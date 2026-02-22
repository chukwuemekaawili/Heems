import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, ExternalLink, Calendar, TrendingUp, Award, Users, Globe } from "lucide-react";

const pressReleases = [
    {
        date: "February 2026",
        tag: "Platform Launch",
        title: "Heems Officially Launches in England, Connecting Families with Verified Independent Carers",
        excerpt: "Heems, a new UK-based care introductory platform, has officially launched its digital marketplace across England, enabling families to identify, verify, and arrange independent home carers with transparency and confidence. The launch addresses a critical gap in the private care market, where families often navigate complex and fragmented systems alone.",
        href: "/contact"
    },
    {
        date: "January 2026",
        tag: "Policy",
        title: "Heems Responds to NHS 10-Year Plan: Home Care Must Be Central to Social Care Reform",
        excerpt: "In a public statement, Heems has welcomed the government's renewed focus on community-based care in the NHS 10-Year Plan. The company called for greater investment in introductory care platforms as a complement to NHS discharge planning, citing growing evidence that structured home support reduces hospital readmissions and frees up acute care capacity.",
        href: "/contact"
    },
    {
        date: "December 2025",
        tag: "Product",
        title: "Heems Introduces Structured Verification Pathway for Independent Carers Across England",
        excerpt: "Heems has implemented a multi-stage verification framework for all independent carers listed on its platform, covering identity checks, professional qualification review, and reference sourcing. The move sets a new standard for introductory care marketplaces, providing families with greater confidence in the safety and competence of care professionals they engage.",
        href: "/contact"
    }
];

const mediaCoverage = [
    {
        outlet: "Community Care",
        headline: "Technology platforms are reshaping how families access home care",
        date: "Feb 2026",
        url: "https://www.communitycare.co.uk",
        color: "bg-blue-50 text-blue-700"
    },
    {
        outlet: "Skills for Care",
        headline: "Digital platforms help independent carers build sustainable careers",
        date: "Jan 2026",
        url: "https://www.skillsforcare.org.uk",
        color: "bg-emerald-50 text-emerald-700"
    },
    {
        outlet: "Homecare Association",
        headline: "New market entrants raise standards in self-directed care",
        date: "Jan 2026",
        url: "https://www.homecareassociation.org.uk",
        color: "bg-violet-50 text-violet-700"
    },
    {
        outlet: "Age UK",
        headline: "Proactive planning and digital tools key to ageing well at home",
        date: "Dec 2025",
        url: "https://www.ageuk.org.uk",
        color: "bg-amber-50 text-amber-700"
    }
];

const keyMilestones = [
    { icon: Calendar, year: "Q4 2025", label: "Founded in London", desc: "Heems established with a clear mission: to make independent home care transparent, structured, and safe." },
    { icon: Users, year: "Q1 2026", label: "Platform Opens to Carers", desc: "Structured verification pathway launched. First cohort of verified independent carers onboarded across England." },
    { icon: Globe, year: "Q1 2026", label: "Public Launch", desc: "Families across England gain access to the Heems marketplace, with pre-filtered, verified carer profiles." },
    { icon: TrendingUp, year: "Q2 2026", label: "Growth Phase", desc: "Continuous expansion of carer listings, regional coverage, and platform capabilities based on user feedback." },
];

