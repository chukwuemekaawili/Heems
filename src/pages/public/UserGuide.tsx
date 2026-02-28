import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Play, Book, Lightbulb, CheckCircle2, ChevronRight, ChevronDown } from "lucide-react";
import { ChatWidget } from "@/components/shared/ChatWidget";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

const UserGuide = () => {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-[#1a9e8c]/30">
            <Helmet>
                <title>User Guide - Heems | How to Get Started with Private Care</title>
                <meta name="description" content="Everything you need to know about using Heems. Learn how to set up your account, find the right carer, and manage bookings from our step-by-step guide." />
                <meta property="og:title" content="User Guide - Heems | How to Get Started with Private Care" />
                <meta property="og:url" content="https://www.heems.co.uk/user-guide" />
            </Helmet>
            <Header />

            <main className="pt-24">
                {/* ─── HERO (Cinematic) ─── */}
                <section className="relative min-h-[75vh] flex items-center pt-32 pb-20 overflow-hidden bg-[#0B1120]">
                    {/* Background Image & Cinematic Overlays */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/user_guide_hero.png" /* Fallback handled by CSS gradient if missing */
                            alt="Heems User Guide"
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
                                    <Book className="w-3.5 h-3.5 text-[#1a9e8c]" />
                                    Mastering Heems
                                </div>
                                <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-6 leading-[1.05] tracking-tight">
                                    Everything you need to <br className="hidden md:block" />
                                    <span className="text-[#1a9e8c]">get started.</span>
                                </h1>
                                <p className="text-lg lg:text-xl text-white/70 font-medium leading-relaxed max-w-2xl mb-10">
                                    From setting up your first booking to managing ongoing arrangements, our guide explains how to use the platform step by step.
                                </p>
                            </motion.div>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer opacity-60 hover:opacity-100 transition-opacity z-20"
                        onClick={() => { document.getElementById('getting-started')?.scrollIntoView({ behavior: 'smooth' }) }}
                    >
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Scroll to Guide</span>
                        <ChevronDown className="w-5 h-5 text-white/50 animate-bounce" />
                    </motion.div>
                </section>

                {/* Getting Started Grid */}
                <section id="getting-started" className="py-24 lg:py-40 border-b border-black/[0.03]">
                    <div className="container mx-auto px-6 lg:px-12">
                        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                            {[{
                                title: "Setting up your account",
                                steps: ["Verify your email", "Complete your profile", "Add payment method"],
                                icon: Book,
                                action: "GET STARTED",
                                link: "/signup"
                            },
                            {
                                title: "Finding the right carer",
                                steps: ["Use precise filters", "Review profile & docs", "Initial message"],
                                icon: Search,
                                action: "FIND CARERS",
                                link: "/marketplace"
                            },
                            {
                                title: "Managing Bookings",
                                steps: ["Calendar sync", "Review submissions", "Emergency contacts"],
                                icon: CheckCircle2,
                                action: "GO TO DASHBOARD",
                                link: "/client/bookings"
                            }
                            ].map((card, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: i * 0.15 }}
                                    key={i}
                                >
                                    <Card className="group h-full border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-[#1a9e8c]/30 hover:shadow-[0_20px_60px_rgba(26,158,140,0.1)] hover:-translate-y-2 transition-all duration-500 rounded-[2.5rem] p-8 lg:p-10 flex flex-col">
                                        <CardContent className="p-0 flex flex-col h-full">
                                            <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-8 group-hover:bg-[#1a9e8c] transition-colors duration-500">
                                                <card.icon className="h-7 w-7 text-slate-400 group-hover:text-white transition-colors duration-500" />
                                            </div>
                                            <h3 className="text-2xl font-black text-[#111827] mb-6 tracking-tight group-hover:text-[#1a9e8c] transition-colors">{card.title}</h3>
                                            <ul className="space-y-4 mb-10 flex-grow">
                                                {card.steps.map((step, si) => (
                                                    <li key={si} className="flex items-center gap-3 text-sm font-bold text-slate-500 uppercase tracking-widest">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-[#1a9e8c]" />
                                                        {step}
                                                    </li>
                                                ))}
                                            </ul>
                                            <Button variant="link" className="p-0 h-auto text-[#1a9e8c] font-black group-hover:translate-x-2 transition-transform text-sm tracking-widest uppercase justify-start mt-auto" asChild>
                                                <Link to={card.link}>
                                                    {card.action} <ChevronRight className="w-4 h-4 ml-1" />
                                                </Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Video Guide Placeholder Section */}
                <section className="py-24 lg:py-40 bg-[#0B1120] text-white relative overflow-hidden group">
                    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    <div className="container mx-auto px-6 lg:px-12 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8 }}
                            >
                                <h2 className="text-4xl lg:text-6xl font-black mb-8 leading-[1.05] tracking-tight">Watch: A Day in the Life with Heems</h2>
                                <p className="text-slate-400 text-xl font-medium mb-12 leading-relaxed max-w-xl">
                                    Discover how Heems brings clarity, structure, and calm to arranging care — supporting both families and independent carers every step of the way.
                                    <br /><br />
                                    "We take care of the coordination, so you can focus on what truly matters: delivering and receiving care with confidence."
                                </p>
                                <div className="space-y-6">
                                    <div className="flex gap-6 p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md hover:border-white/20 transition-colors">
                                        <div className="h-14 w-14 rounded-2xl bg-[#1a9e8c] flex items-center justify-center shrink-0 shadow-[0_10px_20px_rgba(26,158,140,0.3)]">
                                            <Lightbulb className="h-7 w-7 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black mb-2 tracking-tight">Pro Tip</h4>
                                            <p className="text-base text-slate-400 font-medium leading-relaxed">Enable platform notifications to receive real-time updates on care session completions.</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8 }}
                                className="relative"
                            >
                                <div className="aspect-video bg-white/5 rounded-[3rem] border border-white/10 flex flex-col items-center justify-center overflow-hidden relative shadow-[0_20px_80px_rgba(0,0,0,0.2)] hover:border-white/20 transition-all duration-500 group-hover:shadow-[0_20px_80px_rgba(26,158,140,0.15)]">
                                    <div className="relative z-10 text-center flex flex-col items-center">
                                        <div className="h-24 w-24 rounded-full bg-white/10 flex items-center justify-center mb-8 backdrop-blur-md border border-white/10 cursor-not-allowed hover:bg-white/20 hover:scale-105 transition-all duration-300">
                                            <Play className="h-10 w-10 text-white ml-2 opacity-80" />
                                        </div>
                                        <h3 className="text-3xl font-black text-white mb-3 tracking-tight">Video Guide Coming Soon</h3>
                                        <p className="text-slate-400 font-medium text-lg">We're filming a comprehensive walkthrough.</p>
                                    </div>
                                    {/* Abstract decorative background */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-[#1a9e8c]/20 via-transparent to-emerald-500/10 opacity-60" />
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#1a9e8c]/20 rounded-full blur-[80px]" />
                                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* FAQ Style guide */}
                <section className="py-24 lg:py-40 bg-slate-50 border-t border-black/[0.03]" id="faq-section">
                    <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8 }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl lg:text-5xl font-black text-[#111827] mb-4 tracking-tight">Common Scenarios</h2>
                            <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">Quick answers to frequently asked questions about managing care on Heems.</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="max-w-3xl mx-auto"
                        >
                            <Accordion type="single" collapsible className="w-full space-y-4">
                                {[
                                    { q: "How do I update support details during a booking?", a: "Clients can update booking notes and preferences through their dashboard at any time. Carers will be notified of any updates via the platform. Any changes to agreed support should be discussed directly between the client and carer." },
                                    { q: "What happens if a carer needs to cancel?", a: "If a carer cancels a confirmed booking, the client will be notified immediately. Clients may then search for and book another available carer through the platform." },
                                    { q: "Manage support for more than one person?", a: "A primary account holder can create and manage multiple member profiles, each with separate booking details and preferences." }
                                ].map((faq, i) => (
                                    <AccordionItem key={i} value={`item-${i}`} className="border border-slate-100 rounded-[2rem] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-[#1a9e8c]/30 hover:shadow-[0_15px_40px_rgba(26,158,140,0.08)] transition-all overflow-hidden px-8 py-4">
                                        <AccordionTrigger className="text-xl lg:text-2xl font-black text-[#111827] hover:text-[#1a9e8c] text-left hover:no-underline tracking-tight">
                                            {faq.q}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-lg text-slate-500 font-medium leading-relaxed pb-4 pt-2">
                                            {faq.a}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </motion.div>
                    </div>
                </section>
            </main>

            <ChatWidget />
            <Footer />
        </div >
    );
};

export default UserGuide;
