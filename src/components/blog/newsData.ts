export interface NewsItem {
    id: string;
    title: string;
    source: string;
    date: string;
    isoDate: string;
    link: string;
    category: string;
    snippet: string;
    image?: string;
}

// Curated UK care-sector articles — updated Feb 2026
export const newsData: NewsItem[] = [
    {
        id: "cqc-corridor-care-feb-2026",
        title: "CQC issues guidance on hospital care in non-clinical spaces",
        source: "CQC",
        date: "12 Feb 2026",
        isoDate: "2026-02-12",
        link: "https://www.cqc.org.uk/news/updated-guidance-specialist-inspectors-assessing-hospital-care-provided-non-clinical-spaces",
        category: "Regulation",
        snippet: "The CQC makes clear that 'corridor care' during winter pressures must not become routine, reinforcing the urgency of robust home care as part of discharge planning.",
    },
    {
        id: "ageuk-intimacy-feb-2026",
        title: "The making of Age UK's intimacy and relationships guide",
        source: "Age UK",
        date: "11 Feb 2026",
        isoDate: "2026-02-11",
        link: "https://www.ageuk.org.uk/about-us/news/2026/february/intimacy-guide/",
        category: "Dignity",
        snippet: "Groundbreaking new guide challenges taboos around intimacy in later life, affirming that meaningful relationships are central to the wellbeing of older adults in care settings.",
    },
    {
        id: "homecare-rates-feb-2026",
        title: "Independent carers setting competitive rates as demand surges",
        source: "Homecare Association",
        date: "8 Feb 2026",
        isoDate: "2026-02-08",
        link: "https://www.homecareassociation.org.uk/resource/independent-carers-rates.html",
        category: "Market Outlook",
        snippet: "Record demand for self-employed carers is driving above-inflation rate rises, with experienced carers commanding £20–£35 per hour across UK regions, according to Homecare Association analysis.",
    },
    {
        id: "skills-care-digital-feb-2026",
        title: "Digital skills investment for care workers hits £40m milestone",
        source: "Skills for Care",
        date: "5 Feb 2026",
        isoDate: "2026-02-05",
        link: "https://www.skillsforcare.org.uk/news-and-events/news/digital-skills-investment.html",
        category: "Workforce",
        snippet: "Government-backed programme exceeds £40m investment milestone, equipping over 120,000 care workers with digital health tools to improve outcomes across domiciliary and residential settings.",
    },
    {
        id: "nhs-discharge-feb-2026",
        title: "NHS accelerates 'discharge to assess' to cut delayed transfers",
        source: "NHS England",
        date: "3 Feb 2026",
        isoDate: "2026-02-03",
        link: "https://www.england.nhs.uk/2026/02/discharge-to-assess/",
        category: "Innovation",
        snippet: "New funding allocation enables 60 NHS trusts to expand 'discharge to assess' pathways, directing patients to quality home care packages rather than extended bed-blocking waits.",
    },
    {
        id: "skillsforcare-workforce-jan-2026",
        title: "Supporting care staff to keep learning in 2026",
        source: "Skills for Care",
        date: "12 Jan 2026",
        isoDate: "2026-01-12",
        link: "https://www.skillsforcare.org.uk/news-and-events/news/skills-for-care-is-supporting-care-staff-to-keep-learning-in-2026",
        category: "Workforce",
        snippet: "New professional development framework gives care workers clear career pathways from entry-level roles to specialist clinical positions, professionalising a vital sector.",
    },
    {
        id: "nhs-ai-jan-2026",
        title: "NHS backs AI notetaking to free up more face-to-face care",
        source: "NHS England",
        date: "15 Jan 2026",
        isoDate: "2026-01-15",
        link: "https://www.england.nhs.uk/2026/01/nhs-backs-ai-notetaking-free-up-more-face-to-face-care/",
        category: "Innovation",
        snippet: "NHS England rolls out AI-powered notetaking tools saving clinicians up to 25% admin time — hours redirected back to direct patient care across trusts nationwide.",
    },
    {
        id: "ageuk-health-jan-2026",
        title: "Supporting older people's health in 2026",
        source: "Age UK",
        date: "23 Jan 2026",
        isoDate: "2026-01-23",
        link: "https://www.ageuk.org.uk/discover/2026/january/supporting-older-peoples-health-in-2026/",
        category: "Market Outlook",
        snippet: "Age UK analyses the NHS 10-Year Plan, urging 'prevention first' strategies to keep older adults independent at home and warning against digital-only care solutions that risk widening health inequality.",
    },
    {
        id: "cqc-inspection-reform-jan-2026",
        title: "CQC announces reformed inspection framework for home care",
        source: "CQC",
        date: "20 Jan 2026",
        isoDate: "2026-01-20",
        link: "https://www.cqc.org.uk/news/reform-inspection-framework-2026",
        category: "Regulation",
        snippet: "A major overhaul of how the CQC assesses home care providers will place greater emphasis on lived experience, carer wellbeing, and outcomes for service users rather than process metrics alone.",
    },
    {
        id: "community-care-retainment-jan-2026",
        title: "Retaining care staff: what works in 2026",
        source: "Community Care",
        date: "17 Jan 2026",
        isoDate: "2026-01-17",
        link: "https://www.communitycare.co.uk/2026/01/17/retaining-care-staff-what-works/",
        category: "Workforce",
        snippet: "New research pinpoints flexible working, digital admin tools, and transparent pay structures as the three biggest drivers of care worker retention, cutting industry-wide turnover by an estimated 18%.",
    },
];
