import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import {
    ArrowLeft,
    Calendar as CalendarIcon,
    Clock,
    ShieldCheck,
    CreditCard,
    CheckCircle2,
    ChevronRight,
    Info,
    AlertCircle,
    TrendingUp,
    Tag,
    Repeat
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { calculateFees, formatCurrency, MINIMUM_HOURLY_RATE, validateMinimumRate } from "@/lib/fees";
import type { FeeCalculation, PricingPhase } from "@/types/database";

export default function CreateBooking() {
    const { carerId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [step, setStep] = useState(1);
    const [carer, setCarer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentPhase, setCurrentPhase] = useState<PricingPhase>('1');
    const [feeBreakdown, setFeeBreakdown] = useState<FeeCalculation | null>(null);

    // Proposal Data
    const proposalRate = searchParams.get('rate') ? parseFloat(searchParams.get('rate')!) : null;
    const proposalId = searchParams.get('proposalId');
    const proposalType = searchParams.get('type');

    // Selection State
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [selectedTime, setSelectedTime] = useState("09:00");
    // Service Selection
    const [serviceType, setServiceType] = useState<'hourly' | 'live_in' | 'overnight'>('hourly');
    const [serviceSubtype, setServiceSubtype] = useState<string>('hourly'); // 'hourly', 'daily', 'weekly', 'sleeping', 'waking'
    const [duration, setDuration] = useState(2); // reused as quantity (hours/days/weeks/nights)
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurrenceType, setRecurrenceType] = useState<'weekly' | 'fortnightly' | 'monthly'>('weekly');
    const [recurrenceEndDate, setRecurrenceEndDate] = useState<Date | undefined>(undefined);

    useEffect(() => {
        if (proposalType) {
            if (proposalType === 'live-in') setServiceType('live_in');
            else if (proposalType === 'overnight') setServiceType('overnight');
            else setServiceType('hourly');
        }
    }, [proposalType]);

    useEffect(() => {
        fetchCarer();
        fetchCurrentPhase();
    }, [carerId]);

    useEffect(() => {
        if (carer) {
            calculateFeeBreakdown();
        }
    }, [carer, duration, currentPhase, serviceType, serviceSubtype]);

    const fetchCarer = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select(`
          id,
          full_name,
          avatar_url,
          email,
          carer_details (
            bio,
            hourly_rate,
            live_in_rate_weekly,
            live_in_rate_daily,
            overnight_sleeping_rate,
            overnight_waking_rate,
            verification_status,
            onboarded_at
          )
        `)
                .eq('id', carerId)
                .single();

            if (error) throw error;

            // Normalize carer data (handle case where 1:1 relation returns array)
            const normalizedCarer = {
                ...data,
                carer_details: Array.isArray(data.carer_details)
                    ? data.carer_details[0]
                    : data.carer_details
            };

            setCarer(normalizedCarer);
        } catch (error: any) {
            toast({
                title: "Error fetching carer",
                description: error.message,
                variant: "destructive",
            });
            navigate("/client/search");
        } finally {
            setLoading(false);
        }
    };

    const fetchCurrentPhase = async () => {
        try {
            const { data, error } = await supabase
                .from('system_config')
                .select('value')
                .eq('id', 'active_phase')
                .single();

            if (error) throw error;
            setCurrentPhase((data?.value || '1') as PricingPhase);
        } catch (error) {
            console.error('Error fetching phase:', error);
            setCurrentPhase('1'); // Default to Phase 1
        }
    };

    const calculateFeeBreakdown = () => {
        try {
            if (!carer?.carer_details) return;

            // Use proposal rate if available, otherwise default to carer's rate
            let rate = proposalRate || carer.carer_details.hourly_rate || 25;

            // Determine rate based on service type IF NOT A PROPOSAL
            if (!proposalRate) {
                if (serviceType === 'live_in') {
                    if (serviceSubtype === 'weekly' && carer.carer_details.live_in_rate_weekly) {
                        rate = carer.carer_details.live_in_rate_weekly;
                    } else if (serviceSubtype === 'daily' && carer.carer_details.live_in_rate_daily) {
                        rate = carer.carer_details.live_in_rate_daily;
                    }
                } else if (serviceType === 'overnight') {
                    if (serviceSubtype === 'sleeping' && carer.carer_details.overnight_sleeping_rate) {
                        rate = carer.carer_details.overnight_sleeping_rate;
                    } else if (serviceSubtype === 'waking' && carer.carer_details.overnight_waking_rate) {
                        rate = carer.carer_details.overnight_waking_rate;
                    }
                }
            }

            const onboardedAt = carer.carer_details.onboarded_at;
            // duration acts as quantity (hours, days, weeks, nights)
            const fees = calculateFees(rate, duration, currentPhase, onboardedAt);
            setFeeBreakdown(fees);
        } catch (error: any) {
            console.error('Fee calculation error:', error);
            toast({
                title: 'Rate Error',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    const handleBooking = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Please log in to book");

            // Validate minimum rate
            const rate = proposalRate || carer?.carer_details?.hourly_rate || 25;
            if (!validateMinimumRate(rate)) {
                throw new Error(`Rate must be at least £${MINIMUM_HOURLY_RATE}/hour`);
            }

            if (!feeBreakdown) {
                throw new Error('Fee calculation failed');
            }

            const startTime = new Date(selectedDate!);
            const [hours, minutes] = selectedTime.split(':');
            startTime.setHours(parseInt(hours), parseInt(minutes));

            const bookingsToInsert = [];
            let currentStart = new Date(startTime);
            const rEndDate = isRecurring && recurrenceEndDate ? new Date(recurrenceEndDate) : new Date(startTime.getTime() + 1000 * 60 * 60 * 24 * 365); // Default to max 1 year

            let occurrences = 0;
            const maxOccurrences = 12; // Safety limit to avoid massive batch inserts at once

            while (currentStart <= rEndDate && occurrences < maxOccurrences) {
                const currentEnd = new Date(currentStart);
                currentEnd.setHours(currentEnd.getHours() + duration);

                bookingsToInsert.push({
                    client_id: user.id,
                    carer_id: carerId,
                    start_time: currentStart.toISOString(),
                    end_time: currentEnd.toISOString(),
                    total_price: feeBreakdown.clientTotal,
                    rate_per_hour: rate,
                    client_fee: feeBreakdown.clientFee,
                    carer_fee: feeBreakdown.carerFee,
                    status: 'pending',
                    recurrence_type: isRecurring ? recurrenceType : null,
                    recurrence_end_date: isRecurring && recurrenceEndDate ? recurrenceEndDate.toISOString() : null
                });

                if (!isRecurring) break;

                // Advance the date based on frequency
                if (recurrenceType === 'weekly') {
                    currentStart.setDate(currentStart.getDate() + 7);
                } else if (recurrenceType === 'biweekly') {
                    currentStart.setDate(currentStart.getDate() + 14);
                } else if (recurrenceType === 'monthly') {
                    currentStart.setMonth(currentStart.getMonth() + 1);
                } else {
                    break;
                }

                occurrences++;
            }

            const { data: insertedBookings, error } = await supabase
                .from('bookings')
                .insert(bookingsToInsert)
                .select();

            if (error) throw error;
            if (!insertedBookings || insertedBookings.length === 0) throw new Error("No bookings were created");

            const booking = insertedBookings[0];

            // If it was a proposal, mark it as booked and preserve other metadata
            if (proposalId) {
                const { data: proposal } = await supabase
                    .from('messages')
                    .select('metadata')
                    .eq('id', proposalId)
                    .single();

                if (proposal) {
                    await supabase
                        .from('messages')
                        .update({
                            metadata: {
                                ...proposal.metadata,
                                status: 'booked',
                                booked_at: new Date().toISOString()
                            }
                        })
                        .eq('id', proposalId);
                }
            }

            // 3. Send confirmation emails via Edge Function
            // Email to Carer: Booking Request
            await supabase.functions.invoke('send-transactional-email', {
                body: {
                    type: 'booking_request',
                    email: carer.email, // Assuming checking carer email or handle in edge function
                    name: carer.full_name,
                    data: {
                        clientName: user.user_metadata.full_name || 'A Client',
                        date: startTime.toLocaleDateString(),
                        duration: `${duration} ${serviceType === 'hourly' ? 'hours' : 'days'}`,
                        bookingId: booking.id
                    }
                }
            });

            // Email to Client: Request Sent Confirmation
            await supabase.functions.invoke('send-transactional-email', {
                body: {
                    type: 'booking_request_sent',
                    email: user.email,
                    name: user.user_metadata.full_name || 'Client',
                    data: {
                        carerName: carer.full_name,
                        date: startTime.toLocaleDateString(),
                        bookingId: booking.id
                    }
                }
            });

            setStep(3);
            toast({
                title: isRecurring ? "Recurring Booking Request Sent!" : "Booking Request Sent!",
                description: `Your request for ${insertedBookings.length} session(s) has been sent to ${carer.full_name}. You'll be notified when they respond.`,
            });
        } catch (error: any) {
            toast({
                title: "Booking Failed",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading && step === 1) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 px-4 md:px-6 py-4 animate-fade-in">
            {/* Navigation */}
            <Button variant="ghost" onClick={() => navigate(-1)} className="h-9 px-4 rounded-lg group hover:bg-primary/5 text-xs font-bold">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Search
            </Button>

            <div className="flex flex-col-reverse lg:grid lg:grid-cols-3 gap-6">
                {/* Main Booking Content */}
                <div className="lg:col-span-2 space-y-6">
                    {step < 3 && (
                        <Card className="rounded-2xl border-black/5 shadow-sm overflow-hidden bg-white">
                            <CardContent className="p-0">
                                {/* Progress Header */}
                                <div className="bg-slate-50 border-b border-black/5 p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${step >= 1 ? 'bg-primary text-white shadow-sm' : 'bg-muted text-muted-foreground'}`}>1</div>
                                        <div className="h-px w-6 bg-black/5" />
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${step >= 2 ? 'bg-primary text-white shadow-sm' : 'bg-muted text-muted-foreground'}`}>2</div>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                        Step {step} of 2
                                    </span>
                                </div>

                                {step === 1 ? (
                                    <div className="p-6 space-y-6">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-xl font-bold tracking-tight">Configure Booking</h2>
                                            {proposalRate && (
                                                <Badge className="bg-emerald-500 hover:bg-emerald-600">
                                                    <Tag className="w-3 h-3 mr-1" /> Special Offer Applied
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Service Type Selection */}
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Service Type</Label>
                                            <div className="flex flex-wrap gap-2">
                                                <Button
                                                    variant={serviceType === 'hourly' ? 'default' : 'outline'}
                                                    onClick={() => { if (!proposalRate) { setServiceType('hourly'); setServiceSubtype('hourly'); setDuration(2); } }}
                                                    className={`h-9 text-xs ${(proposalRate && serviceType !== 'hourly') ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    disabled={!!proposalRate && serviceType !== 'hourly'} // Disable if offer is not for this type? Actually proposal sets type.
                                                >
                                                    Hourly Care
                                                </Button>

                                                {(carer?.carer_details?.overnight_sleeping_rate || carer?.carer_details?.overnight_waking_rate) && (
                                                    <Button
                                                        variant={serviceType === 'overnight' ? 'default' : 'outline'}
                                                        onClick={() => {
                                                            if (!proposalRate) {
                                                                setServiceType('overnight');
                                                                setServiceSubtype(carer?.carer_details?.overnight_sleeping_rate ? 'sleeping' : 'waking');
                                                                setDuration(1); // 1 night
                                                            }
                                                        }}
                                                        className={`h-9 text-xs ${(proposalRate && serviceType !== 'overnight') ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        disabled={!!proposalRate && serviceType !== 'overnight'}
                                                    >
                                                        Overnight Care
                                                    </Button>
                                                )}

                                                {(carer?.carer_details?.live_in_rate_daily || carer?.carer_details?.live_in_rate_weekly) && (
                                                    <Button
                                                        variant={serviceType === 'live_in' ? 'default' : 'outline'}
                                                        onClick={() => {
                                                            if (!proposalRate) {
                                                                setServiceType('live_in');
                                                                setServiceSubtype(carer?.carer_details?.live_in_rate_daily ? 'daily' : 'weekly');
                                                                setDuration(1); // 1 day/week
                                                            }
                                                        }}
                                                        className={`h-9 text-xs ${(proposalRate && serviceType !== 'live_in') ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        disabled={!!proposalRate && serviceType !== 'live_in'}
                                                    >
                                                        Live-in Care
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Subtype Selection (if applicable) */}
                                        {serviceType === 'overnight' && !proposalRate && (
                                            <div className="space-y-3 animate-in fade-in">
                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Night Type</Label>
                                                <div className="flex gap-2">
                                                    {carer?.carer_details?.overnight_sleeping_rate && (
                                                        <Button
                                                            variant={serviceSubtype === 'sleeping' ? 'default' : 'outline'}
                                                            onClick={() => setServiceSubtype('sleeping')}
                                                            size="sm" className="h-8 text-xs"
                                                        >
                                                            Sleeping Night
                                                        </Button>
                                                    )}
                                                    {carer?.carer_details?.overnight_waking_rate && (
                                                        <Button
                                                            variant={serviceSubtype === 'waking' ? 'default' : 'outline'}
                                                            onClick={() => setServiceSubtype('waking')}
                                                            size="sm" className="h-8 text-xs"
                                                        >
                                                            Waking Night
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {serviceType === 'live_in' && !proposalRate && (
                                            <div className="space-y-3 animate-in fade-in">
                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Duration Unit</Label>
                                                <div className="flex gap-2">
                                                    {carer?.carer_details?.live_in_rate_daily && (
                                                        <Button
                                                            variant={serviceSubtype === 'daily' ? 'default' : 'outline'}
                                                            onClick={() => setServiceSubtype('daily')}
                                                            size="sm" className="h-8 text-xs"
                                                        >
                                                            Daily Rate
                                                        </Button>
                                                    )}
                                                    {carer?.carer_details?.live_in_rate_weekly && (
                                                        <Button
                                                            variant={serviceSubtype === 'weekly' ? 'default' : 'outline'}
                                                            onClick={() => setServiceSubtype('weekly')}
                                                            size="sm" className="h-8 text-xs"
                                                        >
                                                            Weekly Rate
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Start Date</Label>
                                                <div className="p-2 border border-black/5 rounded-2xl bg-slate-50/50">
                                                    <Calendar
                                                        mode="single"
                                                        selected={selectedDate}
                                                        onSelect={setSelectedDate}
                                                        className="rounded-md"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                {/* Time Selection - Only for Hourly or Overnight */}
                                                {(serviceType === 'hourly' || serviceType === 'overnight') && (
                                                    <div className="space-y-3">
                                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                                            {serviceType === 'overnight' ? 'Start Time (Approx)' : 'Arrival Window'}
                                                        </Label>
                                                        <div className="grid grid-cols-3 gap-2">
                                                            {(serviceType === 'overnight'
                                                                ? ["20:00", "21:00", "22:00"]
                                                                : ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"]
                                                            ).map(t => (
                                                                <Button
                                                                    key={t}
                                                                    variant={selectedTime === t ? "default" : "outline"}
                                                                    className={`rounded-lg font-bold h-10 text-xs transition-all ${selectedTime === t ? 'shadow-md shadow-primary/10' : 'border-black/5'}`}
                                                                    onClick={() => setSelectedTime(t)}
                                                                >
                                                                    {t}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="space-y-3">
                                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                                        {serviceType === 'hourly' ? 'Duration (Hours)' :
                                                            serviceType === 'overnight' ? 'Duration (Nights)' :
                                                                serviceSubtype === 'weekly' ? 'Duration (Weeks)' : 'Duration (Days)'}
                                                    </Label>
                                                    <div className="flex items-center gap-3 p-3 border border-black/5 rounded-xl bg-slate-50/50">
                                                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setDuration(Math.max(1, duration - 1))}>-</Button>
                                                        <span className="flex-1 text-center text-lg font-bold">
                                                            {duration} <span className="text-xs font-semibold text-muted-foreground">
                                                                {serviceType === 'hourly' ? 'hrs' :
                                                                    serviceType === 'overnight' ? 'nights' :
                                                                        serviceSubtype === 'weekly' ? 'wks' : 'days'}
                                                            </span>
                                                        </span>
                                                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setDuration(duration + 1)}>+</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Recurring Booking Toggle */}
                                        <div className="pt-4 border-t space-y-3">
                                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-black/5">
                                                <div className="flex items-center gap-3">
                                                    <Repeat className="w-4 h-4 text-[#1a9e8c]" />
                                                    <div>
                                                        <Label className="font-bold text-sm cursor-pointer">Recurring Booking</Label>
                                                        <p className="text-[11px] text-muted-foreground">Automatically rebook on a schedule</p>
                                                    </div>
                                                </div>
                                                <Switch checked={isRecurring} onCheckedChange={setIsRecurring} />
                                            </div>
                                            {isRecurring && (
                                                <div className="space-y-4 animate-in fade-in">
                                                    <Select value={recurrenceType} onValueChange={(v: any) => setRecurrenceType(v)}>
                                                        <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-black/5">
                                                            <SelectValue placeholder="Frequency" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="weekly">Every Week</SelectItem>
                                                            <SelectItem value="biweekly">Every 2 Weeks</SelectItem>
                                                            <SelectItem value="monthly">Every Month</SelectItem>
                                                        </SelectContent>
                                                    </Select>

                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Until (Optional)</Label>
                                                        <div className="p-3 border border-black/5 rounded-xl bg-slate-50/50 flex flex-col items-center">
                                                            <Calendar
                                                                mode="single"
                                                                selected={recurrenceEndDate}
                                                                onSelect={setRecurrenceEndDate}
                                                                disabled={(date) => date < (selectedDate || new Date())}
                                                                initialFocus
                                                                className="rounded-md border bg-white shadow-sm"
                                                            />
                                                            <p className="text-[10px] text-muted-foreground mt-2">
                                                                {recurrenceEndDate ? `Recurring until ${format(recurrenceEndDate, 'dd MMM yyyy')}` : 'Runs until cancelled'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <Button className="w-full h-12 rounded-xl font-bold text-sm shadow-md shadow-primary/10" onClick={() => setStep(2)}>
                                            Review Summary
                                            <ChevronRight className="w-4 h-4 ml-1.5" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="p-6 space-y-6">
                                        <h2 className="text-xl font-bold tracking-tight">Review & Confirm</h2>

                                        <div className="space-y-4">
                                            {/* Booking Details */}
                                            <div className="p-5 rounded-2xl bg-slate-50/50 border border-black/5 space-y-3">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="font-semibold text-muted-foreground">Appointment</span>
                                                    <span className="font-bold text-foreground">{format(selectedDate!, "EEE, MMM do")} at {selectedTime}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="font-semibold text-muted-foreground">Duration</span>
                                                    <span className="font-bold text-foreground">
                                                        {duration} {serviceType === 'hourly' ? 'Hours' :
                                                            serviceType === 'overnight' ? 'Nights' :
                                                                serviceSubtype === 'weekly' ? 'Weeks' : 'Days'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Fee Breakdown */}
                                            {feeBreakdown && (
                                                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#111827] to-[#1a9e8c] text-white space-y-3">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <TrendingUp className="h-4 w-4" />
                                                        <span className="text-xs font-bold uppercase tracking-widest">Fee Breakdown (Phase {currentPhase})</span>
                                                    </div>

                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-white/70">
                                                            Base Rate ({duration} {serviceType === 'hourly' ? 'hrs' :
                                                                serviceType === 'overnight' ? 'nights' :
                                                                    serviceSubtype === 'weekly' ? 'wks' : 'days'} × {formatCurrency(feeBreakdown.baseRate)}/{serviceType === 'hourly' ? 'hr' :
                                                                        serviceType === 'overnight' ? 'night' :
                                                                            serviceSubtype === 'weekly' ? 'wk' : 'day'})
                                                        </span>
                                                        <span className="font-bold">{formatCurrency(feeBreakdown.subtotal)}</span>
                                                    </div>

                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-white/70">Platform Fee ({(feeBreakdown.clientFeePercentage * 100).toFixed(0)}%)</span>
                                                        <span className="font-bold">+{formatCurrency(feeBreakdown.clientFee)}</span>
                                                    </div>

                                                    <div className="h-px bg-white/10" />

                                                    <div className="flex justify-between items-center">
                                                        <span className="font-semibold">Total to Pay</span>
                                                        <span className="text-2xl font-black tracking-tight">{formatCurrency(feeBreakdown.clientTotal)}</span>
                                                    </div>

                                                    <div className="text-xs text-white/60 mt-2">
                                                        Carer receives: {formatCurrency(feeBreakdown.carerEarnings)}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Rate Compliance Alert */}


                                            {(carer?.carer_details?.hourly_rate || 25) < MINIMUM_HOURLY_RATE && !proposalRate && (
                                                <Alert variant="destructive">
                                                    <AlertCircle className="h-4 w-4" />
                                                    <AlertDescription>
                                                        <strong>Rate Error:</strong> This carer's rate (£{carer?.carer_details?.hourly_rate || 25}/hr) is below the minimum of £{MINIMUM_HOURLY_RATE}/hr. Booking cannot proceed.
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                            <div className="flex items-start gap-3 p-3.5 bg-amber-50 rounded-xl border border-amber-100 italic font-medium text-[11px] text-amber-900 leading-relaxed">
                                                <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                                Payment is processed only after the carer completes the visit. All fees comply with PRD v2.3.2.
                                            </div>
                                        </div>

                                        <Button
                                            className="w-full h-12 rounded-xl font-bold text-sm shadow-md shadow-primary/10"
                                            onClick={handleBooking}
                                            disabled={loading || (!proposalRate && (carer?.carer_details?.hourly_rate || 25) < MINIMUM_HOURLY_RATE)}
                                        >
                                            {loading ? "Processing..." : "Confirm Booking"}
                                            {!loading && <CheckCircle2 className="w-4 h-4 ml-2" />}
                                        </Button>

                                        <Button variant="ghost" className="w-full h-10 rounded-lg font-bold text-xs text-muted-foreground" onClick={() => setStep(1)} disabled={loading}>
                                            Back to Reschedule
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {step === 3 && (
                        <Card className="rounded-2xl border-black/5 shadow-md overflow-hidden text-center p-10 space-y-6 bg-white">
                            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-float">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <div className="space-y-1.5">
                                <h2 className="text-2xl font-bold tracking-tight">Booking Requested!</h2>
                                <p className="text-muted-foreground text-sm">We've sent your request to {carer.full_name}.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Button variant="outline" className="h-11 rounded-xl font-bold text-xs" onClick={() => navigate("/client/bookings")}>
                                    View Bookings
                                </Button>
                                <Button className="h-11 rounded-xl font-bold text-xs" onClick={() => navigate("/client/search")}>
                                    Find Another
                                </Button>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Sidebar: Carer Summary */}
                <div className="space-y-6 w-full mb-6 lg:mb-0">
                    <Card className="rounded-2xl border-none bg-slate-900 text-white overflow-hidden lg:sticky lg:top-8 shadow-xl">
                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12 border border-white/10 rounded-xl">
                                    <AvatarImage src={carer?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${carer?.full_name}`} />
                                    <AvatarFallback className="text-xs font-bold bg-white/10">{carer?.full_name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-base font-bold tracking-tight">{carer?.full_name}</h3>
                                    <div className="flex items-center gap-1.5 text-primary">
                                        <ShieldCheck className="w-3.5 h-3.5 fill-primary text-slate-900" />
                                        <span className="text-[9px] font-bold uppercase tracking-wider">Elite Member</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 pt-5 border-t border-white/5">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-semibold text-white/40">Hourly Rate</span>
                                    {proposalRate ? (
                                        <span className="font-bold tracking-tight text-emerald-400">
                                            {formatCurrency(proposalRate)}
                                            <span className="text-[10px] ml-1 text-white/50">(Offer)</span>
                                        </span>
                                    ) : (
                                        <span className="font-bold tracking-tight">£{carer?.carer_details?.hourly_rate || '25.00'}</span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center text-[11px]">
                                    <span className="font-semibold text-white/40 flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5" /> Response
                                    </span>
                                    <span className="font-bold text-emerald-400">~15 mins</span>
                                </div>
                            </div>

                            <div className="pt-5 space-y-3">
                                <Button
                                    className="w-full h-10 rounded-xl font-bold text-xs bg-white text-slate-900 hover:bg-white/90"
                                    onClick={() => navigate(`/client/messages?userId=${carer.id}`)}
                                >
                                    Message {carer.full_name?.split(' ')[0]}
                                </Button>
                            </div>

                            <div className="pt-3 space-y-3">
                                <Label className="text-[9px] font-bold uppercase tracking-widest text-white/30">Payment Protection</Label>
                                <div className="flex gap-3 items-center">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                        <CreditCard className="w-4 h-4 opacity-60" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-bold text-white/70">Escrow Secured</p>
                                        <p className="text-[9px] text-white/30 leading-tight">Funds held safely until care is confirmed.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div >
    );
}
