import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, CheckCircle2, Heart, HeartPulse, UserCheck, ShieldAlert, ShieldCheck } from "lucide-react";
import { ChatWidget } from "@/components/shared/ChatWidget";
import { motion } from "framer-motion";

const SafetyGuidelines = () => {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-rose-500/30">
            <Header />

            <main className="pt-24">
                {/* Hero Section */}
                <section className="py-32 bg-[#111827] relative overflow-hidden">
                    {/* Abstract Background */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#1a9e8c]/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

                    <div className="container mx-auto px-6 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-4xl mx-auto"
                        >
                            <Badge className="mb-8 bg-rose-500/10 text-rose-500 border-rose-500/20 py-1.5 px-4 text-sm font-black uppercase tracking-widest backdrop-blur-sm shadow-lg shadow-rose-500/5">Safety First</Badge>
                            <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-8 leading-[1.05] tracking-tight">
                                Your safety is our <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-rose-300">non-negotiable.</span>
                            </h1>
                            <p className="text-xl lg:text-2xl text-slate-400 font-medium leading-relaxed max-w-3xl mx-auto">
                                We've established the most rigorous safety protocols in the care industry. This guide outlines our standards and how you can ensure a safe care environment.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* The Heems Triple-Verification */}
                <section className="py-24 lg:py-40">
                    <div className="container mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="text-center mb-24"
                        >
                            <h2 className="text-4xl lg:text-5xl font-black text-[#111827] mb-6 tracking-tight relative inline-block">
                                Triple-Verification System
                                <div className="absolute -bottom-2 left-0 right-0 h-2 bg-rose-600/10 rounded-full" />
                            </h2>
                            <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto mt-6">Every carer on our platform passes through three distinct layers of care and residential vetting.</p>
                        </motion.div>
                        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
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
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: i * 0.15 }}
                                    key={i}
                                    className="text-center space-y-6 group"
                                >
                                    <div className="h-28 w-28 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto shadow-[0_10px_30px_rgba(0,0,0,0.03)] group-hover:shadow-[0_20px_40px_rgba(225,29,72,0.1)] group-hover:-translate-y-2 group-hover:border-rose-100 transition-all duration-500">
                                        <pillar.icon className="h-12 w-12 text-rose-500 group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <h3 className="text-2xl font-black text-[#111827] tracking-tight">{pillar.title}</h3>
                                    <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-sm mx-auto">{pillar.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Red Flags / Alert Section */}
                <section className="py-24 lg:py-40 bg-[#0B1120] text-white relative overflow-hidden group">
                    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="flex flex-wrap items-center gap-4 mb-8">
                                    <div className="h-16 w-16 rounded-[1.5rem] bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0">
                                        <AlertTriangle className="h-8 w-8 text-rose-500" />
                                    </div>
                                    <h2 className="text-4xl lg:text-5xl font-black tracking-tight">Safety Red Flags</h2>
                                </div>
                                <p className="text-white/60 text-xl font-medium mb-12 leading-relaxed">
                                    Contact Heems support immediately if you notice any of the following behavior from any participant in the care circle.
                                </p>
                                <Button className="mb-14 h-16 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-[1.25rem] px-10 text-lg shadow-[0_10px_30px_rgba(225,29,72,0.3)] hover:shadow-[0_15px_40px_rgba(225,29,72,0.4)] hover:-translate-y-1 transition-all duration-500">
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
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.2 + (i * 0.1), duration: 0.5 }}
                                            key={i}
                                            className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                                        >
                                            <div className="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(225,29,72,0.8)]" />
                                            <span className="text-sm font-bold uppercase tracking-widest text-white/90">{text}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8 }}
                                className="relative"
                            >
                                <Card className="bg-white rounded-[3rem] p-12 lg:p-16 border-none shadow-[0_30px_80px_rgba(0,0,0,0.3)] text-[#111827] relative z-10">
                                    <h3 className="text-3xl lg:text-4xl font-black mb-8 leading-[1.1] tracking-tight">Your safety and comfort matter.</h3>
                                    <p className="text-slate-600 text-xl font-medium mb-12 leading-relaxed">
                                        If you ever feel unsafe or uncomfortable, you can report concerns immediately through your dashboard. We review all platform-related issues promptly and may take appropriate action in line with our policies.
                                    </p>
                                    <div className="flex items-center gap-5 pt-8 border-t border-slate-100">
                                        <div className="h-14 w-14 rounded-full bg-[#111827] flex items-center justify-center font-black text-rose-400 text-lg shadow-lg">HM</div>
                                        <div>
                                            <p className="font-black text-[#111827] text-lg">Heems Management</p>
                                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Trust & Safety Team</p>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Reporting Infrastructure */}
                <section className="py-24 lg:py-40 bg-slate-50 border-t border-black/[0.03]">
                    <div className="container mx-auto px-6 lg:px-12 text-center">
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8 }}
                            className="text-4xl lg:text-5xl font-black text-[#111827] mb-16 tracking-tight"
                        >
                            Platform Safety Features
                        </motion.h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { icon: ShieldAlert, title: "Panic Button", info: "One-tap emergency alert in-app" },
                                { icon: UserCheck, title: "Face Match", info: "Biometric check before every session" },
                                { icon: CheckCircle2, title: "NFC Check-in", info: "Verified arrival and departure" },
                                { icon: Shield, title: "Incident Log", info: "Immutable record of all care events" }
                            ].map((item, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    key={i}
                                >
                                    <Card className="border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-[2.5rem] p-10 hover:shadow-[0_20px_60px_rgba(26,158,140,0.08)] hover:border-[#1a9e8c]/20 hover:-translate-y-2 transition-all duration-500 cursor-default group h-full flex flex-col items-center justify-center">
                                        <CardContent className="p-0 flex flex-col items-center text-center">
                                            <div className="h-16 w-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mb-8 group-hover:bg-rose-500 transition-colors duration-500">
                                                <item.icon className="h-8 w-8 text-rose-500 group-hover:text-white transition-colors duration-500" />
                                            </div>
                                            <h4 className="text-xl font-black text-[#111827] mb-3 tracking-tight">{item.title}</h4>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.15em] leading-relaxed">{item.info}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
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
