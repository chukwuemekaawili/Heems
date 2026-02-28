import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, MapPin, Clock, ArrowRight, Zap, Globe, Heart, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { ChatWidget } from "@/components/shared/ChatWidget";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

const jobs = [
    {
        title: "Senior Full Stack Engineer",
        department: "Engineering",
        location: "London / Remote",
        type: "Full-time",
        seniority: "Senior"
    },
    {
        title: "Product Designer (UX/UI)",
        department: "Product",
        location: "London",
        type: "Full-time",
        seniority: "Mid-Senior"
    },
    {
        title: "Head of Care Operations",
        department: "Operations",
        location: "London",
        type: "Full-time",
        seniority: "Lead"
    },
    {
        title: "Customer Success Manager",
        department: "Experience",
        location: "Remote",
        type: "Full-time",
        seniority: "Junior-Mid"
    }
];

const Careers = () => {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-[#1a9e8c]/30">
            <Helmet>
                <title>Careers at Heems - Join Us and Redefine Care</title>
                <meta name="description" content="Join the Heems team and help us transform private care in the UK. We're hiring driven, empathetic individuals to build the future of care." />
                <meta property="og:title" content="Careers at Heems - Join Us and Redefine Care" />
                <meta property="og:url" content="https://www.heems.co.uk/careers" />
            </Helmet>
            <Header />

            <main className="pt-24">
                {/* ─── HERO (Cinematic) ─── */}
                <section className="relative min-h-[75vh] flex items-center pt-32 pb-20 overflow-hidden bg-[#0B1120]">
                    {/* Background Image & Cinematic Overlays */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/careers_hero.png" /* Fallback handled by CSS gradient if missing */
                            alt="Careers at Heems"
                            className="w-full h-full object-cover opacity-30 object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1120] via-[#0B1120]/90 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent" />
                    </div>

                    {/* Accent orbs */}
                    <div className="absolute top-1/4 right-[10%] w-[400px] h-[400px] rounded-full bg-[#1a9e8c]/15 blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-1/4 left-[5%] w-[300px] h-[300px] rounded-full bg-blue-500/15 blur-[100px] pointer-events-none" />

                    <div className="container mx-auto px-6 lg:px-12 relative z-10 w-full mt-10">
                        <div className="max-w-4xl">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest mb-8 shadow-xl">
                                    <Zap className="w-3.5 h-3.5 text-[#1a9e8c]" />
                                    Join the Revolution
                                </div>
                                <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-6 leading-[1.05] tracking-tight">
                                    Help us build the <br className="hidden md:block" />
                                    <span className="text-[#1a9e8c]">infrastructure of care.</span>
                                </h1>
                                <p className="text-lg lg:text-xl text-white/70 font-medium leading-relaxed max-w-2xl mb-10">
                                    We're looking for ambitious, empathetic, and technologically-minded individuals to help us redefine the private care industry from the ground up.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <Button className="h-14 px-10 bg-[#1a9e8c] hover:bg-[#15806c] text-white rounded-[1.25rem] font-bold shadow-[0_8px_20px_rgba(26,158,140,0.2)] hover:shadow-[0_15px_30px_rgba(26,158,140,0.3)] hover:-translate-y-0.5 transition-all duration-300 text-base" onClick={() => { document.getElementById('open-roles')?.scrollIntoView({ behavior: 'smooth' }) }}>
                                        View Openings
                                    </Button>
                                    <Button variant="outline" className="h-14 px-10 bg-white/5 border border-white/20 hover:bg-white/10 hover:border-white/30 text-white hover:text-white rounded-[1.25rem] font-bold backdrop-blur-md shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 text-base" asChild>
                                        <Link to="/about">Our Story</Link>
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer opacity-60 hover:opacity-100 transition-opacity z-20"
                        onClick={() => { document.getElementById('why-heems')?.scrollIntoView({ behavior: 'smooth' }) }}
                    >
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Explore Roles</span>
                        <ChevronDown className="w-5 h-5 text-white/50 animate-bounce" />
                    </motion.div>
                </section>

                {/* Why Heems Section */}
                <section id="why-heems" className="py-24 lg:py-40 border-b border-black/[0.03]">
                    <div className="container mx-auto px-6 lg:px-12">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="text-center mb-20 lg:mb-24"
                        >
                            <h2 className="text-4xl lg:text-5xl font-black text-[#111827] mb-6 tracking-tight">Why work at Heems?</h2>
                            <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto">We're building a culture of radical ownership, deep empathy, and rapid iteration.</p>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                            {[
                                {
                                    icon: Zap,
                                    title: "Hyper-Growth Environment",
                                    desc: "We move fast. You'll have the autonomy to make high-impact decisions and see your work change lives every day."
                                },
                                {
                                    icon: Globe,
                                    title: "Remote-First & Global",
                                    desc: "Work from wherever you're most productive. We're building a distributed team of world-class talent."
                                },
                                {
                                    icon: Heart,
                                    title: "Mission-Driven Tech",
                                    desc: "We don't build software for the sake of it. Everything we do serves a vulnerable population and the people who care for them."
                                }
                            ].map((benefit, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: i * 0.15 }}
                                    key={i}
                                    className="bg-white p-10 lg:p-12 rounded-[2.5rem] border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:border-[#1a9e8c]/20 hover:shadow-[0_20px_60px_rgba(26,158,140,0.1)] hover:-translate-y-2 transition-all duration-500 group"
                                >
                                    <div className="h-16 w-16 rounded-2xl bg-[#1a9e8c]/5 border border-[#1a9e8c]/10 flex items-center justify-center mb-8 group-hover:bg-[#1a9e8c] transition-colors duration-500">
                                        <benefit.icon className="h-7 w-7 text-[#1a9e8c] group-hover:text-white transition-colors duration-500" />
                                    </div>
                                    <h3 className="text-2xl font-black text-[#111827] mb-4 tracking-tight">{benefit.title}</h3>
                                    <p className="text-slate-500 font-medium leading-relaxed text-base">{benefit.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Open Roles Section */}
                <section id="open-roles" className="py-24 lg:py-40 bg-slate-50">
                    <div className="container mx-auto px-6 lg:px-12">
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8"
                        >
                            <div>
                                <h2 className="text-4xl lg:text-5xl font-black text-[#111827] mb-4 tracking-tight">Current Openings</h2>
                                <p className="text-slate-500 text-xl font-medium">Join our world-class team across London and beyond.</p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Badge className="bg-[#111827] border-[#111827] text-white px-5 py-2.5 rounded-xl font-bold shadow-sm cursor-pointer hover:bg-[#111827]/90 text-sm">All Departments</Badge>
                                <Badge variant="outline" className="bg-white border-black/10 text-slate-500 px-5 py-2.5 rounded-xl font-bold cursor-pointer hover:bg-slate-100 transition-colors text-sm">Engineering</Badge>
                                <Badge variant="outline" className="bg-white border-black/10 text-slate-500 px-5 py-2.5 rounded-xl font-bold cursor-pointer hover:bg-slate-100 transition-colors text-sm">Product</Badge>
                            </div>
                        </motion.div>

                        <div className="space-y-6">
                            {jobs.map((job, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    key={i}
                                >
                                    <Card className="group bg-white border-slate-100 hover:border-[#1a9e8c]/30 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_60px_rgba(26,158,140,0.1)] hover:-translate-y-1 transition-all duration-500 rounded-[2rem] overflow-hidden cursor-pointer block w-full">
                                        <CardContent className="p-0">
                                            <div className="flex flex-col md:flex-row items-center justify-between p-8 lg:px-10 lg:py-8 gap-6">
                                                <div className="flex items-center gap-6 w-full md:w-auto">
                                                    <div className="h-16 w-16 rounded-[1.25rem] bg-slate-50 border border-black/5 flex items-center justify-center shrink-0 group-hover:bg-[#1a9e8c] transition-colors duration-500">
                                                        <Briefcase className="h-7 w-7 text-slate-400 group-hover:text-white transition-colors duration-500" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl font-black text-[#111827] mb-2 tracking-tight group-hover:text-[#1a9e8c] transition-colors duration-300">{job.title}</h3>
                                                        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {job.location}</span>
                                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200 hidden sm:block" />
                                                            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {job.type}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between md:justify-end items-center gap-6 w-full md:w-auto pt-4 md:pt-0 border-t border-slate-100 md:border-none">
                                                    <Badge variant="outline" className="border-black/5 text-slate-500 bg-slate-50 font-bold px-4 py-2 h-auto rounded-full text-xs uppercase tracking-wider">{job.department}</Badge>
                                                    <div className="h-12 w-12 rounded-full border border-black/5 flex items-center justify-center group-hover:border-[#1a9e8c]/30 group-hover:bg-[#1a9e8c] group-hover:text-white transition-all duration-300 shadow-sm text-slate-400">
                                                        <ArrowRight className="h-5 w-5" />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="mt-20 text-center"
                        >
                            <p className="text-slate-500 font-medium mb-6 text-lg">Don't see a role that fits? We're always looking for exceptional talent.</p>
                            <Button variant="outline" className="h-14 px-10 border-slate-200 text-[#111827] rounded-[1.25rem] font-bold hover:bg-slate-50 hover:border-slate-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-500 text-base">Send General Application</Button>
                        </motion.div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-24 lg:py-40">
                    <div className="container mx-auto px-6 lg:px-12">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="bg-[#0B1120] rounded-[3rem] p-12 lg:p-24 text-white flex flex-col items-center text-center overflow-hidden relative shadow-[0_20px_80px_rgba(0,0,0,0.15)] group"
                        >
                            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                            <div className="relative z-10 max-w-4xl mx-auto">
                                <h2 className="text-5xl lg:text-7xl font-black mb-8 leading-[1.1] tracking-tight">Beyond the paycheck.</h2>
                                <p className="text-slate-400 text-xl font-medium mb-20 leading-relaxed max-w-2xl mx-auto">We provide a comprehensive benefits package designed to help our team grow and thrive both personally and professionally.</p>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 sm:gap-8">
                                    <div className="space-y-4">
                                        <p className="text-4xl lg:text-5xl font-black text-[#1a9e8c]">28d</p>
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Paid Holiday</p>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-4xl lg:text-5xl font-black text-[#1a9e8c]">100%</p>
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Remote Friendly</p>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-4xl lg:text-5xl font-black text-[#1a9e8c]">Private</p>
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Healthcare</p>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-4xl lg:text-5xl font-black text-[#1a9e8c]">Equity</p>
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Stock Options</p>
                                    </div>
                                </div>
                            </div>

                            {/* Abstract Shape */}
                            <div className="absolute bottom-0 right-0 h-full w-1/2 bg-gradient-to-l from-[#1a9e8c]/20 to-transparent pointer-events-none transition-transform duration-1000 group-hover:scale-110" />
                        </motion.div>
                    </div>
                </section>
            </main>

            <ChatWidget />
            <Footer />
        </div>
    );
};

export default Careers;
