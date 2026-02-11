
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
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Parse Webhook Payload
        const payload = await req.json();
        const { record } = payload;

        if (!record || !record.receiver_id || !record.sender_id) {
            console.log("Invalid payload or missing IDs");
            return new Response("Invalid payload", { status: 400 });
        }

        console.log(`Processing message ${record.id} from ${record.sender_id} to ${record.receiver_id}`);

        // 1. Fetch Receiver (to get Email) and Sender (to get Name)
        const { data: profiles, error: profileError } = await supabase
            .from("profiles")
            .select("id, first_name, last_name, email")
            .in("id", [record.sender_id, record.receiver_id]);

        if (profileError || !profiles) {
            console.error("Error fetching profiles:", profileError);
            return new Response("Profile fetch error", { status: 500 });
        }

        const receiver = profiles.find(p => p.id === record.receiver_id);
        const sender = profiles.find(p => p.id === record.sender_id);

        if (!receiver || !receiver.email) {
            console.log("Receiver not found or has no email. Skipping.");
            return new Response("Receiver invalid", { status: 200 });
        }

        // 2. Send Email Notification
        // We call the send-transactional-email function
        const emailRes = await fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${supabaseKey}`
            },
            body: JSON.stringify({
                type: "new_message",
                email: receiver.email,
                name: receiver.first_name || "User",
                data: {
                    senderName: sender ? `${sender.first_name} ${sender.last_name || ''}`.trim() : "Someone",
                    previewText: record.content ? record.content.substring(0, 100) : "Sent a file"
                }
            })
        });

        if (!emailRes.ok) {
            const err = await emailRes.text();
            console.error("Failed to send email:", err);
            return new Response("Email send failed", { status: 500 });
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });

    } catch (error) {
        console.error("Error processing webhook:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
        });
    }
});
