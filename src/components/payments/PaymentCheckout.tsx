// Payment Checkout Component with Stripe
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
    CreditCard,
    Loader2,
    CheckCircle,
    AlertCircle,
    Shield,
    Lock,
    TrendingUp,
} from "lucide-react";
import { formatCurrency } from "@/lib/fees";
import type { FeeCalculation } from "@/types/database";

interface PaymentCheckoutProps {
    bookingId: string;
    carerId: string;
    carerName: string;
    carerStripeAccountId: string;
    feeBreakdown: FeeCalculation;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function PaymentCheckout({
    bookingId,
    carerId,
    carerName,
    carerStripeAccountId,
    feeBreakdown,
    onSuccess,
    onCancel,
}: PaymentCheckoutProps) {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handlePayment = async () => {
        try {
            setLoading(true);

            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Please log in to continue");

            // Convert to pence (Stripe uses smallest currency unit)
            const amountInPence = Math.round(feeBreakdown.clientTotal * 100);
            const platformFeeInPence = Math.round(feeBreakdown.platformRevenue * 100);

            // Call Edge Function to create checkout session
            const { data, error } = await supabase.functions.invoke('stripe-checkout-session', {
                body: {
                    bookingId,
                    carerId,
                    clientId: user.id,
                    amount: amountInPence,
                    applicationFeeAmount: platformFeeInPence,
                    stripeAccountId: carerStripeAccountId,
                    successUrl: `${window.location.origin}/client/bookings?payment=success&booking=${bookingId}`,
                    cancelUrl: `${window.location.origin}/client/bookings?payment=cancelled`,
                },
            });

            if (error) throw error;

            // Redirect to Stripe Checkout
            if (data?.url) {
                window.location.href = data.url;
            } else {
                throw new Error("No checkout URL received");
            }

        } catch (error: any) {
            console.error('Payment error:', error);
            toast({
                title: 'Payment Failed',
                description: error.message || 'Failed to initiate payment',
                variant: 'destructive',
            });
            onCancel?.();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-2 border-primary/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Secure Payment
                </CardTitle>
                <CardDescription>Complete your booking payment via Stripe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Payment Summary */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#111827] to-[#1a9e8c] text-white space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Payment Breakdown</span>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-white/70">Care Service</span>
                            <span className="font-bold">{formatCurrency(feeBreakdown.subtotal)}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-white/70">Platform Fee</span>
                            <span className="font-bold">+{formatCurrency(feeBreakdown.clientFee)}</span>
                        </div>

                        <div className="h-px bg-white/10" />

                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Total to Pay</span>
                            <span className="text-2xl font-black">{formatCurrency(feeBreakdown.clientTotal)}</span>
                        </div>
                    </div>

                    <div className="text-xs text-white/60 mt-3 p-3 bg-white/5 rounded-lg">
                        <strong>Carer receives:</strong> {formatCurrency(feeBreakdown.carerEarnings)} after platform fees
                    </div>
                </div>

                {/* Security Badges */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 border">
                        <Shield className="h-5 w-5 text-green-500" />
                        <div>
                            <p className="text-xs font-bold">Secure Payment</p>
                            <p className="text-[10px] text-muted-foreground">Powered by Stripe</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 border">
                        <Lock className="h-5 w-5 text-blue-500" />
                        <div>
                            <p className="text-xs font-bold">Encrypted</p>
                            <p className="text-[10px] text-muted-foreground">Bank-level security</p>
                        </div>
                    </div>
                </div>

                {/* Payment Info */}
                <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                        <strong>Payment Protection:</strong> Your payment is held securely until the care service is completed. Funds are automatically transferred to {carerName} after service confirmation.
                    </AlertDescription>
                </Alert>

                {/* Payment Button */}
                <Button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full h-12 text-base font-bold"
                    size="lg"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Redirecting to Stripe...
                        </>
                    ) : (
                        <>
                            <CreditCard className="mr-2 h-5 w-5" />
                            Pay {formatCurrency(feeBreakdown.clientTotal)} Securely
                        </>
                    )}
                </Button>

                {/* Stripe Notice */}
                <div className="text-xs text-center text-muted-foreground">
                    <p>You will be redirected to Stripe's secure payment page</p>
                    <p className="mt-1">Stripe processing fee: 1.4% + 20p (industry standard)</p>
                </div>

                {/* Cancel Option */}
                {onCancel && (
                    <Button
                        onClick={onCancel}
                        variant="ghost"
                        className="w-full"
                        disabled={loading}
                    >
                        Cancel Payment
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
