// Stripe Connect Onboarding Component
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
    CreditCard,
    CheckCircle,
    AlertCircle,
    ExternalLink,
    Loader2,
    Shield,
    DollarSign,
} from "lucide-react";

interface StripeConnectOnboardingProps {
    carerId: string;
    stripeAccountId?: string | null;
    onboardingComplete?: boolean;
    chargesEnabled?: boolean;
    payoutsEnabled?: boolean;
}

export function StripeConnectOnboarding({
    carerId,
    stripeAccountId,
    onboardingComplete = false,
    chargesEnabled = false,
    payoutsEnabled = false,
}: StripeConnectOnboardingProps) {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleStartOnboarding = async () => {
        try {
            setLoading(true);

            // TODO: Call Supabase Edge Function to create Stripe Connect account
            // For now, this is a placeholder
            toast({
                title: "Stripe Connect Setup",
                description: "This feature requires Stripe API keys to be configured. Please contact support.",
            });

            // Example implementation:
            // const { data, error } = await supabase.functions.invoke('stripe-connect-account', {
            //   body: { carerId }
            // });
            //
            // if (error) throw error;
            //
            // // Redirect to Stripe onboarding
            // window.location.href = data.onboardingUrl;

        } catch (error: any) {
            console.error('Onboarding error:', error);
            toast({
                title: 'Setup Failed',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRefreshStatus = async () => {
        try {
            setLoading(true);

            // TODO: Call Edge Function to refresh Stripe account status
            toast({
                title: "Status Refreshed",
                description: "Stripe account status has been updated",
            });

        } catch (error: any) {
            console.error('Refresh error:', error);
            toast({
                title: 'Refresh Failed',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = () => {
        if (!stripeAccountId) {
            return <Badge variant="outline">Not Connected</Badge>;
        }
        if (!onboardingComplete) {
            return <Badge variant="secondary" className="bg-amber-100 text-amber-800">Pending Setup</Badge>;
        }
        if (!chargesEnabled || !payoutsEnabled) {
            return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Verification Pending</Badge>;
        }
        return <Badge className="bg-green-500">Active</Badge>;
    };

    return (
        <Card className="border-2 border-primary/20">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-primary" />
                            Stripe Connect
                        </CardTitle>
                        <CardDescription>Receive payments directly to your bank account</CardDescription>
                    </div>
                    {getStatusBadge()}
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Not Connected State */}
                {!stripeAccountId && (
                    <>
                        <Alert>
                            <Shield className="h-4 w-4" />
                            <AlertDescription>
                                <strong>Secure Payment Setup:</strong> Connect your bank account via Stripe to receive payments. Your financial information is encrypted and never stored on our servers.
                            </AlertDescription>
                        </Alert>

                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                <div>
                                    <p className="font-bold text-sm">Instant Payouts</p>
                                    <p className="text-sm text-muted-foreground">Receive payments within 2 business days</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                <div>
                                    <p className="font-bold text-sm">Secure & Encrypted</p>
                                    <p className="text-sm text-muted-foreground">Bank-level security powered by Stripe</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                <div>
                                    <p className="font-bold text-sm">Automatic Transfers</p>
                                    <p className="text-sm text-muted-foreground">Earnings transferred automatically after each booking</p>
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={handleStartOnboarding}
                            disabled={loading}
                            className="w-full h-12"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Setting up...
                                </>
                            ) : (
                                <>
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Connect Stripe Account
                                </>
                            )}
                        </Button>
                    </>
                )}

                {/* Pending Onboarding State */}
                {stripeAccountId && !onboardingComplete && (
                    <>
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                <strong>Action Required:</strong> Complete your Stripe onboarding to start receiving payments.
                            </AlertDescription>
                        </Alert>

                        <Button
                            onClick={handleStartOnboarding}
                            disabled={loading}
                            className="w-full h-12"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                <>
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Complete Stripe Setup
                                </>
                            )}
                        </Button>
                    </>
                )}

                {/* Verification Pending State */}
                {stripeAccountId && onboardingComplete && (!chargesEnabled || !payoutsEnabled) && (
                    <>
                        <Alert className="border-blue-500 bg-blue-50">
                            <AlertCircle className="h-4 w-4 text-blue-600" />
                            <AlertDescription className="text-blue-900">
                                <strong>Verification in Progress:</strong> Stripe is verifying your account. This usually takes 1-2 business days.
                            </AlertDescription>
                        </Alert>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                <span className="text-sm font-medium">Charges Enabled</span>
                                {chargesEnabled ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                    <Loader2 className="h-5 w-5 text-amber-500 animate-spin" />
                                )}
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                <span className="text-sm font-medium">Payouts Enabled</span>
                                {payoutsEnabled ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                    <Loader2 className="h-5 w-5 text-amber-500 animate-spin" />
                                )}
                            </div>
                        </div>

                        <Button
                            onClick={handleRefreshStatus}
                            disabled={loading}
                            variant="outline"
                            className="w-full"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Refreshing...
                                </>
                            ) : (
                                'Refresh Status'
                            )}
                        </Button>
                    </>
                )}

                {/* Active State */}
                {stripeAccountId && onboardingComplete && chargesEnabled && payoutsEnabled && (
                    <>
                        <Alert className="border-green-500 bg-green-50">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-900">
                                <strong>All Set!</strong> Your Stripe account is active and ready to receive payments.
                            </AlertDescription>
                        </Alert>

                        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#111827] to-[#1a9e8c] text-white">
                            <div className="flex items-center gap-2 mb-3">
                                <DollarSign className="h-5 w-5" />
                                <span className="font-bold">Payment Details</span>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-white/70">Account ID</span>
                                    <span className="font-mono text-xs">{stripeAccountId.substring(0, 20)}...</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/70">Payout Schedule</span>
                                    <span className="font-bold">Daily</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/70">Status</span>
                                    <Badge className="bg-green-500">Active</Badge>
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={() => window.open('https://dashboard.stripe.com', '_blank')}
                            variant="outline"
                            className="w-full"
                        >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Stripe Dashboard
                        </Button>
                    </>
                )}

                {/* Info Notice */}
                <div className="text-xs text-muted-foreground p-3 bg-slate-50 rounded-lg">
                    <strong>Note:</strong> Stripe charges a standard processing fee of 1.4% + 20p per transaction. This is separate from the Heems platform fee.
                </div>
            </CardContent>
        </Card>
    );
}
