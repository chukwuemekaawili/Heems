import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, ShieldCheck, Zap, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
    {
        name: "Families & Individuals",
        price: "10%",
        description: "Direct connection with elite, self-employed carers. Introductory model.",
        features: [
            "Access to top 1% Carer Marketplace",
            "Fixed £15/hr minimum rate",
            "Badge-Only credential verification",
            "Secure Stripe-integrated payments",
            "No monthly subscriptions"
        ],
        cta: "Sign Up for Care",
        href: "/signup/client",
        highlight: false
    },
    {
        name: "Care Organisations",
        price: "10%",
        description: "Specialized infrastructure for Agencies, NHS Trusts, and Care Hubs.",
        features: [
            "Clinical Compliance Vault access",
            "Postcode-radius discovery tools",
            "Volume booking management",
            "No 14-day trials (Transactional)",
            "GDPR & CQC compliant data"
        ],
        cta: "Register Organisation",
        href: "/signup/organisation",
        highlight: true
    },
    {
        name: "Independent Carers",
        price: "0%",
        description: "Work independently. Set your own rates. Keep what you earn.",
        features: [
            "Listed in Elite Marketplace",
            "Set your own rates (£15/hr min)",
            "Verified Referrals system",
            "Automated payment splits",
            "Insurance & DBS validation"
        ],
        cta: "Apply as a Carer",
        href: "/signup/carer",
        highlight: false
    }
];

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
                        <p className="text-xl text-[#4B5563] font-medium leading-relaxed max-w-xl">
                            Heems replaces expensive agency fees with a simple, transactional service fee.
                            No subscriptions. No paywalls to search. Pay only for care delivered.
                        </p>
                    </div>

                    {/* Plans Grid */}
                    <div className="grid lg:grid-cols-3 gap-10">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`flex flex-col p-12 rounded-[3.5rem] border transition-all duration-700 ${plan.highlight
                                    ? "bg-[#111827] border-[#111827] shadow-2xl shadow-black/20 hover:-translate-y-2"
                                    : "bg-white border-black/[0.05] hover:border-[#1a9e8c]/30 hover:shadow-xl hover:-translate-y-1"
                                    }`}
                            >
                                <div className="mb-12">
                                    <h3 className={`text-2xl font-black mb-10 tracking-tight ${plan.highlight ? "text-white" : "text-[#111827]"}`}>
                                        {plan.name}
                                    </h3>
                                    <div className="flex items-baseline gap-2 mb-6">
                                        <span className={`text-6xl font-black ${plan.highlight ? "text-[#1a9e8c]" : "text-[#111827]"}`}>
                                            {plan.price}
                                        </span>
                                        <span className={`text-sm font-black uppercase tracking-widest ${plan.highlight ? "text-slate-400" : "text-slate-400"}`}>
                                            Service Fee
                                        </span>
                                    </div>
                                    <p className={`text-sm font-bold leading-relaxed ${plan.highlight ? "text-slate-400/80" : "text-[#4B5563]"}`}>
                                        {plan.description}
                                    </p>
                                </div>

                                <ul className="space-y-5 mb-12 flex-grow">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-3">
                                            <div className={`mt-0.5 h-6 w-6 rounded-xl flex items-center justify-center shrink-0 ${plan.highlight ? "bg-white/10" : "bg-slate-50"}`}>
                                                <Check className={`h-3.5 w-3.5 ${plan.highlight ? "text-[#1a9e8c]" : "text-[#1a9e8c]"}`} />
                                            </div>
                                            <span className={`text-sm font-bold ${plan.highlight ? "text-white/80" : "text-[#111827]"}`}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    size="lg"
                                    className={`h-16 px-10 rounded-2xl font-black text-sm transition-all ${plan.highlight
                                        ? "bg-[#1a9e8c] text-white hover:bg-[#15806c] shadow-xl shadow-[#1a9e8c]/20"
                                        : "bg-[#111827] text-white hover:bg-[#1a9e8c]"
                                        }`}
                                    asChild
                                >
                                    <Link to={plan.href}>
                                        {plan.cta}
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </Button>
                            </div>
                        ))}
                    </div>

                    {/* Pricing FAQ Section */}
                    <div className="mt-32 pt-24 border-t border-black/[0.05]">
                        <div className="grid lg:grid-cols-2 gap-20">
                            <div>
                                <h2 className="text-4xl font-black text-[#111827] mb-8 tracking-tight">The Transactional Model</h2>
                                <p className="text-[#4B5563] font-medium leading-relaxed mb-8">
                                    Unlike traditional care agencies that charge up to 50% on top of a carer's rate,
                                    Heems operates a high-efficiency introductory model. We charge a flat service fee
                                    to maintain the verification infrastructure, secure messaging, and payment processing.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex gap-4 items-center">
                                        <Zap className="w-6 h-6 text-[#1a9e8c]" />
                                        <p className="text-sm font-bold text-[#111827]">Phase 2 triggers at 30+ verified carers.</p>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <Heart className="w-6 h-6 text-[#1a9e8c]" />
                                        <p className="text-sm font-bold text-[#111827]">95% Caregiver retention rate.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50 rounded-[3rem] p-12 border border-black/[0.03]">
                                <h3 className="text-2xl font-black text-[#111827] mb-6 tracking-tight">Fee Breakdown</h3>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center pb-4 border-b border-black/[0.05]">
                                        <span className="text-sm font-bold text-[#111827]">Service Fee (Client Side)</span>
                                        <span className="text-2xl font-black text-[#1a9e8c]">10%</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b border-black/[0.05]">
                                        <span className="text-sm font-bold text-[#111827]">Support Fee (Carer Side)</span>
                                        <span className="text-2xl font-black text-slate-300">0%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-[#111827]">Minimum Hourly Rate</span>
                                        <span className="text-2xl font-black text-[#111827]">£15.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Pricing;
