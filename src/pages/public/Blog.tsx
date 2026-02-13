import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, User, Calendar, BookOpen, ArrowUpRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ChatWidget } from "@/components/shared/ChatWidget";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { IndustryNews, newsData } from "@/components/blog/IndustryNews";

const Blog = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [featured, setFeatured] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        const fetchPosts = async () => {
            const { data } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('status', 'Published')
                .order('created_at', { ascending: false });

            if (data && data.length > 0) {
                setFeatured(data[0]);
                setPosts(data.slice(1));
            } else {
                setPosts([]);
            }
            setLoading(false);
        };
        fetchPosts();
    }, []);

    const filteredPosts = posts.filter(post => {
        const matchesSearch = (post.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (post.excerpt?.toLowerCase() || "").includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="pt-24">
                {/* Hero Section */}
                <section className="py-24 bg-[#111827] text-white relative overflow-hidden">
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                            <div className="max-w-2xl">
                                <Badge className="mb-6 bg-[#1a9e8c]/20 text-[#1a9e8c] border-[#1a9e8c]/30 py-1 px-4 text-xs font-black uppercase tracking-widest">Heems Insights</Badge>
                                <h1 className="text-6xl font-black mb-8 leading-tight">Expertise in the <span className="text-[#1a9e8c]">evolution of care</span>.</h1>
                                <p className="text-xl text-white/60 font-medium leading-relaxed">
                                    Thought leadership, practical guides, and industry news from the intersection of technology and care.
                                </p>
                            </div>
                            <div className="w-full lg:max-w-sm">
                                <Card className="bg-white/5 border-white/10 backdrop-blur-md rounded-3xl p-6">
                                    <h3 className="text-lg font-bold mb-4 text-white">Search Insights</h3>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                                        <Input
                                            className="pl-10 h-12 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-white/30 focus-visible:ring-[#1a9e8c]"
                                            placeholder="Search articles..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content Feed */}
                <section className="py-24 bg-slate-50">
                    <div className="container mx-auto px-6">
                        <div className="max-w-4xl mx-auto">
                            <div className="mb-16 flex items-center justify-between">
                                <h2 className="text-3xl font-black text-[#111827]">Latest Insights</h2>
                                <div className="flex gap-2">
                                    {["All", "Market Outlook", "Innovation", "Workforce", "Regulation"].map((tag, i) => (
                                        <Badge
                                            key={i}
                                            variant="outline"
                                            onClick={() => setSelectedCategory(tag)}
                                            className={`px-4 py-2 border-black/5 rounded-full font-bold cursor-pointer transition-all ${selectedCategory === tag
                                                ? "bg-[#111827] text-white border-[#111827]"
                                                : "bg-white text-slate-400 hover:border-[#1a9e8c] hover:text-[#1a9e8c]"
                                                }`}
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Unified Feed of Industry News + Internal Posts */}
                            <div className="space-y-16">
                                {/* Map over newsData directly since database posts are empty/secondary for now */}
                                {
                                    // Combine DB posts and static news
                                    [
                                        ...posts.map(post => ({
                                            id: post.id,
                                            title: post.title,
                                            source: post.author || 'Heems Team',
                                            date: format(new Date(post.created_at), 'MMM d, yyyy'),
                                            link: `/blog/${post.id}`, // Internal link
                                            category: post.category,
                                            content: post.excerpt || post.content?.substring(0, 200) + "...",
                                            image: post.image_url,
                                            isInternal: true
                                        })),
                                        ...newsData
                                    ]
                                        .filter(item => {
                                            const matchesSearch = (item.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                                                (item.content?.toLowerCase() || "").includes(searchTerm.toLowerCase());
                                            const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
                                            return matchesSearch && matchesCategory;
                                        })
                                        .map((item) => {
                                            // Dynamic Read Time Calculation
                                            const wordCount = (item.content || "").split(/\s+/).length;
                                            const readTime = Math.ceil(wordCount / 200);

                                            const CardContent = (
                                                <Card className="h-full border-black/5 hover:border-[#1a9e8c]/30 hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 rounded-[2.5rem] overflow-hidden bg-white flex flex-col md:flex-row cursor-pointer">
                                                    {/* Image Section - Fixed Aspect Ratio / Width */}
                                                    <div className="md:w-[35%] bg-slate-100 relative min-h-[250px] md:min-h-full shrink-0 overflow-hidden">
                                                        {item.image ? (
                                                            <>
                                                                <img
                                                                    src={item.image}
                                                                    alt={item.title}
                                                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                                />
                                                                <div className="absolute inset-0 bg-[#1a9e8c]/10 group-hover:bg-transparent transition-colors duration-500" />
                                                            </>
                                                        ) : (
                                                            <div className="absolute inset-0 flex items-center justify-center bg-[#1a9e8c]/5 group-hover:bg-[#1a9e8c]/10 transition-colors">
                                                                <BookOpen className="h-16 w-16 text-[#1a9e8c]/30 group-hover:scale-110 transition-transform duration-500" />
                                                            </div>
                                                        )}
                                                        <div className="absolute top-6 left-6 z-10">
                                                            <Badge className="bg-white/90 backdrop-blur text-[#111827] border-none text-[10px] font-black uppercase tracking-widest shadow-sm">
                                                                {item.source}
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    {/* Content Section - Responsive Padding */}
                                                    <div className="flex-grow p-8 md:p-10 lg:p-12 flex flex-col">
                                                        <div className="flex items-center justify-between mb-6">
                                                            <Badge className="bg-[#1a9e8c]/10 text-[#1a9e8c] border-none text-[10px] font-black uppercase tracking-widest">
                                                                {item.category}
                                                            </Badge>
                                                            <div className="flex items-center gap-2 text-slate-400">
                                                                <Calendar className="h-3 w-3" />
                                                                <span className="text-[10px] font-bold uppercase tracking-widest">{item.date} • {readTime} min read</span>
                                                            </div>
                                                        </div>

                                                        <h3 className="text-2xl lg:text-3xl font-black text-[#111827] mb-6 group-hover:text-[#1a9e8c] transition-colors leading-tight">
                                                            {item.title}
                                                        </h3>

                                                        <div className="prose prose-slate mb-8 line-clamp-4 text-slate-500 font-medium leading-relaxed flex-grow">
                                                            {(item.content || "").split('\n').map((paragraph: string, idx: number) => (
                                                                <p key={idx} className="mb-2 last:mb-0">{paragraph}</p>
                                                            ))}
                                                        </div>

                                                        <div className="mt-auto pt-8 border-t border-black/5 flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center border border-black/5">
                                                                    <User className="h-4 w-4 text-slate-400" />
                                                                </div>
                                                                <span className="text-xs font-bold text-[#111827]">Heems Editorial</span>
                                                            </div>
                                                            <div className="rounded-full font-bold bg-transparent hover:bg-[#111827] text-[#111827] hover:text-white border border-black/10 px-4 py-2 flex items-center gap-2 transition-all">
                                                                Read Post <ArrowUpRight className="ml-2 h-3 w-3" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card>
                                            );

                                            return (
                                                <div key={item.id} className="group block h-full">
                                                    {/* @ts-ignore - isInternal check */}
                                                    {item.isInternal ? (
                                                        <Link to={item.link}>{CardContent}</Link>
                                                    ) : (
                                                        <a href={item.link} target="_blank" rel="noopener noreferrer">{CardContent}</a>
                                                    )}
                                                </div>
                                            );
                                        })
                                }
                            </div>
                        </div>
                    </div>
                </section>

                {/* Newsletter Section - Keep existing */}
                <section className="py-32">
                    <div className="container mx-auto px-6">
                        <div className="bg-[#1a9e8c] rounded-[3rem] p-12 lg:p-24 text-white flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden">
                            <div className="relative z-10 max-w-xl text-center lg:text-left">
                                <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight italic">Subcribe to <span className="text-[#111827]">Pulse</span></h2>
                                <p className="text-white/80 text-xl font-medium">Join 5,000+ care professionals and families receiving our weekly briefing on the future of private care.</p>
                            </div>
                            <div className="relative z-10 w-full lg:max-w-md">
                                <div className="flex gap-2">
                                    <Input className="h-14 bg-white/10 border-white/20 rounded-xl text-white placeholder:text-white/60 focus-visible:ring-white" placeholder="Enter your email" />
                                    <Button className="h-14 px-8 bg-[#111827] hover:bg-black text-white rounded-xl font-black">Join</Button>
                                </div>
                                <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mt-4 text-center lg:text-left">No spam. Just high-value intelligence.</p>
                            </div>
                            <div className="absolute top-0 right-0 h-full w-full opacity-10 pointer-events-none">
                                <div className="absolute top-0 right-0 w-[400px] h-[400px] border-[40px] border-white rounded-full translate-x-1/2 -translate-y-1/2" />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <ChatWidget />
            <Footer />
        </div>
    );
};

export default Blog;
