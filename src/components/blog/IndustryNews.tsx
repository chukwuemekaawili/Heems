import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Newspaper, Loader2, Radio } from "lucide-react";

interface NewsItem {
    title: string;
    source: string;
    date: string;
    link: string;
    category: string;
    snippet?: string;
}

const newsData: NewsItem[] = [
    {
        title: "Supporting older people's health in 2026",
        source: "Age UK",
        date: "Jan 23, 2026",
        link: "https://www.ageuk.org.uk/discover/2026/january/supporting-older-peoples-health-in-2026/",
        category: "Market Outlook",
        snippet: "A deep dive into the NHS 10 Year Plan updates and what families should expect regarding the future of social care and independence in later life."
    },
    {
        title: "NHS backs AI notetaking to free up more face-to-face care",
        source: "NHS England",
        date: "Jan 15, 2026",
        link: "https://www.england.nhs.uk/2026/01/nhs-backs-ai-notetaking-free-up-more-face-to-face-care/",
        category: "Innovation",
        snippet: "New AI tools are helping clinicians spend up to 25% more time with their patients by automating the capture of patient conversations into real-time transcriptions."
    },
    {
        title: "Supporting care staff to keep learning in 2026",
        source: "Skills for Care",
        date: "Jan 12, 2026",
        link: "https://www.skillsforcare.org.uk/news-and-events/news/skills-for-care-is-supporting-care-staff-to-keep-learning-in-2026",
        category: "Workforce",
        snippet: "Skills for Care kicks off 2026 with a spotlight on professional development as a critical pillar for retaining the quality care workforce England needs."
    },
    {
        title: "Guidance for Assessing Hospital Care in Non-Clinical Spaces",
        source: "CQC",
        date: "Feb 12, 2026",
        link: "https://www.cqc.org.uk/news/updated-guidance-specialist-inspectors-assessing-hospital-care-provided-non-clinical-spaces",
        category: "Regulation",
        snippet: "Updated safety guidance addresses the growing concern of 'corridor care', emphasizing that professional environments are essential for dignity and quality."
    },
    {
        title: "Budgets are up, confidence isn't: 2026 tech investment insights",
        source: "CB Insights",
        date: "Feb 11, 2026",
        link: "https://www.cbinsights.com/research/report/tech-investment-insights-2026/",
        category: "Strategy",
        snippet: "While 74% of leaders report increased software investment, many struggle to translate this into tangible business ROI amid fragmented insights."
    },
    {
        title: "The making of Age UK's intimacy and relationships guide",
        source: "Age UK",
        date: "Feb 11, 2026",
        link: "https://www.ageuk.org.uk/discover/2026/february/the-making-of-age-uks-sex-relationships-and-intimacy-information-guide/",
        category: "Dignity",
        snippet: "A groundbreaking guide focusing on the often-overlooked importance of sex, intimacy, and meaningful human connection in later life."
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
