import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calculator, Zap } from "lucide-react";

const PricingEstimator = () => {
    const [careType, setCareType] = useState("visiting");
    const [overnightType, setOvernightType] = useState("sleeping"); // sleeping | waking
    const [liveInType, setLiveInType] = useState("full-time"); // full-time | part-time
    const [duration, setDuration] = useState(1);

    const calculateCosts = () => {
        let subtotal = 0;
        let unit = "hours";

        if (careType === "visiting") {
            subtotal = 25 * duration;
            unit = "hours";
        } else if (careType === "live-in") {
            if (liveInType === "full-time") {
                subtotal = 1200 * duration;
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

        return { subtotal, serviceFee, total, unit };
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
                    {/* Care Type */}
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
                                <SelectItem value="visiting">Visiting Care (Avg £25/hr)</SelectItem>
                                <SelectItem value="live-in">Live-in Care</SelectItem>
                                <SelectItem value="overnight">Overnight Care</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Sub-Option for Live-in */}
                    {careType === "live-in" && (
                        <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 border border-black/5">
                            <div className="space-y-1">
                                <Label className="text-lg font-bold text-[#111827]">
                                    {liveInType === "full-time" ? "Full-Time (Weekly)" : "Part-Time (Daily)"}
                                </Label>
                                <p className="text-sm font-medium text-slate-500">
                                    {liveInType === "full-time" ? "£1,200 per week" : "£160 per day"}
                                </p>
                            </div>
                            <Switch
                                checked={liveInType === "part-time"}
                                onCheckedChange={(checked) => setLiveInType(checked ? "part-time" : "full-time")}
                                className="data-[state=checked]:bg-[#1a9e8c]"
                            />
                        </div>
                    )}

                    {/* Sub-Option for Overnight */}
                    {careType === "overnight" && (
                        <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 border border-black/5">
                            <div className="space-y-1">
                                <Label className="text-lg font-bold text-[#111827]">
                                    {overnightType === "sleeping" ? "Sleeping Night" : "Waking Night"}
                                </Label>
                                <p className="text-sm font-medium text-slate-500">
                                    {overnightType === "sleeping" ? "£120 per night (Restful support)" : "£200 per night (Active support)"}
                                </p>
                            </div>
                            <Switch
                                checked={overnightType === "waking"}
                                onCheckedChange={(checked) => setOvernightType(checked ? "waking" : "sleeping")}
                                className="data-[state=checked]:bg-[#1a9e8c]"
                            />
                        </div>
                    )}

                    {/* Duration */}
                    <div className="space-y-3">
                        <Label className="text-sm font-bold uppercase tracking-wider text-slate-500">
                            Duration ({unit.charAt(0).toUpperCase() + unit.slice(1)})
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
                                {unit}
                            </span>
                        </div>
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
