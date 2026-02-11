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
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
    type: string;
    email: string;
    name: string;
    data: any;
}

const handler = async (req: Request): Promise<Response> => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const { type, email, name, data }: EmailRequest = await req.json();

        if (!email || !type) {
            throw new Error("Email and Type are required");
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

        let subject = "";
        let content = "";
        let title = "";

        // --- EMAIL CONTENT LOGIC ---
        switch (type) {
            /* -------------------------
               B. CARER TRIGGERS
            ------------------------- */
            case "welcome_carer":
                subject = "Welcome to Heems – Your Account is Approved";
                title = "Welcome to Heems";
                content = `
                    <p>Hello ${name},</p>
                    <p>We are thrilled to let you know that your Heems account has been approved!</p>
                    <p><strong>Your 6-Month Introductory Offer Starts Now</strong></p>
                    <p>As a welcome gift, you will pay <strong>0% Platform Fees</strong> for your first 6 months. This means you keep 100% of your earnings from every booking during this period.</p>
                    <p>You can now log in, complete your profile, and start receiving job leads.</p>
                    <p><a href="https://heartful-care-connect.vercel.app/login" class="btn">Login to Dashboard</a></p>
                    <p style="font-size: 13px; color: #6b7280; margin-top: 24px;">Offer valid until ${data?.expiryDate || "6 months from today"}. After this period, a standard 8% platform fee applies.</p>
                `;
                break;

            case "subscription_expiring":
                subject = "Action Required: Platform Fees Update";
                title = "Platform Fees Start in 14 Days";
                content = `
                    <p>Hello ${name},</p>
                    <p>We’re writing to let you know that your free promotional period on Heems will end in 14 days, on <strong>${data?.expiryDate}</strong>.</p>
                    <p>From this date, a platform service fee of 8% per completed booking will apply. The fee is automatically deducted before payouts are released.</p>
                    <div style="background-color: #fff7ed; border: 1px solid #ffedd5; padding: 16px; border-radius: 8px; margin: 20px 0;">
                        <p style="color: #9a3412; font-weight: bold; margin-top: 0;">What this means:</p>
                        <ul style="color: #9a3412; padding-left: 20px; margin-bottom: 0;">
                            <li>No upfront costs or subscription fees.</li>
                            <li>Fees only apply when a booking is successfully completed.</li>
                            <li>You keep 92% of your earnings.</li>
                        </ul>
                    </div>
                    <p>You don’t need to do anything. You can continue using Heems as normal.</p>
                    <p>Thank you for being a valued part of Heems.</p>
                `;
                break;

            case "profile_rejected":
                subject = "Action Required: Profile Update Needed";
                title = "Profile Update Required";
                content = `
                    <p>Hello ${name},</p>
                    <p>Thank you for submitting your profile to Heems. Our team has reviewed your application, and we need a few more details before we can approve your account.</p>
                    <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 16px; border-radius: 8px; margin: 20px 0;">
                        <p style="color: #991b1b; font-weight: bold; margin-top: 0;">Reason for Rejection:</p>
                        <p style="color: #991b1b; margin-bottom: 0;">${data?.reason || "Please check your dashboard for specific details regarding your documentation or profile information."}</p>
                    </div>
                    <p>Please log in to your dashboard to update the requested information. Once submitted, we will prioritize your review.</p>
                    <p><a href="https://heartful-care-connect.vercel.app/login" class="btn">Update Profile</a></p>
                `;
                break;

            case "document_expiring":
                subject = "Action Required: Document Expiring Soon";
                title = "Document Expiry Warning";
                content = `
                    <p>Hello ${name},</p>
                    <p>This is a reminder that your <strong>${data?.documentType}</strong> is due to expire in less than 30 days.</p>
                    <p>To ensure you can continue accepting bookings without interruption, please upload a renewed document as soon as possible.</p>
                    <p><a href="https://heartful-care-connect.vercel.app/carer/documents" class="btn">Update Documents</a></p>
                `;
                break;

            case "document_expired":
                subject = "Urgent: Document Expired";
                title = "Action Required: Document Expired";
                content = `
                    <p>Hello ${name},</p>
                    <p>Important: Your <strong>${data?.documentType}</strong> has expired.</p>
                    <p>As a result, your profile has been temporarily <strong>de-activated</strong>, and you result cannot accept new bookings until this is resolved.</p>
                    <p>Please upload a valid document immediately to restore your verified status.</p>
                    <p><a href="https://heartful-care-connect.vercel.app/carer/documents" class="btn">Upload Now</a></p>
                `;
                break;

            /* -------------------------
               C. JOBS & BOOKINGS
            ------------------------- */
            case "new_job_lead":
                subject = "New Job Match: " + (data?.jobTitle || "Care Opportunity");
                title = "New Job Opportunity";
                content = `
                    <p>Hello ${name},</p>
                    <p>Great news! A new job that matches your profile has just been posted.</p>
                    <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Type:</strong> ${data?.careType || "General Care"}</p>
                        <p><strong>Location:</strong> ${data?.location || "London"}</p>
                        <p><strong>Rate:</strong> £${data?.rate || "15"}/hr</p>
                    </div>
                    <p>Review the details and apply now to secure this opportunity.</p>
                    <p><a href="https://heartful-care-connect.vercel.app/carer/jobs/${data?.jobId}" class="btn">View Job</a></p>
                `;
                break;

            case "application_received":
                subject = "New Application for Your Job Post";
                title = "New Application Received";
                content = `
                    <p>Hello ${name},</p>
                    <p>You have received a new application for your job post: <strong>${data?.jobTitle}</strong>.</p>
                    <p><strong>Applicant:</strong> ${data?.applicantName}</p>
                    <p>Log in to view their profile, read their message, and proceed with the booking.</p>
                    <p><a href="https://heartful-care-connect.vercel.app/client/jobs/${data?.jobId}" class="btn">View Application</a></p>
                `;
                break;

            case "booking_request":
                subject = "New Booking Request from " + data?.clientName;
                title = "New Booking Request";
                content = `
                    <p>Hello ${name},</p>
                    <p>You have received a new booking request!</p>
                    <div style="border-left: 4px solid #1a9e8c; padding-left: 16px; margin: 20px 0;">
                         <p><strong>Client:</strong> ${data?.clientName}</p>
                         <p><strong>Date:</strong> ${data?.date}</p>
                         <p><strong>Duration:</strong> ${data?.duration}</p>
                    </div>
                    <p>Please accept or decline this request within 24 hours.</p>
                    <p><a href="https://heartful-care-connect.vercel.app/carer/bookings" class="btn">Manage Booking</a></p>
                `;
                break;

            case "booking_confirmation":
                subject = "Booking Confirmed: " + data?.date;
                title = "Booking Confirmed";
                content = `
                    <p>Hello ${name},</p>
                    <p>Your booking has been successfully confirmed.</p>
                     <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; border-radius: 8px; margin: 20px 0;">
                         <p style="color: #166534; font-weight: bold; margin: 0;">Status: Confirmed</p>
                         <p style="color: #166534; margin: 8px 0 0;">Booking Ref: #${data?.bookingRef}</p>
                    </div>
                    <p>You can view full details in your dashboard.</p>
                `;
                break;

            case "job_completed_review":
                subject = "How was your experience with " + data?.carerName + "?";
                title = "Rate Your Experience";
                content = `
                    <p>Hello ${name},</p>
                    <p>Your booking with <strong>${data?.carerName}</strong> has been marked as complete.</p>
                    <p>We'd love to hear about your experience. Your feedback helps build trust in the Heems community.</p>
                    <p><a href="https://heartful-care-connect.vercel.app/client/bookings/${data?.bookingId}/review" class="btn">Leave a Review</a></p>
                `;
                break;

            /* -------------------------
               D. PAYMENTS & MESSAGES
            ------------------------- */
            case "new_message":
                subject = "New Message from " + data?.senderName;
                title = "You have a new message";
                content = `
                    <p>Hello ${name},</p>
                    <p><strong>${data?.senderName}</strong> has sent you a new message on Heems.</p>
                    <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0; font-style: italic;">
                        "${data?.previewText || 'Log in to view message...'}"
                    </div>
                    <p>Please do not reply to this email. Reply directly via the secure messaging center.</p>
                    <p><a href="https://heartful-care-connect.vercel.app/messages" class="btn">Reply Now</a></p>
                `;
                break;

            case "payout_notification":
                subject = "Payout Processed: £" + data?.amount;
                title = "Payout on the way";
                content = `
                    <p>Hello ${name},</p>
                    <p>Good news! We've processed a payout of <strong>£${data?.amount}</strong> to your bank account.</p>
                    <p>This should arrive within 3-5 business days depending on your bank.</p>
                    <p>Reference: ${data?.payoutId}</p>
                `;
                break;

            case "payment_receipt":
                subject = "Payment Receipt: " + data?.bookingRef;
                title = "Payment Successful";
                content = `
                    <p>Hello ${name},</p>
                    <p>Thank you for your payment. Here is your receipt for the recent care booking.</p>
                    <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 20px 0;">
                        <p><strong>Amount Paid:</strong> £${data?.amount}</p>
                        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                        <p><strong>Booking Ref:</strong> ${data?.bookingRef}</p>
                    </div>
                    <p><a href="https://heartful-care-connect.vercel.app/client/payments" class="btn">View Invoice</a></p>
                `;
                break;

            default:
                throw new Error("Invalid email type");
        }

        await transporter.sendMail({
            from: `"Heems Notifications" <${SMTP_USER}>`,
            to: email,
            subject: subject,
            html: generateEmailHtml(content, title),
        });

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error: any) {
        console.error("Error sending transactional email:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
};

Deno.serve(handler);
