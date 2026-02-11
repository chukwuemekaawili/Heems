import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import nodemailer from "npm:nodemailer@6.9.13";
// @ts-ignore
import { generateEmailHtml } from "../_shared/email-template.ts";

const SMTP_HOST = Deno.env.get("SMTP_HOST");
const SMTP_PORT = parseInt(Deno.env.get("SMTP_PORT") || "465");
const SMTP_USER = Deno.env.get("SMTP_USER");
const SMTP_PASS = Deno.env.get("SMTP_PASS");

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
    email: string;
    name: string;
}

const handler = async (req: Request): Promise<Response> => {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const { email, name }: EmailRequest = await req.json();

        if (!email) {
            throw new Error("Email is required");
        }

        if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
            console.error("Missing SMTP Configuration");
            throw new Error("Server email configuration error");
        }

        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: SMTP_PORT === 465,
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS,
            },
        });

        const emailContent = `
            <p style="font-size: 16px; margin-bottom: 24px;">
              Welcome to Heems — we’re really glad to have you on board.
            </p>
            <p style="font-size: 16px; margin-bottom: 24px;">
              To help you get started, we’re offering carers an introductory promotional period with platform fees waived while you begin using Heems and connecting with clients.
            </p>
            
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 8px; margin: 24px 0;">
                <h3 style="color: #166534; margin-top: 0; margin-bottom: 12px;">What this means for you</h3>
                <ul style="color: #166534; padding-left: 20px; list-style-type: disc;">
                    <li style="margin-bottom: 8px;">You can accept and complete bookings without platform fees during this period</li>
                    <li style="margin-bottom: 8px;">The promotional period can last up to 6 months from your onboarding date</li>
                    <li>We’ll always notify you in advance before standard platform fees apply</li>
                </ul>
            </div>

            <p style="font-size: 16px; margin-bottom: 24px;">
              There’s nothing you need to do right now — just complete your profile, connect with clients, and use the platform as normal.
            </p>
            <p style="font-size: 16px; margin-bottom: 24px;">
              If you have any questions along the way, our support team is here to help.
            </p>
            <p style="font-size: 16px; margin-bottom: 32px;">
              Welcome again, and we wish you every success on Heems.
            </p>

            <div style="text-align: center; margin-bottom: 32px;">
              <a href="https://heartful-care-connect.vercel.app/login" 
                 style="background-color: #1a9e8c; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Go to Dashboard
              </a>
            </div>
            <p style="font-size: 14px; color: #6b7280;">
              Warm regards,<br/>The Heems Team
            </p>
        `;

        await transporter.sendMail({
            from: `"Heems" <${SMTP_USER}>`,
            to: email,
            subject: "Your Heems Account has been Approved",
            html: generateEmailHtml(emailContent, "Welcome to Heems – Your Introductory Free Period"),
        });

        return new Response(JSON.stringify({ success: true, message: "Email sent successfully" }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                ...corsHeaders,
            },
        });
    } catch (error: any) {
        console.error("Error sending email:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                status: 500,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            }
        );
    }
};

Deno.serve(handler);
