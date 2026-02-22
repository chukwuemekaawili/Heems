import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { ShieldCheck, Zap, Heart } from "lucide-react";
import PricingEstimator from "@/components/pricing/PricingEstimator";

const Pricing = () => {
    return (
        <div className="min-h-screen bg-white font-sans">
            <Header />
            <main className="pt-32 lg:pt-48 pb-24 lg:pb-40">
                <div className="container mx-auto px-6 lg:px-12">
                    {/* Header */}
                    <div className="max-w-4xl mb-24 lg:mb-32">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a9e8c]/5 border border-[#1a9e8c]/10 text-[#1a9e8c] text-[10px] font-black uppercase tracking-widest mb-8">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Phase 1: Founder Pricing Active
                        </div>
                        <h1 className="text-5xl lg:text-8xl font-black text-[#111827] leading-[0.9] tracking-tighter mb-10">
                            Introductory Agency. <br />
                            <span className="text-[#1a9e8c]">Pure Transparency.</span>
                        </h1>
                        <p className="text-xl text-[#374151] font-medium leading-relaxed max-w-2xl">
                            Heems replaces expensive agency fees with a simple, transactional service fee.
                            No subscriptions. No paywalls to search. Pay only for care delivered.
                        </p>
                    </div>

                    {/* Care Cost Estimator */}
                    <div className="mb-32">
                        <PricingEstimator />
                    </div>

                    {/* Comparison Section */}
                    <div className="border-t border-black/[0.05] pt-24">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <h2 className="text-4xl lg:text-5xl font-black text-[#111827] mb-6 tracking-tight">Why Heems makes sense</h2>
                            <p className="text-[#374151] font-medium leading-relaxed text-lg">
                                Transparent pricing. Complete control. No hidden costs.
                                Compare our introductory model to traditional fully-managed care agencies.
                            </p>
                        </div>

                        <div className="max-w-5xl mx-auto bg-white rounded-[3rem] border border-black/[0.05] overflow-hidden shadow-2xl">
                            {/* Table Header */}
                            <div className="grid grid-cols-[1.5fr_1fr_1fr] bg-slate-50 border-b border-black/[0.05] p-6 lg:p-8">
                                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center">Comparison</div>
                                <div className="font-black text-[#111827] text-lg lg:text-xl text-center">Traditional Agency</div>
                                <div className="font-black text-[#1a9e8c] text-lg lg:text-xl text-center flex items-center justify-center gap-2">
                                    <ShieldCheck className="w-5 h-5" /> Heems
                                </div>
                            </div>

                            {/* Table Body */}
                            <div className="divide-y divide-black/[0.05]">
                                {[
                                    {
                                        feature: "Hourly Cost",
                                        trad: "High (£25 - £40+/hr)",
                                        heems: "Carer's Rate + 10% Fee",
                                        heemsHighlight: true
                                    },
                                    {
                                        feature: "Transparency",
                                        trad: "Hidden markups up to 50%",
                                        heems: "100% Transparent breakdown",
                                        heemsHighlight: true
                                    },
                                    {
                                        feature: "Choice of Carer",
                                        trad: "Assigned by the agency",
                                        heems: "You browse, interview & choose",
                                        heemsHighlight: false
                                    },
                                    {
                                        feature: "Commitment",
                                        trad: "Long-term rigid contracts",
                                        heems: "Flexible, cancel anytime",
                                        heemsHighlight: false
                                    },
                                    {
                                        feature: "Carer Compensation",
                                        trad: "Often minimum wage",
                                        heems: "Carers set & keep their own rates",
                                        heemsHighlight: true
                                    }
                                ].map((row, i) => (
                                    <div key={i} className="grid grid-cols-[1.5fr_1fr_1fr] group hover:bg-slate-50/50 transition-colors">
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
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Phase 2 / Transactional Notes */}
                        <div className="max-w-5xl mx-auto mt-12 grid sm:grid-cols-2 gap-6">
                            <div className="flex gap-4 items-center bg-slate-50 rounded-2xl p-6 border border-black/[0.03]">
                                <Heart className="w-8 h-8 text-[#1a9e8c] shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-[#111827]">Fairer for Carers</p>
                                    <p className="text-xs text-slate-500 font-medium mt-1">Carers are charged 0% during Phase 1 Founder Pricing. They keep what they earn.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center bg-slate-50 rounded-2xl p-6 border border-black/[0.03]">
                                <Zap className="w-8 h-8 text-amber-500 shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-[#111827]">No Ongoing Subscriptions</p>
                                    <p className="text-xs text-slate-500 font-medium mt-1">We don't charge you securely to message carers. You only pay when care is delivered.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <div className="container mx-auto px-6 lg:px-12 pb-12">
                <p className="text-xs text-[#4B5563] font-medium opacity-50 italic">
                    Heems acts as an introductory agency. Carers are independent professionals and not employees of Heems.
                </p>
            </div>
            <Footer />
        </div>
    );
};

export default Pricing;
