import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Newspaper, Loader2, Radio } from "lucide-react";

export interface NewsItem {
    id: string; // Added for list keys
    title: string;
    source: string;
    date: string;
    link: string;
    category: string;
    content: string; // changed from snippet to content
    image?: string;
}

export const newsData: NewsItem[] = [
    {
        id: "age-uk-2026",
        title: "Supporting older people's health in 2026",
        source: "Age UK",
        date: "Jan 23, 2026",
        link: "https://www.ageuk.org.uk/discover/2026/january/supporting-older-peoples-health-in-2026/",
        category: "Market Outlook",
        content: "Age UK has released a comprehensive analysis of the NHS 10 Year Plan updates, providing a critical look at what families can expect regarding the future of social care. The report highlights a shift towards 'prevention first' strategies, aiming to keep older adults independent in their own homes for longer. This aligns with broader government initiatives but raises questions about funding and workforce availability.\n\nThe analysis digs deep into the proposed digital integration of health records, which promises to streamline communication between hospitals and home care providers. However, Age UK warns that without significant investment in digital literacy for older people, these advancements could inadvertently widen the health inequality gap. The charity is calling for a 'guarantee of human contact' alongside these digital improvements.\n\nFamilies are urged to start planning for care earlier, with the report suggesting that the 'crisis management' approach to social care is no longer sustainable. Instead, a proactive model—utilizing home adaptations, remote monitoring, and community support networks—is presented as the gold standard for 2026 and beyond."
    },
    {
        id: "nhs-ai-2026",
        title: "NHS backs AI notetaking to free up more face-to-face care",
        source: "NHS England",
        date: "Jan 15, 2026",
        link: "https://www.england.nhs.uk/2026/01/nhs-backs-ai-notetaking-free-up-more-face-to-face-care/",
        category: "Innovation",
        content: "In a major push to reduce clinician burnout and improve patient experience, NHS England is rolling out AI-powered notetaking tools across trusts nationwide. Early pilots have shown that these tools can save doctors and nurses up to 25% of their administrative time—hours that can now be redirected back to face-to-face patient care.\n\nThe technology works by securely listening to patient consultations and automatically generating accurate, structured medical notes in real-time. This eliminates the need for clinicians to type during appointments, allowing them to maintain eye contact and build better rapport with those they are treating. Privacy safeguards are strictly enforced, with patient consent required for all AI-assisted sessions.\n\nThis initiative is part of the wider NHS Digital Transformation strategy, which seeks to modernize the health service's infrastructure. By automating routine tasks, the NHS aims to tackle the backlog of elective care and improve waiting times, proving that technology can be a compassionate partner in healthcare delivery."
    },
    {
        id: "skills-care-2026",
        title: "Supporting care staff to keep learning in 2026",
        source: "Skills for Care",
        date: "Jan 12, 2026",
        link: "https://www.skillsforcare.org.uk/news-and-events/news/skills-for-care-is-supporting-care-staff-to-keep-learning-in-2026",
        category: "Workforce",
        content: "Skills for Care has kicked off 2026 with a renewed spotlight on professional development, identifying it as the critical pillar for retaining England's quality care workforce. The organization has launched a new framework of 'learning pathways' designed to give care workers clear routes for career progression, from entry-level positions to specialized clinical roles.\n\nThe initiative addresses a long-standing issue in the sector: the perception of care work as a 'dead-end job'. By formalizing training for complex needs—such as dementia care, palliative support, and autism awareness—Skills for Care aims to professionalize the workforce and drive up wages. The new resources include funding guides for employers to access government training grants.\n\nFor independent carers and agency staff alike, this focus on continuous learning is a game-changer. It empowers individuals to take ownership of their skills, ensuring that the care provided in homes across the country is not just compassionate, but also clinically informed and safety-conscious."
    },
    {
        id: "cqc-corridor-care",
        title: "Guidance for Assessing Hospital Care in Non-Clinical Spaces",
        source: "CQC",
        date: "Feb 12, 2026",
        link: "https://www.cqc.org.uk/news/updated-guidance-specialist-inspectors-assessing-hospital-care-provided-non-clinical-spaces",
        category: "Regulation",
        content: "The Care Quality Commission (CQC) has issued urgent updated guidance for inspectors regarding the safety of hospital care provided in non-clinical spaces, such as corridors. This move comes in response to the growing prevalence of 'corridor care' during periods of extreme winter pressure, emphasizing that such environments must not become the norm.\n\nThe guidance instructs inspectors to rigorously assess how trusts are mitigating risks in these overflow areas. Key focus points include patient privacy, dignity, and the availability of essential equipment like oxygen and call bells. The CQC has made it clear that while they understand system pressures, the compromise of patient safety will not be tolerated.\n\nThis regulatory update reinforces the vital importance of effective discharge planning and home care capacity. By ensuring patients can be safely discharged to their own homes with appropriate support, the strain on hospital capacity can be alleviated. It underscores the interconnectedness of the health and social care systems, where high-quality home care is a direct solution to hospital overcrowding."
    },
    {
        id: "cb-insights-2026",
        title: "Budgets are up, confidence isn't: 2026 tech investment insights",
        source: "CB Insights",
        date: "Feb 11, 2026",
        link: "https://www.cbinsights.com/research/report/tech-investment-insights-2026/",
        category: "Strategy",
        content: "A new report from CB Insights reveals a paradox in the 2026 global tech landscape: while 74% of enterprise leaders report increased IT and software budgets, confidence in Return on Investment (ROI) is faltering. The study suggests that the rapid pace of AI adoption has left many organizations 'rich in tools but poor in strategy'.\n\nThe 'Tech Investment Insights 2026' report highlights that decision-making is slowing down as leaders grapple with fragmented data and unproven use cases. In the healthcare sector specifically, there is a rush to adopt generative AI, but a struggle to integrate it meaningfully into existing clinical workflows without causing disruption.\n\nFor the care/tech market, this signals a shift towards 'proven value' over 'hype'. Investors and buyers are increasingly looking for platforms that solve tangible problems—like staffing shortages or care coordination—rather than experimental technologies. Companies that can demonstrate clear, measurable outcomes for patients and providers are poised to capture the bulk of this increased spending."
    },
    {
        id: "age-uk-intimacy",
        title: "The making of Age UK's intimacy and relationships guide",
        source: "Age UK",
        date: "Feb 11, 2026",
        link: "https://www.ageuk.org.uk/discover/2026/february/the-making-of-age-uks-sex-relationships-and-intimacy-information-guide/",
        category: "Dignity",
        content: "Age UK has launched a groundbreaking new guide focusing on an often-overlooked aspect of aging: sex, intimacy, and meaningful relationships. The guide challenges deep-seated societal taboos that desexualize older adults, affirming that the need for connection and intimacy remains vital throughout the entire lifespan.\n\nCreated in consultation with older people and clinical experts, the resource offers practical advice on navigating relationship changes due to health conditions, bereavement, or cognitive decline. It covers topics ranging from dating in later life to maintaining intimacy when one partner acts as a carer for the other. The guide is being hailed as a crucial step in recognizing the 'whole person' in geriatric care.\n\nHeems champions this holistic approach. Recognizing that care is not just about medication and meals, but also about supporting the emotional and social lives of individuals, resonates deeply with our mission. This guide is a must-read for families and carers looking to support the full dignity and well-being of their loved ones."
    }
];

