// Supabase Edge Function: Process Review Requests
// Deploy to: supabase/functions/process-review-requests/index.ts
// Schedule: Every hour (cron)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL");
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error("Supabase environment variables are missing");
        }

        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

        console.log("Starting review requests processing...");

        const now = new Date().toISOString();
        const { data: requests, error: fetchError } = await supabaseAdmin
            .from('review_requests')
            .select(`
                id,
                booking_id,
                client_id,
                carer_id
            `)
            .eq('status', 'pending')
            .lte('scheduled_for', now)
            .limit(50); // Process in batches

        if (fetchError) {
            throw new Error(`Error fetching review requests: ${fetchError.message}`);
        }

        console.log(`Found ${requests?.length || 0} review requests ready to send.`);

        if (!requests || requests.length === 0) {
            return new Response(JSON.stringify({ message: "No reviews to process" }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            });
        }

        const stats = { success: 0, failed: 0 };

        for (const request of requests) {
            try {
                console.log(`Processing review request ${request.id}...`);

                // 1. Fetch Client Email and Carer Name
                const { data: clientData, error: clientError } = await supabaseAdmin
                    .from('profiles')
                    .select('email, full_name')
                    .eq('id', request.client_id)
                    .single();

                const { data: carerData, error: carerError } = await supabaseAdmin
                    .from('profiles')
                    .select('full_name')
                    .eq('id', request.carer_id)
                    .single();

                if (clientError || carerError || !clientData || !carerData) {
                    console.error(`Could not find profiles for review ${request.id}`);
                    continue; // Skip if user data missing
                }

                // 2. Invoke transaction email edge function
                const { error: emailError } = await supabaseAdmin.functions.invoke('send-transactional-email', {
                    body: {
                        type: 'job_completed_review',
                        email: clientData.email,
                        name: clientData.full_name,
                        data: {
                            carerName: carerData.full_name,
                            bookingId: request.booking_id
                        }
                    }
                });

                if (emailError) throw emailError;

                // 3. Mark as sent
                await supabaseAdmin
                    .from('review_requests')
                    .update({ status: 'sent', updated_at: new Date().toISOString() })
                    .eq('id', request.id);

                stats.success++;
            } catch (err: any) {
                console.error(`Failed to process review ${request.id}:`, err);

                // Mark as failed so it can be retried or ignored
                await supabaseAdmin
                    .from('review_requests')
                    .update({ status: 'failed', updated_at: new Date().toISOString() })
                    .eq('id', request.id);

                stats.failed++;
            }
        }

        return new Response(JSON.stringify({
            message: "Review requests processing complete",
            processed: requests.length,
            stats
        }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });

    } catch (error: any) {
        console.error("Critical Error:", error.message);
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
    }
});
