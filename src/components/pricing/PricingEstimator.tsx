import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Zap } from "lucide-react";

const PricingEstimator = () => {
    const [careType, setCareType] = useState("visiting");
    const [overnightType, setOvernightType] = useState<"sleeping" | "waking">("sleeping");
    const [liveInType, setLiveInType] = useState<"full-time" | "part-time">("full-time");
    const [duration, setDuration] = useState(1);

    const calculateCosts = () => {
        let subtotal = 0;
        let unit = "hours";

        if (careType === "visiting") {
            subtotal = 18 * duration;
            unit = "hours";
        } else if (careType === "live-in") {
            if (liveInType === "full-time") {
                subtotal = 1120 * duration;
                unit = "weeks";
            } else {
                subtotal = 160 * duration;
                unit = "days";
            }
        } else if (careType === "overnight") {
            const nightlyRate = overnightType === "sleeping" ? 120 : 200;
            subtotal = nightlyRate * duration;
            unit = "nights";
        }

        const serviceFee = subtotal * 0.10;
        const total = subtotal + serviceFee;

        // Ensure duration label is singular if 1
        const durationLabel = duration === 1 ? unit.slice(0, -1) : unit;

        return { subtotal, serviceFee, total, unit: durationLabel };
    };

    const { subtotal, serviceFee, total, unit } = calculateCosts();

    return (
        <Card className="max-w-2xl mx-auto border-black/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-[#111827] text-white p-10 lg:p-12">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#1a9e8c] flex items-center justify-center">
                        <Calculator className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-black tracking-tight">Care Cost Estimator</CardTitle>
                </div>
                <CardDescription className="text-white/60 text-lg font-medium">
                    Get an instant estimate for your care requirements. All calculations include our transparent 10% service fee.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-10 lg:p-12 space-y-8">
                <div className="grid gap-8">
                    {/* Care Type Selection */}
                    <div className="space-y-3">
                        <Label className="text-sm font-bold uppercase tracking-wider text-slate-500">Select Care Type</Label>
                        <Select value={careType} onValueChange={(val) => {
                            setCareType(val);
                            // Reset duration defaults when switching types for better UX
                            if (val === "visiting") setDuration(2);
                            else setDuration(1);
                        }}>
                            <SelectTrigger className="h-14 rounded-2xl border-black/5 bg-slate-50 text-lg font-bold">
                                <SelectValue placeholder="Select care type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="visiting">Visiting Care (Avg £18/hr)</SelectItem>
                                <SelectItem value="live-in">Live-in Care</SelectItem>
                                <SelectItem value="overnight">Overnight Care</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Live-in Care Options */}
                    {careType === "live-in" && (
                        <div className="grid sm:grid-cols-2 gap-4 animate-fade-in">
                            <div
                                onClick={() => setLiveInType("full-time")}
                                className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-200 ${liveInType === "full-time"
                                    ? "border-[#1a9e8c] bg-[#1a9e8c]/5 ring-2 ring-[#1a9e8c]/20"
                                    : "border-black/5 bg-slate-50 hover:border-[#1a9e8c]/30"
                                    }`}
                            >
                                <div className="space-y-1">
                                    <Label className={`text-lg font-bold cursor-pointer ${liveInType === "full-time" ? "text-[#1a9e8c]" : "text-[#111827]"}`}>
                                        Full-Time / Ongoing
                                    </Label>
                                    <p className="text-sm font-medium text-slate-500">
                                        £1,120 per week
                                    </p>
                                    <p className="text-xs text-slate-400 mt-2">
                                        Best for consistent, long-term 24/7 support.
                                    </p>
                                </div>
                            </div>

                            <div
                                onClick={() => setLiveInType("part-time")}
                                className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-200 ${liveInType === "part-time"
                                    ? "border-[#1a9e8c] bg-[#1a9e8c]/5 ring-2 ring-[#1a9e8c]/20"
                                    : "border-black/5 bg-slate-50 hover:border-[#1a9e8c]/30"
                                    }`}
                            >
                                <div className="space-y-1">
                                    <Label className={`text-lg font-bold cursor-pointer ${liveInType === "part-time" ? "text-[#1a9e8c]" : "text-[#111827]"}`}>
                                        Short-Term / Respite
                                    </Label>
                                    <p className="text-sm font-medium text-slate-500">
                                        £160 per day
                                    </p>
                                    <p className="text-xs text-slate-400 mt-2">
                                        Flexible daily support for covering breaks.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Overnight Care Options */}
                    {careType === "overnight" && (
                        <div className="grid sm:grid-cols-2 gap-4 animate-fade-in">
                            <div
                                onClick={() => setOvernightType("sleeping")}
                                className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-200 ${overnightType === "sleeping"
                                    ? "border-[#1a9e8c] bg-[#1a9e8c]/5 ring-2 ring-[#1a9e8c]/20"
                                    : "border-black/5 bg-slate-50 hover:border-[#1a9e8c]/30"
                                    }`}
                            >
                                <div className="space-y-1">
                                    <Label className={`text-lg font-bold cursor-pointer ${overnightType === "sleeping" ? "text-[#1a9e8c]" : "text-[#111827]"}`}>
                                        Sleeping Night
                                    </Label>
                                    <p className="text-sm font-medium text-slate-500">
                                        £120 per night
                                    </p>
                                    <p className="text-xs text-slate-400 mt-2">
                                        Carer sleeps but is available for occasional support.
                                    </p>
                                </div>
                            </div>

                            <div
                                onClick={() => setOvernightType("waking")}
                                className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-200 ${overnightType === "waking"
                                    ? "border-[#1a9e8c] bg-[#1a9e8c]/5 ring-2 ring-[#1a9e8c]/20"
                                    : "border-black/5 bg-slate-50 hover:border-[#1a9e8c]/30"
                                    }`}
                            >
                                <div className="space-y-1">
                                    <Label className={`text-lg font-bold cursor-pointer ${overnightType === "waking" ? "text-[#1a9e8c]" : "text-[#111827]"}`}>
                                        Waking Night
                                    </Label>
                                    <p className="text-sm font-medium text-slate-500">
                                        £200 per night
                                    </p>
                                    <p className="text-xs text-slate-400 mt-2">
                                        Carer stays awake for continuous supervision.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Duration Input */}
                    <div className="space-y-3">
                        <Label className="text-sm font-bold uppercase tracking-wider text-slate-500">
                            Duration ({
                                careType === 'live-in' && liveInType === 'full-time' ? 'Weeks' :
                                    careType === 'live-in' && liveInType === 'part-time' ? 'Days' :
                                        careType === 'overnight' ? 'Nights' : 'Hours'
                            })
                        </Label>
                        <div className="relative">
                            <Input
                                type="number"
                                min="1"
                                value={duration}
                                onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 0))}
                                className="h-14 rounded-2xl border-black/5 bg-slate-50 text-lg font-bold pl-6"
                            />
                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold uppercase text-xs tracking-widest">
                                {careType === 'live-in' && liveInType === 'full-time' ? (duration === 1 ? 'Week' : 'Weeks') :
                                    careType === 'live-in' && liveInType === 'part-time' ? (duration === 1 ? 'Day' : 'Days') :
                                        careType === 'overnight' ? (duration === 1 ? 'Night' : 'Nights') :
                                            (duration === 1 ? 'Hour' : 'Hours')}
                            </span>
                        </div>
                        {careType === "visiting" && (
                            <p className="text-xs font-bold text-[#1a9e8c] mt-2">
                                Average Rate: £18.00/hr
                            </p>
                        )}
                    </div>

                </div>

                {/* Results Area */}
                <div className="pt-8 border-t border-black/[0.05]">
                    <div className="bg-slate-50 rounded-3xl p-8 space-y-4">
                        <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                            <span>Estimated Carer Rate</span>
                            <span>£{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-slate-500">Service Fee (Client)</span>
                                <span className="px-2 py-0.5 rounded-full bg-[#1a9e8c]/10 text-[#1a9e8c] text-[10px] font-black uppercase">10%</span>
                            </div>
                            <span className="text-sm font-bold text-[#111827]">£{serviceFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center py-4 border-t border-black/[0.05] mt-4">
                            <span className="text-xl font-black text-[#111827]">Total Estimate</span>
                            <span className="text-3xl font-black text-[#1a9e8c]">£{total.toLocaleString()}</span>
                        </div>

                        <div className="pt-4 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest justify-center">
                            <Zap className="w-3 h-3 text-[#1a9e8c]" />
                            Support Fee (Carer): 0%
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="mt-8 text-xs text-slate-400 font-medium leading-relaxed space-y-2 text-center">
                        <p>
                            The Care Cost Estimator is provided as a guidance tool to help families understand potential care costs based on typical usage and current platform averages. It is not a fixed quote or contractual offer.
                        </p>
                        <p>
                            Carers on Heems are independent professionals who set their own hourly, daily, or weekly rates. Actual costs may vary depending on the carer selected, level of support required, location, scheduling needs, and any additional agreed services.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PricingEstimator;
