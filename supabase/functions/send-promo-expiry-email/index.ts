import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import nodemailer from "npm:nodemailer@6.9.13";
// @ts-ignore
import { generateEmailHtml } from "../_shared/email-template.ts";

const SMTP_HOST = Deno.env.get("SMTP_HOST");
const SMTP_PORT = parseInt(Deno.env.get("SMTP_PORT") || "465");
const SMTP_USER = Deno.env.get("SMTP_USER");
const SMTP_PASS = Deno.env.get("SMTP_PASS");
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
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase environment variables");
    }

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      console.error("Missing SMTP Configuration");
      throw new Error("Server email configuration error");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const { data: carers, error } = await supabase
      .from("carer_details")
      .select(`
        id, 
        onboarded_at,
        profiles:id (first_name, email)
      `)
      .not("onboarded_at", "is", null);

    if (error) throw error;

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 14); // 14 days from now
    const checkDateString = targetDate.toISOString().split("T")[0];

    const emailsToSend = [];

    for (const carer of carers) {
      const onboardedAt = new Date(carer.onboarded_at);
      const expiryDate = new Date(onboardedAt);
      expiryDate.setMonth(expiryDate.getMonth() + 6);

      const expiryDateString = expiryDate.toISOString().split("T")[0];

      if (expiryDateString === checkDateString) {
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
      try {
        const emailContent = `
                    <p>Hello ${recipient.name},</p>
                    <p>We’re writing to let you know that your free promotional period on Heems will end in 14 days, on <strong>${recipient.endDate}</strong>.</p>
                    <p>From this date, a platform service fee of 8% per completed booking will apply. The fee is automatically deducted before payouts are released.</p>
                    <p>There are no upfront costs, subscriptions, or charges for browsing, messaging, or keeping your profile active — fees only apply when a booking is successfully completed.</p>
                    <p>The platform fee helps cover secure payments, verification checks, and ongoing platform maintenance and support.</p>
                    <p>You don’t need to do anything. You can continue using Heems as normal, and if you don’t take bookings, no fees will apply.</p>
                    <p>For more details, please refer to the <a href="https://heartful-care-connect.vercel.app/privacy">Terms and Conditions</a> or contact us via your dashboard.</p>
                    <p>Thank you for being part of Heems — we’re glad to have you with us.</p>
                    <p style="color: #6b7280; font-size: 14px;">Warm regards,<br/>The Heems Team</p>
                `;

        const info = await transporter.sendMail({
          from: `"Heems Notifications" <${SMTP_USER}>`,
          to: recipient.email,
          subject: "Platform Fees Start in 14 Days",
          html: generateEmailHtml(emailContent, "Platform Fees Update"),
        });

        results.push({ email: recipient.email, id: info.messageId });
      } catch (err) {
        console.error(`Failed to send email to ${recipient.email}:`, err);
        results.push({ email: recipient.email, error: err.message });
      }
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
