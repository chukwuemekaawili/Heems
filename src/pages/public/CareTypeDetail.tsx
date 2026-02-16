
import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { careTypeData } from "@/data/careTypeData";
import { ArrowLeft, CheckCircle2, User, ArrowRight, ShieldCheck } from "lucide-react";

interface CareType {
    title: string;
    icon: any;
    image: string;
    heroImage?: string;
    summary: string;
    content: string;
    benefits: string[];
    whoIsItFor: string[];
    color: string;
    accentColor: string;
    gallery?: string[];
    costRange: string;
    costDescription: string;
}

const CareTypeDetail = () => {
    const { typeId } = useParams();
    const navigate = useNavigate();

    const careType = careTypeData[typeId as keyof typeof careTypeData] as CareType;

    useEffect(() => {
        if (!careType) {
            navigate("/types-of-care");
        }
    }, [careType, navigate]);

    if (!careType) return null;

    // Fallback images if gallery is missing (shouldn't happen with updated data)
    const gallery = careType.gallery || [careType.image, careType.image, careType.image, careType.image];

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="pt-24 lg:pt-0">
                {/* 1. Hero Section (Image 1) */}
                <section className="relative h-[50vh] lg:h-[60vh] flex items-center overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src={careType.heroImage || gallery[0]}
                            alt={careType.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                    </div>

                    <div className="container mx-auto px-6 lg:px-12 relative z-10">
                        <div className="max-w-3xl">
                            <Link to="/types-of-care" className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors font-bold text-sm uppercase tracking-widest">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to All Services
                            </Link>
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm`}>
                                <careType.icon className="w-4 h-4" />
                                {careType.title}
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tighter">
                                {careType.title}
                            </h1>
                            <p className="text-xl lg:text-2xl text-white/80 font-medium leading-relaxed max-w-2xl">
                                {careType.summary}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="py-24">
                    <div className="container mx-auto px-6 lg:px-12">
                        <div className="grid lg:grid-cols-12 gap-16">

                            {/* Left Column: Heavy Content */}
                            <div className="lg:col-span-7 space-y-16">

                                <div>
                                    <h2 className="text-3xl font-black text-[#111827] mb-6">
                                        What is {careType.title}?
                                    </h2>
                                    {/* Removed duplicate intro text - summary already appears in hero */}
                                </div>

                                {/* 2. Image Strip (Image 2 & 3) */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <img
                                        src={gallery[1]}
                                        alt="Care in action"
                                        className="w-full h-64 object-cover rounded-3xl shadow-lg hover:scale-[1.02] transition-transform duration-500"
                                    />
                                    <img
                                        src={gallery[2]}
                                        alt="Patient support"
                                        className="w-full h-64 object-cover rounded-3xl shadow-lg hover:scale-[1.02] transition-transform duration-500 delay-100"
                                    />
                                </div>

                                {/* Detailed Content */}
                                <div>
                                    <h2 className="text-3xl font-black text-[#111827] mb-6">
                                        Why Choose {careType.title}?
                                    </h2>
                                    <div className="prose prose-lg prose-slate text-[#4B5563] font-medium leading-relaxed">
                                        {/* Render remaining paragraphs if any, or general philosophy */}
                                        {careType.content.split('\n\n').slice(1).map((p, i) => (
                                            <p key={i} className="mb-4">{p}</p>
                                        ))}
                                        <p>
                                            At Heems, we verify every carer's background and experience to ensure they meet our high standards for safety and compassion.
                                        </p>
                                    </div>
                                </div>

                                {/* Benefits Grid */}
                                <div>
                                    <h3 className="text-2xl font-black text-[#111827] mb-8">
                                        Key Benefits
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {careType.benefits.map((benefit, i) => (
                                            <div key={i} className="flex gap-4 p-6 rounded-2xl bg-slate-50 border border-black/5 hover:border-[#1a9e8c]/20 transition-colors">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-white shadow-sm ${careType.color}`}>
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </div>
                                                <p className="text-[#111827] font-bold text-sm leading-relaxed pt-2">{benefit}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Who Are the Carers? */}
                                <div>
                                    <h2 className="text-3xl font-black text-[#111827] mb-6">
                                        Who Are the Carers?
                                    </h2>
                                    <p className="text-[#4B5563] font-medium leading-relaxed mb-6">
                                        Our carers are experienced professionals who have valid work rights in the UK. They are compassionate, reliable, and dedicated to providing the highest quality of care.
                                    </p>
                                    <ul className="space-y-3">
                                        {[
                                            "Enhanced DBS Checked",
                                            "Personally Interviewed",
                                            "Reference Verified",
                                            "Skills Assessed"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                                <div className="h-1.5 w-1.5 rounded-full bg-[#1a9e8c]" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* How to Arrange */}
                                <div>
                                    <h2 className="text-3xl font-black text-[#111827] mb-6">
                                        How to Arrange Care
                                    </h2>
                                    <div className="space-y-6">
                                        {[
                                            { title: "Search", desc: "Browse profiles of verified carers in your area." },
                                            { title: "Connect", desc: "Message and interview carers to find the perfect match." },
                                            { title: "Book", desc: "Securely book and pay for care through our platform." }
                                        ].map((step, i) => (
                                            <div key={i} className="flex gap-4">
                                                <div className="w-8 h-8 rounded-full bg-[#1a9e8c]/10 text-[#1a9e8c] flex items-center justify-center font-bold text-sm shrink-0">
                                                    {i + 1}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-[#111827]">{step.title}</h4>
                                                    <p className="text-sm text-slate-500">{step.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Cost Information Section */}
                                <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-[#1a9e8c]/5 to-[#111827]/5 border border-[#1a9e8c]/10">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-[#1a9e8c] flex items-center justify-center shrink-0">
                                            <svg className="w-6 h-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-[#111827] mb-2">
                                                How Much Does it Cost?
                                            </h3>
                                            <p className="text-3xl font-black text-[#1a9e8c] mb-4">
                                                {careType.costRange}
                                            </p>
                                            <p className="text-[#4B5563] font-medium leading-relaxed">
                                                {careType.costDescription}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Full Width Image (Image 4) */}
                                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl h-80 group">
                                    <img
                                        src={gallery[3]}
                                        alt="Quality care"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                    <div className="absolute bottom-8 left-8 text-white max-w-md">
                                        <p className="font-bold text-lg">Trusted by families across the UK.</p>
                                    </div>
                                </div>

                            </div>

                            {/* Right Column: Sticky Sidebar / Who is it for */}
                            <div className="lg:col-span-5">
                                <div className="sticky top-32 space-y-8">
                                    <div className="p-8 lg:p-10 rounded-[2.5rem] bg-[#111827] text-white overflow-hidden relative shadow-2xl">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#1a9e8c]/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

                                        <h3 className="text-xl font-black mb-8 flex items-center gap-2 relative z-10">
                                            <User className="w-5 h-5 text-[#1a9e8c]" />
                                            Who is this suitable for?
                                        </h3>

                                        <ul className="space-y-4 relative z-10 mb-10">
                                            {careType.whoIsItFor.map((item, i) => (
                                                <li key={i} className="flex gap-4">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#1a9e8c] mt-2.5 shrink-0" />
                                                    <span className="text-white/80 font-medium leading-relaxed">{item}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="relative z-10 pt-8 border-t border-white/10">
                                            <p className="text-sm font-medium text-white/50 mb-6">
                                                Ready to find the perfect carer?
                                            </p>
                                            <Button className="w-full h-14 rounded-xl bg-white text-[#111827] font-black hover:bg-[#1a9e8c] hover:text-white transition-all text-base shadow-xl" asChild>
                                                <Link to={`/marketplace?type=${careTypeData[typeId as keyof typeof careTypeData].title}`}>
                                                    Find a Carer
                                                    <ArrowRight className="w-4 h-4 ml-2" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="p-8 rounded-[2.5rem] border border-black/5 bg-slate-50">
                                        <h3 className="font-black text-[#111827] mb-2 flex items-center gap-2">
                                            <ShieldCheck className="w-5 h-5 text-[#1a9e8c]" />
                                            Heems Guarantee
                                        </h3>
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                            All carers displayed on our platform are vetted with our 20-point safety check, including enhanced DBS and reference verification.
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Loop Back CTA */}
                <section className="py-24 bg-[#1a9e8c] relative overflow-hidden">
                    <div className="container mx-auto px-6 text-center relative z-10">
                        <h2 className="text-3xl lg:text-5xl font-black text-white mb-8 tracking-tighter">
                            Start connecting with verified carers.
                        </h2>
                        <Button className="h-16 px-12 rounded-2xl bg-[#111827] text-white font-black hover:bg-black transition-all text-lg shadow-2xl" asChild>
                            <Link to={`/marketplace?type=${careTypeData[typeId as keyof typeof careTypeData].title}`}>Browse {careType.title}</Link>
                        </Button>
                    </div>
                </section>
            </main>
            <Footer />
        </div >
    );
};

export default CareTypeDetail;
