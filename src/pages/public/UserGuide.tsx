import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Play, Book, Lightbulb, CheckCircle2, ChevronRight } from "lucide-react";
import { ChatWidget } from "@/components/shared/ChatWidget";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const UserGuide = () => {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="pt-24">
                {/* Hero Section */}
                <section className="py-24 bg-slate-50 relative overflow-hidden">
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="max-w-4xl">
                            <Badge className="mb-6 bg-[#1a9e8c]/10 text-[#1a9e8c] border-[#1a9e8c]/20 py-1 px-4 text-xs font-black uppercase tracking-widest">Mastering Heems</Badge>
                            <h1 className="text-6xl font-black text-[#111827] mb-8 leading-tight">Everything you need to <span className="text-[#1a9e8c]">get started</span>.</h1>
                            <p className="text-xl text-slate-600 font-medium leading-relaxed">
                                From setting up your first booking to managing ongoing arrangements, our guide explains how to use the platform step by step.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Getting Started Grid */}
                <section className="py-32">
                    <div className="container mx-auto px-6">
                        <div className="grid lg:grid-cols-3 gap-12">
                            {[
                                {
                                    title: "Setting up your account",
                                    steps: ["Verify your email", "Complete your profile", "Add payment method"],
                                    icon: Book
                                },
                                {
                                    title: "Finding the right carer",
                                    steps: ["Use precise filters", "Review profile & docs", "Initial message"],
                                    icon: Search
                                },
                                {
                                    title: "Managing Bookings",
                                    steps: ["Calendar sync", "Review submissions", "Emergency contacts"],
                                    icon: CheckCircle2
                                }
                            ].map((card, i) => (
                                <Card key={i} className="group border-black/5 hover:border-[#1a9e8c]/30 hover:shadow-2xl hover:shadow-black/5 transition-all duration-300 rounded-[2.5rem] p-8">
                                    <CardContent className="p-0">
                                        <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-black/5 flex items-center justify-center mb-8 group-hover:bg-[#1a9e8c] group-hover:text-white transition-colors">
                                            <card.icon className="h-7 w-7" />
                                        </div>
                                        <h3 className="text-2xl font-black text-[#111827] mb-6">{card.title}</h3>
                                        <ul className="space-y-4 mb-8">
                                            {card.steps.map((step, si) => (
                                                <li key={si} className="flex items-center gap-3 text-sm font-bold text-slate-500 uppercase tracking-widest">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-[#1a9e8c]" />
                                                    {step}
                                                </li>
                                            ))}
                                        </ul>
                                        <Button variant="link" className="p-0 text-[#1a9e8c] font-bold group-hover:translate-x-2 transition-transform" asChild>
                                            <Link to={i === 0 ? "/signup" : i === 1 ? "/marketplace" : "/client/bookings"}>
                                                {i === 0 ? "GET STARTED" : i === 1 ? "FIND CARERS" : "GO TO DASHBOARD"} <ChevronRight className="w-4 h-4 ml-1" />
                                            </Link>
                                        </Button>

                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Video Guide Placeholder Section */}
                <section className="py-32 bg-[#111827] text-white">
                    <div className="container mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-24 items-center">
                            <div>
                                <h2 className="text-4xl font-black mb-8 leading-tight">Watch: A Day in the Life with Heems</h2>
                                <p className="text-white/60 text-lg font-medium mb-10 leading-relaxed">
                                    Discover how Heems brings clarity, structure, and calm to arranging care — supporting both families and independent carers every step of the way.
                                    <br /><br />
                                    "We take care of the coordination, so you can focus on what truly matters: delivering and receiving care with confidence."
                                </p>
                                <div className="space-y-6">
                                    <div className="flex gap-6 p-6 rounded-3xl bg-white/5 border border-white/10">
                                        <div className="h-12 w-12 rounded-2xl bg-[#1a9e8c] flex items-center justify-center shrink-0">
                                            <Lightbulb className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold mb-1">Pro Tip</h4>
                                            <p className="text-sm text-white/40">Enable platform notifications to receive real-time updates on care session completions.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative group cursor-default">
                                <div className="aspect-video bg-white/5 rounded-[3rem] border border-white/10 flex items-center justify-center overflow-hidden">
                                    <div className="text-center">
                                        <div className="h-20 w-20 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-6 backdrop-blur-sm">
                                            <Play className="h-8 w-8 text-white/50 ml-1" />
                                        </div>
                                        <h3 className="text-2xl font-black text-white mb-2">Video Guide Coming Soon</h3>
                                        <p className="text-white/50 font-medium">We're filming a comprehensive walkthrough.</p>
                                    </div>
                                    {/* Abstract decorative background */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-[#1a9e8c]/20 via-transparent to-rose-500/20 opacity-50" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Style guide */}
                <section className="py-32" id="faq-section">
                    <div className="container mx-auto px-6 max-w-4xl">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-black text-[#111827] mb-4">Common Scenarios</h2>
                        </div>
                        <div className="max-w-3xl mx-auto">
                            <Accordion type="single" collapsible className="w-full">
                                {[
                                    { q: "How do I update support details during a booking?", a: "Clients can update booking notes and preferences through their dashboard at any time. Carers will be notified of any updates via the platform. Any changes to agreed support should be discussed directly between the client and carer." },
                                    { q: "What happens if a carer needs to cancel?", a: "If a carer cancels a confirmed booking, the client will be notified immediately. Clients may then search for and book another available carer through the platform." },
                                    { q: "Manage support for more than one person?", a: "A primary account holder can create and manage multiple member profiles, each with separate booking details and preferences." }
                                ].map((faq, i) => (
                                    <AccordionItem key={i} value={`item-${i}`} className="border-b border-black/10 last:border-0 px-6 py-2">
                                        <AccordionTrigger className="text-xl font-bold text-[#111827] hover:text-[#1a9e8c] text-left">
                                            {faq.q}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-lg text-slate-600 font-medium leading-relaxed">
                                            {faq.a}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div >
    );
};

export default UserGuide;
