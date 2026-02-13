
import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { careTypeData } from "@/data/careTypeData";
import { ArrowLeft, CheckCircle2, User, ArrowRight, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CareTypeDetail = () => {
    const { typeId } = useParams();
    const navigate = useNavigate();

    const careType = careTypeData[typeId as keyof typeof careTypeData];

    useEffect(() => {
        if (!careType) {
            navigate("/types-of-care");
        }
    }, [careType, navigate]);

    if (!careType) return null;

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="pt-24 lg:pt-0">
                {/* Hero Section */}
                <section className="relative h-[60vh] lg:h-[70vh] flex items-center overflow-hidden">
                    <div className="absolute inset-0">
                        {/* Placeholder image logic - allow generic fallback if specific hero undefined */}
                        <img
                            src={careType.heroImage || careType.image}
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

                {/* Content Section */}
                <section className="py-24">
                    <div className="container mx-auto px-6 lg:px-12">
                        <div className="grid lg:grid-cols-12 gap-16">

                            {/* Left Column: Content */}
                            <div className="lg:col-span-7 space-y-16">
                                <div>
                                    <h2 className="text-3xl font-black text-[#111827] mb-8 flex items-center gap-3">
                                        What is {careType.title}?
                                    </h2>
                                    <div className="prose prose-lg prose-slate text-[#4B5563] font-medium leading-relaxed">
                                        {/* Render markdown-style content properly - simple split for paragraphs */}
                                        {careType.content.split('\n\n').map((paragraph, i) => (
                                            <p key={i} className="mb-6">{paragraph}</p>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-3xl font-black text-[#111827] mb-8">
                                        Key Benefits
                                    </h2>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {careType.benefits.map((benefit, i) => (
                                            <div key={i} className="flex gap-4 p-6 rounded-2xl bg-slate-50 border border-black/5">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-white shadow-sm ${careType.color}`}>
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </div>
                                                <p className="text-[#111827] font-bold text-sm leading-relaxed pt-2">{benefit}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Sticky Sidebar / Who is it for */}
                            <div className="lg:col-span-5">
                                <div className="sticky top-32 space-y-8">
                                    <div className="p-8 lg:p-10 rounded-[2.5rem] bg-[#111827] text-white overflow-hidden relative">
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
                                                <Link to="/marketplace">
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
                            <Link to="/marketplace">Browse {careType.title}</Link>
                        </Button>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
};

export default CareTypeDetail;
