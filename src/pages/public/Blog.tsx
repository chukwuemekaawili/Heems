import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, Calendar, ArrowUpRight, Radio, Newspaper, RefreshCw, ExternalLink, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useRSSFeed } from "@/hooks/useRSSFeed";

// Publisher domain map for favicon lookup
const SOURCE_DOMAINS: Record<string, string> = {
    "BBC Health": "bbc.co.uk",
    "UK Care News": "theguardian.com",
    "CQC News": "cqc.org.uk",
    "Homecare News": "homecare.co.uk",
    "NHS Confederation": "nhsconfed.org",
    "Age UK": "ageuk.org.uk",
    "Skills for Care": "skillsforcare.org.uk",
    "Heems Team": "heems.co.uk",
    "Heems Editorial": "heems.co.uk",
};

// Publisher logo component using favicon API with dark fallback
const PublisherLogo = ({ source, size = 24 }: { source: string; size?: number }) => {
    const domain = SOURCE_DOMAINS[source];
    const initials = source.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    const [imgError, setImgError] = useState(false);

    if (domain && !imgError) {
        return (
            <img
                src={`https://www.google.com/s2/favicons?sz=64&domain=${domain}`}
                alt={source}
                width={size}
                height={size}
                className="rounded-full object-contain bg-white"
                onError={() => setImgError(true)}
            />
        );
    }

    return (
        <div
            className="rounded-full bg-slate-800 flex items-center justify-center"
            style={{ width: size, height: size }}
        >
            <span className="text-white font-black" style={{ fontSize: size * 0.38 }}>{initials}</span>
        </div>
    );
};

const FALLBACK_IMAGES: Record<string, string> = {
    "Workforce": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
    "Regulation": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
    "Market Outlook": "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=800&q=80",
    "Innovation": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
    "default": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
};

// Swap to fallback if image fails to load OR loads but is a tiny pixel/invalid
const handleImgFallback = (e: React.SyntheticEvent<HTMLImageElement>, category: string) => {
    const el = e.target as HTMLImageElement;
    const fallback = FALLBACK_IMAGES[category] || FALLBACK_IMAGES.default;
    // Avoid infinite loop if fallback itself somehow errors
    if (el.src === fallback) return;
    el.src = fallback;
    el.onerror = null;
};

const handleImgLoad = (e: React.SyntheticEvent<HTMLImageElement>, category: string) => {
    const el = e.target as HTMLImageElement;
    // Detect tiny placeholder pixels or broken images that loaded with 200 OK
    if (el.naturalWidth < 50 || el.naturalHeight < 50) {
        el.src = FALLBACK_IMAGES[category] || FALLBACK_IMAGES.default;
        el.onerror = null;
    }
};

const CATEGORIES = ["All", "Market Outlook", "Innovation", "Workforce", "Regulation", "Dignity", "Strategy"];

interface FeedItem {
    id: string;
    title: string;
    source: string;
    date: string;
    isoDate: string;
    link: string;
    category: string;
    snippet: string;
    image: string | null;
    isInternal: boolean;
}

