import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, UserCheck, Calendar, Heart, Sparkles, User, Lock, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const familySteps = [
    {
        number: "01",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
        title: "Define Your Needs",
        description: "Tell us about your requirements. Our system starts matching instantly based on care experience, location, and personality.",
    },
    {
        number: "02",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
        title: "Select Your Carer",
        description: "Review elite profiles verified with our rigorous 20-point vetting process. Video interview them before you book.",
    },
    {
        number: "03",
        image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80",
        title: "Seamless Booking",
        description: "Schedule one-off visits or complex recurring care plans. Contracts, scheduling, and secure payments in one place.",
    },
    {
        number: "04",
        image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=800&q=80",
        title: "Expert Care Delivery",
        description: "Receive world-class care at home. Track every visit with real-time daily logs and direct communication with your carer.",
    },
];

const carerSteps = [
    {
        number: "01",
        image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&q=80",
        title: "Apply & Verify",
        description: "Create your profile and complete our 20-point vetting process. We verify your DBS, right to work, and references.",
    },
    {
        number: "02",
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",
        title: "Set Your Terms",
        description: "You're in control. Set your own hourly rates, define your service area, and maintain your availability calendar.",
    },
    {
        number: "03",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
        title: "Connect & Interview",
        description: "Receive booking requests from local families or organisations. Review needs and conduct video interviews.",
    },
    {
        number: "04",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
        title: "Deliver Care & Earn",
        description: "Provide exceptional care and log your visits on the go. Guaranteed, secure payouts processed swiftly.",
    },
];

