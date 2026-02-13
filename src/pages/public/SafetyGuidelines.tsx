import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, CheckCircle2, Heart, HeartPulse, UserCheck, ShieldAlert, ShieldCheck } from "lucide-react";
import { ChatWidget } from "@/components/shared/ChatWidget";

const SafetyGuidelines = () => {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="pt-24">
                {/* Hero Section */}
                <section className="py-32 bg-[#111827] relative overflow-hidden">
                    {/* Abstract Background */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#1a9e8c]/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

                    <div className="container mx-auto px-6 relative z-10 text-center">
                        <div className="max-w-4xl mx-auto">
                            <Badge className="mb-8 bg-rose-500/10 text-rose-500 border-rose-500/20 py-1.5 px-4 text-sm font-black uppercase tracking-widest backdrop-blur-sm">Safety First</Badge>
                            <h1 className="text-6xl lg:text-7xl font-black text-white mb-8 leading-tight tracking-tight">
                                Your safety is our <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-rose-300">non-negotiable</span>.
                            </h1>
                            <p className="text-xl lg:text-2xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
                                We've established the most rigorous safety protocols in the care industry. This guide outlines our standards and how you can ensure a safe care environment.
                            </p>
                        </div>
                    </div>
                </section>

                {/* The Heems Triple-Verification */}
                <section className="py-32">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-24">
                            <h2 className="text-4xl font-black text-[#111827] mb-6 underline decoration-rose-600/20 decoration-8 underline-offset-8">Triple-Verification System</h2>
                            <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">Every carer on our platform passes through three distinct layers of care and residential vetting.</p>
                        </div>
                        <div className="grid lg:grid-cols-3 gap-12">
                            {[
                                {
                                    icon: UserCheck,
                                    title: "Identity & Legal",
                                    desc: "Real-time government ID verification, global sanctions screen, and right-to-work validation."
                                },
                                {
                                    icon: ShieldCheck,
                                    title: "Professional Background",
                                    desc: "Enhanced DBS checks, professional registration codes (NMC/HCPC), and credential validation."
                                },
                                {
                                    icon: HeartPulse,
                                    title: "Reference Analysis",
                                    desc: "Manual verification of at least two professional references with a focus on care performance."
                                }
                            ].map((pillar, i) => (
                                <div key={i} className="text-center space-y-6">
                                    <div className="h-24 w-24 rounded-[2rem] bg-slate-50 border border-black/5 flex items-center justify-center mx-auto shadow-2xl shadow-black/5">
                                        <pillar.icon className="h-10 w-10 text-rose-600" />
                                    </div>
                                    <h3 className="text-2xl font-black text-[#111827]">{pillar.title}</h3>
                                    <p className="text-slate-600 font-medium leading-relaxed">{pillar.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Red Flags / Alert Section */}
                <section className="py-32 bg-[#111827] text-white">
                    <div className="container mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-24 items-center">
                            <div>
                                <div className="flex items-center gap-4 mb-8">
                                    <AlertTriangle className="h-10 w-10 text-rose-500" />
                                    <h2 className="text-4xl font-black">Safety Red Flags</h2>
                                </div>
                                <p className="text-white/60 text-lg font-medium mb-12">
                                    Contact Heems support immediately if you notice any of the following behavior from any participant in the care circle.
                                </p>
                                <Button className="mb-12 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl px-8 py-6 text-lg shadow-lg shadow-rose-600/20">
                                    Report a Concern
                                </Button>

                                <div className="space-y-4">
                                    {[
                                        "Requests for off-platform payment",
                                        "Pressure to bypass documentation",
                                        "Unprofessional or aggressive communication",
                                        "Inconsistency between profile and identity",
                                        "Sharing of sensitive platform login details"
                                    ].map((text, i) => (
                                        <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
                                            <div className="h-2 w-2 rounded-full bg-rose-500" />
                                            <span className="text-sm font-bold uppercase tracking-widest text-white/80">{text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative">
                                <Card className="bg-white rounded-[3rem] p-12 lg:p-16 border-none shadow-3xl text-[#111827]">
                                    <h3 className="text-3xl font-black mb-8 leading-tight">Your safety and comfort matter.</h3>
                                    <p className="text-slate-600 text-lg font-medium mb-10 leading-relaxed">
                                        If you ever feel unsafe or uncomfortable, you can report concerns immediately through your dashboard. We review all platform-related issues promptly and may take appropriate action in line with our policies.
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-[#1a9e8c]/10 flex items-center justify-center font-black text-[#1a9e8c]">HM</div>
                                        <div>
                                            <p className="font-black text-[#111827]">Heems Management</p>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Reporting Infrastructure */}
                <section className="py-32">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-4xl font-black text-[#111827] mb-16">Platform safety features</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { icon: ShieldAlert, title: "Panic Button", info: "One-tap emergency alert in-app" },
                                { icon: UserCheck, title: "Face Match", info: "Biometric check before every session" },
                                { icon: CheckCircle2, title: "NFC Check-in", info: "Verified arrival and departure" },
                                { icon: Shield, title: "Incident Log", info: "Immutable record of all care events" }
                            ].map((item, i) => (
                                <Card key={i} className="border-black/5 rounded-3xl p-8 hover:shadow-2xl hover:shadow-black/5 transition-all cursor-default">
                                    <CardContent className="p-0 flex flex-col items-center">
                                        <div className="h-14 w-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mb-6">
                                            <item.icon className="h-7 w-7 text-rose-600" />
                                        </div>
                                        <h4 className="text-xl font-black text-[#111827] mb-2">{item.title}</h4>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.info}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <ChatWidget />
            <Footer />
        </div>
    );
};

export default SafetyGuidelines;
