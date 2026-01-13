import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, User, Calendar, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ChatWidget } from "@/components/shared/ChatWidget";

const blogPosts = [
    {
        title: "The Future of Specialist Care in the UK",
        excerpt: "How technological infrastructure is solving the fragmentation of private care and improving clinical outcomes.",
        author: "Dr. Sarah Jameson",
        date: "Jan 10, 2026",
        category: "Industry Insights",
        readingTime: "8 min read",
        color: "bg-blue-500"
    },
    {
        title: "5 Things to Look for in a Specialist Carer",
        excerpt: "A comprehensive guide for families navigating the vetting process for complex care needs.",
        author: "Marcus Thorne",
        date: "Jan 08, 2026",
        category: "Family Guide",
        readingTime: "5 min read",
        color: "bg-[#1a9e8c]"
    },
    {
        title: "Automating Compliance: The Heems Story",
        excerpt: "Behind the scenes of the engine that ensures every carer on our platform meets the highest standards.",
        author: "James Heems",
        date: "Jan 05, 2026",
        category: "Engineering",
        readingTime: "12 min read",
        color: "bg-purple-500"
    }
];

const Blog = () => {
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
                                    Thought leadership, practical guides, and industry news from the intersection of technology and specialist care.
                                </p>
                            </div>
                            <div className="w-full lg:max-w-sm">
                                <Card className="bg-white/5 border-white/10 backdrop-blur-md rounded-3xl p-6">
                                    <h3 className="text-lg font-bold mb-4">Search Insights</h3>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                                        <Input className="pl-10 h-12 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-white/30 focus-visible:ring-[#1a9e8c]" placeholder="Search articles..." />
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Post */}
                <section className="py-24">
                    <div className="container mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="relative group cursor-pointer">
                                <div className="aspect-[16/9] bg-slate-100 rounded-[3rem] overflow-hidden">
                                    <div className="w-full h-full bg-gradient-to-br from-[#1a9e8c]/20 to-slate-200 flex items-center justify-center">
                                        <BookOpen className="h-24 w-24 text-[#1a9e8c]/20 group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                </div>
                                <Badge className="absolute top-6 left-6 bg-[#111827] text-white border-none py-1.5 px-4 font-bold rounded-full">MUST READ</Badge>
                            </div>
                            <div>
                                <Badge className="mb-6 bg-[#1a9e8c]/10 text-[#1a9e8c] border-none py-1 px-3 text-[10px] font-black uppercase tracking-widest">Featured Story</Badge>
                                <h2 className="text-4xl font-black text-[#111827] mb-6 leading-tight hover:text-[#1a9e8c] transition-colors cursor-pointer">Connecting the Dots: How Shared Data is Transforming Clinical-at-Home Outcomes.</h2>
                                <p className="text-lg text-slate-500 font-medium leading-relaxed mb-8">
                                    An in-depth analysis of how Heems' integrated data layer is giving carers and families the real-time insights they need to prevent hospital readmissions.
                                </p>
                                <div className="flex items-center gap-6 mb-8 py-6 border-y border-black/5">
                                    <div className="flex items-center gap-2">
                                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center"><User className="h-5 w-5 text-slate-400" /></div>
                                        <span className="text-sm font-bold text-[#111827]">David Elan</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Calendar className="h-4 w-4" />
                                        <span className="text-xs font-bold uppercase tracking-widest">Jan 12, 2026</span>
                                    </div>
                                </div>
                                <Button className="h-14 px-8 bg-[#111827] hover:bg-[#1a9e8c] text-white rounded-xl font-black flex items-center gap-2">
                                    Read Full Insight <ArrowRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Grid Section */}
                <section className="py-24 bg-slate-50">
                    <div className="container mx-auto px-6">
                        <div className="flex items-center justify-between mb-16">
                            <h2 className="text-3xl font-black text-[#111827]">Latest Insights</h2>
                            <div className="flex gap-2">
                                {["All", "Operations", "Clinical", "Product"].map((tag, i) => (
                                    <Badge key={i} variant="outline" className={`px-4 py-2 border-black/5 rounded-full font-bold cursor-pointer transition-all ${i === 0 ? "bg-[#111827] text-white border-[#111827]" : "bg-white text-slate-400 hover:border-[#1a9e8c] hover:text-[#1a9e8c]"}`}>{tag}</Badge>
                                ))}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {blogPosts.map((post, i) => (
                                <Card key={i} className="group border-black/5 hover:border-[#1a9e8c]/30 hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 rounded-[2.5rem] overflow-hidden bg-white">
                                    <CardContent className="p-0">
                                        <div className={`h-48 ${post.color} opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center`}>
                                            <BookOpen className="h-12 w-12 text-white/50" />
                                        </div>
                                        <div className="p-8">
                                            <div className="flex items-center justify-between mb-4">
                                                <Badge className="bg-[#1a9e8c]/10 text-[#1a9e8c] border-none text-[10px] font-black uppercase tracking-widest">{post.category}</Badge>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{post.readingTime}</span>
                                            </div>
                                            <h3 className="text-2xl font-black text-[#111827] mb-4 group-hover:text-[#1a9e8c] transition-colors leading-tight">{post.title}</h3>
                                            <p className="text-slate-500 font-medium leading-relaxed mb-8 line-clamp-3">{post.excerpt}</p>
                                            <div className="flex items-center justify-between pt-6 border-t border-black/5">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center border border-black/5"><User className="h-4 w-4 text-slate-400" /></div>
                                                    <span className="text-xs font-bold text-[#111827]">{post.author}</span>
                                                </div>
                                                <div className="h-10 w-10 rounded-full border border-black/5 flex items-center justify-center group-hover:bg-[#111827] group-hover:text-white transition-all">
                                                    <ArrowRight className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="mt-20 text-center">
                            <Button variant="outline" className="h-14 px-12 border-black/10 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-[#111827] hover:text-white transition-all">Load More Insights</Button>
                        </div>
                    </div>
                </section>

                {/* Newsletter Section */}
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
                                <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mt-4 text-center lg:text-left">No spam. Just clinical-grade intelligence.</p>
                            </div>
                            {/* Abstract Shape */}
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
