import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        if (!RESEND_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error("Missing environment variables");
        }

        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        // Calculate the target date: Today + 14 days should be the End Date (Onboarded + 6 months)
        // So we look for people where (onboarded_at + 6 months) = (now + 14 days)
        // Or: onboarded_at = (now + 14 days) - 6 months

        // Simpler SQL approach: 
        // "Select carers where onboarded_at is not null AND 
        //  (onboarded_at + interval '6 months')::date = (current_date + interval '14 days')::date"

        const { data: carers, error } = await supabase
            .from("carer_details") // You might need to join with profiles to get email/name if not in carer_details
            .select(`
        id, 
        onboarded_at,
        profiles:id (first_name, email)
      `)
            // Note: This logic assumes 'profiles' is the relation name. 
            // Checking local files, 'profiles' table exists and IDs match.
            .not("onboarded_at", "is", null);

        if (error) throw error;

        // Filter in JS for precision or use a more complex RPC/Query if list is huge. 
        // For now, JS filter is fine for MVP.
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 14); // 14 days from now
        const checkDateString = targetDate.toISOString().split("T")[0];

        const emailsToSend = [];

        for (const carer of carers) {
            const onboardedAt = new Date(carer.onboarded_at);
            const expiryDate = new Date(onboardedAt);
            expiryDate.setMonth(expiryDate.getMonth() + 6);

            const expiryDateString = expiryDate.toISOString().split("T")[0];

            // Check if expiry date is exactly 14 days from now
            if (expiryDateString === checkDateString) {
                // Safe check for profile data
                const profile = Array.isArray(carer.profiles) ? carer.profiles[0] : carer.profiles;
                if (profile && profile.email) {
                    emailsToSend.push({
                        email: profile.email,
                        name: profile.first_name || "Carer",
                        endDate: expiryDate.toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' })
                    });
                }
            }
        }

        console.log(`Found ${emailsToSend.length} carers expiring on ${checkDateString}`);

        const results = [];

        for (const recipient of emailsToSend) {
            const res = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${RESEND_API_KEY}`,
                },
                body: JSON.stringify({
                    from: "Heems <notifications@resend.dev>",
                    to: [recipient.email],
                    subject: "Platform Fees Start in 14 Days",
                    html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <p style="font-size: 16px; color: #4b5563;">
                Hello ${recipient.name},
              </p>
              <p style="font-size: 16px; color: #4b5563;">
                We’re writing to let you know that your free promotional period on Heems will end in 14 days, on <strong>${recipient.endDate}</strong>.
              </p>
              <p style="font-size: 16px; color: #4b5563;">
                From this date, a platform service fee of 8% per completed booking will apply. The fee is automatically deducted before payouts are released.
              </p>
              <p style="font-size: 16px; color: #4b5563;">
                There are no upfront costs, subscriptions, or charges for browsing, messaging, or keeping your profile active — fees only apply when a booking is successfully completed.
              </p>
              <p style="font-size: 16px; color: #4b5563;">
                The platform fee helps cover secure payments, verification checks, and ongoing platform maintenance and support.
              </p>
              <p style="font-size: 16px; color: #4b5563;">
                You don’t need to do anything. You can continue using Heems as normal, and if you don’t take bookings, no fees will apply.
              </p>
              <p style="font-size: 16px; color: #4b5563;">
                For more details, please refer to the <a href="https://heartful-care-connect.vercel.app/privacy" style="color: #1a9e8c;">Terms and Conditions</a> or contact us via your dashboard.
              </p>
              <p style="font-size: 16px; color: #4b5563;">
                Thank you for being part of Heems — we’re glad to have you with us.
              </p>
              <p style="font-size: 14px; color: #9ca3af;">
                Warm regards,<br/>The Heems Team
              </p>
            </div>
          `,
                }),
            });

            const data = await res.json();
            results.push(data);
        }

        return new Response(JSON.stringify({ sent: results.length, details: results }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error: any) {
        console.error("Error sending expiry emails:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
};

Deno.serve(handler);
