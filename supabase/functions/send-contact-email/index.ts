// Supabase Edge Function: Send Contact Form Email
// Deploy with: supabase functions deploy send-contact-email

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import nodemailer from "npm:nodemailer@6.9.13";
// @ts-ignore
import { generateEmailHtml } from "../_shared/email-template.ts";

const SMTP_HOST = Deno.env.get("SMTP_HOST");
const SMTP_PORT = parseInt(Deno.env.get("SMTP_PORT") || "465");
const SMTP_USER = Deno.env.get("SMTP_USER");
const SMTP_PASS = Deno.env.get("SMTP_PASS");
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "support@heems.com";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { name, email, subject, message }: ContactFormData = await req.json();

        // Validate required fields
        if (!name || !email || !subject || !message) {
            throw new Error("All fields are required");
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("Invalid email format");
        }

        // Configure SMTP Transporter
        // If credentials are missing, this will fail gracefully or we can fallback/log
        if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
            console.error("Missing SMTP Configuration");
            throw new Error("Server email configuration error");
        }

        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: SMTP_PORT === 465, // true for 465, false for other ports
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS,
            },
        });

        // 1. Send Admin Notification
        const adminContent = `
            <p><strong>New Contact Form Submission</strong></p>
            <p><strong>From:</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr />
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
        `;

        await transporter.sendMail({
            from: `"Heems System" <${SMTP_USER}>`, // Send from authenticated user
            to: ADMIN_EMAIL,
            replyTo: email,
            subject: `[Heems Contact] ${subject}`,
            html: generateEmailHtml(adminContent, "New Inquiry Received"),
        });

        // 2. Send User Confirmation
        const userContent = `
            <p>Dear ${name},</p>
            <p>Thank you for contacting Heems. We have received your message regarding "<strong>${subject}</strong>".</p>
            <p>Our team reviews every inquiry and will respond within 24 hours.</p>
            <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Your Message:</strong></p>
                <p style="font-style: italic;">"${message}"</p>
            </div>
            <p>If your matter is urgent, please reply to this email.</p>
        `;

        await transporter.sendMail({
            from: `"Heems Support" <${SMTP_USER}>`,
            to: email,
            subject: "We've received your message - Heems",
            html: generateEmailHtml(userContent, "Thank You for Contacting Us"),
        });

        // Store in database for record keeping
        const supabaseUrl = Deno.env.get("SUPABASE_URL");
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

        if (supabaseUrl && supabaseKey) {
            await fetch(`${supabaseUrl}/rest/v1/contact_submissions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": supabaseKey,
                    "Authorization": `Bearer ${supabaseKey}`,
                    "Prefer": "return=minimal",
                },
                body: JSON.stringify({
                    name,
                    email,
                    subject,
                    message,
                    status: "sent",
                }),
            });
        }

        return new Response(
            JSON.stringify({ success: true, message: "Email sent successfully" }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            }
        );
    } catch (error: any) {
        console.error("Error sending contact email:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 400,
            }
        );
    }
});
