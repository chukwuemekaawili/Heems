import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Shield, Lock, Server, Fingerprint, Eye, CheckCircle2, FileCheck, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChatWidget } from "@/components/shared/ChatWidget";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Security = () => {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-[#1a9e8c]/30">
            <Header />

            <main className="pt-24">
                {/* Hero Section */}
                <section className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden border-b border-black/[0.03]">
                    <div className="container mx-auto px-6 lg:px-12 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-4xl"
                        >
                            <Badge className="mb-8 bg-[#1a9e8c]/10 text-[#1a9e8c] border-[#1a9e8c]/20 py-1.5 px-4 text-xs font-black uppercase tracking-[0.2em] shadow-sm">Trust & Reliability</Badge>
                            <h1 className="text-5xl lg:text-7xl xl:text-8xl font-black text-[#111827] mb-8 leading-[1.05] tracking-tight">
                                Bank-grade security for <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a9e8c] to-emerald-400">trusted care.</span>
                            </h1>
                            <p className="text-xl lg:text-2xl text-slate-500 font-medium leading-relaxed max-w-3xl">
                                We protect your most sensitive data with the same intensity we use to vet our carers. Heems is built on a foundation of high-trust infrastructure.
                            </p>
                        </motion.div>
                    </div>
                    {/* Abstract Grid Background */}
                    <div className="absolute inset-0 z-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(#111827 1px, transparent 1px), linear-gradient(90deg, #111827 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                </section>

                {/* Core Pillars */}
                <section className="py-24 lg:py-40">
                    <div className="container mx-auto px-6 lg:px-12">
                        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                            {[
                                {
                                    icon: Lock,
                                    title: "End-to-End Encryption",
                                    desc: "All sensitive health data and communications are encrypted at rest and in transit using AES-256 and TLS 1.3 standards."
                                },
                                {
                                    icon: Server,
                                    title: "Sovereign Cloud Infrastructure",
                                    desc: "Your data stays where it belongs. We use localized, high-security data centers with 99.99% uptime guarantees."
                                },
                                {
                                    icon: Fingerprint,
                                    title: "Secure Account Protection",
                                    desc: "Multi-factor authentication (MFA) and biometric verification ensure that only authorized individuals can access account data."
                                }
                            ].map((pillar, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.5, delay: i * 0.15 }}
                                    key={i}
                                    className="p-10 lg:p-12 rounded-[2.5rem] bg-slate-50 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(26,158,140,0.1)] hover:-translate-y-2 hover:border-[#1a9e8c]/30 transition-all duration-500 group"
                                >
                                    <div className="h-16 w-16 rounded-2xl bg-[#111827] flex items-center justify-center mb-8 group-hover:bg-[#1a9e8c] transition-colors duration-500">
                                        <pillar.icon className="h-8 w-8 text-white group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <h3 className="text-2xl font-black text-[#111827] mb-4 tracking-tight">{pillar.title}</h3>
                                    <p className="text-slate-500 font-medium leading-relaxed text-lg">{pillar.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Vetting Infrastructure */}
                <section className="py-24 lg:py-40 bg-[#0B1120] text-white overflow-hidden relative group">
                    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    <div className="container mx-auto px-6 lg:px-12 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8 }}
                            >
                                <h2 className="text-4xl lg:text-5xl font-black mb-8 leading-[1.05] tracking-tight">Our Verification Infrastructure</h2>
                                <p className="text-slate-400 text-xl font-medium mb-12 leading-relaxed">
                                    We've automated the most rigorous verification standards in the industry to ensure that every participant in the Heems ecosystem is verified and compliant.
                                </p>

                                <div className="space-y-6">
                                    {[
                                        { icon: FileCheck, title: "DBS & Criminal Record Checks", info: "Automated integrations with government databases for real-time verification." },
                                        { icon: Eye, title: "Identity Forgery Detection", info: "AI-driven analysis of government IDs to prevent impersonation and fraud." },
                                        { icon: Globe, title: "Right to Work Verification", info: "Comprehensive checks ensuring all professional carers are legally eligible to work." }
                                    ].map((item, i) => (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.2 + (i * 0.1), duration: 0.5 }}
                                            key={i}
                                            className="flex gap-6 p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                                        >
                                            <div className="h-14 w-14 rounded-2xl bg-[#1a9e8c]/20 border border-[#1a9e8c]/30 flex items-center justify-center shrink-0">
                                                <item.icon className="h-7 w-7 text-[#1a9e8c]" />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold mb-2 tracking-tight">{item.title}</h4>
                                                <p className="text-slate-400 text-sm font-medium leading-relaxed">{item.info}</p>
                                            </div>
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
                                <div className="aspect-[4/5] bg-white/5 rounded-[3rem] border border-white/10 flex flex-col p-10 lg:p-14 overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.3)] backdrop-blur-md relative z-10">
                                    <div className="flex items-center justify-between mb-12">
                                        <Badge className="bg-[#1a9e8c] text-white border-none py-1.5 px-4 font-black tracking-widest text-xs uppercase shadow-[0_0_20px_rgba(26,158,140,0.4)]">Verified Node</Badge>
                                        <Shield className="h-10 w-10 text-white/20" />
                                    </div>
                                    <div className="space-y-6">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} className="h-14 bg-white/5 rounded-2xl border border-white/10 flex items-center px-6 gap-6 relative overflow-hidden group-hover:border-white/20 transition-colors">
                                                <div className="h-2 w-2 rounded-full bg-[#1a9e8c] shadow-[0_0_10px_rgba(26,158,140,0.8)] animate-pulse" />
                                                <div className="h-2 w-1/3 bg-white/20 rounded-full" />

                                                {/* Scanning line effect */}
                                                <div className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-[#1a9e8c]/20 to-transparent -translate-x-full animate-[scan_2s_ease-in-out_infinite]" style={{ animationDelay: `${i * 200}ms` }} />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-auto pt-10 border-t border-white/10 flex items-center justify-between">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1a9e8c]">Compliance Engine v4.0</p>
                                        <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-pulse" />
                                    </div>
                                </div>

                                {/* Floating Badge */}
                                <div className="absolute -top-10 -right-10 lg:-right-16 bg-white p-8 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.2)] text-[#111827] flex items-center gap-6 z-20 animate-float">
                                    <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center">
                                        <CheckCircle2 className="h-7 w-7 text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black tracking-tight">AES-256</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bank-Grade</p>
                                    </div>
                                </div>

                                {/* Abstract decorative background */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#1a9e8c]/20 via-transparent to-emerald-500/10 opacity-60 z-0 rounded-[3rem]" />
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Reporting */}
                <section className="py-24 lg:py-40 bg-slate-50 border-t border-black/[0.03]">
                    <div className="container mx-auto px-6 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8 }}
                            className="max-w-3xl mx-auto"
                        >
                            <h2 className="text-4xl lg:text-5xl font-black text-[#111827] mb-8 tracking-tight">Report a Security Issue</h2>
                            <p className="text-xl text-slate-500 font-medium mb-12 leading-relaxed">We take security reports from the community seriously. If you've identified a vulnerability, please reach out directly to our security team.</p>
                            <Button size="lg" className="h-16 px-12 rounded-[1.25rem] bg-[#111827] text-white font-black text-lg hover:bg-[#1a9e8c] transition-all shadow-[0_10px_25px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_40px_rgba(26,158,140,0.3)] hover:-translate-y-1" asChild>
                                <Link to="/contact">Contact Security Team</Link>
                            </Button>
                        </motion.div>
                    </div>
                </section>
            </main>

            <ChatWidget />
            <Footer />
        </div>
    );
};

export default Security;
