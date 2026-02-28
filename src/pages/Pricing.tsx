import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { ShieldCheck, Zap, Heart } from "lucide-react";
import PricingEstimator from "@/components/pricing/PricingEstimator";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

const Pricing = () => {
    return (
        <div className="min-h-screen bg-white font-sans">
            <Helmet>
                <title>Pricing - Heems | Transparent Care Costs, No Surprises</title>
                <meta name="description" content="Heems offers transparent, fair pricing for private home care. No agency fees, no hidden charges. Pay a simple platform fee and agree rates directly with your carer." />
                <meta property="og:title" content="Pricing - Heems | Transparent Care Costs, No Surprises" />
                <meta property="og:description" content="Heems offers transparent, fair pricing for private home care. No agency fees, no hidden charges." />
                <meta property="og:url" content="https://www.heems.co.uk/pricing" />
            </Helmet>
            <Header />

            <main>
                {/* ─── HERO (Cinematic) ─── */}
                <section className="relative min-h-[75vh] flex items-center pt-32 pb-20 overflow-hidden bg-[#0B1120]">
                    {/* Background Image & Cinematic Overlays */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/pricing_hero.png"
                            alt="Transparent Care Pricing"
                            className="w-full h-full object-cover opacity-30 object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1120] via-[#0B1120]/90 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/20 to-transparent" />
                    </div>

                    {/* Accent orbs */}
                    <div className="absolute top-1/4 right-[10%] w-[400px] h-[400px] rounded-full bg-[#1a9e8c]/15 blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-1/4 left-[5%] w-[300px] h-[300px] rounded-full bg-blue-500/15 blur-[100px] pointer-events-none" />

                    <div className="container mx-auto px-6 lg:px-12 relative z-10 w-full mt-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-4xl"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-widest mb-8 shadow-xl">
                                <ShieldCheck className="w-3.5 h-3.5 text-[#1a9e8c]" />
                                Phase 1: Founder Pricing Active
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[1.05] tracking-tight mb-8">
                                Introductory Agency. <br />
                                <span className="text-[#1a9e8c]">Pure Transparency.</span>
                            </h1>
                            <p className="text-lg lg:text-xl text-white/70 font-medium leading-relaxed max-w-2xl mb-10">
                                Heems replaces expensive agency fees with a simple, transactional service fee.
                                No subscriptions. No paywalls to search. Pay only for care delivered.
                            </p>
                        </motion.div>
                    </div>
                </section>

                <div className="container mx-auto px-6 lg:px-12">
                    {/* Care Cost Estimator */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mb-32 relative z-20 -mt-12" // Pulls estimator up into the hero background slightly
                    >
                        <PricingEstimator />
                    </motion.div>

                    {/* Comparison Section */}
                    <div className="border-t border-black/[0.05] pt-24 pb-32">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className="text-center max-w-2xl mx-auto mb-16"
                        >
                            <h2 className="text-4xl lg:text-5xl font-black text-[#111827] mb-6 tracking-tight">Why Heems makes sense</h2>
                            <p className="text-[#374151] font-medium leading-relaxed text-lg">
                                Transparent pricing. Complete control. No hidden costs.
                                Compare our introductory model to traditional fully-managed care agencies.
                            </p>
                        </motion.div>

                        <div className="max-w-5xl mx-auto bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
                            {/* Table Header */}
                            <div className="grid grid-cols-[1.5fr_1fr_1fr] bg-slate-50 border-b border-black/[0.05] p-6 lg:p-8">
                                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center">Comparison</div>
                                <div className="font-black text-[#111827] text-lg lg:text-xl text-center">Traditional Agency</div>
                                <div className="font-black text-[#1a9e8c] text-lg lg:text-xl text-center flex items-center justify-center gap-2">
                                    <ShieldCheck className="w-5 h-5" /> Heems
                                </div>
                            </div>

                            {/* Table Body (Staggered) */}
                            <div className="divide-y divide-black/[0.05]">
                                {[
                                    { feature: "Hourly Cost", trad: "High (£25 - £40+/hr)", heems: "Carer's Rate + 10% Fee", heemsHighlight: true },
                                    { feature: "Transparency", trad: "Hidden markups up to 50%", heems: "100% Transparent breakdown", heemsHighlight: true },
                                    { feature: "Choice of Carer", trad: "Assigned by the agency", heems: "You browse, interview & choose", heemsHighlight: false },
                                    { feature: "Commitment", trad: "Long-term rigid contracts", heems: "Flexible, cancel anytime", heemsHighlight: false },
                                    { feature: "Carer Compensation", trad: "Often minimum wage", heems: "Carers set & keep their own rates", heemsHighlight: true }
                                ].map((row, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                        className="grid grid-cols-[1.5fr_1fr_1fr] group hover:bg-slate-50/50 transition-colors"
                                    >
                                        <div className="p-6 lg:p-8 flex items-center">
                                            <span className="font-bold text-[#111827]">{row.feature}</span>
                                        </div>
                                        <div className="p-6 lg:p-8 flex items-center justify-center text-center border-l border-r border-black/[0.03] bg-slate-50/30">
                                            <span className="font-medium text-slate-500">{row.trad}</span>
                                        </div>
                                        <div className={`p-6 lg:p-8 flex items-center justify-center text-center transition-colors ${row.heemsHighlight ? "bg-[#1a9e8c]/5 group-hover:bg-[#1a9e8c]/10" : ""}`}>
                                            <span className={`font-bold ${row.heemsHighlight ? "text-[#1a9e8c]" : "text-[#111827]"}`}>
                                                {row.heems}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Phase 2 / Transactional Notes */}
                        <div className="max-w-5xl mx-auto mt-16 grid sm:grid-cols-2 gap-8">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6 }}
                                className="group flex gap-5 items-start bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_60px_rgba(26,158,140,0.1)] hover:-translate-y-2 transition-all duration-500 cursor-pointer"
                            >
                                <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center shrink-0 border border-rose-100 group-hover:bg-rose-500 group-hover:border-rose-500 transition-colors duration-500">
                                    <Heart className="w-6 h-6 text-rose-500 group-hover:text-white transition-colors duration-500" />
                                </div>
                                <div>
                                    <p className="text-base font-black text-[#111827] mb-2 tracking-tight group-hover:text-[#1a9e8c] transition-colors">Fairer for Carers</p>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">Carers are charged 0% during Phase 1 Founder Pricing. They keep what they earn in full.</p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: 0.15 }}
                                className="group flex gap-5 items-start bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_60px_rgba(26,158,140,0.1)] hover:-translate-y-2 transition-all duration-500 cursor-pointer"
                            >
                                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100 group-hover:bg-amber-400 group-hover:border-amber-400 transition-colors duration-500">
                                    <Zap className="w-6 h-6 text-amber-500 group-hover:text-white transition-colors duration-500" />
                                </div>
                                <div>
                                    <p className="text-base font-black text-[#111827] mb-2 tracking-tight group-hover:text-[#1a9e8c] transition-colors">No Subscriptions</p>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">We don't charge you securely to message carers. You only pay when care is successfully delivered.</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>
            <div className="container mx-auto px-6 lg:px-12 pb-12">
                <p className="text-xs text-[#4B5563] font-medium opacity-50 italic text-center">
                    Heems acts as an introductory agency. Carers are independent professionals and not employees of Heems.
                </p>
            </div>
            <Footer />
        </div>
    );
};

export default Pricing;
