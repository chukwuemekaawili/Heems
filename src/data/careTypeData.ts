
import { User, Home, Moon, Brain, Heart, Coffee } from "lucide-react";

export const careTypeData = {
    "visiting": {
        title: "Visiting Care",
        icon: User,
        image: "/visiting_care.png",
        heroImage: "/visiting_care_hero.png", // Need to ensure these exist or map to placeholders for now
        description: "Flexible support from one hour per visit, tailored to your schedule and personal needs.",
        summary: "Visiting care (also referred to as visiting support) involves a carer attending the client’s home for pre-arranged visits to provide practical assistance and social companionship.",
        content: `Visiting care (also referred to as visiting support) involves a carer attending the client’s home for pre-arranged visits to provide practical assistance and social companionship. Visits can range from short check-ins to longer sessions and may be arranged on a regular basis (such as daily or weekly) or as occasional, one-off support, depending on individual circumstances.
The purpose of visiting care is to help individuals maintain independence, dignity, and quality of life within their own home environment. Support focuses on everyday activities and reassurance, without introducing medical treatment, nursing tasks, or regulated care activities.`,
        benefits: [
            "Supporting independence and maintaining daily routines",
            "Flexible scheduling to suit changing needs and preferences",
            "Reducing feelings of loneliness and social isolation",
            "Providing reassurance to individuals and their families",
            "Helping manage everyday tasks before they become overwhelming",
            "Offering support without the commitment of long-term or live-in arrangements"
        ],
        whoIsItFor: [
            "Older adults who wish to remain living independently",
            "People who need occasional or regular help with everyday routines",
            "Individuals recovering from illness, injury, or surgery",
            "People experiencing reduced mobility, confidence, or energy levels",
            "Families seeking additional or supplementary home support"
        ],
        color: "bg-blue-100 text-blue-700",
        accentColor: "#1d4ed8", // blue-700
        costRange: "£15-£25 per hour",
        costDescription: "Rates vary depending on location, level of support required, and whether care is provided on a regular or occasional basis. Visiting care is a flexible option, with sessions typically ranging from one hour to several hours per visit.",
        gallery: ["/visiting_care.png", "/visiting_care_hero.png", "/carer_female_1.png", "/carer_client_home.png"]
    },
    "live-in": {
        title: "Live-in Care",
        icon: Home,
        image: "/live_in_care.png",
        heroImage: "/live_in_care_hero.png",
        description: "Permanent 24/7 support from a dedicated professional who lives with you in your home.",
        summary: "Live-in care involves a carer staying in the client’s home for an agreed period—typically several days or weeks at a time—to provide ongoing, personal support, practical assistance, and companionship.",
        content: `Live-in care involves a carer staying in the client’s home for an agreed period—typically several days or weeks at a time—to provide ongoing, personal support, practical assistance, and companionship. This arrangement allows individuals to continue living in their own home while receiving consistent, familiar support throughout the day and night.`,
        benefits: [
            "Continuity of support from one consistent carer",
            "One-to-one attention tailored to personal routines",
            "The comfort and familiarity of remaining at home",
            "Reduced disruption compared to moving into residential care",
            "Flexible arrangements that can adapt over time",
            "Reassurance for families knowing support is readily available"
        ],
        whoIsItFor: [
            "Individuals requiring regular daily assistance and supervision",
            "People who wish to remain in their own home rather than move into residential care",
            "Couples or households seeking shared, consistent support",
            "Families seeking continuity of care without rotating carers"
        ],
        color: "bg-emerald-100 text-emerald-700",
        accentColor: "#047857", // emerald-700
        costRange: "£100-£180 per day",
        costDescription: "Live-in care provides 24/7 support and is typically charged at a daily rate. Costs depend on the complexity of support required, location, and whether care is needed for one person or a couple.",
        gallery: ["/live_in_care.png", "/live_in_care_hero.png", "/modern_home_care_hero.png", "/carer_female_2.png"]
    },
    "overnight": {
        title: "Overnight Care",
        icon: Moon,
        image: "/overnight_care.png",
        heroImage: "/overnight_care_hero.png",
        description: "Peace of mind through the night, whether for waking support or a reassuring presence.",
        summary: "Overnight care involves a carer staying in the client’s home during nighttime hours to provide reassurance, presence, and support as needed.",
        content: `Overnight care involves a carer staying in the client’s home during nighttime hours to provide reassurance, presence, and support as needed. The carer’s role is to help promote safety, comfort, and peace of mind throughout the night, particularly for individuals who may feel anxious, disoriented, or vulnerable after dark.
Support may include being on hand to respond to night-time needs such as assistance with toileting, offering reassurance if the client wakes feeling unsettled, helping with mobility around the home, or providing a calm, supportive presence to reduce the risk of falls or confusion.
Overnight care may be arranged in two common formats:

* **Sleeping nights:** the carer is provided with a suitable place to rest but remains available to respond if support is needed during the night.
* **Waking nights:** the carer remains awake throughout the night to offer continuous supervision and support.`,
        benefits: [
            "Increased safety and reduced risk of falls or incidents at night",
            "Reassurance for individuals who feel anxious, disoriented, or unsettled overnight",
            "Support with night-time routines such as toileting or settling back to sleep",
            "Peace of mind for families knowing someone is present",
            "Allowing family members or household members to rest uninterrupted"
        ],
        whoIsItFor: [
            "Individuals who are at higher risk of falls during the night",
            "People experiencing confusion, restlessness, or disrupted sleep",
            "Those who require reassurance or a comforting presence after dark",
            "Families who need night-time support without committing to full live-in care"
        ],
        color: "bg-indigo-100 text-indigo-700",
        accentColor: "#4338ca", // indigo-700
        costRange: "£120-£200 per night",
        costDescription: "The cost of overnight care depends on whether waking night or sleeping night support is required. Rates also vary by location and the complexity of care needs.",
        gallery: ["/overnight_care.png", "/overnight_care_hero.png", "/carer_male_1.png", "/about-care.png"]
    },
    "dementia": {
        title: "Dementia Support",
        icon: Brain,
        image: "/about-care.png",
        heroImage: "/dementia_care_hero.png",
        description: "Expert care focused on routine, safety, and maintaining the highest quality of life.",
        summary: "Dementia support focuses on creating a stable, familiar, and reassuring environment for individuals living with memory loss or cognitive decline.",
        content: `Dementia support focuses on creating a stable, familiar, and reassuring environment for individuals living with memory loss or cognitive decline. The emphasis is on maintaining routine, reducing anxiety, and supporting everyday activities in a way that feels predictable, respectful, and person-centred.`,
        benefits: [
            "Maintaining routine and structure, which can reduce distress and confusion",
            "Reducing anxiety through familiar faces, environments, and predictable interactions",
            "Encouraging independence, allowing individuals to remain involved in daily activities",
            "Providing reassurance to families, knowing someone is present to offer calm, supportive assistance"
        ],
        whoIsItFor: [
            "Individuals in the early to moderate stages of dementia",
            "People who benefit from consistent routines and familiar support",
            "Those living at home who require non-clinical assistance and companionship"
        ],
        color: "bg-purple-100 text-purple-700",
        accentColor: "#7e22ce", // purple-700
        costRange: "£18-£30 per hour",
        costDescription: "Dementia care rates reflect the specialized understanding required. Costs vary by location, the level of support needed, and the structure of care (hourly visits, regular daily support, or live-in arrangements).",
        gallery: ["/about-care.png", "/dementia_care_hero.png", "/carer_casual_female_1.png", "/professional_carers_team.png"]
    },
    "palliative": {
        title: "Palliative Support",
        icon: Heart,
        image: "/palliative_care.png", // New image to be generated
        heroImage: "/palliative_care_hero.png",
        description: "Compassionate end-of-life care prioritizing dignity, comfort, and family support.",
        summary: "Palliative support focuses on comfort, dignity, emotional reassurance, and everyday support for individuals living with life-limiting or serious health conditions.",
        content: `Palliative support focuses on comfort, dignity, emotional reassurance, and everyday support for individuals living with life-limiting or serious health conditions. The aim is to support quality of life by providing compassionate presence, everyday help, and emotional support during what can be a physically and emotionally challenging time.`,
        benefits: [
            "Emotional reassurance and calm presence, offering comfort to individuals who may feel anxious, vulnerable, or unsettled",
            "Compassionate companionship, helping reduce feelings of isolation",
            "Reduced stress for families, allowing loved ones to rest or attend to other responsibilities",
            "Support with comfort-focused daily routines, helping individuals remain settled and dignified"
        ],
        whoIsItFor: [
            "Individuals who are already receiving medical or hospice-led palliative care and require additional non-clinical support at home",
            "People living with serious or life-limiting conditions who wish to remain in familiar surroundings",
            "Families seeking extra practical and emotional support alongside existing healthcare provision"
        ],
        color: "bg-rose-100 text-rose-700",
        accentColor: "#be123c", // rose-700
        costRange: "£20-£35 per hour",
        costDescription: "Palliative support rates reflect the compassionate, sensitive nature of the role. Costs depend on the hours required, location, and whether care is provided on an occasional or regular basis.",
        gallery: ["/palliative_care.png", "/palliative_care_hero.png", "/carer_casual_female_2.png", "/carer_client_home.png"]
    },
    "respite": {
        title: "Respite Care",
        icon: Coffee,
        image: "/respite_care.png", // New image to be generated
        heroImage: "/respite_care_hero.png",
        description: "Short-term relief for family carers, ensuring your loved one is in safe, professional hands.",
        summary: "Respite care provides short-term, flexible support designed to give family members or informal carers a break from their ongoing caring responsibilities.",
        content: `Respite care provides short-term, flexible support designed to give family members or informal carers a break from their ongoing caring responsibilities. It allows primary carers time to rest, attend personal or professional commitments, or focus on their own wellbeing, knowing that their loved one is supported at home.`,
        benefits: [
            "Prevention of carer fatigue and burnout",
            "Peace of mind, knowing that a trusted carer is present and routines are maintained",
            "Flexibility, whether support is planned in advance or arranged at short notice",
            "Continuity and stability for the person receiving support"
        ],
        whoIsItFor: [
            "Family members or informal carers who need a temporary break",
            "Individuals whose usual carer is unavailable due to illness, travel, or work commitments",
            "Planned holidays, short-term absences, or regular scheduled breaks"
        ],
        color: "bg-amber-100 text-amber-700",
        accentColor: "#b45309", // amber-700
        costRange: "£15-£25 per hour",
        costDescription: "Respite care is typically charged at standard visiting care rates. Actual costs depend on the frequency, duration, and location of support, as well as whether care is arranged as occasional or regularly scheduled visits.",
        gallery: ["/respite_care.png", "/respite_care_hero.png", "/carer_client_home.png", "/about-team.png"]
    }
};
