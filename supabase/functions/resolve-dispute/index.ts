// Supabase Edge Function: Admin Resolve Dispute
// Deploy to: supabase/functions/resolve-dispute/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.11.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2023-10-16",
    httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL");
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error("Supabase environment variables are missing");
        }

        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

        // Get User from Auth Header (admin)
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) throw new Error('No authorization header');

        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(authHeader.replace('Bearer ', ''));
        if (authError || !user) throw new Error('Unauthorized');

        // Verify Admin Role
        const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role !== 'admin') {
            throw new Error("Forbidden: Admins only");
        }

        const { disputeId, resolution } = await req.json();
        // resolution: 'client' | 'carer' | 'split'

        if (!disputeId || !resolution) throw new Error("Dispute ID and resolution are required");

        // 1. Fetch Dispute and Booking
        const { data: dispute, error: disputeError } = await supabaseAdmin
            .from('disputes')
            .select('*, bookings(*)')
            .eq('id', disputeId)
            .single();

        if (disputeError || !dispute) throw new Error("Dispute not found");

        const booking = dispute.bookings;
        if (!booking) throw new Error("Associated booking not found");

        console.log(`Admin resolving dispute ${disputeId} in favor of ${resolution}`);

        let refundAmount = 0;
        let disputeNotes = `Dispute resolved by Admin in favor of ${resolution}. `;

        if (resolution === 'client') {
            refundAmount = booking.total_price - (booking.client_fee || 0);
            disputeNotes += `Full service cost refunded to client.`;
        } else if (resolution === 'split') {
            refundAmount = (booking.total_price - (booking.client_fee || 0)) / 2;
            disputeNotes += `50% service cost refunded to client.`;
        } else if (resolution === 'carer') {
            refundAmount = 0;
            disputeNotes += `No refund issued to client.`;
        }

        const refundAmountPence = Math.round(refundAmount * 100);

        if (booking.payment_status === 'paid' && booking.stripe_payment_intent_id && refundAmountPence > 0) {
            await stripe.refunds.create({
                payment_intent: booking.stripe_payment_intent_id,
                amount: refundAmountPence,
                metadata: {
                    reason: "admin_dispute_resolution",
                    dispute_id: disputeId,
                    booking_id: booking.id
                }
            });
        }

        // Update Booking
        await supabaseAdmin
            .from('bookings')
            .update({
                status: resolution === 'carer' ? 'completed' : 'cancelled', // If carer wins, they provided service. If client wins/split, it's partially or fully cancelled.
                notes: disputeNotes,
                refund_status: refundAmount > 0 ? 'succeeded' : booking.refund_status,
                refund_amount_processed: refundAmount,
                updated_at: new Date().toISOString()
            })
            .eq('id', booking.id);

        // Update Dispute
        await supabaseAdmin
            .from('disputes')
            .update({
                status: 'resolved',
                resolution_notes: disputeNotes,
                refund_amount: refundAmount,
                updated_at: new Date().toISOString()
            })
            .eq('id', disputeId);

        return new Response(JSON.stringify({
            message: "Dispute resolved and Stripe refund processed if applicable.",
            status: 'resolved'
        }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });

    } catch (error: any) {
        console.error("Resolve Dispute Error:", error.message);
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
    }
});
