import { useState, useRef, useEffect } from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import {
    Home, Brain, Heart, Coffee, Moon, User,
    ArrowRight, ShieldCheck, CheckCircle2, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const careDetails = [
    {
        id: "visiting",
        title: "Visiting Care",
        icon: User,
        color: "bg-blue-100 text-blue-700 hover:bg-blue-200",
        activeColor: "bg-blue-600 text-white",
        content: {
            whatIsIt: `Visiting care (also referred to as visiting support) involves a carer attending the client’s home for pre-arranged visits to provide practical assistance and social companionship. Visits can range from short check-ins to longer sessions and may be arranged on a regular basis (such as daily or weekly) or as occasional, one-off support, depending on individual circumstances.

The purpose of visiting care is to help individuals maintain independence, dignity, and quality of life within their own home environment. Support focuses on everyday activities and reassurance, without introducing medical treatment, nursing tasks, or regulated care activities.

Visiting care is often used as a preventative and supportive solution, helping individuals manage day-to-day routines safely while remaining connected to their community and familiar surroundings.`,
            benefits: [
                "Supporting independence and maintaining daily routines",
                "Flexible scheduling to suit changing needs and preferences",
                "Reducing feelings of loneliness and social isolation",
                "Providing reassurance to individuals and their families",
                "Helping manage everyday tasks before they become overwhelming",
                "Offering support without the commitment of long-term or live-in arrangements"
            ],
            benefitsNote: "Visiting care can be easily adapted over time as circumstances evolve.",
            suitableFor: [
                "Older adults who wish to remain living independently",
                "People who need occasional or regular help with everyday routines",
                "Individuals recovering from illness, injury, or surgery",
                "People experiencing reduced mobility, confidence, or energy levels",
                "Families seeking additional or supplementary home support"
            ],
            whoAreCarers: [
                "Independent, self-employed professionals",
                "Not employees, agents, or representatives of Heems",
                "Free to choose when, where, and how they work",
                "Verified for identity, right to work, and DBS status prior to listing",
                "Responsible for working strictly within their own skills, training, and experience",
                "Able to accept or decline bookings based on suitability and availability"
            ],
            costTitle: "How Much Does Visiting Care Cost?",
            costDesc: `The cost of visiting care varies depending on factors such as geographic location, length and frequency of visits, time of day (including evenings or weekends), and the carer’s experience and availability.`,
            costEstimate: "Rates on Heems typically range from £15 - £35 per hour.",
            costNote: "Carers set their own rates, which are clearly displayed on the platform before booking, allowing families to make informed and transparent choices.",
            arranging: [
                "Create a client account on the Heems platform",
                "Search for carers by location, availability, experience, and hourly rate",
                "Message carers directly to discuss needs, expectations, and suitability",
                "Confirm bookings through the platform once agreed",
                "Manage payments securely online and review support after completion."
            ],
            arrangingNote: "All care arrangements exist solely between the client and the carer."
        }
    },
    {
        id: "overnight",
        title: "Overnight Care",
        icon: Moon,
        color: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200",
        activeColor: "bg-indigo-600 text-white",
        content: {
            whatIsIt: `Overnight care involves a carer staying in the client’s home during nighttime hours to provide reassurance, presence, and support as needed. The carer’s role is to help promote safety, comfort, and peace of mind throughout the night, particularly for individuals who may feel anxious, disoriented, or vulnerable after dark.

Support may include being on hand to respond to night-time needs such as assistance with toileting, offering reassurance if the client wakes feeling unsettled, helping with mobility around the home, or providing a calm, supportive presence to reduce the risk of falls or confusion. Overnight care can also offer reassurance to family members, knowing someone is available should support be required during the night.

Overnight care may be arranged in two common formats:
• **Sleeping nights** – the carer is provided with a suitable place to rest but remains available to respond if support is needed during the night.
• **Waking nights** – the carer remains awake throughout the night to offer continuous supervision and support.

The appropriate option is agreed directly between the client and the carer based on individual needs and expectations.`,
            benefits: [
                "Increased safety and reduced risk of falls or incidents at night",
                "Reassurance for individuals who feel anxious, disoriented, or unsettled overnight",
                "Support with night-time routines such as toileting or settling back to sleep",
                "Peace of mind for families knowing someone is present",
                "Allowing family members or household members to rest uninterrupted"
            ],
            benefitsNote: "Overnight care can be arranged as an ongoing solution or for short-term support during periods of increased need.",
            suitableFor: [
                "Individuals who are at higher risk of falls during the night",
                "People experiencing confusion, restlessness, or disrupted sleep",
                "Those who require reassurance or a comforting presence after dark",
                "Individuals recovering from illness or surgery on a non-clinical basis",
                "Families who need night-time support without committing to full live-in care"
            ],
            whoAreCarers: [
                "Independent, self-employed professionals",
                "Not employed, supervised, or managed by Heems",
                "Clear about whether they provide waking nights, sleeping nights, or both",
                "Responsible for agreeing duties, boundaries, and expectations directly with clients",
                "Not medical or nursing professionals unless independently qualified and engaged separately"
            ],
            costTitle: "How Much Does Overnight Care Cost?",
            costDesc: `The cost of overnight care varies depending on whether the arrangement is a waking or sleeping night, location and regional demand, duration of cover and frequency, and carer experience and availability.`,
            costEstimate: "Sleeping night: £90–£150 per night \n Waking night: £170–£230 per night",
            costNote: "Carers set their own rates, which are displayed transparently on the platform prior to booking.",
            arranging: [
                "Create a client account on the Heems platform",
                "Search for carers offering overnight availability",
                "Message carers to discuss type of cover, night-time routines, facilities provided, and emergency procedures",
                "Confirm the booking through the platform once terms are agreed",
                "Manage payments securely online"
            ]
        }
    },
    {
        id: "live-in",
        title: "Live-In Care",
        icon: Home,
        color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
        activeColor: "bg-emerald-600 text-white",
        content: {
            whatIsIt: `Live-in care involves a carer staying in the client’s home for an agreed period—typically several days or weeks at a time—to provide ongoing, personal support, practical assistance, and companionship.

This arrangement allows individuals to continue living in their own home while receiving consistent, familiar support throughout the day and night. Live-in care arranged through Heems focuses on everyday assistance and supervision and does not include any regulated care activities.

Live-in arrangements are agreed directly between the client and the carer and are tailored to individual routines, preferences, and household circumstances.`,
            benefits: [
                "Continuity of support from one consistent carer",
                "One-to-one attention tailored to personal routines",
                "The comfort and familiarity of remaining at home",
                "Reduced disruption compared to moving into residential care",
                "Flexible arrangements that can adapt over time",
                "Reassurance for families knowing support is readily available"
            ],
            benefitsNote: "Live-in care can be arranged short-term (for example, following illness or during recovery) or longer-term, depending on needs and mutual agreement.",
            suitableFor: [
                "Individuals requiring regular daily assistance and supervision",
                "People who wish to remain in their own home rather than move into residential care",
                "Couples or households seeking shared, consistent support",
                "Individuals who benefit from ongoing reassurance, structure, and companionship",
                "Families seeking continuity of care without rotating carers"
            ],
            suitableForNote: "Live-in care arranged through Heems is not suitable for complex clinical interventions.",
            whoAreCarers: [
                "Independent, self-employed professionals",
                "Not employed, supervised, or managed by Heems",
                "Responsible for agreeing working patterns, rest periods, and boundaries directly with clients",
                "Expected to operate within their own experience, training, and competence",
                "Required to decline tasks they are not qualified or able to perform safely"
            ],
            costTitle: "How Much Does Live-In Care Cost?",
            costDesc: `Live-in care costs vary depending on the level and intensity of daily support required, location and regional demand, the experience of the carer, and the duration of the live-in arrangement.`,
            costEstimate: "Weekly live-in care typically ranges between £900 and £1,500, while part-time daily support may start from around £160 per day.",
            costNote: "Rates are set by carers themselves and are clearly displayed on the platform before any booking is confirmed.",
            arranging: [
                "Create a client account on the Heems platform",
                "Search for carers offering live-in availability",
                "Message carers to discuss daily routines, accommodation arrangements, rest periods, and emergency procedures",
                "Agree terms directly with the carer",
                "Confirm the booking through the platform and manage payments securely"
            ]
        }
    },
    {
        id: "palliative",
        title: "Palliative Support",
        icon: Heart,
        color: "bg-rose-100 text-rose-700 hover:bg-rose-200",
        activeColor: "bg-rose-600 text-white",
        content: {
            whatIsIt: `Palliative support focuses on comfort, dignity, emotional reassurance, and everyday support for individuals living with life-limiting or serious health conditions. The aim is to support quality of life by providing compassionate presence, everyday help, and emotional support during what can be a physically and emotionally challenging time.

Support may include companionship, reassurance, assistance with daily routines, helping maintain comfort within the home, and offering calm, respectful support aligned with the individual’s wishes and preferences.

This type of support can also provide reassurance to families, helping to reduce stress and allowing loved ones to focus on meaningful time together, knowing that practical and emotional support is available in the home.`,
            benefits: [
                "Emotional reassurance and calm presence, offering comfort to individuals who may feel anxious, vulnerable, or unsettled",
                "Compassionate companionship, helping reduce feelings of isolation and providing gentle, respectful interaction",
                "Reduced stress for families, allowing loved ones to rest or attend to other responsibilities knowing support is in place",
                "Support with comfort-focused daily routines, helping individuals remain settled, relaxed, and dignified in their own home",
                "Continuity and familiarity, ensuring consistent support during a time when change can feel overwhelming"
            ],
            benefitsNote: "Palliative support can provide meaningful reassurance and stability during a sensitive and emotional period.",
            suitableFor: [
                "Individuals who are already receiving medical or hospice-led palliative care and require additional non-clinical support at home",
                "People living with serious or life-limiting conditions who wish to remain in familiar surroundings",
                "Families seeking extra practical and emotional support alongside existing healthcare provision",
                "Clients who value comfort, dignity, and companionship rather than clinical intervention"
            ],
            whoAreCarers: [
                "Are independent, self-employed professionals with experience in providing emotional and end-of-life support",
                "Focus on compassionate presence, reassurance, and respect for individual wishes",
                "Operate strictly within non-clinical boundaries, complementing care provided by healthcare professionals",
                "Do not provide medical treatment, nursing care, medication administration, or symptom management",
                "Are responsible for working within their own competence, experience, and agreed role"
            ],
            costTitle: "Cost of Palliative Support",
            costDesc: `Independent carers set their own rates.`,
            costEstimate: "Rates on Heems typically ranges from £15–£35 per hour depending on hours and requirements.",
            arranging: [
                "Families can arrange non-clinical palliative support through Heems to complement existing medical or hospice care.",
                "Independent carers on the platform may provide companionship, emotional reassurance, practical assistance, and help with day-to-day routines, helping individuals remain comfortable in their own home.",
                "Families coordinate directly with their chosen carer to agree expectations, boundaries, schedules, and the type of support required."
            ],
            arrangingNote: "All medical treatment, clinical decisions, and specialist care remain the responsibility of qualified healthcare professionals."
        }
    },
    {
        id: "dementia",
        title: "Dementia Support",
        icon: Brain,
        color: "bg-purple-100 text-purple-700 hover:bg-purple-200",
        activeColor: "bg-purple-600 text-white",
        content: {
            whatIsIt: `Dementia support focuses on creating a stable, familiar, and reassuring environment for individuals living with memory loss or cognitive decline. The emphasis is on maintaining routine, reducing anxiety, and supporting everyday activities in a way that feels predictable, respectful, and person-centred.

Support arranged through Heems is practical and emotional in nature, helping individuals navigate daily life while preserving independence wherever possible. This may include gentle prompting, companionship, assistance with familiar routines, and support with everyday activities that promote comfort and confidence.

All dementia support facilitated through Heems is strictly non-clinical. It does not include diagnosis, treatment, medication administration, behavioural therapy, or any form of medical intervention. Instead, it is intended to complement existing healthcare, social services, or specialist dementia support, working alongside professionals rather than replacing them.

The overall aim is to help individuals remain in familiar surroundings for as long as possible, while offering families reassurance that support is being provided in a calm, dignified, and consistent way.`,
            benefits: [
                "Maintaining routine and structure, which can reduce distress and confusion",
                "Reducing anxiety through familiar faces, environments, and predictable interactions",
                "Encouraging independence, allowing individuals to remain involved in daily activities where possible",
                "Providing reassurance to families, knowing someone is present to offer calm, supportive assistance",
                "Promoting dignity, respect, and familiarity, particularly during moments of uncertainty"
            ],
            suitableFor: [
                "Individuals in the early to moderate stages of dementia",
                "People who benefit from consistent routines and familiar support",
                "Those living at home who require non-clinical assistance and companionship",
                "Families seeking additional support alongside existing medical or community services"
            ],
            suitableForNote: "Dementia support arranged via Heems may not be suitable for individuals with advanced dementia, complex behavioural needs, or those requiring specialist clinical intervention.",
            whoAreCarers: [
                "Are independent, self-employed professionals with relevant experience supporting individuals with dementia",
                "Are chosen directly by clients or families based on experience, availability, and compatibility",
                "Work within their own competence, training, and experience at all times",
                "Provide support that is routine-focused, calm, and person-centred",
                "Must decline complex behavioural challenges or any task requiring clinical, specialist, or regulated care"
            ],
            costTitle: "Cost of Dementia Support",
            costDesc: `Independent carers set their own rates.`,
            costEstimate: "Rates on Heems typically ranges from £15–£35 per hour depending on experience and schedule.",
            arranging: [
                "Creating a client account and searching for carers with experience supporting individuals living with dementia",
                "Reviewing carer profiles to understand experience, availability, and approach to routine and reassurance",
                "Messaging carers directly to discuss specific needs, preferences, routines, and any triggers or sensitivities",
                "Booking the same carer consistently, where possible, to promote familiarity and continuity",
                "Adjusting visit times, frequency, or support arrangements as needs change over time"
            ],
            arrangingNote: "All arrangements are agreed directly between families and carers, allowing flexibility as circumstances evolve. Heems provides the tools to manage bookings and payments but does not assess needs or supervise care delivery."
        }
    },
    {
        id: "respite",
        title: "Respite Care",
        icon: Coffee,
        color: "bg-amber-100 text-amber-700 hover:bg-amber-200",
        activeColor: "bg-amber-600 text-white",
        content: {
            whatIsIt: `Respite care provides short-term, flexible support designed to give family members or informal carers a break from their ongoing caring responsibilities. It allows primary carers time to rest, attend personal or professional commitments, or focus on their own wellbeing, knowing that their loved one is supported at home.

Respite care can be arranged in advance or at short notice and may range from a few hours to several days, depending on individual needs. Support is non-clinical and focused on companionship, reassurance, and everyday assistance, helping maintain continuity and routine while regular carers take time away.`,
            benefits: [
                "Prevention of carer fatigue and burnout, helping families sustain caring roles over the long term",
                "Peace of mind, knowing that a trusted carer is present and routines are maintained",
                "Flexibility, whether support is planned in advance or arranged at short notice",
                "Continuity and stability for the person receiving support, reducing disruption and anxiety",
                "Support during unexpected situations, such as illness, emergencies, or personal commitments"
            ],
            benefitsNote: "By allowing carers time to recharge, respite care helps protect both physical wellbeing and emotional resilience.",
            suitableFor: [
                "Family members or informal carers who need a temporary break",
                "Individuals whose usual carer is unavailable due to illness, travel, or work commitments",
                "Planned holidays, short-term absences, or regular scheduled breaks",
                "Situations where additional support is needed during periods of change or increased demand"
            ],
            suitableForNote: "Respite care is designed to supplement existing arrangements and is not intended for clinical, nursing, or specialist care needs.",
            whoAreCarers: [
                "Are independent, self-employed professionals",
                "Provide short-term or ad hoc support based on availability",
                "Are selected directly by families according to experience, location, and preferences",
                "Work within agreed boundaries and their own competence",
                "Are not employed, supervised, or managed by Heems"
            ],
            contactNote: "All arrangements, expectations, and schedules are agreed directly between the family and the carer.",
            costTitle: "Cost of Respite Care",
            costDesc: `Independent carers set their own rates.`,
            costEstimate: "Rates on Heems typically ranges from £15–£35 depending on duration and requirements.",
            arranging: [
                "Create a client account on the Heems platform",
                "Search for carers by location, availability, experience, and hourly rate",
                "Message carers directly to discuss needs, expectations, and suitability",
                "Confirm bookings through the platform once agreed",
                "Manage payments securely online and review support after completion."
            ],
            arrangingNote: "All care arrangements exist solely between the client and the carer."
        }
    }
];

const TypesOfCare = () => {
    const { hash } = useLocation();

    // Determine initially active tab based on URL hash (e.g. #dementia), fallback to first type
    const initialActive = hash ? hash.replace('#', '') : careDetails[0].id;
    const [activeTab, setActiveTab] = useState(initialActive);

    const activeContent = careDetails.find(c => c.id === activeTab) || careDetails[0];

    // Scroll to section logic handled if they arrive on the page with a hash
    useEffect(() => {
        if (hash) {
            const cleanHash = hash.replace('#', '');
            if (careDetails.some(c => c.id === cleanHash)) {
                setActiveTab(cleanHash);
                setTimeout(() => {
                    const el = document.getElementById('care-details');
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 150);
            }
        }
    }, [hash]);

    const handleTabClick = (id: string) => {
        setActiveTab(id);
        const isMobile = window.innerWidth < 1024;
        if (isMobile) {
            setTimeout(() => {
                const el = document.getElementById('care-details');
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 50);
        }
    };


    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Header />
            <main className="pt-24 lg:pt-32">

                {/* Modern Thin Header */}
                <section className="bg-white border-b border-black/5 pb-12 pt-8">
                    <div className="container mx-auto px-6 lg:px-12 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a9e8c]/5 border border-[#1a9e8c]/10 text-[#1a9e8c] text-xs font-bold uppercase tracking-widest mb-6">
                            <ShieldCheck className="w-3 h-3" />
                            Comprehensive Support
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black text-[#111827] mb-6 tracking-tight leading-tight">
                            Explore the Types of Care
                        </h1>
                        <p className="text-lg lg:text-xl text-[#4B5563] font-medium max-w-2xl mx-auto">
                            Read about the flexible, transparent, and non-clinical care solutions available through our vetted network of independent professionals.
                        </p>
                    </div>
                </section>

                <section className="container mx-auto px-4 lg:px-8 py-12 lg:py-20" id="care-details">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">

                        {/* LEFT SIDEBAR: Interactive Tabs */}
                        <div className="lg:w-1/3 flex-shrink-0">
                            <div className="sticky top-32 space-y-3">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-4 mb-6">Select a Care Category</h3>
                                {careDetails.map((type) => {
                                    const isActive = activeTab === type.id;
                                    return (
                                        <button
                                            key={type.id}
                                            onClick={() => handleTabClick(type.id)}
                                            className={cn(
                                                "w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-300 border-2",
                                                isActive
                                                    ? type.activeColor + " border-transparent shadow-lg scale-[1.02]"
                                                    : "bg-white border-transparent hover:border-slate-200 text-slate-700 hover:shadow-md"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                                                isActive ? "bg-white/20 text-white" : type.color
                                            )}>
                                                <type.icon className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1 font-bold text-lg">
                                                {type.title}
                                            </div>
                                            <ChevronRight className={cn(
                                                "w-5 h-5 transition-transform",
                                                isActive ? "text-white opacity-100" : "text-slate-300 opacity-0 -translate-x-4"
                                            )} />
                                        </button>
                                    );
                                })}

                                {/* Sidebar CTA */}
                                <div className="mt-8 bg-[#111827] rounded-3xl p-8 text-white text-center hidden lg:block">
                                    <h4 className="font-black text-xl mb-4">Ready to start?</h4>
                                    <p className="text-white/70 text-sm font-medium mb-6">Connect with vetted carers available in your area today.</p>
                                    <Button asChild className="w-full bg-[#1a9e8c] hover:bg-[#15806c] text-white font-bold rounded-xl h-12">
                                        <Link to="/marketplace">Find Carers</Link>
                                    </Button>
                                    <Button asChild variant="link" className="w-full font-bold text-white hover:text-[#1a9e8c] mt-2">
                                        <Link to="/contact">Speak to an Advisor</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT VIEW: Exhaustive Content Body */}
                        <div className="lg:w-2/3">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                    className="bg-white rounded-[2rem] p-8 lg:p-14 shadow-sm border border-black/5"
                                >
                                    {/* Content Header */}
                                    <div className="flex items-center gap-4 mb-10 pb-10 border-b border-slate-100">
                                        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shrink-0", activeContent.color)}>
                                            <activeContent.icon className="w-8 h-8" />
                                        </div>
                                        <h2 className="text-3xl lg:text-4xl font-black text-[#111827]">
                                            {activeContent.title}
                                        </h2>
                                    </div>

                                    <div className="prose prose-lg prose-slate max-w-none prose-headings:font-black prose-headings:text-[#111827] prose-p:text-[#4B5563] prose-p:leading-relaxed prose-li:text-[#4B5563]">

                                        {/* What Is It? */}
                                        <h3 className="text-2xl mt-0">What Is {activeContent.title}?</h3>
                                        <div className="whitespace-pre-wrap mb-12 text-[17px]">
                                            {activeContent.content.whatIsIt}
                                        </div>

                                        {/* Benefits */}
                                        <div className="bg-slate-50 rounded-2xl p-8 mb-12 border border-slate-100">
                                            <h3 className="text-xl mt-0 mb-6 flex items-center gap-2">
                                                <Heart className="w-6 h-6 text-[#1a9e8c]" />
                                                Benefits of {activeContent.title}
                                            </h3>
                                            <ul className="space-y-4 mb-0">
                                                {activeContent.content.benefits.map((benefit, i) => (
                                                    <li key={i} className="flex gap-3 items-start my-0">
                                                        <CheckCircle2 className="w-5 h-5 text-[#1a9e8c] shrink-0 mt-1" />
                                                        <span className="font-medium">{benefit}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            {activeContent.content.benefitsNote && (
                                                <p className="mt-6 mb-0 text-sm font-bold text-slate-500 italic">
                                                    {activeContent.content.benefitsNote}
                                                </p>
                                            )}
                                        </div>

                                        {/* Who is it for? */}
                                        <h3 className="text-xl mb-6">Who Is {activeContent.title} Suitable For?</h3>
                                        <ul className="list-disc pl-5 mb-6 space-y-2">
                                            {activeContent.content.suitableFor.map((item, i) => (
                                                <li key={i} className="font-medium">{item}</li>
                                            ))}
                                        </ul>
                                        {activeContent.content.suitableForNote && (
                                            <p className="mb-12 text-sm font-bold text-slate-500 italic bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                {activeContent.content.suitableForNote}
                                            </p>
                                        )}

                                        {/* Who are the carers? */}
                                        <div className="bg-[#111827] text-white rounded-2xl p-8 mb-12">
                                            <h3 className="text-xl text-white mt-0 mb-6">Who Are the Carers?</h3>
                                            <p className="text-white/70 mb-6">Carers offering {activeContent.title.toLowerCase()} through Heems are:</p>
                                            <ul className="space-y-4 mb-0 text-white/90">
                                                {activeContent.content.whoAreCarers.map((item, i) => (
                                                    <li key={i} className="flex gap-3 items-start my-0">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0 mt-2.5" />
                                                        <span className="font-medium">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            {activeContent.content.contactNote && (
                                                <p className="mt-6 mb-0 text-white/60 italic text-sm">
                                                    {activeContent.content.contactNote}
                                                </p>
                                            )}
                                        </div>

                                        {/* Costs & Arranging block side by side on large */}
                                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                                            {/* Cost Section */}
                                            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                                                <h4 className="text-emerald-900 font-bold mb-4">{activeContent.content.costTitle}</h4>
                                                <p className="text-emerald-800/80 text-sm mb-4">
                                                    {activeContent.content.costDesc}
                                                </p>
                                                <div className="bg-white rounded-xl p-4 border border-emerald-100 mb-4 whitespace-pre-wrap">
                                                    <span className="font-black text-emerald-700 block">
                                                        {activeContent.content.costEstimate}
                                                    </span>
                                                </div>
                                                {activeContent.content.costNote && (
                                                    <p className="text-emerald-800/60 text-xs font-bold leading-relaxed">
                                                        {activeContent.content.costNote}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Arranging Section */}
                                            <div>
                                                <h4 className="text-lg font-bold mb-6">How to Arrange {activeContent.title}</h4>
                                                <ol className="list-decimal pl-5 space-y-3 mb-6">
                                                    {activeContent.content.arranging.map((step, i) => (
                                                        <li key={i} className="text-sm font-medium text-slate-700">{step}</li>
                                                    ))}
                                                </ol>
                                                {activeContent.content.arrangingNote && (
                                                    <p className="text-xs font-bold text-slate-500 italic">
                                                        {activeContent.content.arrangingNote}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Bottom Action inside tab for mobile convenience */}
                                        <div className="pt-8 mt-8 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                                            <Button asChild className="bg-[#1a9e8c] hover:bg-[#15806c] text-white font-bold rounded-xl h-14 px-8 text-lg">
                                                <Link to="/marketplace">Find {activeContent.title} Carers</Link>
                                            </Button>
                                        </div>

                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
};

export default TypesOfCare;
