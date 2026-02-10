const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

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

        if (!RESEND_API_KEY) {
            console.error("RESEND_API_KEY is not set");
            return new Response(
                JSON.stringify({ error: "Server configuration error" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json", ...corsHeaders },
                }
            );
        }

        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: "Heems <onboarding@resend.dev>",
                to: [email],
                subject: "Your Heems Account has been Approved",
                html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #111827;">Welcome to Heems – Your Introductory Free Period</h1>
            <p style="font-size: 16px; color: #4b5563;">
              Welcome to Heems — we’re really glad to have you on board.
            </p>
            <p style="font-size: 16px; color: #4b5563;">
              To help you get started, we’re offering carers an introductory promotional period with platform fees waived while you begin using Heems and connecting with clients.
            </p>
            
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; border-radius: 8px; margin: 24px 0;">
                <h3 style="color: #166534; margin-top: 0;">What this means for you</h3>
                <ul style="color: #166534; padding-left: 20px;">
                    <li>You can accept and complete bookings without platform fees during this period</li>
                    <li>The promotional period can last up to 6 months from your onboarding date</li>
                    <li>We’ll always notify you in advance before standard platform fees apply</li>
                </ul>
            </div>

            <p style="font-size: 16px; color: #4b5563;">
              There’s nothing you need to do right now — just complete your profile, connect with clients, and use the platform as normal.
            </p>
            <p style="font-size: 16px; color: #4b5563;">
              If you have any questions along the way, our support team is here to help.
            </p>
            <p style="font-size: 16px; color: #4b5563;">
              Welcome again, and we wish you every success on Heems.
            </p>

            <div style="margin-top: 32px; margin-bottom: 32px;">
              <a href="https://heartful-care-connect.vercel.app/login" 
                 style="background-color: #1a9e8c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Go to Dashboard
              </a>
            </div>
            <p style="font-size: 14px; color: #9ca3af;">
              Warm regards,<br/>The Heems Team
            </p>
          </div>
        `,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            console.error("Resend API specific error:", data);
            throw new Error(JSON.stringify(data));
        }

        return new Response(JSON.stringify(data), {
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
