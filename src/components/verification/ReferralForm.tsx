// Referral Form Component for Carer Verification
import { useState } from 'react';
import { UserPlus, Mail, Phone, Briefcase, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ReferralFormProps {
    carerId: string;
    referralNumber: 1 | 2;
    onSubmitComplete?: () => void;
}

interface ReferralData {
    referee_name: string;
    referee_email: string;
    referee_phone: string;
    relationship: string;
}

export function ReferralForm({ carerId, referralNumber, onSubmitComplete }: ReferralFormProps) {
    const [formData, setFormData] = useState<ReferralData>({
        referee_name: '',
        referee_email: '',
        referee_phone: '',
        relationship: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const { toast } = useToast();

    const handleChange = (field: keyof ReferralData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setSubmitStatus('idle');
    };

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone: string): boolean => {
        // UK phone number validation (basic)
        const phoneRegex = /^(\+44|0)[0-9]{10}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.referee_name.trim()) {
            toast({
                title: 'Name required',
                description: 'Please enter the referee\'s full name',
                variant: 'destructive',
            });
            return;
        }

        if (!validateEmail(formData.referee_email)) {
            toast({
                title: 'Invalid email',
                description: 'Please enter a valid email address',
                variant: 'destructive',
            });
            return;
        }

        if (formData.referee_phone && !validatePhone(formData.referee_phone)) {
            toast({
                title: 'Invalid phone number',
                description: 'Please enter a valid UK phone number',
                variant: 'destructive',
            });
            return;
        }

        if (!formData.relationship.trim()) {
            toast({
                title: 'Relationship required',
                description: 'Please describe your relationship with this referee',
                variant: 'destructive',
            });
            return;
        }

        setSubmitting(true);

        try {
            // Insert referral into database
            const { error } = await supabase
                .from('carer_referrals')
                .insert({
                    carer_id: carerId,
                    referee_name: formData.referee_name,
                    referee_email: formData.referee_email,
                    referee_phone: formData.referee_phone || null,
                    relationship: formData.relationship,
                    status: 'pending',
                });

            if (error) throw error;

            // TODO: Send email notification to referee
            // This would be done via Supabase Edge Function or email service

            setSubmitStatus('success');
            toast({
                title: 'Referral submitted',
                description: 'Your referee will be contacted for verification',
            });

            onSubmitComplete?.();
        } catch (error: any) {
            console.error('Referral submission error:', error);
            setSubmitStatus('error');
            toast({
                title: 'Submission failed',
                description: error.message || 'Failed to submit referral',
                variant: 'destructive',
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Work Referral {referralNumber}
                </CardTitle>
                <CardDescription>
                    Provide details of a previous employer or supervisor who can verify your work history
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor={`name-${referralNumber}`}>
                            Referee Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id={`name-${referralNumber}`}
                            placeholder="e.g., Dr. Sarah Johnson"
                            value={formData.referee_name}
                            onChange={(e) => handleChange('referee_name', e.target.value)}
                            disabled={submitting || submitStatus === 'success'}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor={`email-${referralNumber}`}>
                            Referee Email <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id={`email-${referralNumber}`}
                                type="email"
                                placeholder="referee@example.com"
                                className="pl-10"
                                value={formData.referee_email}
                                onChange={(e) => handleChange('referee_email', e.target.value)}
                                disabled={submitting || submitStatus === 'success'}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor={`phone-${referralNumber}`}>Referee Phone (Optional)</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id={`phone-${referralNumber}`}
                                type="tel"
                                placeholder="07123 456789"
                                className="pl-10"
                                value={formData.referee_phone}
                                onChange={(e) => handleChange('referee_phone', e.target.value)}
                                disabled={submitting || submitStatus === 'success'}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor={`relationship-${referralNumber}`}>
                            Relationship/Position <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id={`relationship-${referralNumber}`}
                                placeholder="e.g., Previous Employer, Care Home Manager"
                                className="pl-10"
                                value={formData.relationship}
                                onChange={(e) => handleChange('relationship', e.target.value)}
                                disabled={submitting || submitStatus === 'success'}
                                required
                            />
                        </div>
                    </div>

                    {submitStatus === 'success' ? (
                        <Alert className="border-green-500 bg-green-50">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800">
                                Referral {referralNumber} submitted successfully
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <Button
                            type="submit"
                            disabled={submitting}
                            className="w-full"
                        >
                            {submitting ? (
                                <>
                                    <UserPlus className="mr-2 h-4 w-4 animate-pulse" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Submit Referral {referralNumber}
                                </>
                            )}
                        </Button>
                    )}

                    {submitStatus === 'error' && (
                        <Alert variant="destructive">
                            <XCircle className="h-4 w-4" />
                            <AlertDescription>
                                Failed to submit referral. Please try again.
                            </AlertDescription>
                        </Alert>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
