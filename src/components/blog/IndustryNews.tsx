import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SourceFallback } from "@/components/shared/SourceFallback";
import { ArrowUpRight, Newspaper, Loader2, Radio, RefreshCw } from "lucide-react";
import { useRSSFeed } from "@/hooks/useRSSFeed";

export { newsData } from "./newsData";
export type { NewsItem } from "./newsData";

export const IndustryNews = () => {
    const { articles, loading, lastUpdated } = useRSSFeed();

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
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                {loading ? "Syncing feeds..." : `Live — ${articles.length} articles`}
                            </p>
                        </div>
                    </div>
                    {lastUpdated && (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <RefreshCw className="w-3 h-3" />
                            Updated {lastUpdated.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-8 h-8 text-[#1a9e8c] animate-spin" />
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Syncing Feeds...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {articles.map((item, i) => (
                            <a
                                key={i}
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-start gap-5 p-5 rounded-2xl bg-white border border-black/[0.03] hover:border-[#1a9e8c]/30 hover:shadow-xl hover:shadow-black/5 transition-all duration-300"
                            >
                                {/* Article Image */}
                                {item.image ? (
                                    <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-slate-100">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            onError={(e) => {
                                                const el = e.target as HTMLImageElement;
                                                el.src = "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80";
                                                el.onerror = null;
                                            }}
                                            onLoad={(e) => {
                                                const el = e.target as HTMLImageElement;
                                                if (el.naturalWidth < 50 || el.naturalHeight < 50) {
                                                    el.src = "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80";
                                                    el.onerror = null;
                                                }
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="shrink-0 w-16 h-16 rounded-xl bg-slate-50 relative overflow-hidden group-hover:bg-[#1a9e8c]/10 transition-colors">
                                        <SourceFallback source={item.source} className="!text-xs !gap-1" />
                                    </div>
                                )}

                                <div className="flex-grow min-w-0">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <Badge className="bg-slate-100 text-slate-500 border-none text-[10px] font-black uppercase tracking-widest shrink-0">
                                            {item.source}
                                        </Badge>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2 shrink-0">{item.date}</span>
                                    </div>
                                    <h4 className="text-sm font-bold text-[#111827] leading-snug mb-1.5 group-hover:text-[#1a9e8c] transition-colors line-clamp-2">
                                        {item.title}
                                    </h4>
                                    <p className="text-xs text-slate-400 font-medium leading-relaxed line-clamp-2">{item.snippet}</p>
                                    <div className="flex items-center gap-1 mt-2 text-[10px] font-black text-[#1a9e8c] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                        Read on {item.source} <ArrowUpRight className="w-3 h-3" />
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-black/[0.05] text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Live data from NHS England · Community Care · Age UK · Skills for Care · Homecare Association
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};
