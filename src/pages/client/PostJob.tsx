import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PostcodeAddressLookup } from "@/components/shared/PostcodeAddressLookup";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";

const STEPS = 8;

const LANGUAGES = [
    "Arabic", "Bengali", "British Sign Language", "Cantonese", "French",
    "German", "Greek", "Gujarati", "Hindi", "Italian",
    "Lithuanian", "Makaton", "Mandarin", "Persian/Farsi", "Polish",
    "Portuguese", "Punjabi", "Romanian", "Russian", "Sign Supported English",
    "Somali", "Spanish", "Tagalog/Filipino", "Tamil", "Turkish",
    "Urdu", "Welsh"
];

// Hour blocks for Hourly care (07:00 to 21:00)
const HOURLY_BLOCKS = Array.from({ length: 15 }, (_, i) => {
    const hour = i + 7;
    return `${hour.toString().padStart(2, '0')}:00`;
});

export default function PostJob() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        // Q1
        care_type: "", // 'hourly', 'overnight', 'live_in'
        care_subtype: "", // 'hourly', 'sleeping', 'waking', 'part_time', 'full_time'
        live_in_confirmed: false,

        // Q2 & Q3 (Date & Schedule)
        start_timeline: "specific_dates", // Default to specific dates for clarity
        selected_dates: [] as Date[], // Array of selected dates
        schedule: {} as Record<string, string[]>, // Map of date string -> array of selected times

        // Q4
        recipient_relationship: "", // 'myself', 'family', 'friend'
        recipient_age_group: "", // 'under_18', '18_35', '35_65', 'over_65'

        // Q5 (Funding & Rate)
        funding_source: "", // 'self', 'local_authority', 'nhs'
        preferred_rate: "",

        // Q6 (Preferences)
        driver_required: "dont_mind", // 'yes', 'no', 'dont_mind'
        non_smoker_required: "dont_mind",
        has_pets: "no", // 'yes', 'no'
        languages: [] as string[], // New languages field

        // Q7
        gender_preference: "dont_mind",

        // Q8
        postcode: "",
        address: "",

        // Q9
        additional_info: ""
    });

    const getRateHelperText = () => {
        if (formData.care_type === 'hourly') return "The average rate per hour is £22.50";
        if (formData.care_type === 'live_in') {
            if (formData.care_subtype === 'part_time') return "The average daily rate is £160";
            if (formData.care_subtype === 'full_time') return "The average weekly rate is £1,120";
        }
        if (formData.care_type === 'overnight') return "The average rate per hour is £22.50"; // Defaulting to hourly for overnight
        return "Enter your preferred rate.";
    };




    const toggleLanguage = (lang: string) => {
        setFormData(prev => ({
            ...prev,
            languages: prev.languages.includes(lang)
                ? prev.languages.filter(l => l !== lang)
                : [...prev.languages, lang]
        }));
    };

    const toggleTimeSlot = (dateStr: string, time: string) => {
        setFormData(prev => {
            const currentSlots = prev.schedule[dateStr] || [];
            // Handle 'flexible' specially if needed, but for now treat as string
            const newSlots = currentSlots.includes(time)
                ? currentSlots.filter(t => t !== time)
                : [...currentSlots, time].sort();

            return {
                ...prev,
                schedule: {
                    ...prev.schedule,
                    [dateStr]: newSlots
                }
            };
        });
    };

    const handleNext = () => {
        // Validation
        if (step === 1) {
            if (!formData.care_type) return toast({ title: "Please select a care type", variant: "destructive" });
            if (!formData.care_subtype) return toast({ title: "Please select the specific care needed", variant: "destructive" });
            if (formData.care_type === 'live_in' && !formData.live_in_confirmed) {
                return toast({ title: "Confirmation Required", description: "You must acknowledge the requirements for live-in care.", variant: "destructive" });
            }
        }

        // Step 2: Location (Moved UP)
        if (step === 2) {
            if (!formData.postcode) return toast({ title: "Postcode is required", variant: "destructive" });
            if (!formData.address) return toast({ title: "Address is required", variant: "destructive" });
        }

        // Step 3: Date Selection (Formerly Step 2)
        if (step === 3) {
            if (formData.selected_dates.length === 0) {
                return toast({ title: "Please select at least one date", variant: "destructive" });
            }

            // AUTO-FILL OVERNIGHT SCHEDULE
            if (formData.care_type === 'overnight') {
                const newSchedule = { ...formData.schedule };
                formData.selected_dates.forEach(date => {
                    const dateStr = date.toISOString().split('T')[0];
                    // Always pre-fill 20:00 - 08:00 for overnight, ensuring it's not empty
                    newSchedule[dateStr] = ['20:00', '08:00 (Next Day)'];
                });
                setFormData(prev => ({ ...prev, schedule: newSchedule }));
            }


        }

        // Skip Schedule (Step 4) for Live-in Full-Time
        if (step === 3 && formData.care_type === 'live_in' && formData.care_subtype === 'full_time') {
            setStep(5);
            window.scrollTo(0, 0);
            return;
        }

        // Step 4: Schedule Configuration (Formerly Step 3)
        if (step === 4) {
            // For hourly care, ensure at least one slot is selected for each date
            if (formData.care_type === 'hourly') {
                const missingSchedule = formData.selected_dates.some(date => {
                    const dateStr = date.toISOString().split('T')[0];
                    return !formData.schedule[dateStr] || formData.schedule[dateStr].length === 0;
                });

                if (missingSchedule) {
                    return toast({
                        title: "Incomplete Schedule",
                        description: "Please select at least one time slot for each selected date.",
                        variant: "destructive"
                    });
                }
            }
            // For overnight, we auto-set logic, so it's fine.
        }

        if (step === 5) {
            if (!formData.recipient_relationship) return toast({ title: "Please select who needs care", variant: "destructive" });
            if (!formData.recipient_age_group) return toast({ title: "Please select the age group", variant: "destructive" });
        }

        if (step === 6) {
            if (!formData.funding_source) return toast({ title: "Please select funding source", variant: "destructive" });
            // Rate is optional but recommended
        }

        if (step < STEPS) {
            setStep(step + 1);
            window.scrollTo(0, 0);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (step === 5 && formData.care_type === 'live_in' && formData.care_subtype === 'full_time') {
            setStep(3);
            return;
        }
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            // Prepare schedule for DB
            // If overnight, ensure schedule is set to '20:00 - 08:00' for all dates
            const finalSchedule = { ...formData.schedule };
            if (formData.care_type === 'overnight') {
                formData.selected_dates.forEach(date => {
                    finalSchedule[date.toISOString().split('T')[0]] = ['20:00', '08:00 (Next Day)'];
                });
            }

            // Save to database
            const { error } = await supabase
                .from('jobs')
                .insert({
                    client_id: user.id,
                    ...formData,
                    has_pets: formData.has_pets === 'yes',
                    languages: formData.languages,
                    schedule: finalSchedule, // New column
                    specific_start_date: formData.selected_dates[0]?.toISOString(), // Primary start date
                    // Store full list if needed in 'schedule' column
                });

            if (error) throw error;

            toast({
                title: "Job Posted Successfully",
                description: "Carers in your area have been notified.",
            });
            navigate("/client/dashboard");

        } catch (error: any) {
            console.error(error);
            toast({
                title: "Error posting job",
                description: error.message || "Something went wrong",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-20">
            <div className="flex items-center gap-4 mb-2">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Post a Job</h1>
                    <p className="text-muted-foreground">Tell us about your care needs</p>
                </div>
            </div>

            <Progress value={(step / STEPS) * 100} className="h-2" />

            <Card>
                <CardHeader>
                    <CardTitle>
                        {step === 1 && "Type of Care"}
                        {step === 2 && "Location of Care"}
                        {step === 3 && "Select Dates"}
                        {step === 4 && "Schedule Details"}
                        {step === 5 && "Recipient Details"}
                        {step === 6 && "Funding & Rates"}
                        {step === 7 && "Preferences"}
                        {step === 8 && "Review & Submit"}
                    </CardTitle>
                    <CardDescription>
                        Step {step} of {STEPS}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* STEP 1: Care Type */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <Label className="text-base">What type of care do you need?</Label>
                                <RadioGroup value={formData.care_type} onValueChange={(val) => updateField('care_type', val)}>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2 border p-4 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                                            <RadioGroupItem value="hourly" id="r1" />
                                            <Label htmlFor="r1" className="flex-1 cursor-pointer font-medium">Hourly Care</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 border p-4 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                                            <RadioGroupItem value="overnight" id="r2" />
                                            <Label htmlFor="r2" className="flex-1 cursor-pointer font-medium">Overnight Care</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 border p-4 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                                            <RadioGroupItem value="live_in" id="r3" />
                                            <Label htmlFor="r3" className="flex-1 cursor-pointer font-medium">Live-in Care</Label>
                                        </div>
                                    </div>
                                </RadioGroup>
                            </div>

                            {formData.care_type === 'hourly' && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                    <Label>Schedule Type</Label>
                                    <Select value={formData.care_subtype} onValueChange={(val) => updateField('care_subtype', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="hourly">Standard Hourly</SelectItem>
                                            <SelectItem value="respite">Respite Care</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {formData.care_type === 'overnight' && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                    <Label>Overnight Type</Label>
                                    <RadioGroup value={formData.care_subtype} onValueChange={(val) => updateField('care_subtype', val)} className="flex gap-4">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="sleeping" id="sleep" />
                                            <Label htmlFor="sleep">Sleeping Night</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="waking" id="wake" />
                                            <Label htmlFor="wake">Waking Night</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            )}

                            {formData.care_type === 'live_in' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                    <div className="space-y-3">
                                        <Label>Live-in Type</Label>
                                        <RadioGroup value={formData.care_subtype} onValueChange={(val) => updateField('care_subtype', val)} className="flex gap-4">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="part_time" id="pt" />
                                                <Label htmlFor="pt">Part Time</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="full_time" id="ft" />
                                                <Label htmlFor="ft">Full Time</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    <Alert className="bg-amber-50 border-amber-200">
                                        <AlertCircle className="h-4 w-4 text-amber-600" />
                                        <AlertTitle className="text-amber-800">Important Requirement</AlertTitle>
                                        <AlertDescription className="text-amber-700 mt-2">
                                            <div className="flex items-start space-x-2">
                                                <Checkbox
                                                    id="confirm_live_in"
                                                    checked={formData.live_in_confirmed}
                                                    onCheckedChange={(checked) => updateField('live_in_confirmed', !!checked)}
                                                />
                                                <label htmlFor="confirm_live_in" className="text-sm leading-tight cursor-pointer">
                                                    Please confirm your awareness that live-in care means a Care professional will stay in your home and will require their own bedroom for rest and privacy.
                                                </label>
                                            </div>
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            )}
                        </div>
                    )}


                    {/* STEP 2: Location (Moved Here) */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div className="space-y-4">
                                <Label className="text-base">Where will the care take place?</Label>
                                <div className="grid gap-4">
                                    <PostcodeAddressLookup
                                        postcode={formData.postcode}
                                        onPostcodeChange={(pc) => updateField('postcode', pc)}
                                        onAddressSelect={(addr) => updateField('address', addr)}
                                        label="Postcode"
                                    />

                                    <div className="space-y-2">
                                        <Label>Address Line 1</Label>
                                        <Input
                                            placeholder="Street address..."
                                            value={formData.address}
                                            onChange={(e) => updateField('address', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Date Selection (Multi-Select) */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <Label className="text-base">Select the days you need care</Label>
                                <p className="text-sm text-muted-foreground">You can select multiple days or a range.</p>
                                <div className="flex justify-center p-4 border rounded-xl bg-slate-50/50">
                                    <Calendar
                                        mode="multiple"
                                        selected={formData.selected_dates}
                                        onSelect={(dates) => updateField('selected_dates', dates || [])}
                                        className="rounded-md border bg-white shadow-sm"
                                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                    />
                                </div>
                                {formData.selected_dates.length > 0 && (
                                    <div className="text-sm text-center font-medium">
                                        {formData.selected_dates.length} day(s) selected
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* STEP 4: Dynamic Schedule Grid */}
                    {step === 4 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold">Select Times</h3>
                                <p className="text-sm text-muted-foreground">
                                    {formData.care_type === 'overnight'
                                        ? "Overnight shifts are typically 20:00 to 08:00."
                                        : "Select the hours you need for each day."}
                                </p>
                            </div>

                            <div className="space-y-6">
                                {[...formData.selected_dates].sort((a, b) => a.getTime() - b.getTime()).map((date) => {
                                    const dateStr = date.toISOString().split('T')[0];
                                    const dayName = date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
                                    const selectedSlots = formData.schedule[dateStr] || [];

                                    return (
                                        <div key={dateStr} className="space-y-3 border-b pb-6 last:border-0 last:pb-0">
                                            <h4 className="font-medium text-base flex items-center gap-2">
                                                <CalendarIcon className="h-4 w-4 text-primary" />
                                                {dayName}
                                            </h4>

                                            {formData.care_type === 'overnight' ? (
                                                /* Overnight: Pre-selected block */
                                                <div className="p-4 bg-slate-100 rounded-lg border border-slate-200 text-sm text-slate-700 font-medium flex items-center justify-between">
                                                    <span>Overnight Shift</span>
                                                    <span className="bg-slate-200 px-3 py-1 rounded text-slate-900">20:00 - 08:00</span>
                                                </div>
                                            ) : (
                                                /* Hourly: Selectable Grid */
                                                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
                                                    {HOURLY_BLOCKS.map(time => (
                                                        <Button
                                                            key={time}
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => toggleTimeSlot(dateStr, time)}
                                                            className={`
                                                                text-xs h-9 transition-all
                                                                ${selectedSlots.includes(time)
                                                                    ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90'
                                                                    : 'hover:bg-slate-50 text-slate-600'}
                                                            `}
                                                        >
                                                            {time}
                                                        </Button>
                                                    ))}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => toggleTimeSlot(dateStr, 'flexible')}
                                                        className={`
                                                            text-xs h-9 transition-all col-span-2 sm:col-span-1 border-dashed
                                                            ${selectedSlots.includes('flexible')
                                                                ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                                                                : 'hover:bg-slate-50 text-slate-500'}
                                                        `}
                                                    >
                                                        Flexible
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* STEP 5: Recipient Details */}
                    {step === 5 && (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <Label className="text-base">Who needs care?</Label>
                                <RadioGroup value={formData.recipient_relationship} onValueChange={(val) => updateField('recipient_relationship', val)} className="flex flex-wrap gap-4">
                                    <div className="flex items-center space-x-2 border px-4 py-3 rounded-lg hover:bg-slate-50 cursor-pointer min-w-[120px]">
                                        <RadioGroupItem value="myself" id="who1" />
                                        <Label htmlFor="who1" className="cursor-pointer">Myself</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 border px-4 py-3 rounded-lg hover:bg-slate-50 cursor-pointer min-w-[120px]">
                                        <RadioGroupItem value="family" id="who2" />
                                        <Label htmlFor="who2" className="cursor-pointer">Family Member</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 border px-4 py-3 rounded-lg hover:bg-slate-50 cursor-pointer min-w-[120px]">
                                        <RadioGroupItem value="friend" id="who3" />
                                        <Label htmlFor="who3" className="cursor-pointer">Friend</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="space-y-4 pt-4 border-t animate-in fade-in slide-in-from-top-2">
                                <Label className="text-base">Age group of care recipient</Label>
                                <RadioGroup value={formData.recipient_age_group} onValueChange={(val) => updateField('recipient_age_group', val)} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="flex items-center space-x-2 border px-4 py-3 rounded-lg hover:bg-slate-50 cursor-pointer">
                                        <RadioGroupItem value="under_18" id="age1" />
                                        <Label htmlFor="age1" className="cursor-pointer">Under 18</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 border px-4 py-3 rounded-lg hover:bg-slate-50 cursor-pointer">
                                        <RadioGroupItem value="18_35" id="age2" />
                                        <Label htmlFor="age2" className="cursor-pointer">18-35 years</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 border px-4 py-3 rounded-lg hover:bg-slate-50 cursor-pointer">
                                        <RadioGroupItem value="35_65" id="age3" />
                                        <Label htmlFor="age3" className="cursor-pointer">35-65 years</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 border px-4 py-3 rounded-lg hover:bg-slate-50 cursor-pointer">
                                        <RadioGroupItem value="over_65" id="age4" />
                                        <Label htmlFor="age4" className="cursor-pointer">Over 65</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                    )}

                    {/* STEP 6: Details & Funding */}
                    {step === 6 && (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <Label className="text-base">How are you funding your care?</Label>
                                <Select value={formData.funding_source} onValueChange={(val) => updateField('funding_source', val)}>
                                    <SelectTrigger className="h-12">
                                        <SelectValue placeholder="Select funding source" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="self">Self-funding</SelectItem>
                                        <SelectItem value="local_authority">Local Authority</SelectItem>
                                        <SelectItem value="nhs">NHS / CHC</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-4 pt-4 border-t animate-in fade-in slide-in-from-top-2">
                                <Label className="text-base">Proposed Rate</Label>
                                <div className="max-w-xs">
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">£</span>
                                        <Input
                                            type="number"
                                            className="pl-7"
                                            placeholder="0.00"
                                            value={formData.preferred_rate}
                                            onChange={(e) => updateField('preferred_rate', e.target.value)}
                                        />
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2 bg-slate-50 p-2 rounded border text-slate-600">
                                        <Info className="h-4 w-4 text-blue-500" />
                                        {getRateHelperText()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 7: Preferences */}
                    {step === 7 && (
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <Label className="text-base">Is a driver necessary?</Label>
                                <RadioGroup value={formData.driver_required} onValueChange={(val) => updateField('driver_required', val)} className="flex flex-wrap gap-4">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="d_y" /><Label htmlFor="d_y">Yes</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="d_n" /><Label htmlFor="d_n">No</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="dont_mind" id="d_dm" /><Label htmlFor="d_dm">I Don't mind</Label></div>
                                </RadioGroup>
                            </div>

                            <div className="space-y-2 pt-2">
                                <Label className="text-base">Are you looking for a non-smoker?</Label>
                                <RadioGroup value={formData.non_smoker_required} onValueChange={(val) => updateField('non_smoker_required', val)} className="flex flex-wrap gap-4">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="s_y" /><Label htmlFor="s_y">Yes</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="s_n" /><Label htmlFor="s_n">No</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="dont_mind" id="s_dm" /><Label htmlFor="s_dm">I Don't mind</Label></div>
                                </RadioGroup>
                            </div>

                            <div className="space-y-2 pt-2">
                                <Label className="text-base">Is a language other than English essential?</Label>
                                <p className="text-sm text-muted-foreground mb-3">Please select (Optional)</p>
                                <div className="flex flex-wrap gap-2">
                                    {LANGUAGES.map(lang => (
                                        <button
                                            key={lang}
                                            type="button"
                                            onClick={() => toggleLanguage(lang)}
                                            className={`
                                                px-3 py-1.5 rounded-full text-sm font-medium transition-all
                                                ${formData.languages.includes(lang)
                                                    ? 'bg-primary text-primary-foreground shadow-sm ring-2 ring-primary ring-offset-2'
                                                    : 'bg-white border text-slate-600 hover:bg-slate-50 hover:border-slate-300'}
                                            `}
                                        >
                                            + {lang}
                                        </button>
                                    ))}
                                </div>
                                {formData.languages.length > 0 && (
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Selected: {formData.languages.join(", ")}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2 pt-4">
                                <Label className="text-base">Do you have a pet in your home?</Label>
                                <RadioGroup value={formData.has_pets} onValueChange={(val) => updateField('has_pets', val)} className="flex gap-4">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="p_y" /><Label htmlFor="p_y">Yes</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="p_n" /><Label htmlFor="p_n">No</Label></div>
                                </RadioGroup>
                            </div>

                            <div className="space-y-2 pt-4">
                                <Label className="text-base">Do you have a preference for your Care professional?</Label>
                                <RadioGroup value={formData.gender_preference} onValueChange={(val) => updateField('gender_preference', val)} className="flex flex-wrap gap-4">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="male" id="g_m" /><Label htmlFor="g_m">Male</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="female" id="g_f" /><Label htmlFor="g_f">Female</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="dont_mind" id="g_dm" /><Label htmlFor="g_dm">I don't mind</Label></div>
                                </RadioGroup>
                            </div>
                        </div>
                    )}

                    {/* STEP 8: Final Review */}
                    {step === 8 && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-base">Additional Information</Label>
                                <Textarea
                                    className="min-h-[150px]"
                                    placeholder="Please provide any other details that might help us find the perfect carer for you..."
                                    value={formData.additional_info}
                                    onChange={(e) => updateField('additional_info', e.target.value)}
                                />
                            </div>

                            <div className="bg-slate-50 p-4 rounded-lg space-y-4 text-sm">
                                <h3 className="font-bold">Summary</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><span className="text-muted-foreground">Type:</span> <span className="font-medium capitalize">{formData.care_type.replace('_', ' ')}</span></div>
                                    <div><span className="text-muted-foreground">Subtype:</span> <span className="font-medium capitalize">{formData.care_subtype.replace('_', ' ')}</span></div>
                                    <div><span className="text-muted-foreground">Timeline:</span> <span className="font-medium capitalize">{formData.start_timeline.replace('_', ' ')}</span></div>
                                    <div><span className="text-muted-foreground">Location:</span> <span className="font-medium">{formData.postcode}</span></div>
                                    <div><span className="text-muted-foreground">Age Group:</span> <span className="font-medium capitalize">{formData.recipient_age_group?.replace('_', '-')}</span></div>
                                    <div><span className="text-muted-foreground">Languages:</span> <span className="font-medium">{formData.languages.length > 0 ? formData.languages.join(", ") : "None"}</span></div>
                                </div>
                                {formData.additional_info && (
                                    <div className="pt-2 border-t mt-2">
                                        <span className="text-muted-foreground block mb-1">Additional Information:</span>
                                        <p className="text-slate-700 whitespace-pre-wrap">{formData.additional_info}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between pt-6 border-t mt-6">
                        {step > 1 ? (
                            <Button variant="outline" onClick={handleBack}>Back</Button>
                        ) : (
                            <div />
                        )}

                        <Button onClick={handleNext} disabled={loading} className="px-8">
                            {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
                            {step === STEPS ? "Post Job" : "Next"}
                            {step !== STEPS && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>
                    </div>

                </CardContent>
            </Card>
        </div >
    );
}
