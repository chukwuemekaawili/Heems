import { useState } from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
    Home, Brain, Heart, Coffee, Moon, User,
    ArrowRight, ShieldCheck, CheckCircle2, Users
} from "lucide-react";

const careTypes = [
    {
        id: "visiting",
        title: "Visiting Care",
        icon: User,
        image: "/visiting_care.png",
        description: "Flexible support from one hour per visit, tailored to your schedule and personal needs.",
        summary: "Visiting care (also referred to as visiting support) involves a carer attending the client’s home for pre-arranged visits to provide practical assistance and social companionship.",
        benefits: [
            "Supporting independence and maintaining daily routines.",
            "Flexible scheduling to suit changing needs and preferences.",
            "Reducing feelings of loneliness and social isolation."
        ],
        whoIsItFor: [
            "Older adults who wish to remain living independently.",
            "People who need occasional or regular help with everyday routines."
        ],
        color: "bg-blue-100 text-blue-700"
    },
    {
        id: "live-in",
        title: "Live-in Care",
        icon: Home,
        image: "/live_in_care.png",
        description: "Permanent 24/7 support from a dedicated professional who lives with you in your home.",
        summary: "Live-in care involves a carer staying in the client’s home for an agreed period—typically several days or weeks at a time—to provide ongoing, personal support, practical assistance, and companionship.",
        benefits: [
            "Continuity of support from one consistent carer.",
            "One-to-one attention tailored to personal routines.",
            "The comfort and familiarity of remaining at home."
        ],
        whoIsItFor: [
            "Individuals requiring regular daily assistance and supervision.",
            "Couples or households seeking shared, consistent support."
        ],
        color: "bg-emerald-100 text-emerald-700"
    },
    {
        id: "overnight",
        title: "Overnight Care",
        icon: Moon,
        image: "/overnight_care.png",
        description: "Peace of mind through the night, whether for waking support or a reassuring presence.",
        summary: "Overnight care involves a carer staying in the client’s home during nighttime hours to provide reassurance, presence, and support as needed.",
        benefits: [
            "Increased safety and reduced risk of falls or incidents at night.",
            "Reassurance for individuals who feel anxious, disoriented, or unsettled.",
            "Peace of mind for families knowing someone is present."
        ],
        whoIsItFor: [
            "Individuals who are at higher risk of falls during the night.",
            "People experiencing confusion, restlessness, or disrupted sleep."
        ],
        color: "bg-indigo-100 text-indigo-700"
    },
    {
        id: "dementia",
        title: "Dementia Support",
        icon: Brain,
        image: "/about-care.png",
        description: "Expert care focused on routine, safety, and maintaining the highest quality of life.",
        summary: "Dementia support focuses on creating a stable, familiar, and reassuring environment for individuals living with memory loss or cognitive decline.",
        benefits: [
            "Maintaining routine and structure, which can reduce distress and confusion.",
            "Reducing anxiety through familiar faces and environments.",
            "Encouraging independence in daily activities."
        ],
        whoIsItFor: [
            "Individuals in the early to moderate stages of dementia.",
            "People who benefit from consistent routines and familiar support."
        ],
        color: "bg-purple-100 text-purple-700"
    },
    {
        id: "palliative",
        title: "Palliative Support",
        icon: Heart,
        image: "/carer_client_home.png",
        description: "Compassionate end-of-life care prioritizing dignity, comfort, and family support.",
        summary: "Palliative support focuses on comfort, dignity, emotional reassurance, and everyday support for individuals living with life-limiting or serious health conditions.",
        benefits: [
            "Emotional reassurance and calm presence.",
            "Compassionate companionship to reduce isolation.",
            "Reduced stress for families, allowing them to focus on meaningful time together."
        ],
        whoIsItFor: [
            "Individuals receiving medical palliative care who need additional home support.",
            "People living with serious conditions who wish to remain in familiar surroundings."
        ],
        color: "bg-rose-100 text-rose-700"
    },
    {
        id: "respite",
        title: "Respite Care",
        icon: Coffee,
        image: "/about-team.png",
        description: "Short-term relief for family carers, ensuring your loved one is in safe, professional hands.",
        summary: "Respite care provides short-term, flexible support designed to give family members or informal carers a break from their ongoing caring responsibilities.",
        benefits: [
            "Prevention of carer fatigue and burnout.",
            "Peace of mind knowing a trusted carer is present.",
            "Flexibility for short-term absences or holidays."
        ],
        whoIsItFor: [
            "Family members or informal carers who need a temporary break.",
            "Individuals whose usual carer is unavailable."
        ],
        color: "bg-amber-100 text-amber-700"
    }
];

const TypesOfCare = () => {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="pt-24 lg:pt-32">
                {/* Hero Section */}
                <section className="container mx-auto px-6 lg:px-12 py-16 lg:py-24 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a9e8c]/5 border border-[#1a9e8c]/10 text-[#1a9e8c] text-xs font-bold uppercase tracking-widest mb-8">
                            <ShieldCheck className="w-3 h-3" />
                            Comprehensive Support
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black text-[#111827] mb-8 tracking-tighter leading-[0.95]">
                            Care tailored to <br />
                            <span className="text-[#1a9e8c]">your specific needs.</span>
                        </h1>
                        <p className="text-xl text-[#4B5563] font-medium leading-relaxed max-w-2xl mx-auto mb-10">
                            From hourly visits to full-time live-in support, Heems connects you with carers vetted for every situation.
                        </p>
                    </div>
                </section>

                {/* Care Types Grid */}
                <section className="bg-slate-50 py-24 border-y border-black/[0.03]">
                    <div className="container mx-auto px-6 lg:px-12">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {careTypes.map((type, index) => (
                                <div key={index} className="bg-white p-10 rounded-3xl border border-black/5 hover:border-[#1a9e8c]/30 hover:shadow-xl transition-all duration-500 group">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${type.color}`}>
                                        <type.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-2xl font-black text-[#111827] mb-4 group-hover:text-[#1a9e8c] transition-colors">{type.title}</h3>
                                    <p className="text-lg text-[#4B5563] font-medium leading-relaxed mb-8 h-20 overflow-hidden line-clamp-3">
                                        {type.description}
                                    </p>

                                    <Button asChild variant="link" className="p-0 h-auto font-bold text-[#111827] hover:text-[#1a9e8c] transition-colors">
                                        <Link to={`/types-of-care/${type.id}`}>
                                            Learn More <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 lg:py-32">
                    <div className="container mx-auto px-6 lg:px-12">
                        <div className="bg-[#111827] rounded-[3rem] p-12 lg:p-24 text-white text-center relative overflow-hidden">
                            <div className="relative z-10 max-w-2xl mx-auto">
                                <h2 className="text-4xl lg:text-6xl font-black mb-8 tracking-tighter">Not sure what you need?</h2>
                                <p className="text-white/60 text-xl font-medium mb-12">Our care experts are here to guide you through the options and help you find the perfect match.</p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button className="h-16 px-12 rounded-2xl bg-[#1a9e8c] text-white font-black hover:bg-[#15806c] shadow-2xl transition-all text-lg" asChild>
                                        <Link to="/marketplace">Browse Carers</Link>
                                    </Button>
                                    <Button variant="outline" className="h-16 px-12 rounded-2xl bg-transparent border-white/20 text-white font-black hover:bg-white hover:text-[#111827] transition-all text-lg" asChild>
                                        <Link to="/contact">Speak to an Advisor</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
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

export default TypesOfCare;