const PhoneScreen = () => {
    const [screen, setScreen] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setScreen((prev) => (prev + 1) % 3);
        }, 5000); // Change screen every 5 seconds
        return () => clearInterval(timer);
    }, []);

    const variants = {
        enter: { opacity: 0, x: 20 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
    };

    return (
        <div className="relative w-[300px] h-[600px] bg-[#111827] rounded-[3rem] border-8 border-[#1a1f2e] shadow-2xl overflow-hidden mx-auto">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1a1f2e] rounded-b-2xl z-20" />

            {/* Screen Content */}
            <div className="w-full h-full bg-white relative pt-12 p-6 flex flex-col font-sans">
                <AnimatePresence mode="wait">
                    {screen === 0 && (
                        <motion.div
                            key="register"
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.5 }}
                            className="flex flex-col h-full"
                        >
                            <div className="flex-1 flex flex-col justify-center">
                                <div className="flex items-center justify-center mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-[#1a9e8c] flex items-center justify-center shadow-lg">
                                        <Sparkles className="text-white w-6 h-6" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-black text-[#111827] text-center mb-2">Create Account</h3>
                                <p className="text-xs text-slate-500 text-center mb-8">Join thousands of families finding care.</p>

                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">Full Name</label>
                                        <div className="h-10 bg-slate-50 rounded-lg border border-slate-200 flex items-center px-4 text-sm text-[#111827] font-medium shadow-sm">
                                            Sarah Williams
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">Email Address</label>
                                        <div className="h-10 bg-slate-50 rounded-lg border border-slate-200 flex items-center px-4 text-sm text-[#111827] font-medium shadow-sm">
                                            sarah@example.com
                                        </div>
                                    </div>
                                    <div className="h-12 bg-[#111827] rounded-xl mt-6 flex items-center justify-center text-white font-bold text-sm shadow-xl">
                                        Create Account
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {screen === 1 && (
                        <motion.div
                            key="login"
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.5 }}
                            className="flex flex-col h-full"
                        >
                            <div className="flex-1 flex flex-col justify-center">
                                <div className="flex items-center justify-center mb-8">
                                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                                        <User className="text-slate-400 w-8 h-8" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-black text-[#111827] text-center mb-8">Welcome Back</h3>

                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">Email</label>
                                        <div className="h-10 bg-slate-50 rounded-lg border border-slate-200 flex items-center px-4 text-xs text-[#111827]">
                                            sarah@example.com
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">Password</label>
                                        <div className="h-10 bg-slate-50 rounded-lg border border-slate-200 flex items-center px-4 text-xs text-[#111827] justify-between">
                                            <span>••••••••</span>
                                            <Lock className="w-3 h-3 text-slate-400" />
                                        </div>
                                    </div>

                                    <div className="h-12 bg-[#1a9e8c] rounded-xl mt-6 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-[#1a9e8c]/20">
                                        Sign In
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {screen === 2 && (
                        <motion.div
                            key="dashboard"
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.5 }}
                            className="flex flex-col h-full"
                        >
                            <div className="flex items-center justify-between mb-6 pt-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">SW</div>
                                    <div>
                                        <p className="text-xs font-bold text-[#111827]">Hello, Sarah</p>
                                        <p className="text-[10px] text-slate-500">London, UK</p>
                                    </div>
                                </div>
                                <div className="p-2 rounded-full bg-slate-50">
                                    <Search className="text-slate-400 w-4 h-4" />
                                </div>
                            </div>

                            <h3 className="text-lg font-black text-[#111827] mb-4">Recommended</h3>

                            <div className="space-y-3 flex-grow overflow-hidden">
                                {/* Carer Card 1 */}
                                <div className="p-3 bg-white rounded-2xl border border-black/5 flex gap-3 shadow-md hover:shadow-lg transition-all">
                                    <div className="w-12 h-12 rounded-xl bg-slate-100 shrink-0 overflow-hidden">
                                        <img src="/carer_female_1.png" alt="Carer" className="w-full h-full object-cover opacity-80" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-sm text-[#111827]">Maria G.</h4>
                                            <span className="text-[10px] font-bold text-[#1a9e8c] bg-[#1a9e8c]/10 px-1.5 py-0.5 rounded">£18/hr</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 mt-1 truncate">Expert in Dementia Care • 5y Exp</p>
                                        <div className="flex gap-1 mt-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                                            <span className="text-[9px] text-slate-400 font-medium">Available today</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Carer Card 2 */}
                                <div className="p-3 bg-white rounded-2xl border border-black/5 flex gap-3 shadow-sm opacity-80">
                                    <div className="w-12 h-12 rounded-xl bg-slate-100 shrink-0 overflow-hidden">
                                        <img src="/carer_male_1.png" alt="Carer" className="w-full h-full object-cover opacity-80" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-sm text-[#111827]">James T.</h4>
                                            <span className="text-[10px] font-bold text-[#1a9e8c] bg-[#1a9e8c]/10 px-1.5 py-0.5 rounded">£28/hr</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 mt-1 truncate">Mobility Support • 8y Exp</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto pt-4">
                                <div className="h-12 bg-[#111827] rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-xl">
                                    View All Carers
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const faqs = [
    {
        question: "How long does the matching process take?",
        answer: "Our intelligent matching algorithm often provides suitable carer profiles within minutes. Depending on your specific requirements and location, you can typically interview and book a carer within 24 to 48 hours."
    },
    {
        question: "How are the carers vetted on Heems?",
        answer: "We employ a rigorous 20-point vetting process. This includes mandatory enhanced DBS checks, right-to-work verification, professional reference checks, and a review of all relevant care qualifications and certificates before a carer's profile goes live."
    },
    {
        question: "How do payments work?",
        answer: "All payments are handled securely through the Heems platform via Stripe. For families, you are charged automatically after a care session is completed. For carers, funds are securely held and deposited directly into your linked bank account."
    },
    {
        question: "Is Heems an agency?",
        answer: "No, Heems operates as an Introductory Agency platform. This means we facilitate the connection, vetting, scheduling, and payment between families and independent, self-employed carers. The care agreement is directly between the client and the carer."
    }
];

const HowItWorksSection = () => {
    const [activeTab, setActiveTab] = useState<'families' | 'carers'>('families');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const currentSteps = activeTab === 'families' ? familySteps : carerSteps;

    return (
        <section className="py-24 lg:py-40 bg-white border-b border-black/[0.03] relative overflow-hidden" id="how-it-works">
            {/* Decorative Elements */}
            <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-[#1a9e8c]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 left-0 w-[600px] h-[600px] bg-[#111827]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                {/* Section Header with Phone Animation */}
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-20 lg:mb-28">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a9e8c]/10 border border-[#1a9e8c]/20 text-[#1a9e8c] text-xs font-black uppercase tracking-[0.25em] mb-8">
                            <Sparkles className="w-3.5 h-3.5" />
                            How It Works
                        </div>
                        <h2 className="text-5xl lg:text-7xl font-black text-[#111827] leading-[0.95] tracking-tighter mb-8">
                            A Better Path <br />
                            <span className="text-[#1a9e8c]">to Quality Care.</span>
                        </h2>
                        <p className="text-xl text-[#4B5563] font-medium leading-relaxed max-w-xl">
                            We've combined rigorous vetting with advanced algorithms to create the UK's most efficient care platform, whether you're seeking support or providing it.
                        </p>
                    </div>

                    {/* Animated Phone */}
                    <div className="relative h-[600px] flex items-center justify-center hidden lg:flex">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1a9e8c]/20 to-transparent rounded-full blur-3xl opacity-30 animate-pulse" />
                        <PhoneScreen />
                    </div>
                </div>

                {/* Role Tabs */}
                <div className="flex justify-center mb-16">
                    <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl shadow-inner border border-black/5">
                        <button
                            onClick={() => setActiveTab('families')}
                            className={`px-8 py-4 rounded-xl text-sm font-black transition-all ${activeTab === 'families'
                                ? 'bg-white text-[#111827] shadow-lg shadow-black/5 scale-[1.02]'
                                : 'text-slate-500 hover:text-[#111827]'
                                }`}
                        >
                            <Heart className="inline-block w-4 h-4 mr-2" />
                            For Families
                        </button>
                        <button
                            onClick={() => setActiveTab('carers')}
                            className={`px-8 py-4 rounded-xl text-sm font-black transition-all ${activeTab === 'carers'
                                ? 'bg-[#111827] text-white shadow-lg shadow-black/20 scale-[1.02]'
                                : 'text-slate-500 hover:text-[#111827]'
                                }`}
                        >
                            <UserCheck className="inline-block w-4 h-4 mr-2" />
                            For Carers
                        </button>
                    </div>
                </div>

                {/* Steps with Modern Card Design & Photography */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32 relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.5, staggerChildren: 0.1 }}
                            className="col-span-full grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {currentSteps.map((step, index) => (
                                <motion.div
                                    key={step.number}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.6, delay: index * 0.15 }}
                                    className="group relative bg-[#0B1120] rounded-[2.5rem] overflow-hidden flex flex-col aspect-[4/5] sm:aspect-auto sm:min-h-[460px] cursor-pointer shadow-lg hover:shadow-[0_20px_60px_rgba(26,158,140,0.2)] transition-shadow duration-500"
                                >
                                    {/* Photography Background with Hover Zoom */}
                                    <div className="absolute inset-0 z-0">
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/60 to-transparent z-10" />
                                        <img
                                            src={step.image}
                                            alt={step.title}
                                            className="w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-40 transition-all duration-1000 ease-out"
                                        />
                                    </div>

                                    <div className="relative z-20 flex-1 flex flex-col p-8 xl:p-10 text-white justify-end">
                                        <div className="absolute top-8 left-8 right-8 flex justify-between items-start">
                                            <span className={`text-6xl font-black ${activeTab === 'families' ? 'text-white/20 group-hover:text-[#1a9e8c]/80' : 'text-white/20 group-hover:text-blue-400/80'} transition-colors duration-500 tracking-tighter`}>
                                                {step.number}
                                            </span>
                                            {index < currentSteps.length - 1 && (
                                                <div className="hidden lg:flex w-12 h-12 rounded-full border border-white/10 items-center justify-center translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 bg-white/5 backdrop-blur-md transition-all duration-500">
                                                    <ArrowRight className="w-5 h-5 text-white" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            <h3 className="text-2xl font-black mb-3 tracking-tight leading-[1.1] group-hover:text-[#2dd4bf] transition-colors">
                                                {step.title}
                                            </h3>
                                            <p className="text-white/70 font-medium leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-4">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto mb-32">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl lg:text-4xl font-black text-[#111827] tracking-tight mb-4">Frequently Asked Questions</h3>
                        <p className="text-lg text-slate-500 font-medium">Everything you need to know about how the platform operates.</p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="border border-slate-100 rounded-[2rem] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-[#1a9e8c]/20 hover:shadow-[0_20px_60px_rgba(26,158,140,0.08)] transition-all duration-500 overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors focus:outline-none"
                                >
                                    <span className="text-[#111827] font-bold text-lg pr-8">{faq.question}</span>
                                    <div className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-transform duration-300 ${openFaq === index ? 'rotate-180 bg-[#1a9e8c] text-white' : ''}`}>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </button>
                                <AnimatePresence>
                                    {openFaq === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="p-6 pt-0 text-slate-600 font-medium leading-relaxed border-t border-black/5">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Enhanced CTA */}
                <div className="mt-24 p-12 lg:p-20 rounded-[3rem] bg-[#0B1120] relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#1a9e8c]/20 rounded-full blur-3xl opacity-30 pointer-events-none" />
                    <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
                        <div className="max-w-md text-white">
                            <p className="text-2xl font-black mb-2">Ready to experience the difference?</p>
                            <p className="text-white/70 font-medium">Start browsing verified carers or apply to offer your services today.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <Button size="lg" className="h-16 px-8 rounded-2xl bg-white text-[#111827] font-black text-lg hover:bg-slate-100 shadow-2xl transition-all w-full sm:w-auto" asChild>
                                <Link to="/marketplace">
                                    Find a Carer
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Link>
                            </Button>
                            <Button size="lg" className="h-16 px-8 rounded-2xl bg-transparent border-2 border-white/20 text-white font-black text-lg hover:bg-white/10 transition-all w-full sm:w-auto" asChild>
                                <Link to="/signup/carer">
                                    Apply as Carer
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
