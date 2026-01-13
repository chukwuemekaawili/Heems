// Supabase Edge Function: Stripe Webhook Handler
// Deploy to: supabase/functions/stripe-webhook/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.11.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2023-10-16",
    httpClient: Stripe.createFetchHttpClient(),
});

const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";

serve(async (req) => {
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
        return new Response("No signature", { status: 400 });
    }

    try {
        const body = await req.text();
        const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

        const supabaseUrl = Deno.env.get("SUPABASE_URL");
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

        console.log("Webhook event:", event.type);

        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                const bookingId = session.metadata?.booking_id;

                if (bookingId) {
                    // Update booking status to confirmed
                    await fetch(`${supabaseUrl}/rest/v1/bookings?id=eq.${bookingId}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            "apikey": supabaseKey || "",
                            "Authorization": `Bearer ${supabaseKey}`,
                            "Prefer": "return=minimal",
                        },
                        body: JSON.stringify({
                            status: "confirmed",
                            stripe_payment_intent_id: session.payment_intent,
                            payment_status: "paid",
                            updated_at: new Date().toISOString(),
                        }),
                    });

                    console.log(`Booking ${bookingId} confirmed`);
                }
                break;
            }

            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                const bookingId = paymentIntent.metadata?.booking_id;

                if (bookingId) {
                    await fetch(`${supabaseUrl}/rest/v1/bookings?id=eq.${bookingId}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            "apikey": supabaseKey || "",
                            "Authorization": `Bearer ${supabaseKey}`,
                            "Prefer": "return=minimal",
                        },
                        body: JSON.stringify({
                            payment_status: "paid",
                            stripe_payment_intent_id: paymentIntent.id,
                            updated_at: new Date().toISOString(),
                        }),
                    });

                    console.log(`Payment succeeded for booking ${bookingId}`);
                }
                break;
            }

            case "payment_intent.payment_failed": {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                const bookingId = paymentIntent.metadata?.booking_id;

                if (bookingId) {
                    await fetch(`${supabaseUrl}/rest/v1/bookings?id=eq.${bookingId}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            "apikey": supabaseKey || "",
                            "Authorization": `Bearer ${supabaseKey}`,
                            "Prefer": "return=minimal",
                        },
                        body: JSON.stringify({
                            payment_status: "failed",
                            status: "cancelled",
                            updated_at: new Date().toISOString(),
                        }),
                    });

                    console.log(`Payment failed for booking ${bookingId}`);
                }
                break;
            }

            case "account.updated": {
                const account = event.data.object as Stripe.Account;
                const carerId = account.metadata?.carer_id;

                if (carerId) {
                    // Update carer's Stripe status
                    await fetch(`${supabaseUrl}/rest/v1/carer_details?id=eq.${carerId}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            "apikey": supabaseKey || "",
                            "Authorization": `Bearer ${supabaseKey}`,
                            "Prefer": "return=minimal",
                        },
                        body: JSON.stringify({
                            stripe_charges_enabled: account.charges_enabled,
                            stripe_payouts_enabled: account.payouts_enabled,
                            stripe_onboarding_complete: account.details_submitted,
                            stripe_onboarded_at: account.details_submitted ? new Date().toISOString() : null,
                        }),
                    });

                    console.log(`Stripe account updated for carer ${carerId}`);
                }
                break;
            }

            case "transfer.created": {
                const transfer = event.data.object as Stripe.Transfer;
                console.log(`Transfer created: ${transfer.id} for ${transfer.amount / 100} GBP`);
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("Webhook error:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { "Content-Type": "application/json" },
                status: 400,
            }
        );
    }
});
