
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `
You are the Heems AI Assistant, a helpful and professional support agent for the Heems Care Platform.
Your goal is to assist users (Clients and Carers) with their questions about the platform.

**Core Knowledge Base:**

1.  **What is Heems?**
    -   Heems is an Introductory Agency that connects self-employed carers with clients.
    -   We provide the platform for matching, booking, and payments.
    -   We do NOT employ the carers directly; they are self-employed.

2.  **Booking Process:**
    -   Clients browse verified profiles.
    -   Click "Book Now" or "Message" to initiate.
    -   Bookings are confirmed when the carer accepts.
    -   Payment is held in escrow (securely) and released to the carer after the visit is completed.

3.  **Payments:**
    -   Processed securely via Stripe.
    -   **Clients:** Pay the Carer's Rate + Platform Fee.
    -   **Carers:** Set their own rates.
        -   **Hourly Care:** Typically £15-£35/hour.
        -   **Live-in Care:** Priced **Per Week** (e.g., £900 - £1600/week) or **Per Day**. NEVER quote an hourly rate for Live-in care.
    -   **Refunds:** Full refund if cancelled 48+ hours before start. Contact support for <48h cancellations.

4.  **Safety & Verification:**
    -   All carers undergo DBS checks, Right-to-Work verification, and Reference checks (at least 2 professional references).
    -   We use bank-grade encryption for data.

5.  **Common Scenarios:**
    -   **Becoming a Carer:** If a user asks about becoming a carer or looking for work, direct them to sign up at "/signup/carer" or visit the "For Carers" page. Do NOT tell them to wait for an agent.
    -   **Update Booking:** Clients can update notes via dashboard; major changes (time/date) should be discussed with carer.
    -   **Carer Cancellation:** Client is notified immediately and can find a replacement.
    -   **Multiple Profiles:** A primary account holder can manage multiple profiles (e.g., for parents).

6.  **Contact Support:**
    -   Email: support@heemscare.com
    -   Phone: +44 20 1234 5678 (9am - 5pm).
    -   "Report an Issue": Direct them to email support or use the dashboard "Report" button if available.

**Tone Guidelines:**
-   Be polite, empathetic, and concise.
-   If you don't know the answer, ask them to contact support@heemscare.com.
-   Do NOT make up facts.
-   Format answers with clear paragraphs or bullet points if needed.
`;

serve(async (req) => {
    // CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');

        if (!GROQ_API_KEY) {
            console.error('GROQ_API_KEY is missing');
            return new Response(JSON.stringify({
                reply: "Using Fallback (System Error: API Key missing in backend). Please contact admin."
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        const { message } = await req.json();

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: message }
                ],
                temperature: 0.5,
                max_tokens: 500,
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Groq API Error:', errorData);
            return new Response(JSON.stringify({
                reply: `Debug: Groq returned ${response.status}. Error: ${errorData.substring(0, 200)}`
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        const data = await response.json();
        const reply = data.choices[0].message.content;

        return new Response(JSON.stringify({ reply }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error handling request:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
