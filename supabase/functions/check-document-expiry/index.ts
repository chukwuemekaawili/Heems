// Supabase Edge Function: Daily Document Expiry Check
// Deploy to: supabase/functions/check-document-expiry/index.ts
// Schedule: Run daily via Supabase Cron

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
    try {
        console.log("Starting daily document expiry check...");

        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);

        // Fetch all carer verifications
        const { data: verifications, error: fetchError } = await supabase
            .from('carer_verification')
            .select('*')
            .eq('overall_status', 'verified');

        if (fetchError) throw fetchError;

        console.log(`Found ${verifications?.length || 0} verified carers to check`);

        let expiredCount = 0;
        let expiringSoonCount = 0;
        let deVerifiedCarers: string[] = [];

        for (const verification of verifications || []) {
            let hasExpired = false;
            let expiringSoon = false;

            // Check each document type - using correct column names from schema
            const documents = [
                { type: 'dbs', expiry: verification.dbs_expiry },
                { type: 'rtw', expiry: verification.rtw_expiry },
                { type: 'insurance', expiry: verification.insurance_expiry },
            ];

            for (const doc of documents) {
                if (!doc.expiry) continue;

                const expiryDate = new Date(doc.expiry);

                // Check if expired
                if (expiryDate < today) {
                    console.log(`${doc.type} expired for carer ${verification.id}`);
                    hasExpired = true;

                    // Update document status to expired
                    const statusField = `${doc.type}_status`;
                    await supabase
                        .from('carer_verification')
                        .update({ [statusField]: 'rejected' }) // Using 'rejected' as per schema constraint
                        .eq('id', verification.id);
                }
                // Check if expiring soon (within 30 days)
                else if (expiryDate <= thirtyDaysFromNow) {
                    console.log(`${doc.type} expiring soon for carer ${verification.id}`);
                    expiringSoon = true;
                }
            }

            // If any document expired, de-verify the carer
            if (hasExpired) {
                await supabase
                    .from('carer_verification')
                    .update({
                        overall_status: 'pending',
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', verification.id);

                deVerifiedCarers.push(verification.id);
                expiredCount++;

                // TODO: Send email notification to carer
                console.log(`De-verified carer ${verification.id} due to expired documents`);
            }

            if (expiringSoon && !hasExpired) {
                expiringSoonCount++;
                // TODO: Send reminder email to carer
                console.log(`Reminder needed for carer ${verification.id}`);
            }
        }

        // Log the check to a system log table (optional)
        await supabase
            .from('system_logs')
            .insert({
                event_type: 'document_expiry_check',
                details: {
                    total_checked: verifications?.length || 0,
                    expired_count: expiredCount,
                    expiring_soon_count: expiringSoonCount,
                    de_verified_carers: deVerifiedCarers,
                },
                created_at: new Date().toISOString(),
            })
            .select()
            .single()
            .then(({ error }) => {
                if (error) console.error('Failed to log check:', error);
            });

        const summary = {
            success: true,
            timestamp: new Date().toISOString(),
            total_checked: verifications?.length || 0,
            expired_count: expiredCount,
            expiring_soon_count: expiringSoonCount,
            de_verified_carers: deVerifiedCarers,
            message: `Checked ${verifications?.length || 0} carers. ${expiredCount} de-verified, ${expiringSoonCount} expiring soon.`,
        };

        console.log("Daily expiry check completed:", summary);

        return new Response(JSON.stringify(summary), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("Error in expiry check:", error);
        return new Response(
            JSON.stringify({
                success: false,
                error: error.message,
                timestamp: new Date().toISOString(),
            }),
            {
                headers: { "Content-Type": "application/json" },
                status: 500,
            }
        );
    }
});