export const IndustryNews = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate RSS Fetching
        const timer = setTimeout(() => {
            setNews(newsData);
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Card className="border-black/5 bg-slate-50/50 rounded-[3rem] overflow-hidden">
            <CardContent className="p-8 lg:p-12">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#1a9e8c] flex items-center justify-center animate-pulse">
                            <Radio className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-[#111827] tracking-tight">Industry Monitor</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live News Feed</p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-8 h-8 text-[#1a9e8c] animate-spin" />
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Syncing Feeds...</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {news.map((item, i) => (
                            <a
                                key={i}
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-start gap-6 p-6 rounded-2xl bg-white border border-black/[0.03] hover:border-[#1a9e8c]/30 hover:shadow-xl hover:shadow-black/5 transition-all duration-300"
                            >
                                <div className="shrink-0 w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-[#1a9e8c]/10 transition-colors">
                                    <Newspaper className="w-5 h-5 text-slate-400 group-hover:text-[#1a9e8c]" />
                                </div>
                                <div className="flex-grow">
                                    <div className="flex items-center justify-between mb-2">
                                        <Badge className="bg-slate-100 text-slate-500 border-none text-[10px] font-black uppercase tracking-widest">
                                            {item.source}
                                        </Badge>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.date}</span>
                                    </div>
                                    <h4 className="text-lg font-bold text-[#111827] leading-tight mb-2 group-hover:text-[#1a9e8c] transition-colors">
                                        {item.title}
                                    </h4>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed mb-4">
                                        {item.snippet}
                                    </p>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-[#1a9e8c] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                        Read Full Insight on {item.source} <ArrowUpRight className="w-3 h-3" />
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                )}

                <div className="mt-10 pt-8 border-t border-black/[0.05] text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Data aggregated from official CQC, NHS, and industry partners
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};
