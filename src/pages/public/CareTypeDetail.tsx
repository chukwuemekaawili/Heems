import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { CareType, careTypeData } from "@/data/careTypeData";
import { ArrowLeft, CheckCircle2, User, ArrowRight, ShieldCheck } from "lucide-react";

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

    // Fallback images if gallery is missing
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
                                        What Is {careType.title}?
                                    </h2>
                                    <div className="prose prose-lg prose-slate text-[#4B5563] font-medium leading-relaxed">
                                        {careType.content.split('\n\n').map((p, i) => (
                                            <p key={i} className="mb-4 whitespace-pre-wrap">{p}</p>
                                        ))}
                                    </div>
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

                                {/* Benefits Grid */}
                                <div>
                                    <h3 className="text-3xl font-black text-[#111827] mb-6">
                                        Benefits of {careType.title}
                                    </h3>
                                    {careType.benefitsIntro && (
                                        <p className="text-[#4B5563] font-medium leading-relaxed mb-8">
                                            {careType.benefitsIntro}
                                        </p>
                                    )}
                                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                                        {careType.benefits.map((benefit, i) => (
                                            <div key={i} className="flex gap-4 p-6 rounded-2xl bg-slate-50 border border-black/5 hover:border-[#1a9e8c]/20 transition-colors">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-white shadow-sm ${careType.color}`}>
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </div>
                                                <p className="text-[#111827] font-bold text-sm leading-relaxed pt-2">{benefit}</p>
                                            </div>
                                        ))}
                                    </div>
                                    {careType.benefitsOutro && (
                                        <p className="text-[#4B5563] font-medium leading-relaxed">
                                            {careType.benefitsOutro}
                                        </p>
                                    )}
                                </div>


                                {/* Who Are the Carers? */}
                                <div>
                                    <h2 className="text-3xl font-black text-[#111827] mb-6">
                                        Who Are the Carers?
                                    </h2>
                                    <p className="text-[#4B5563] font-medium leading-relaxed mb-6">
                                        {careType.whoAreTheCarersIntro}
                                    </p>
                                    <ul className="space-y-4 mb-6">
                                        {careType.whoAreTheCarers.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-base font-bold text-slate-700">
                                                <div className="h-1.5 w-1.5 rounded-full bg-[#1a9e8c] mt-2 shrink-0" />
                                                <span className="leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    {careType.whoAreTheCarersOutro && (
                                        <p className="text-[#4B5563] font-medium leading-relaxed">
                                            {careType.whoAreTheCarersOutro}
                                        </p>
                                    )}
                                </div>

                                {/* Cost Information Section */}
                                <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-[#1a9e8c]/5 to-[#111827]/5 border border-[#1a9e8c]/10">
                                    <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                                        <div className="w-16 h-16 rounded-2xl bg-[#1a9e8c] flex items-center justify-center shrink-0 shadow-lg">
                                            <svg className="w-8 h-8 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-black text-[#111827] mb-4">
                                                How Much Does {careType.title} Cost?
                                            </h3>

                                            {careType.costFactors && careType.costFactors.length > 0 && (
                                                <>
                                                    <p className="text-[#4B5563] font-medium leading-relaxed mb-4">
                                                        The cost of {careType.title.toLowerCase()} varies depending on factors such as:
                                                    </p>
                                                    <ul className="space-y-4 mb-6">
                                                        {careType.costFactors.map((factor, i) => (
                                                            <li key={i} className="flex items-center gap-3 text-base font-bold text-slate-700">
                                                                <div className="h-2 w-2 rounded-full bg-[#1a9e8c] shrink-0" />
                                                                {factor}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </>
                                            )}

                                            <div className="prose prose-slate text-[#4B5563] font-medium leading-relaxed">
                                                {careType.costDescription.split('\n\n').map((p, i) => (
                                                    <p key={i} className="mb-4 whitespace-pre-wrap">{p}</p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* How to Arrange */}
                                <div>
                                    <h2 className="text-3xl font-black text-[#111827] mb-6">
                                        How to Arrange {careType.title} with Heems
                                    </h2>

                                    {careType.howToArrangeText ? (
                                        <div className="prose prose-lg prose-slate text-[#4B5563] font-medium leading-relaxed">
                                            {careType.howToArrangeText.split('\n\n').map((p, i) => (
                                                <p key={i} className="mb-4">{p}</p>
                                            ))}
                                        </div>
                                    ) : (
                                        <>
                                            <p className="text-[#4B5563] font-medium leading-relaxed mb-8">
                                                {careType.howToArrangeIntro}
                                            </p>
                                            <div className="space-y-6 mb-8">
                                                {careType.howToArrange?.map((step, i) => (
                                                    <div key={i} className="flex gap-4">
                                                        {careType.isHowToArrangeNumbered ? (
                                                            <div className="w-8 h-8 rounded-full bg-[#1a9e8c]/10 text-[#1a9e8c] flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                                                                {i + 1}
                                                            </div>
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-full bg-[#1a9e8c]/10 text-[#1a9e8c] flex items-center justify-center font-bold text-sm shrink-0">
                                                                <CheckCircle2 className="w-4 h-4" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-bold text-[#111827] whitespace-pre-wrap leading-relaxed">
                                                                {step}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {careType.howToArrangeOutro && (
                                                <p className="text-[#4B5563] font-medium leading-relaxed">
                                                    {careType.howToArrangeOutro}
                                                </p>
                                            )}
                                        </>
                                    )}
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

                                        <h3 className="text-2xl font-black mb-8 flex items-center gap-2 relative z-10">
                                            <User className="w-6 h-6 text-[#1a9e8c]" />
                                            Who is {careType.title} suitable for?
                                        </h3>

                                        <ul className="space-y-4 relative z-10 mb-8">
                                            {careType.whoIsItFor.map((item, i) => (
                                                <li key={i} className="flex gap-4">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#1a9e8c] mt-2.5 shrink-0" />
                                                    <span className="text-white/80 font-medium leading-relaxed">{item}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {careType.whoIsItForOutro && (
                                            <p className="text-sm font-medium text-white/50 mb-8 relative z-10">
                                                * {careType.whoIsItForOutro}
                                            </p>
                                        )}

                                        <div className="relative z-10 pt-8 border-t border-white/10">
                                            <p className="text-sm font-medium text-white/50 mb-6">
                                                Ready to find the perfect carer?
                                            </p>
                                            <Button className="w-full h-14 rounded-xl bg-white text-[#111827] font-black hover:bg-[#1a9e8c] hover:text-white transition-all text-base shadow-xl" asChild>
                                                <Link to={`/marketplace?type=${careType.title}`}>
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
                            <Link to={`/marketplace?type=${careType.title}`}>Browse {careType.title}</Link>
                        </Button>
                    </div>
                </section>
            </main>
            <Footer />
        </div >
    );
};

export default CareTypeDetail;
