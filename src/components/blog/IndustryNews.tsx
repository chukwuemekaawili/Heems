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
}

const newsData: NewsItem[] = [
    {
        title: "New CQC Inspection Framework: What Care Providers Need to Know",
        source: "CQC",
        date: "2 hours ago",
        link: "https://www.cqc.org.uk/news",
        category: "Regulation"
    },
    {
        title: "NHS England Announces £200m Fund for Social Care Tech Implementation",
        source: "NHS England",
        date: "5 hours ago",
        link: "https://www.england.nhs.uk/news/",
        category: "Funding"
    },
    {
        title: "Skills for Care: Annual Report Highlights Workforce Growth Trends",
        source: "Skills for Care",
        date: "1 day ago",
        link: "https://www.skillsforcare.org.uk/About/News/News.aspx",
        category: "Workforce"
    },
    {
        title: "Age UK Response to Proposed Social Care Reform Bill",
        source: "Age UK",
        date: "1 day ago",
        link: "https://www.ageuk.org.uk/about-us/news/",
        category: "Advocacy"
    },
    {
        title: "CB Insights: The 2026 State of Care-Tech Funding",
        source: "CB Insights",
        date: "2 days ago",
        link: "https://www.cbinsights.com",
        category: "Tech"
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
                                    <div className="flex items-center gap-2 text-[10px] font-black text-[#1a9e8c] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                        Read Official Source <ArrowUpRight className="w-3 h-3" />
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
