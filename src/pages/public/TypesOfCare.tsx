import { useRef } from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
    Home, Brain, Heart, Coffee, Moon, User,
    ArrowRight, ShieldCheck, CheckCircle2, ChevronDown, Sparkles
} from "lucide-react";
import { motion, useInView } from "framer-motion";

/* ───────────────── Care Sections Data ───────────────── */

const careSections = [
    {
        id: "visiting",
        title: "Visiting Care",
        subtitle: "Flexible, personalised support in the comfort of your home",
        icon: User,
        description:
            "Visiting care involves a carer attending your home for pre-arranged visits to provide practical assistance and social companionship. Visits range from short check-ins to longer sessions, arranged regularly or as one-off support.",
        benefits: [
            "Supporting independence & daily routines",
            "Flexible scheduling around your life",
            "Reducing loneliness & isolation",
            "Reassurance for families",
        ],
        costRange: "£15 – £35 / hour",
        images: ["/visiting_care.png", "/carer_client_home.png"],
        accentFrom: "from-blue-500/10",
        accentTo: "to-indigo-500/5",
        iconBg: "bg-blue-100 text-blue-700",
        badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
        id: "live-in",
        title: "Live-In Care",
        subtitle: "Round-the-clock support from a dedicated professional",
        icon: Home,
        description:
            "Live-in care involves a carer staying in your home for an agreed period — typically several days or weeks — to provide ongoing personal support, practical assistance, and companionship throughout day and night.",
        benefits: [
            "Continuity from one consistent carer",
            "One-to-one personalised attention",
            "Comfort of remaining at home",
            "Flexible, adaptable arrangements",
        ],
        costRange: "£900 – £1,500 / week",
        images: ["/live_in_care.png", "/modern_home_care_hero.png"],
        accentFrom: "from-emerald-500/10",
        accentTo: "to-teal-500/5",
        iconBg: "bg-emerald-100 text-emerald-700",
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
        id: "overnight",
        title: "Overnight Care",
        subtitle: "Peace of mind through the night, every night",
        icon: Moon,
        description:
            "Overnight care provides reassurance and support during nighttime hours — whether as a sleeping night with a carer on hand, or a waking night with continuous supervision. Safety, comfort, and calm through the dark hours.",
        benefits: [
            "Reduced risk of falls & incidents",
            "Night-time routine support",
            "Peace of mind for families",
            "Sleeping or waking night options",
        ],
        costRange: "£90 – £230 / night",
        images: ["/overnight_care.png", "/carer_black_male_1.png"],
        accentFrom: "from-indigo-500/10",
        accentTo: "to-purple-500/5",
        iconBg: "bg-indigo-100 text-indigo-700",
        badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    {
        id: "palliative",
        title: "Palliative Support",
        subtitle: "Compassionate presence when it matters most",
        icon: Heart,
        description:
            "Palliative support focuses on comfort, dignity, and emotional reassurance for individuals living with life-limiting conditions. Compassionate companionship and everyday help during a physically and emotionally challenging time.",
        benefits: [
            "Emotional reassurance & calm presence",
            "Compassionate companionship",
            "Reduced stress for families",
            "Comfort-focused daily routines",
        ],
        costRange: "£15 – £35 / hour",
        images: ["/palliative_care.png", "/carer_casual_female_2.png"],
        accentFrom: "from-rose-500/10",
        accentTo: "to-pink-500/5",
        iconBg: "bg-rose-100 text-rose-700",
        badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    },
    {
        id: "dementia",
        title: "Dementia Support",
        subtitle: "Stability, routine, and reassurance for every day",
        icon: Brain,
        description:
            "Dementia support creates a stable, familiar, and reassuring environment for individuals living with memory loss or cognitive decline. Emphasis on maintaining routine, reducing anxiety, and supporting everyday activities with dignity.",
        benefits: [
            "Maintaining routine & structure",
            "Reducing anxiety through familiarity",
            "Encouraging independence",
            "Reassurance for families",
        ],
        costRange: "£15 – £35 / hour",
        images: ["/about-care.png", "/carer_black_female_1.png"],
        accentFrom: "from-purple-500/10",
        accentTo: "to-violet-500/5",
        iconBg: "bg-purple-100 text-purple-700",
        badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
        id: "respite",
        title: "Respite Care",
        subtitle: "A well-deserved break for family carers",
        icon: Coffee,
        description:
            "Respite care provides short-term, flexible support so family carers can rest, recharge, or attend to their own needs — knowing their loved one is safe, supported, and comfortable at home.",
        benefits: [
            "Preventing carer fatigue & burnout",
            "Flexible — planned or short-notice",
            "Continuity for the person receiving care",
            "Peace of mind during your break",
        ],
        costRange: "£15 – £35 / hour",
        images: ["/respite_care.png", "/about-team.png"],
        accentFrom: "from-amber-500/10",
        accentTo: "to-orange-500/5",
        iconBg: "bg-amber-100 text-amber-700",
        badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
];

/* ───────────────── Animated Section Component ───────────────── */

function CareSection({
    section,
    index,
}: {
    section: (typeof careSections)[0];
    index: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });
    const isReversed = index % 2 !== 0;

    const Icon = section.icon;

    return (
        <section
            ref={ref}
            className={`relative overflow-hidden bg-gradient-to-br ${section.accentFrom} ${section.accentTo} to-transparent`}
        >
            {/* Decorative blurred orb */}
            <div
                className="pointer-events-none absolute -top-32 right-0 h-[500px] w-[500px] rounded-full opacity-30 blur-[120px]"
                style={{
                    background:
                        index % 3 === 0
                            ? "radial-gradient(circle, rgba(26,158,140,.25), transparent 70%)"
                            : index % 3 === 1
                                ? "radial-gradient(circle, rgba(99,102,241,.2), transparent 70%)"
                                : "radial-gradient(circle, rgba(244,63,94,.15), transparent 70%)",
                }}
            />

            <div className="container mx-auto px-6 lg:px-12 py-20 lg:py-32">
                <div
                    className={`flex flex-col ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
                        } items-center gap-12 lg:gap-20`}
                >
                    {/* ── Image Column ── */}
                    <motion.div
                        initial={{ opacity: 0, x: isReversed ? 60 : -60 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="w-full lg:w-1/2"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 overflow-hidden rounded-[20px] shadow-lg">
                                <img
                                    src={section.images[0]}
                                    alt={section.title}
                                    className="h-[320px] w-full object-cover transition-transform duration-500 hover:scale-105"
                                    loading="lazy"
                                />
                            </div>
                            <div className="overflow-hidden rounded-[20px] shadow-lg">
                                <img
                                    src={section.images[1]}
                                    alt={`${section.title} detail`}
                                    className="h-[200px] w-full object-cover transition-transform duration-500 hover:scale-105"
                                    loading="lazy"
                                />
                            </div>
                            {/* Accent stat card */}
                            <div className="flex flex-col items-center justify-center rounded-[20px] bg-white/70 p-6 shadow-lg backdrop-blur-xl border border-white/60">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 ${section.iconBg}`}>
                                    <Icon className="w-7 h-7" />
                                </div>
                                <span className="text-[13px] font-bold text-slate-500 uppercase tracking-widest text-center">
                                    Starting from
                                </span>
                                <span className="text-lg font-black text-[#111827] mt-1">
                                    {section.costRange}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Text Column ── */}
                    <motion.div
                        initial={{ opacity: 0, x: isReversed ? -60 : 60 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
                        className="w-full lg:w-1/2"
                    >
                        {/* Glassmorphism Card */}
                        <div className="rounded-[20px] bg-white/70 backdrop-blur-xl border border-white/60 p-8 lg:p-12 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                            {/* Badge */}
                            <div
                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border mb-6 ${section.badgeColor}`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {section.title}
                            </div>

                            <h2 className="text-3xl lg:text-4xl font-black text-[#111827] tracking-tight leading-tight mb-3">
                                {section.subtitle}
                            </h2>

                            <p className="text-[#4B5563] text-base lg:text-lg font-medium leading-relaxed mb-8">
                                {section.description}
                            </p>

                            {/* Benefits */}
                            <div className="space-y-3 mb-10">
                                {section.benefits.map((b, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-[#1a9e8c] shrink-0 mt-0.5" />
                                        <span className="text-sm font-semibold text-slate-700">
                                            {b}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA */}
                            <Button
                                asChild
                                className="bg-[#1a9e8c] hover:bg-[#15806c] text-white font-bold rounded-xl h-13 px-8 text-base shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                            >
                                <Link to={`/types-of-care/${section.id}`}>
                                    Learn More
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

/* ───────────────── Main Page Component ───────────────── */

const TypesOfCare = () => {
    const sectionsRef = useRef<HTMLDivElement>(null);

    const scrollToSections = () => {
        sectionsRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-white font-sans">
            <Header />

            <main>
                {/* ═══════════════ HERO ═══════════════ */}
                <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#111827]">
                    {/* Background image with overlay */}
                    <div className="absolute inset-0">
                        <img
                            src="/modern_home_care_hero.png"
                            alt="Premium home care"
                            className="w-full h-full object-cover opacity-30"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#111827] via-[#111827]/90 to-[#111827]/60" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
                    </div>

                    {/* Floating accent orbs */}
                    <div className="absolute top-1/4 right-[15%] w-[400px] h-[400px] rounded-full bg-[#1a9e8c]/10 blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-1/4 left-[10%] w-[300px] h-[300px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />

                    <div className="container mx-auto px-6 lg:px-12 relative z-10 pt-32 pb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-3xl"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest mb-8">
                                <ShieldCheck className="w-4 h-4 text-[#1a9e8c]" />
                                Comprehensive Care Solutions
                            </div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]">
                                Care that feels like{" "}
                                <span className="text-[#1a9e8c]">home.</span>
                            </h1>

                            <p className="text-lg lg:text-xl text-white/70 font-medium max-w-2xl leading-relaxed mb-10">
                                Explore our range of flexible, transparent, and
                                non-clinical care solutions — delivered by vetted
                                independent professionals, right in your home.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    asChild
                                    className="bg-[#1a9e8c] hover:bg-[#15806c] text-white font-bold rounded-xl h-14 px-8 text-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5"
                                >
                                    <Link to="/marketplace">
                                        <Sparkles className="w-5 h-5 mr-2" />
                                        Find a Carer
                                    </Link>
                                </Button>
                                <Button
                                    onClick={scrollToSections}
                                    variant="outline"
                                    className="border-white/20 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 hover:text-white font-bold rounded-xl h-14 px-8 text-lg transition-all duration-300"
                                >
                                    Explore Services
                                    <ChevronDown className="w-5 h-5 ml-2" />
                                </Button>
                            </div>
                        </motion.div>

                        {/* Trust badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="mt-16 flex flex-wrap gap-6 items-center"
                        >
                            {[
                                "DBS Verified Carers",
                                "Transparent Pricing",
                                "No Long-Term Contracts",
                            ].map((badge) => (
                                <div
                                    key={badge}
                                    className="flex items-center gap-2 text-white/50 text-sm font-semibold"
                                >
                                    <CheckCircle2 className="w-4 h-4 text-[#1a9e8c]" />
                                    {badge}
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Scroll indicator */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
                        <span className="text-white/30 text-xs font-bold uppercase tracking-widest">
                            Scroll
                        </span>
                        <ChevronDown className="w-5 h-5 text-white/30" />
                    </div>
                </section>

                {/* ═══════════════ CARE SECTIONS ═══════════════ */}
                <div ref={sectionsRef}>
                    {careSections.map((section, index) => (
                        <CareSection
                            key={section.id}
                            section={section}
                            index={index}
                        />
                    ))}
                </div>

                {/* ═══════════════ BOTTOM CTA ═══════════════ */}
                <section className="relative py-28 overflow-hidden bg-[#111827]">
                    {/* Accent orbs */}
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[#1a9e8c]/15 blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />

                    <div className="container mx-auto px-6 lg:px-12 text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest mb-8">
                                <Sparkles className="w-4 h-4 text-[#1a9e8c]" />
                                Start Today
                            </div>

                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
                                Ready to find the{" "}
                                <span className="text-[#1a9e8c]">
                                    perfect care?
                                </span>
                            </h2>

                            <p className="text-lg text-white/60 font-medium max-w-xl mx-auto mb-10 leading-relaxed">
                                Connect with verified, experienced carers in your
                                area. Transparent pricing, no long-term contracts.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    asChild
                                    className="bg-[#1a9e8c] hover:bg-[#15806c] text-white font-black rounded-xl h-16 px-12 text-lg shadow-2xl transition-all duration-300 hover:shadow-[0_20px_60px_rgba(26,158,140,0.3)] hover:-translate-y-1"
                                >
                                    <Link to="/marketplace">
                                        Browse Carers
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="border-white/20 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 hover:text-white font-bold rounded-xl h-16 px-12 text-lg transition-all duration-300"
                                >
                                    <Link to="/contact">
                                        Speak to an Advisor
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default TypesOfCare;
