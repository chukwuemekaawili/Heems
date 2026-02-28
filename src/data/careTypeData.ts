import { User, Home, Moon, Brain, Heart, Coffee } from "lucide-react";

export interface CareType {
    title: string;
    icon: any;
    image: string;
    heroImage: string;
    description: string;
    summary: string;
    content: string; // paragraphs separated by \n\n

    benefitsIntro?: string;
    benefits: string[];
    benefitsOutro?: string;

    whoIsItFor: string[];
    whoIsItForOutro?: string;

    whoAreTheCarersIntro: string;
    whoAreTheCarers: string[];
    whoAreTheCarersOutro?: string;

    costFactors?: string[];
    costDescription: string;
    costRange: string;

    howToArrangeIntro?: string;
    howToArrangeText?: string;
    howToArrange?: string[];
    isHowToArrangeNumbered?: boolean;
    howToArrangeOutro?: string;

    color: string;
    accentColor: string;
    gallery: string[];
}

export const careTypeData: Record<string, CareType> = {
    "visiting": {
        title: "Visiting Care",
        icon: User,
        image: "/visiting_care.png",
        heroImage: "/visiting_care_hero.png",
        description: "Flexible support from one hour per visit, tailored to your schedule and personal needs.",
        summary: "Visiting care (also referred to as visiting support) involves a carer attending the client’s home for pre-arranged visits to provide practical assistance and social companionship.",
        content: `Visiting care (also referred to as visiting support) involves a carer attending the client’s home for pre-arranged visits to provide practical assistance and social companionship. Visits can range from short check-ins to longer sessions and may be arranged on a regular basis (such as daily or weekly) or as occasional, one-off support, depending on individual circumstances.\n\nThe purpose of visiting care is to help individuals maintain independence, dignity, and quality of life within their own home environment. Support focuses on everyday activities and reassurance, without introducing medical treatment, nursing tasks, or regulated care activities.\n\nVisiting care is often used as a preventative and supportive solution, helping individuals manage day-to-day routines safely while remaining connected to their community and familiar surroundings.`,
        benefitsIntro: "Visiting care offers a range of practical and emotional benefits, including:",
        benefits: [
            "Supporting independence and maintaining daily routines",
            "Flexible scheduling to suit changing needs and preferences",
            "Reducing feelings of loneliness and social isolation",
            "Providing reassurance to individuals and their families",
            "Helping manage everyday tasks before they become overwhelming",
            "Offering support without the commitment of long-term or live-in arrangements"
        ],
        benefitsOutro: "Visiting care can be easily adapted over time as circumstances evolve.",
        whoIsItFor: [
            "Older adults who wish to remain living independently",
            "People who need occasional or regular help with everyday routines",
            "Individuals recovering from illness, injury, or surgery",
            "People experiencing reduced mobility, confidence, or energy levels",
            "Families seeking additional or supplementary home support"
        ],
        whoAreTheCarersIntro: "Carers offering visiting care through Heems are:",
        whoAreTheCarers: [
            "Independent, self-employed professionals",
            "Not employees, agents, or representatives of Heems",
            "Free to choose when, where, and how they work",
            "Verified for identity, right to work, and DBS status prior to listing",
            "Responsible for working strictly within their own skills, training, and experience",
            "Able to accept or decline bookings based on suitability and availability"
        ],
        costFactors: [
            "Geographic location",
            "Length and frequency of visits",
            "Time of day (including evenings or weekends)",
            "The carer’s experience and availability"
        ],
        costRange: "£15 - £35 per hour",
        costDescription: "Rates on Heems typically range from £15 - £35 per hour. Carers set their own rates, which are clearly displayed on the platform before booking, allowing families to make informed and transparent choices.",
        howToArrangeIntro: "Arranging visiting care through Heems is straightforward:",
        howToArrange: [
            "Create a client account on the Heems platform",
            "Search for carers by location, availability, experience, and hourly rate",
            "Message carers directly to discuss needs, expectations, and suitability",
            "Confirm bookings through the platform once agreed",
            "Manage payments securely online and review support after completion."
        ],
        isHowToArrangeNumbered: true,
        howToArrangeOutro: "All care arrangements exist solely between the client and the carer.",
        color: "bg-blue-100 text-blue-700",
        accentColor: "#1d4ed8",
        gallery: ["/visiting_care.png", "/visiting_care_hero.png", "/carer_black_female_1.png", "/carer_client_home.png"]
    },
    "overnight": {
        title: "Overnight Care",
        icon: Moon,
        image: "/overnight_care.png",
        heroImage: "/overnight_care_hero.png",
        description: "Peace of mind through the night, whether for waking support or a reassuring presence.",
        summary: "Overnight care involves a carer staying in the client’s home during nighttime hours to provide reassurance, presence, and support as needed.",
        content: `Overnight care involves a carer staying in the client’s home during nighttime hours to provide reassurance, presence, and support as needed. The carer’s role is to help promote safety, comfort, and peace of mind throughout the night, particularly for individuals who may feel anxious, disoriented, or vulnerable after dark.\n\nSupport may include being on hand to respond to night-time needs such as assistance with toileting, offering reassurance if the client wakes feeling unsettled, helping with mobility around the home, or providing a calm, supportive presence to reduce the risk of falls or confusion. Overnight care can also offer reassurance to family members, knowing someone is available should support be required during the night.\n\nOvernight care may be arranged in two common formats:\n\n• Sleeping nights – the carer is provided with a suitable place to rest but remains available to respond if support is needed during the night.\n• Waking nights – the carer remains awake throughout the night to offer continuous supervision and support.\n\nThe appropriate option is agreed directly between the client and the carer based on individual needs and expectations.`,
        benefitsIntro: "Overnight care offers reassurance and practical support during night-time hours, including:",
        benefits: [
            "Increased safety and reduced risk of falls or incidents at night",
            "Reassurance for individuals who feel anxious, disoriented, or unsettled overnight",
            "Support with night-time routines such as toileting or settling back to sleep",
            "Peace of mind for families knowing someone is present",
            "Allowing family members or household members to rest uninterrupted"
        ],
        benefitsOutro: "Overnight care can be arranged as an ongoing solution or for short-term support during periods of increased need.",
        whoIsItFor: [
            "Individuals who are at higher risk of falls during the night",
            "People experiencing confusion, restlessness, or disrupted sleep",
            "Those who require reassurance or a comforting presence after dark",
            "Individuals recovering from illness or surgery on a non-clinical basis",
            "Families who need night-time support without committing to full live-in care"
        ],
        whoAreTheCarersIntro: "Carers offering overnight care through Heems are:",
        whoAreTheCarers: [
            "Independent, self-employed professionals",
            "Not employed, supervised, or managed by Heems",
            "Clear about whether they provide waking nights, sleeping nights, or both",
            "Responsible for agreeing duties, boundaries, and expectations directly with clients",
            "Not medical or nursing professionals unless independently qualified and engaged separately"
        ],
        costFactors: [
            "Whether the arrangement is a waking or sleeping night",
            "Location and regional demand",
            "Duration of cover and frequency",
            "Carer experience and availability"
        ],
        costRange: "£90 - £230 per night",
        costDescription: "Typical price ranges:\n• Sleeping night: £90–£150 per night\n• Waking night: £170–£230 per night\n\nCarers set their own rates, which are displayed transparently on the platform prior to booking.",
        howToArrangeIntro: "Arranging overnight care through Heems is simple and flexible:",
        howToArrange: [
            "Create a client account on the Heems platform",
            "Search for carers offering overnight availability",
            "Message carers to discuss:\n   ◦ Type of overnight cover (sleeping or waking)\n   ◦ Night-time expectations and routines\n   ◦ Facilities provided (such as a bed or private room for sleeping nights)\n   ◦ Emergency procedures and contact details",
            "Confirm the booking through the platform once terms are agreed",
            "Manage payments securely online"
        ],
        isHowToArrangeNumbered: true,
        color: "bg-indigo-100 text-indigo-700",
        accentColor: "#4338ca",
        gallery: ["/overnight_care.png", "/overnight_care_hero.png", "/carer_black_male_1.png", "/about-care.png"]
    },
    "live-in": {
        title: "Live-In Care",
        icon: Home,
        image: "/live_in_care.png",
        heroImage: "/live_in_care_hero.png",
        description: "Permanent 24/7 support from a dedicated professional who lives with you in your home.",
        summary: "Live-in care involves a carer staying in the client’s home for an agreed period—typically several days or weeks at a time—to provide ongoing, personal support, practical assistance, and companionship.",
        content: `Live-in care involves a carer staying in the client’s home for an agreed period—typically several days or weeks at a time—to provide ongoing, personal support, practical assistance, and companionship.\n\nThis arrangement allows individuals to continue living in their own home while receiving consistent, familiar support throughout the day and night. Live-in care arranged through Heems focuses on everyday assistance and supervision and does not include any regulated care activities.\n\nLive-in arrangements are agreed directly between the client and the carer and are tailored to individual routines, preferences, and household circumstances.`,
        benefitsIntro: "Live-in care offers a flexible alternative to residential settings and may provide:",
        benefits: [
            "Continuity of support from one consistent carer",
            "One-to-one attention tailored to personal routines",
            "The comfort and familiarity of remaining at home",
            "Reduced disruption compared to moving into residential care",
            "Flexible arrangements that can adapt over time",
            "Reassurance for families knowing support is readily available"
        ],
        benefitsOutro: "Live-in care can be arranged short-term (for example, following illness or during recovery) or longer-term, depending on needs and mutual agreement.",
        whoIsItFor: [
            "Individuals requiring regular daily assistance and supervision",
            "People who wish to remain in their own home rather than move into residential care",
            "Couples or households seeking shared, consistent support",
            "Individuals who benefit from ongoing reassurance, structure, and companionship",
            "Families seeking continuity of care without rotating carers"
        ],
        whoIsItForOutro: "Live-in care arranged through Heems is not suitable for complex clinical interventions.",
        whoAreTheCarersIntro: "Carers offering live-in care through Heems are:",
        whoAreTheCarers: [
            "Independent, self-employed professionals",
            "Not employed, supervised, or managed by Heems",
            "Responsible for agreeing working patterns, rest periods, and boundaries directly with clients",
            "Expected to operate within their own experience, training, and competence",
            "Required to decline tasks they are not qualified or able to perform safely"
        ],
        costFactors: [
            "The level and intensity of daily support required",
            "Location and regional demand",
            "The experience of the carer",
            "The duration of the live-in arrangement"
        ],
        costRange: "£900 - £1,500 per week",
        costDescription: "Weekly live-in care typically ranges between £900 and £1,500, while part-time daily support may start from around £160 per day. Rates are set by carers themselves and are clearly displayed on the platform before any booking is confirmed.",
        howToArrangeIntro: "Arranging live-in care through Heems is straightforward:",
        howToArrange: [
            "Create a client account on the Heems platform",
            "Search for carers offering live-in availability",
            "Message carers to discuss:\n   ◦ Daily routines and expectations\n   ◦ Accommodation arrangements (such as a private room and facilities)\n   ◦ Rest periods, boundaries, and time off\n   ◦ Emergency procedures and contact arrangements",
            "Agree terms directly with the carer",
            "Confirm the booking through the platform and manage payments securely"
        ],
        isHowToArrangeNumbered: true,
        color: "bg-emerald-100 text-emerald-700",
        accentColor: "#047857",
        gallery: ["/live_in_care.png", "/live_in_care_hero.png", "/modern_home_care_hero.png", "/carer_black_male_1.png"]
    },
    "palliative": {
        title: "Palliative Support",
        icon: Heart,
        image: "/palliative_care.png",
        heroImage: "/palliative_care_hero.png",
        description: "Compassionate end-of-life care prioritizing dignity, comfort, and family support.",
        summary: "Palliative support focuses on comfort, dignity, emotional reassurance, and everyday support for individuals living with life-limiting or serious health conditions.",
        content: `Palliative support focuses on comfort, dignity, emotional reassurance, and everyday support for individuals living with life-limiting or serious health conditions.The aim is to support quality of life by providing compassionate presence, everyday help, and emotional support during what can be a physically and emotionally challenging time.\n\nSupport may include companionship, reassurance, assistance with daily routines, helping maintain comfort within the home, and offering calm, respectful support aligned with the individual’s wishes and preferences.\n\nThis type of support can also provide reassurance to families, helping to reduce stress and allowing loved ones to focus on meaningful time together, knowing that practical and emotional support is available in the home.`,
        benefitsIntro: "Palliative support can provide meaningful reassurance and stability during a sensitive and emotional period. Key benefits include:",
        benefits: [
            "Emotional reassurance and calm presence, offering comfort to individuals who may feel anxious, vulnerable, or unsettled",
            "Compassionate companionship, helping reduce feelings of isolation and providing gentle, respectful interaction",
            "Reduced stress for families, allowing loved ones to rest or attend to other responsibilities knowing support is in place",
            "Support with comfort-focused daily routines, helping individuals remain settled, relaxed, and dignified in their own home",
            "Continuity and familiarity, ensuring consistent support during a time when change can feel overwhelming"
        ],
        whoIsItFor: [
            "Individuals who are already receiving medical or hospice-led palliative care and require additional non-clinical support at home",
            "People living with serious or life-limiting conditions who wish to remain in familiar surroundings",
            "Families seeking extra practical and emotional support alongside existing healthcare provision",
            "Clients who value comfort, dignity, and companionship rather than clinical intervention."
        ],
        whoAreTheCarersIntro: "Carers offering palliative support through Heems:",
        whoAreTheCarers: [
            "Are independent, self-employed professionals with experience in providing emotional and end-of-life support",
            "Focus on compassionate presence, reassurance, and respect for individual wishes",
            "Operate strictly within non-clinical boundaries, complementing care provided by healthcare professionals",
            "Do not provide medical treatment, nursing care, medication administration, or symptom management",
            "Are responsible for working within their own competence, experience, and agreed role"
        ],
        costRange: "£15 - £35 per hour",
        costDescription: "Independent carers set their own rates. Rates on Heems typically ranges from £15–£35 per hour depending on hours and requirements.",
        howToArrangeText: "Families can arrange non-clinical palliative support through Heems to complement existing medical or hospice care. Independent carers on the platform may provide companionship, emotional reassurance, practical assistance, and help with day-to-day routines, helping individuals remain comfortable in their own home.\n\nAll medical treatment, clinical decisions, and specialist care remain the responsibility of qualified healthcare professionals. Families coordinate directly with their chosen carer to agree expectations, boundaries, schedules, and the type of support required.",
        color: "bg-rose-100 text-rose-700",
        accentColor: "#be123c",
        gallery: ["/palliative_care.png", "/palliative_care_hero.png", "/carer_casual_female_2.png", "/carer_client_home.png"]
    },
    "dementia": {
        title: "Dementia Support",
        icon: Brain,
        image: "/about-care.png",
        heroImage: "/dementia_care_hero.png",
        description: "Expert care focused on routine, safety, and maintaining the highest quality of life.",
        summary: "Dementia support focuses on creating a stable, familiar, and reassuring environment for individuals living with memory loss or cognitive decline.",
        content: `Dementia support focuses on creating a stable, familiar, and reassuring environment for individuals living with memory loss or cognitive decline. The emphasis is on maintaining routine, reducing anxiety, and supporting everyday activities in a way that feels predictable, respectful, and person-centred.\n\nSupport arranged through Heems is practical and emotional in nature, helping individuals navigate daily life while preserving independence wherever possible. This may include gentle prompting, companionship, assistance with familiar routines, and support with everyday activities that promote comfort and confidence.\n\nAll dementia support facilitated through Heems is strictly non-clinical. It does not include diagnosis, treatment, medication administration, behavioural therapy, or any form of medical intervention. Instead, it is intended to complement existing healthcare, social services, or specialist dementia support, working alongside professionals rather than replacing them.\n\nThe overall aim is to help individuals remain in familiar surroundings for as long as possible, while offering families reassurance that support is being provided in a calm, dignified, and consistent way.`,
        benefitsIntro: "Dementia support can help individuals and families by:",
        benefits: [
            "Maintaining routine and structure, which can reduce distress and confusion",
            "Reducing anxiety through familiar faces, environments, and predictable interactions",
            "Encouraging independence, allowing individuals to remain involved in daily activities where possible",
            "Providing reassurance to families, knowing someone is present to offer calm, supportive assistance",
            "Promoting dignity, respect, and familiarity, particularly during moments of uncertainty"
        ],
        whoIsItFor: [
            "Individuals in the early to moderate stages of dementia",
            "People who benefit from consistent routines and familiar support",
            "Those living at home who require non-clinical assistance and companionship",
            "Families seeking additional support alongside existing medical or community services"
        ],
        whoIsItForOutro: "Dementia support arranged via Heems may not be suitable for individuals with advanced dementia, complex behavioural needs, or those requiring specialist clinical intervention.",
        whoAreTheCarersIntro: "Carers offering dementia support through Heems:",
        whoAreTheCarers: [
            "Are independent, self-employed professionals with relevant experience supporting individuals with dementia",
            "Are chosen directly by clients or families based on experience, availability, and compatibility",
            "Work within their own competence, training, and experience at all times",
            "Provide support that is routine-focused, calm, and person-centred",
            "Must decline complex behavioural challenges or any task requiring clinical, specialist, or regulated care"
        ],
        costRange: "£15 - £35 per hour",
        costDescription: "Independent carers set their own rates. Rates on Heems typically Ranges from £15–£35 per hour depending on experience and schedule.",
        howToArrangeIntro: "Families can arrange dementia support through Heems by:",
        howToArrange: [
            "Creating a client account and searching for carers with experience supporting individuals living with dementia",
            "Reviewing carer profiles to understand experience, availability, and approach to routine and reassurance",
            "Messaging carers directly to discuss specific needs, preferences, routines, and any triggers or sensitivities",
            "Booking the same carer consistently, where possible, to promote familiarity and continuity",
            "Adjusting visit times, frequency, or support arrangements as needs change over time"
        ],
        isHowToArrangeNumbered: false,
        howToArrangeOutro: "All arrangements are agreed directly between families and carers, allowing flexibility as circumstances evolve. Heems provides the tools to manage bookings and payments but does not assess needs or supervise care delivery.",
        color: "bg-purple-100 text-purple-700",
        accentColor: "#7e22ce",
        gallery: ["/about-care.png", "/dementia_care_hero.png", "/carer_casual_female_1.png", "/carer_black_female_1.png"]
    },
    "respite": {
        title: "Respite Care",
        icon: Coffee,
        image: "/respite_care.png",
        heroImage: "/respite_care_hero.png",
        description: "Short-term relief for family carers, ensuring your loved one is in safe, professional hands.",
        summary: "Respite care provides short-term, flexible support designed to give family members or informal carers a break from their ongoing caring responsibilities.",
        content: `Respite care provides short-term, flexible support designed to give family members or informal carers a break from their ongoing caring responsibilities. It allows primary carers time to rest, attend personal or professional commitments, or focus on their own wellbeing, knowing that their loved one is supported at home.\n\nRespite care can be arranged in advance or at short notice and may range from a few hours to several days, depending on individual needs. Support is non-clinical and focused on companionship, reassurance, and everyday assistance, helping maintain continuity and routine while regular carers take time away.`,
        benefitsIntro: "Respite care offers essential relief for family members and informal carers by providing temporary, reliable support while they take time to rest or attend to other responsibilities. Key benefits include:",
        benefits: [
            "Prevention of carer fatigue and burnout, helping families sustain caring roles over the long term",
            "Peace of mind, knowing that a trusted carer is present and routines are maintained",
            "Flexibility, whether support is planned in advance or arranged at short notice",
            "Continuity and stability for the person receiving support, reducing disruption and anxiety",
            "Support during unexpected situations, such as illness, emergencies, or personal commitments"
        ],
        benefitsOutro: "By allowing carers time to recharge, respite care helps protect both physical wellbeing and emotional resilience.",
        whoIsItFor: [
            "Family members or informal carers who need a temporary break",
            "Individuals whose usual carer is unavailable due to illness, travel, or work commitments",
            "Planned holidays, short-term absences, or regular scheduled breaks",
            "Situations where additional support is needed during periods of change or increased demand"
        ],
        whoIsItForOutro: "Respite care is designed to supplement existing arrangements and is not intended for clinical, nursing, or specialist care needs.",
        whoAreTheCarersIntro: "Carers offering respite support through Heems:",
        whoAreTheCarers: [
            "Are independent, self-employed professionals",
            "Provide short-term or ad hoc support based on availability",
            "Are selected directly by families according to experience, location, and preferences",
            "Work within agreed boundaries and their own competence",
            "Are not employed, supervised, or managed by Heems"
        ],
        whoAreTheCarersOutro: "All arrangements, expectations, and schedules are agreed directly between the family and the carer.",
        costRange: "£15 - £35 per hour",
        costDescription: "Independent carers set their own rates. Rates on Heems typically ranges from £15–£35 depending on duration and requirements.",
        howToArrangeIntro: "Arranging respite care through Heems is straightforward:",
        howToArrange: [
            "Create a client account on the Heems platform",
            "Search for carers by location, availability, experience, and hourly rate",
            "Message carers directly to discuss needs, expectations, and suitability",
            "Confirm bookings through the platform once agreed",
            "Manage payments securely online and review support after completion."
        ],
        isHowToArrangeNumbered: true,
        howToArrangeOutro: "All care arrangements exist solely between the client and the carer.",
        color: "bg-amber-100 text-amber-700",
        accentColor: "#b45309",
        gallery: ["/respite_care.png", "/respite_care_hero.png", "/carer_client_home.png", "/about-team.png"]
    }
};