const Blog = () => {
    const [dbPosts, setDbPosts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [visibleCount, setVisibleCount] = useState(6);
    const { articles: liveNews, loading: newsLoading, lastUpdated } = useRSSFeed();

    const allItems: FeedItem[] = [
        ...dbPosts.map(post => ({
            id: post.id,
            title: post.title,
            source: post.author || "Heems Team",
            date: format(new Date(post.created_at), "d MMM yyyy"),
            isoDate: post.created_at,
            link: `/blog/${post.id}`,
            category: post.category || "Insight",
            snippet: post.excerpt || (post.content?.slice(0, 200) + "..."),
            image: post.image_url || null,
            isInternal: true,
        })),
        ...liveNews.map(a => ({
            id: a.id || String(Math.random()),
            title: a.title,
            source: a.source,
            date: a.date,
            isoDate: a.isoDate,
            link: a.link,
            category: a.category || "News",
            snippet: a.snippet,
            image: a.image,
            isInternal: false,
        })),
    ].sort((a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime());
    // deduplicate by title
    const seen = new Set<string>();
    const deduped = allItems.filter(item => {
        const key = item.title.toLowerCase().slice(0, 60);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    const filtered = deduped.filter(item => {
        const matchSearch =
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.snippet.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCat = selectedCategory === "All" || item.category === selectedCategory;
        return matchSearch && matchCat;
    });

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "Market Outlook": return "bg-blue-500/10 text-blue-700";
            case "Innovation": return "bg-purple-500/10 text-purple-700";
            case "Workforce": return "bg-orange-500/10 text-orange-700";
            case "Regulation": return "bg-rose-500/10 text-rose-700";
            case "Dignity": return "bg-pink-500/10 text-pink-700";
            case "Strategy": return "bg-indigo-500/10 text-indigo-700";
            default: return "bg-[#1a9e8c]/10 text-[#0f2824]";
        }
    };

    const isFiltered = searchTerm !== "" || selectedCategory !== "All";
    const featuredArticle = !isFiltered && filtered.length > 0 ? filtered[0] : null;
    const allFeedArticles = featuredArticle ? filtered.slice(1) : filtered;
    const feedArticles = allFeedArticles.slice(0, visibleCount);
    const hasMore = visibleCount < allFeedArticles.length;

    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="pt-24">

                {/* Hero */}
                <section className="relative py-24 bg-slate-50 overflow-hidden">
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-[#1a9e8c]/5 rounded-full blur-[100px]" />

                    <div className="container relative z-10 mx-auto px-6">
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 max-w-6xl mx-auto">
                            <div className="max-w-2xl">
                                <span className="inline-block text-xs font-black text-[#1a9e8c] uppercase tracking-widest mb-6">
                                    Heems Insights
                                </span>
                                <h1 className="text-5xl lg:text-7xl font-black text-[#111827] mb-6 leading-[1.1] tracking-tight">
                                    The voice of <br />
                                    <span className="text-[#1a9e8c]">
                                        UK home care.
                                    </span>
                                </h1>
                                <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-xl">
                                    Live news, analysis and guides from across the care sector — updated daily from NHS, Age UK, CQC, Skills for Care and more.
                                </p>
                            </div>
                            <div className="w-full lg:max-w-md shrink-0">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-[#1a9e8c] rounded-2xl blur opacity-10 group-hover:opacity-20 transition-opacity duration-500" />
                                    <div className="relative bg-white border border-slate-200 shadow-sm rounded-2xl flex items-center p-1">
                                        <Search className="ml-4 h-5 w-5 text-slate-400" />
                                        <Input
                                            className="h-14 bg-transparent border-0 text-[#111827] placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-lg"
                                            placeholder="Search articles..."
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                                {lastUpdated && (
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3 flex items-center gap-1.5">
                                        <RefreshCw className="w-3 h-3" />
                                        Feed synced {lastUpdated.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Category pills */}
                <div className="border-b border-slate-100 bg-white sticky top-[72px] z-30 shadow-sm">
                    <div className="container mx-auto px-6">
                        <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
                            {CATEGORIES.map((tag, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedCategory(tag)}
                                    className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${selectedCategory === tag
                                        ? "bg-[#111827] text-white"
                                        : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Two-column layout */}
                <section className="py-12 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col lg:flex-row gap-8 lg:items-start">

                            {/* Main feed */}
                            <div className="flex-1 min-w-0 space-y-8">
                                <div className="flex items-center justify-between border-b border-black/5 pb-4">
                                    <h2 className="text-2xl font-black text-[#111827] tracking-tight">
                                        {selectedCategory === "All" ? "Latest Coverage" : selectedCategory}
                                    </h2>
                                    <span className="text-sm font-bold text-slate-400 bg-black/5 px-3 py-1 rounded-full">{filtered.length} articles</span>
                                </div>

                                {filtered.length === 0 ? (
                                    <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
                                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <BookOpen className="h-8 w-8 text-slate-300" />
                                        </div>
                                        <h3 className="text-xl font-black text-[#111827] mb-2">No articles found</h3>
                                        <p className="text-slate-500 font-medium max-w-sm mx-auto">We couldn't find any news matching your current filters.</p>
                                        <button onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }} className="mt-6 px-6 py-2.5 bg-[#111827] text-white text-sm font-bold rounded-full hover:bg-black transition-colors">
                                            Clear all filters
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Featured Article Overlay */}
                                        {featuredArticle && (
                                            <div className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#111827] via-[#0B1120] to-[#1a9e8c]/40 aspect-[16/10] sm:aspect-[21/9] cursor-pointer shadow-xl">
                                                {featuredArticle.image ? (
                                                    <img
                                                        src={featuredArticle.image}
                                                        alt={featuredArticle.title}
                                                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-50 transition-all duration-700"
                                                        onError={e => handleImgFallback(e, featuredArticle.category)}
                                                        onLoad={e => handleImgLoad(e, featuredArticle.category)}
                                                    />
                                                ) : (
                                                    <img
                                                        src={FALLBACK_IMAGES[featuredArticle.category] || FALLBACK_IMAGES.default}
                                                        alt={featuredArticle.title}
                                                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-50 transition-all duration-700"
                                                    />
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                                                <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-end">
                                                    <div className="flex flex-wrap items-center gap-3 mb-4">
                                                        <Badge className="bg-[#1a9e8c] text-white border-none text-[10px] font-black uppercase tracking-widest shadow-lg">
                                                            {featuredArticle.source}
                                                        </Badge>
                                                        <Badge className={`${getCategoryColor(featuredArticle.category).replace('/10', '/90')} text-white border-none text-[10px] font-bold uppercase tracking-widest shadow-lg backdrop-blur-md`}>
                                                            {featuredArticle.category}
                                                        </Badge>
                                                        <span className="text-xs font-bold text-white/80 flex items-center gap-1.5 ml-2">
                                                            <Calendar className="h-3.5 w-3.5" />
                                                            {featuredArticle.date}
                                                        </span>
                                                    </div>

                                                    <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.15] mb-4 max-w-3xl group-hover:text-[#2dd4bf] transition-colors">
                                                        {featuredArticle.title}
                                                    </h3>

                                                    <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-2xl line-clamp-2 sm:line-clamp-3 mb-6 font-medium">
                                                        {featuredArticle.snippet.replace(/<\/?[^>]+(>|$)/g, "")}
                                                    </p>

                                                    <div className="flex items-center gap-2">
                                                        {featuredArticle.isInternal ? (
                                                            <Link to={featuredArticle.link} className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-white text-[#111827] font-black hover:bg-[#2dd4bf] hover:text-white transition-colors gap-2">
                                                                Read Editorial <ArrowUpRight className="h-4 w-4" />
                                                            </Link>
                                                        ) : (
                                                            <a href={featuredArticle.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-white text-[#111827] font-black hover:bg-[#2dd4bf] hover:text-white transition-colors gap-2">
                                                                Read Source <ExternalLink className="h-4 w-4" />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Standard Feed Grid */}
                                        <div className="grid grid-cols-1 gap-6">
                                            {feedArticles.map(item => {
                                                const cardEl = (
                                                    <div className="group bg-white rounded-3xl border border-slate-100 hover:border-[#1a9e8c]/30 hover:shadow-2xl hover:-translate-y-1 hover:shadow-[#1a9e8c]/10 transition-all duration-300 overflow-hidden flex flex-col sm:flex-row cursor-pointer h-full">
                                                        {/* Image */}
                                                        <div className="sm:w-[240px] shrink-0 bg-slate-50 relative min-h-[180px] sm:min-h-full overflow-hidden">
                                                            {item.image ? (
                                                                <img
                                                                    src={item.image}
                                                                    alt={item.title}
                                                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                                                    onError={e => handleImgFallback(e, item.category)}
                                                                    onLoad={e => handleImgLoad(e, item.category)}
                                                                />
                                                            ) : (
                                                                <img
                                                                    src={FALLBACK_IMAGES[item.category] || FALLBACK_IMAGES.default}
                                                                    alt={item.title}
                                                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                                                />
                                                            )}
                                                        </div>
                                                        {/* Text */}
                                                        <div className="flex-grow p-6 sm:p-8 flex flex-col justify-between">
                                                            <div>
                                                                <div className="flex items-center gap-3 mb-3">
                                                                    <Badge className={`${getCategoryColor(item.category)} border-none text-[10px] font-black uppercase tracking-widest`}>
                                                                        {item.category}
                                                                    </Badge>
                                                                    <div className="flex items-center gap-1.5 text-slate-400">
                                                                        <Calendar className="h-3.5 w-3.5" />
                                                                        <span className="text-xs font-bold uppercase tracking-widest">{item.date}</span>
                                                                    </div>
                                                                </div>
                                                                <h3 className="text-base font-black text-[#111827] mb-2 group-hover:text-[#1a9e8c] transition-colors leading-snug line-clamp-2">
                                                                    {item.title}
                                                                </h3>
                                                                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 flex-grow">
                                                                    {item.snippet.replace(/<\/?[^>]+(>|$)/g, "")}
                                                                </p>
                                                                <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between">
                                                                    <div className="flex items-center gap-2.5">
                                                                        <PublisherLogo source={item.isInternal ? "Heems Editorial" : item.source} size={22} />
                                                                        <span className="text-xs font-bold text-slate-600">{item.isInternal ? "Heems Editorial" : item.source}</span>
                                                                    </div>
                                                                    <span className="text-xs font-black text-[#1a9e8c] flex items-center gap-1">
                                                                        {item.isInternal ? <><ArrowUpRight className="h-3 w-3" /> Read</> : <><ExternalLink className="h-3 w-3" /> Source</>}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                                return (
                                                    <div key={item.id}>
                                                        {item.isInternal
                                                            ? <Link to={item.link}>{cardEl}</Link>
                                                            : <a href={item.link} target="_blank" rel="noopener noreferrer">{cardEl}</a>
                                                        }
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {hasMore && (
                                            <div className="flex justify-center pt-4">
                                                <button
                                                    onClick={() => setVisibleCount(prev => prev + 6)}
                                                    className="group inline-flex items-center gap-2 px-8 py-3.5 bg-[#111827] text-white text-sm font-black rounded-full hover:bg-[#1a9e8c] transition-colors shadow-lg hover:shadow-xl"
                                                >
                                                    Load More Articles
                                                    <span className="text-xs font-bold text-white/50 group-hover:text-white/80">({allFeedArticles.length - visibleCount} remaining)</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Sidebar */}
                            <aside className="w-full lg:w-[360px] shrink-0 space-y-6 lg:sticky lg:top-[136px]">
                                {/* Industry Monitor */}
                                <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
                                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-[#1a9e8c] flex items-center justify-center">
                                                <Radio className="w-4 h-4 text-white animate-pulse" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-black text-[#111827]">Industry Monitor</h3>
                                                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">● Live</p>
                                            </div>
                                        </div>
                                        {lastUpdated && (
                                            <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                                                <RefreshCw className="w-2.5 h-2.5" />
                                                {lastUpdated.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                                            </span>
                                        )}
                                    </div>
                                    <div
                                        id="industry-monitor-scroll"
                                        className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto"
                                        style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent' }}
                                    >
                                        <style>{`
                                            #industry-monitor-scroll::-webkit-scrollbar { width: 6px; }
                                            #industry-monitor-scroll::-webkit-scrollbar-track { background: transparent; }
                                            #industry-monitor-scroll::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
                                        `}</style>
                                        {liveNews.slice(0, 10).map((item, i) => (
                                            <a
                                                key={i}
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group flex items-start gap-3.5 p-4 hover:bg-slate-50 transition-colors"
                                            >
                                                <div className="shrink-0 mt-0.5">
                                                    <PublisherLogo source={item.source} size={28} />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-1.5 mb-1">
                                                        <span className="text-[10px] font-black text-[#1a9e8c] uppercase tracking-widest">{item.source}</span>
                                                        <span className="text-[10px] text-slate-300">·</span>
                                                        <span className="text-[10px] font-bold text-slate-400">{item.date}</span>
                                                    </div>
                                                    <p className="text-xs font-bold text-[#111827] leading-snug line-clamp-2 group-hover:text-[#1a9e8c] transition-colors">
                                                        {item.title}
                                                    </p>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                    <div className="p-3 border-t border-slate-50 text-center">
                                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                            NHS · Age UK · CQC · Skills for Care · Homecare Assoc.
                                        </p>
                                    </div>
                                </div>

                                {/* Newsletter */}
                                <div className="relative rounded-3xl p-8 text-white overflow-hidden shadow-2xl">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#111827] via-[#0f2824] to-[#1a9e8c] z-0" />
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

                                    <div className="relative z-10">
                                        <h4 className="text-xl font-black mb-3">Subscribe to Pulse</h4>
                                        <p className="text-white/70 text-sm leading-relaxed mb-6 font-medium">
                                            The weekly briefing on the future of private care in England. Stay ahead.
                                        </p>
                                        <div className="flex flex-col gap-3">
                                            <Input
                                                className="h-12 bg-black/20 border-white/10 rounded-xl text-white placeholder:text-white/40 focus-visible:ring-[#2dd4bf] backdrop-blur-sm shadow-inner"
                                                placeholder="Your email address"
                                            />
                                            <Button className="h-12 w-full bg-white text-[#0f2824] hover:bg-[#1a9e8c] hover:text-white rounded-xl font-black transition-all shadow-lg hover:shadow-xl">
                                                Join Now
                                            </Button>
                                        </div>
                                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-4 text-center">No spam. Easy unsubscribe.</p>
                                    </div>
                                </div>
                            </aside>

                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Blog;
