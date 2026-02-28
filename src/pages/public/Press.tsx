import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, ExternalLink, Calendar, TrendingUp, Award, Users, Globe } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

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
        color: "bg-blue-50 text-blue-700 border-blue-100"
    },
    {
        outlet: "Skills for Care",
        headline: "Digital platforms help independent carers build sustainable careers",
        date: "Jan 2026",
        url: "https://www.skillsforcare.org.uk",
        color: "bg-emerald-50 text-emerald-700 border-emerald-100"
    },
    {
        outlet: "Homecare Association",
        headline: "New market entrants raise standards in self-directed care",
        date: "Jan 2026",
        url: "https://www.homecareassociation.org.uk",
        color: "bg-violet-50 text-violet-700 border-violet-100"
    },
    {
        outlet: "Age UK",
        headline: "Proactive planning and digital tools key to ageing well at home",
        date: "Dec 2025",
        url: "https://www.ageuk.org.uk",
        color: "bg-amber-50 text-amber-700 border-amber-100"
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
        <div className="min-h-screen bg-white font-sans selection:bg-[#1a9e8c]/30">
            <Helmet>
                <title>Press & Media - Heems | The UK's Premier Private Care Platform</title>
                <meta name="description" content="Read the latest press releases, media coverage, and milestones from Heems, the UK's leading private home care marketplace." />
                <meta property="og:title" content="Press & Media - Heems" />
                <meta property="og:url" content="https://www.heems.co.uk/press" />
            </Helmet>
            <Header />

            <main>
                {/* ─── HERO (Cinematic) ─── */}
                <section className="relative min-h-[75vh] flex items-center pt-32 pb-20 overflow-hidden bg-[#0B1120]">
                    {/* Background Image & Cinematic Overlays */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/press_hero.png" /* Make sure this image exists or fallback correctly */
                            alt="Heems Press & Media"
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
                                <span className="inline-block text-[10px] font-black text-[#1a9e8c] uppercase tracking-[0.2em] mb-6 bg-[#1a9e8c]/10 px-4 py-2 rounded-full border border-[#1a9e8c]/20 shadow-xl backdrop-blur-md">
                                    Media &amp; Press
                                </span>
                                <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-6 tracking-tight leading-[1.05]">
                                    Newsroom
                                </h1>
                                <p className="text-lg lg:text-xl text-white/70 font-medium max-w-2xl leading-relaxed mb-10">
                                    Heems is redefining how families in England access independent home care. Find our latest news, company milestones, and media contact details below.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                    <a
                                        href="mailto:support@heemscare.com"
                                        className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-[1.25rem] bg-[#1a9e8c] hover:bg-[#15806c] text-white font-bold transition-all shadow-[0_8px_20px_rgba(26,158,140,0.2)] hover:shadow-[0_15px_30px_rgba(26,158,140,0.3)] hover:-translate-y-0.5 text-base"
                                    >
                                        <Mail className="w-5 h-5" />
                                        Press Enquiries
                                    </a>
                                    <Link
                                        to="/about"
                                        className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-[1.25rem] border border-white/20 font-bold text-white bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/30 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all text-base"
                                    >
                                        About Heems <ArrowRight className="w-4 h-4 text-white/50" />
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Key Milestones */}
                <section className="py-24">
                    <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="flex items-center gap-3 mb-12"
                        >
                            <Award className="w-8 h-8 text-[#1a9e8c]" />
                            <h2 className="text-4xl font-black text-[#111827] tracking-tight">Company Milestones</h2>
                        </motion.div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {keyMilestones.map((m, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    key={i}
                                    className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-[#1a9e8c]/30 hover:shadow-[0_15px_40px_rgba(26,158,140,0.1)] hover:-translate-y-2 transition-all duration-500 group flex flex-col items-start"
                                >
                                    <div className="h-12 w-auto flex items-center justify-start mb-6 grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all duration-500 min-w-[8rem]">
                                        {/* Realistic SVG Logo representation based on the 'label' or 'tag' (Since m doesn't have a specific ID, matching by index/iteration) */}
                                        {i === 0 && (
                                            <svg viewBox="0 0 200 60" className="h-8 fill-blue-800">
                                                <text x="0" y="40" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="28" letterSpacing="-1">COMMUNITY</text>
                                                <text x="0" y="55" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="16" fill="#e91e63">CARE</text>
                                            </svg>
                                        )}
                                        {i === 1 && (
                                            <svg viewBox="0 0 200 60" className="h-10 fill-[#1a9e8c]">
                                                <text x="0" y="45" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="bold" fontSize="32">Skills for Care</text>
                                            </svg>
                                        )}
                                        {i === 2 && (
                                            <svg viewBox="0 0 200 60" className="h-8 fill-[#111827]">
                                                <path d="M10,10 L30,10 L30,25 L50,25 L50,10 L70,10 L70,50 L50,50 L50,35 L30,35 L30,50 L10,50 Z" fill="#4B5563" />
                                                <text x="80" y="38" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="26">Homecare</text>
                                            </svg>
                                        )}
                                        {i === 3 && (
                                            <svg viewBox="0 0 200 60" className="h-9 fill-purple-700">
                                                <text x="0" y="40" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="36" letterSpacing="-2">age<tspan fill="#e91e63">UK</tspan></text>
                                            </svg>
                                        )}
                                    </div>
                                    <p className="text-[10px] font-black text-[#1a9e8c] uppercase tracking-widest mb-2">{m.year}</p>
                                    <h3 className="text-xl font-black text-[#111827] mb-3 leading-tight">{m.label}</h3>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{m.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Press Releases */}
                <section className="py-24 bg-slate-50 border-y border-black/[0.03]">
                    <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8 }}
                            className="text-4xl font-black text-[#111827] tracking-tight mb-12"
                        >
                            Press Releases
                        </motion.h2>
                        <div className="space-y-6">
                            {pressReleases.map((pr, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.6, delay: i * 0.1 }}
                                    key={i}
                                    className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-[#1a9e8c]/30 hover:shadow-[0_20px_60px_rgba(26,158,140,0.1)] hover:-translate-y-1 transition-all duration-500 group"
                                >
                                    <div className="flex flex-wrap items-center gap-3 mb-6">
                                        <Badge className="bg-[#1a9e8c]/10 text-[#1a9e8c] border-none text-[10px] font-black uppercase tracking-widest hover:bg-[#1a9e8c]/20">{pr.tag}</Badge>
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 hidden sm:block" />
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{pr.date}</span>
                                    </div>
                                    <h3 className="text-2xl lg:text-3xl font-black text-[#111827] mb-6 leading-[1.2] tracking-tight group-hover:text-[#1a9e8c] transition-colors duration-300">{pr.title}</h3>
                                    <p className="text-slate-500 text-lg font-medium leading-relaxed mb-8 max-w-4xl">{pr.excerpt}</p>
                                    <Link
                                        to={pr.href}
                                        className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[#111827] group-hover:text-[#1a9e8c] transition-colors"
                                    >
                                        Request Full Release <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Media Coverage */}
                <section className="py-24">
                    <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8 }}
                            className="mb-12"
                        >
                            <h2 className="text-4xl font-black text-[#111827] tracking-tight mb-4">In The Press</h2>
                            <p className="text-slate-500 text-xl font-medium">Coverage and commentary from established industry bodies and publications.</p>
                        </motion.div>
                        <div className="grid sm:grid-cols-2 gap-6">
                            {mediaCoverage.map((item, i) => (
                                <motion.a
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    key={i}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex flex-col md:flex-row items-start gap-6 p-8 rounded-[2rem] border border-slate-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-[#1a9e8c]/30 hover:shadow-[0_20px_60px_rgba(26,158,140,0.1)] hover:-translate-y-2 transition-all duration-500"
                                >
                                    <div className={`shrink-0 h-16 w-16 md:h-20 md:w-20 rounded-[1.25rem] flex items-center justify-center font-black text-2xl border ${item.color} group-hover:scale-105 transition-transform duration-500`}>
                                        {item.outlet[0]}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex flex-wrap items-center gap-2 lg:justify-between mb-3">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{item.outlet}</span>
                                            <span className="text-[10px] font-bold text-slate-400 ml-auto md:ml-0">{item.date}</span>
                                        </div>
                                        <p className="text-[#111827] text-lg font-black leading-snug tracking-tight group-hover:text-[#1a9e8c] transition-colors duration-300">{item.headline}</p>
                                        <div className="mt-4 flex items-center gap-1.5 text-[10px] font-black text-[#1a9e8c] uppercase tracking-widest opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                            Visit Site <ExternalLink className="w-3 h-3" />
                                        </div>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* About Heems & Key Facts Grid */}
                <section className="py-24 bg-slate-50 border-t border-black/[0.03]">
                    <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
                            <motion.div
                                initial={{ opacity: 0, x: -40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8 }}
                            >
                                <h2 className="text-4xl font-black text-[#111827] tracking-tight mb-8">About Heems</h2>
                                <div className="space-y-6">
                                    <p className="text-slate-500 text-lg font-medium leading-relaxed">
                                        Heems is a UK-based digital platform that connects families with independent, self-employed carers. The platform provides secure matching, verified profiles, structured booking, and transparent pricing — enabling families to make confident decisions about home care.
                                    </p>
                                    <p className="text-slate-500 text-lg font-medium leading-relaxed">
                                        Heems operates as an introductory platform. Independent carers set their own rates and manage their own availability. All carers undergo a structured identity and document verification process before being listed.
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8 }}
                            >
                                <h2 className="text-4xl font-black text-[#111827] tracking-tight mb-8">Key Facts</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { stat: "London", label: "Headquarters" },
                                        { stat: "National", label: "Coverage Area" },
                                        { stat: "£15/hr+", label: "Min Carer Rate" },
                                        { stat: "2026", label: "Launch Year" },
                                    ].map((item, i) => (
                                        <div key={i} className="p-6 lg:p-8 bg-white rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-[#1a9e8c]/20 hover:shadow-[0_15px_40px_rgba(26,158,140,0.1)] hover:-translate-y-1 transition-all duration-300">
                                            <p className="text-2xl lg:text-3xl font-black text-[#111827] mb-2 tracking-tight group-hover:text-[#1a9e8c]">{item.stat}</p>
                                            <p className="text-[10px] font-black text-[#1a9e8c] uppercase tracking-[0.2em]">{item.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Press Contact */}
                <section className="py-24 lg:py-32 bg-[#0B1120] relative overflow-hidden group">
                    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8 }}
                        className="container mx-auto px-6 lg:px-12 max-w-5xl relative z-10"
                    >
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 bg-white/5 backdrop-blur-xl border border-white/10 p-10 lg:p-14 rounded-[3rem] shadow-[0_20px_80px_rgba(0,0,0,0.2)]">
                            <div>
                                <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">Press Contact</h2>
                                <p className="text-white/60 text-xl font-medium">For all media, interview, and editorial enquiries.</p>
                            </div>
                            <div className="flex flex-col items-start md:items-end gap-3">
                                <a href="mailto:support@heemscare.com" className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a9e8c] to-emerald-400 font-black text-2xl lg:text-3xl hover:opacity-80 transition-opacity">
                                    support@heemscare.com
                                </a>
                                <p className="text-white/40 text-sm font-bold uppercase tracking-widest">We aim to respond within 24 hours</p>
                            </div>
                        </div>
                    </motion.div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Press;