const Press = () => {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="pt-24">
                {/* Hero */}
                <section className="py-24 bg-slate-50 relative overflow-hidden">
                    <div className="container mx-auto px-6 lg:px-12 max-w-5xl relative z-10">
                        <span className="inline-block text-xs font-black text-[#1a9e8c] uppercase tracking-widest mb-6">
                            Media &amp; Press
                        </span>
                        <h1 className="text-5xl lg:text-6xl font-black text-[#111827] mb-6 tracking-tight leading-tight">
                            Newsroom
                        </h1>
                        <p className="text-xl text-slate-600 max-w-2xl leading-relaxed mb-8">
                            Heems is redefining how families in England access independent home care. Find our latest news, company milestones, and media contact details below.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a
                                href="mailto:support@heemscare.com"
                                className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-[#1a9e8c] hover:bg-[#15806c] text-white font-bold transition-colors"
                            >
                                <Mail className="w-4 h-4" />
                                Press Enquiries
                            </a>
                            <Link
                                to="/about"
                                className="inline-flex items-center gap-2 h-12 px-8 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                                About Heems <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#1a9e8c]/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                </section>

                {/* Key Milestones */}
                <section className="py-20">
                    <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
                        <div className="flex items-center gap-3 mb-12">
                            <Award className="w-6 h-6 text-[#1a9e8c]" />
                            <h2 className="text-3xl font-black text-[#111827]">Company Milestones</h2>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {keyMilestones.map((m, i) => (
                                <div key={i} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-[#1a9e8c]/20 hover:shadow-lg transition-all">
                                    <div className="h-10 w-10 rounded-xl bg-[#1a9e8c]/10 flex items-center justify-center mb-4">
                                        <m.icon className="h-5 w-5 text-[#1a9e8c]" />
                                    </div>
                                    <p className="text-xs font-black text-[#1a9e8c] uppercase tracking-widest mb-1">{m.year}</p>
                                    <h3 className="text-lg font-black text-[#111827] mb-2">{m.label}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{m.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Press Releases */}
                <section className="py-20 bg-slate-50">
                    <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
                        <h2 className="text-3xl font-black text-[#111827] mb-12">Press Releases</h2>
                        <div className="space-y-6">
                            {pressReleases.map((pr, i) => (
                                <div key={i} className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 hover:border-[#1a9e8c]/20 hover:shadow-xl transition-all group">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Badge className="bg-[#1a9e8c]/10 text-[#1a9e8c] border-none text-[10px] font-black uppercase tracking-widest">{pr.tag}</Badge>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{pr.date}</span>
                                    </div>
                                    <h3 className="text-xl lg:text-2xl font-black text-[#111827] mb-4 leading-tight group-hover:text-[#1a9e8c] transition-colors">{pr.title}</h3>
                                    <p className="text-slate-600 leading-relaxed mb-6">{pr.excerpt}</p>
                                    <Link
                                        to={pr.href}
                                        className="inline-flex items-center gap-2 text-sm font-bold text-[#1a9e8c] hover:text-[#15806c] transition-colors"
                                    >
                                        Request Full Release <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Media Coverage */}
                <section className="py-20">
                    <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
                        <h2 className="text-3xl font-black text-[#111827] mb-4">In The Press</h2>
                        <p className="text-slate-500 mb-12">Coverage and commentary from established industry bodies and publications.</p>
                        <div className="grid sm:grid-cols-2 gap-6">
                            {mediaCoverage.map((item, i) => (
                                <a
                                    key={i}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-start gap-5 p-6 rounded-3xl border border-slate-100 bg-white hover:border-[#1a9e8c]/20 hover:shadow-lg transition-all"
                                >
                                    <div className={`shrink-0 h-12 w-12 rounded-2xl flex items-center justify-center font-black text-lg ${item.color}`}>
                                        {item.outlet[0]}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{item.outlet}</span>
                                            <span className="text-[10px] font-bold text-slate-400">{item.date}</span>
                                        </div>
                                        <p className="text-[#111827] font-bold leading-snug group-hover:text-[#1a9e8c] transition-colors">{item.headline}</p>
                                        <div className="mt-3 flex items-center gap-1 text-[10px] font-black text-[#1a9e8c] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                            Visit Site <ExternalLink className="w-3 h-3" />
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* About Heems */}
                <section className="py-20 bg-slate-50">
                    <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
                        <h2 className="text-3xl font-black text-[#111827] mb-8">About Heems — For Press</h2>
                        <div className="bg-white rounded-3xl p-10 border border-slate-100">
                            <p className="text-slate-600 leading-relaxed mb-4 text-lg">
                                Heems is a UK-based digital platform that connects families with independent, self-employed carers. The platform provides secure matching, verified profiles, structured booking, and transparent pricing — enabling families to make confident decisions about home care.
                            </p>
                            <p className="text-slate-600 leading-relaxed mb-4">
                                Heems operates as an introductory platform. Independent carers set their own rates and manage their own availability. All carers undergo a structured identity and document verification process before being listed.
                            </p>
                            <p className="text-slate-600 leading-relaxed">
                                Heems is headquartered in London, UK, and serves families across England.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Key Facts */}
                <section className="py-20">
                    <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
                        <h2 className="text-3xl font-black text-[#111827] mb-8">Key Facts</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { stat: "London, UK", label: "Headquarters" },
                                { stat: "England", label: "Coverage Area" },
                                { stat: "£15/hr+", label: "Minimum Carer Rate" },
                                { stat: "2026", label: "Platform Launch" },
                            ].map((item, i) => (
                                <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-2xl font-black text-[#1a9e8c] mb-1">{item.stat}</p>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{item.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Press Contact */}
                <section className="py-20 bg-[#111827]">
                    <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                            <div>
                                <h2 className="text-3xl font-black text-white mb-3">Press Contact</h2>
                                <p className="text-white/50 text-lg">For all media, interview, and editorial enquiries.</p>
                            </div>
                            <div className="flex flex-col items-start md:items-end gap-2">
                                <a href="mailto:support@heemscare.com" className="text-[#1a9e8c] font-black text-2xl hover:underline">
                                    support@heemscare.com
                                </a>
                                <p className="text-white/30 text-sm">We aim to respond within 24 hours.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Press;
