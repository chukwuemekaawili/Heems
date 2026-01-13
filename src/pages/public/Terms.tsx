import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";
import { FileText, Scale, AlertCircle, CheckCircle2, RefreshCcw } from "lucide-react";
import { ChatWidget } from "@/components/shared/ChatWidget";

const Terms = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            <main className="pt-24 pb-24">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="bg-white rounded-[3rem] shadow-2xl shadow-black/5 border border-black/5 overflow-hidden mt-12">
                        {/* Header Section */}
                        <div className="p-12 lg:p-20 bg-[#111827] text-white">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <Badge className="mb-6 bg-[#1a9e8c] text-white border-none py-1 px-4 text-xs font-black uppercase tracking-widest">Platform Terms</Badge>
                                    <h1 className="text-5xl font-black mb-6 leading-tight">Terms of Service</h1>
                                </div>
                                <div className="h-20 w-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                    <Scale className="h-10 w-10 text-[#1a9e8c]" />
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-8 text-white/40 text-sm font-bold uppercase tracking-widest">
                                <span className="flex items-center gap-2"><FileText className="h-4 w-4" /> Global v3.0</span>
                                <span className="flex items-center gap-2"><RefreshCcw className="h-4 w-4" /> Last Updated: Jan 2026</span>
                            </div>
                        </div>

                        <div className="p-12 lg:p-20">
                            <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed">
                                <section className="mb-16">
                                    <h2 className="text-3xl font-black text-[#111827] mb-8">1. Agreement to Terms</h2>
                                    <p className="mb-6">These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity (\"you\") and Heems Care Ltd (\"we\", \"us\", or \"our\"), concerning your access to and use of the heemscare.com website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.</p>
                                    <div className="p-8 bg-amber-50 border-l-4 border-amber-400 rounded-r-3xl flex gap-6">
                                        <AlertCircle className="h-6 w-6 text-amber-500 shrink-0 mt-1" />
                                        <p className="text-sm font-bold text-amber-900 leading-relaxed">Please read these terms carefully. By accessing the site, you acknowledge that you have read, understood, and agree to be bound by all of these terms of service.</p>
                                    </div>
                                </section>

                                <section className="mb-16">
                                    <h2 className="text-3xl font-black text-[#111827] mb-8">2. Intellectual Property Rights</h2>
                                    <p className="mb-6">Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site and the trademarks, service marks, and logos contained therein are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.</p>
                                </section>

                                <section className="mb-16">
                                    <h2 className="text-3xl font-black text-[#111827] mb-8">3. User Representations</h2>
                                    <p className="mb-6 font-bold text-[#111827]">By using the Site, you represent and warrant that:</p>
                                    <ul className="grid sm:grid-cols-2 gap-4 list-none pl-0">
                                        {[
                                            "You have the legal capacity to comply.",
                                            "You are not a minor in your jurisdiction.",
                                            "You will not use bots or scripts.",
                                            "Your use is legal and authorized.",
                                            "All registration info is true.",
                                            "You will maintain info accuracy."
                                        ].map((text, i) => (
                                            <li key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-black/5">
                                                <CheckCircle2 className="h-5 w-5 text-[#1a9e8c]" />
                                                <span className="text-xs font-bold uppercase tracking-widest text-[#111827]">{text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                                <section className="mb-16">
                                    <h2 className="text-3xl font-black text-[#111827] mb-8">4. Professional Care Fees</h2>
                                    <p className="mb-6">Heems operates as a marketplace. Carers set their own hourly rates. In addition to the carer's rate, Heems charges a platform fee (typically 10-15%) for the use of our vetting, matching, and clinical infrastructure.</p>
                                    <p className="mb-8">All payments are handled securely through our payment partner, Stripe. By using our platform, you also agree to be bound by Stripe's Services Agreement.</p>
                                </section>

                                <section className="mb-16">
                                    <h2 className="text-3xl font-black text-[#111827] mb-8">5. Cancellation Policy</h2>
                                    <p className="mb-6">Cancellations made more than 24 hours before a scheduled session are entitled to a full refund. Cancellations made within 24 hours of the session may be subject to a cancellation fee equivalent to 1 hour of the carer's rate plus platform fees.</p>
                                </section>

                                <section className="pt-12 border-t border-black/5 text-center">
                                    <p className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">Questions about these terms?</p>
                                    <p className="text-xl font-black text-[#1a9e8c]">legal@heems.com</p>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <ChatWidget />
            <Footer />
        </div>
    );
};

export default Terms;
