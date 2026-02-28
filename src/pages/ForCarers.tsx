import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, TrendingUp, Shield, Zap, Heart, PoundSterling, Laptop, Globe, ShieldCheck, BadgeCheck, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ForCarers = () => {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-[#1a9e8c]/30">
            <Header />
            <main>
                {/* ─── HERO (Cinematic Portrait) ─── */}
                <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 overflow-hidden bg-[#0B1120]">
                    {/* Background Image & Cinematic Overlays */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/professional_carers_team.png"
                            alt="Professional Carer"
                            className="w-full h-full object-cover object-top opacity-50 xl:opacity-60 saturate-50"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1120] via-[#0B1120]/90 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B1120]/50 to-[#0B1120]" />
                    </div>

                    <div className="container mx-auto px-6 lg:px-12 relative z-10 w-full">
                        <div className="max-w-3xl">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-xl">
                                    <Shield className="w-3.5 h-3.5 text-[#1a9e8c]" />
                                    Empowering Independence
                                </div>

                                <h1 className="text-5xl lg:text-7xl xl:text-8xl font-black text-white mb-8 tracking-tight leading-[1.05]">
                                    Higher Pay. <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a9e8c] to-emerald-400">Total Control.</span>
                                </h1>

                                <p className="text-xl lg:text-2xl text-slate-300 font-medium leading-relaxed mb-10 max-w-2xl">
                                    Join the UK's elite network of independent carers. Build your own brand, set your own rates, and access high-value families directly.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                    <Button className="h-14 px-10 rounded-[1.25rem] bg-[#1a9e8c] text-white font-black text-base hover:bg-emerald-500 shadow-[0_8px_20px_rgba(26,158,140,0.3)] hover:shadow-[0_15px_30px_rgba(26,158,140,0.4)] hover:-translate-y-1 transition-all duration-500" asChild>
                                        <Link to="/signup/carer">Apply as a Carer</Link>
                                    </Button>
                                    <Button variant="outline" className="h-14 px-10 rounded-[1.25rem] font-bold border-white/20 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 hover:border-white/30 hover:-translate-y-1 transition-all duration-500 text-base" asChild>
                                        <Link to="/login">Sign In</Link>
                                    </Button>
                                </div>

                                {/* Trust Badges */}
                                <div className="flex flex-wrap items-center gap-6 pt-8 border-t border-white/10">
                                    <div className="flex items-center gap-2">
                                        <BadgeCheck className="w-5 h-5 text-[#1a9e8c]" />
                                        <span className="text-sm font-bold text-white tracking-wide">DBS Verified</span>
                                    </div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700 hidden sm:block" />
                                    <div className="flex items-center gap-2">
                                        <PoundSterling className="w-5 h-5 text-[#1a9e8c]" />
                                        <span className="text-sm font-bold text-white tracking-wide">Keep 100% of Rate</span>
                                    </div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700 hidden sm:block" />
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-[#1a9e8c] text-[#1a9e8c]" />)}
                                        <span className="text-sm font-bold text-white tracking-wide ml-2">Top Rated</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Benefits Grid */}
                <section className="bg-slate-50 py-24 lg:py-40 border-y border-black/[0.03] overflow-hidden">
                    <div className="container mx-auto px-6 lg:px-12">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="text-center max-w-2xl mx-auto mb-20 lg:mb-32"
                        >
                            <h2 className="text-4xl lg:text-5xl font-black text-[#111827] mb-6 tracking-tight">Designed for Professionals.</h2>
                            <p className="text-slate-500 font-medium text-xl">We've removed the middleman. You keep what you earn and manage your career like a business leader.</p>
                        </motion.div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { title: "Premium Earnings", icon: PoundSterling, desc: "Set your own rates and keep 100% of your listed price." },
                                { title: "Smart Scheduling", icon: Laptop, desc: "Our intelligent app manages your diary and recurring visits." },
                                { title: "Instant Payments", icon: Zap, desc: "Get paid automatically after every visit. No chasing invoices." },
                                { title: "Top-Tier Support", icon: Heart, desc: "Access guidance and career coaching (Lines Open 9-5)." }
                            ].map((item, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: i * 0.15 }}
                                    key={i}
                                    className="bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:border-[#1a9e8c]/30 hover:shadow-[0_20px_60px_rgba(26,158,140,0.12)] hover:-translate-y-2 shadow-[0_4px_25px_rgba(0,0,0,0.03)] transition-all duration-500 relative overflow-hidden group"
                                >
                                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-700 ease-out z-0" />
                                    <div className="relative z-10">
                                        <div className="w-14 h-14 rounded-2xl bg-[#1a9e8c]/10 flex items-center justify-center mb-8 border border-[#1a9e8c]/20 group-hover:bg-[#1a9e8c] transition-colors duration-500">
                                            <item.icon className="w-6 h-6 text-[#1a9e8c] group-hover:text-white transition-colors duration-500" />
                                        </div>
                                        <h3 className="text-2xl font-black text-[#111827] mb-4 tracking-tight">{item.title}</h3>
                                        <p className="text-base text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Requirements */}
                <section className="container mx-auto px-6 lg:px-12 py-24 lg:py-40 overflow-hidden">
                    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        <motion.div
                            initial={{ opacity: 0, x: -60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="flex-1"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-[#111827] text-[10px] font-black uppercase tracking-widest mb-6">
                                <ShieldCheck className="w-4 h-4 text-[#1a9e8c]" />
                                Rigorous Vetting
                            </div>
                            <h2 className="text-4xl lg:text-6xl font-black text-[#111827] mb-10 tracking-tight">Ready to <br /><span className="text-[#1a9e8c]">transition?</span></h2>
                            <div className="space-y-5 mb-12">
                                {[
                                    "Minimum 6 months care experience",
                                    "Right-to-work in the United Kingdom",
                                    "Enhanced DBS (or willing to obtain)",
                                    "Two professional care references",
                                    "Professional Liability Insurance",
                                    "Commitment to excellence"
                                ].map((req, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#1a9e8c]/20 hover:bg-white transition-colors duration-300">
                                        <div className="w-8 h-8 rounded-full bg-[#1a9e8c]/10 flex items-center justify-center shrink-0">
                                            <CheckCircle2 className="w-4 h-4 text-[#1a9e8c]" />
                                        </div>
                                        <span className="text-base font-bold text-slate-700">{req}</span>
                                    </div>
                                ))}
                            </div>
                            <Button className="h-16 px-12 rounded-[1.25rem] bg-[#111827] text-white font-black hover:bg-[#1a9e8c] hover:text-white shadow-[0_10px_25px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_35px_rgba(26,158,140,0.3)] hover:-translate-y-1 transition-all duration-500 text-lg w-full sm:w-auto" asChild>
                                <Link to="/signup/carer">Start Your Application</Link>
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="flex-1 w-full"
                        >
                            {/* Glassmorphic styled card for Heems Academy */}
                            <div className="bg-slate-50 p-10 lg:p-14 rounded-[3rem] border border-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.04)] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[#1a9e8c]/5 blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#1a9e8c]/10 transition-colors duration-1000" />

                                <div className="relative z-10">
                                    <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center mb-8">
                                        <Globe className="w-8 h-8 text-[#1a9e8c]" />
                                    </div>
                                    <h3 className="text-3xl font-black text-[#111827] tracking-tight mb-4">Heems Academy</h3>
                                    <p className="text-lg text-slate-500 font-medium mb-10 leading-relaxed">
                                        All Heems carers get exclusive access to continuous professional development (CPD) accredited training modules through our digital academy. Upskill and unlock higher earnings.
                                    </p>

                                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-sm font-bold text-[#111827]">Dementia Care Advanced</span>
                                            <span className="text-xs font-black text-[#1a9e8c] bg-[#1a9e8c]/10 px-2.5 py-1 rounded-lg">75%</span>
                                        </div>
                                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#1a9e8c] w-3/4 rounded-full relative overflow-hidden">
                                                <div className="absolute inset-0 bg-white/20 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 delay-300" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default ForCarers;
