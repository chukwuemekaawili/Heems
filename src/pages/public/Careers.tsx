import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, MapPin, Clock, ArrowRight, Zap, Globe, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { ChatWidget } from "@/components/shared/ChatWidget";

const jobs = [
    {
        title: "Senior Full Stack Engineer",
        department: "Engineering",
        location: "London / Remote",
        type: "Full-time",
        seniority: "Senior"
    },
    {
        title: "Product Designer (UX/UI)",
        department: "Product",
        location: "London",
        type: "Full-time",
        seniority: "Mid-Senior"
    },
    {
        title: "Head of Care Operations",
        department: "Operations",
        location: "London",
        type: "Full-time",
        seniority: "Lead"
    },
    {
        title: "Customer Success Manager",
        department: "Experience",
        location: "Remote",
        type: "Full-time",
        seniority: "Junior-Mid"
    }
];

const Careers = () => {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="pt-24">
                {/* Hero Section */}
                <section className="py-24 bg-[#111827] text-white overflow-hidden relative">
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="max-w-3xl">
                            <Badge className="mb-6 bg-[#1a9e8c]/20 text-[#1a9e8c] border-[#1a9e8c]/30 py-1 px-4 text-xs font-black uppercase tracking-widest">Join the Revolution</Badge>
                            <h1 className="text-6xl font-black mb-8 leading-tight">Help us build the <span className="text-[#1a9e8c]">infrastructure of care</span>.</h1>
                            <p className="text-xl text-white/60 font-medium leading-relaxed mb-10">
                                We're looking for ambitious, empathetic, and technologically-minded individuals to help us redefine the private care industry from the ground up.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Button className="h-14 px-8 bg-[#1a9e8c] hover:bg-[#15806c] text-white rounded-xl font-black shadow-xl shadow-[#1a9e8c]/20">View Openings</Button>
                                <Button className="h-14 px-8 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl font-black" asChild>
                                    <Link to="/about">Our Story</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#1a9e8c] rounded-full blur-[150px] opacity-10 animate-pulse" />
                </section>

                {/* Why Heems Section */}
                <section className="py-32">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-24">
                            <h2 className="text-4xl font-black text-[#111827] mb-6">Why work at Heems?</h2>
                            <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">We're building a culture of radical ownership, deep empathy, and rapid iteration.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-12">
                            {[
                                {
                                    icon: Zap,
                                    title: "Hyper-Growth Environment",
                                    desc: "We move fast. You'll have the autonomy to make high-impact decisions and see your work change lives every day."
                                },
                                {
                                    icon: Globe,
                                    title: "Remote-First & Global",
                                    desc: "Work from wherever you're most productive. We're building a distributed team of world-class talent."
                                },
                                {
                                    icon: Heart,
                                    title: "Mission-Driven Tech",
                                    desc: "We don't build software for the sake of it. Everything we do serves a vulnerable population and the people who care for them."
                                }
                            ].map((benefit, i) => (
                                <div key={i} className="space-y-6">
                                    <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-black/5 flex items-center justify-center">
                                        <benefit.icon className="h-7 w-7 text-[#1a9e8c]" />
                                    </div>
                                    <h3 className="text-2xl font-black text-[#111827]">{benefit.title}</h3>
                                    <p className="text-slate-600 font-medium leading-relaxed">{benefit.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Open Roles Section */}
                <section className="py-32 bg-slate-50">
                    <div className="container mx-auto px-6">
                        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div>
                                <h2 className="text-4xl font-black text-[#111827] mb-4">Current Openings</h2>
                                <p className="text-slate-500 font-medium">Join our world-class team across London and beyond.</p>
                            </div>
                            <div className="flex gap-4">
                                <Badge className="bg-white border-black/5 text-[#111827] px-4 py-2 rounded-lg font-bold">All Departments</Badge>
                                <Badge className="bg-white border-black/5 text-slate-400 px-4 py-2 rounded-lg font-bold">Engineering</Badge>
                                <Badge className="bg-white border-black/5 text-slate-400 px-4 py-2 rounded-lg font-bold">Product</Badge>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {jobs.map((job, i) => (
                                <Card key={i} className="group border-black/5 hover:border-[#1a9e8c]/30 hover:shadow-2xl hover:shadow-black/5 transition-all duration-300 rounded-3xl overflow-hidden cursor-pointer">
                                    <CardContent className="p-0">
                                        <div className="flex flex-col md:flex-row items-center justify-between p-8 gap-6">
                                            <div className="flex items-center gap-6 w-full md:w-auto">
                                                <div className="h-14 w-14 rounded-2xl bg-white border border-black/5 flex items-center justify-center shrink-0 group-hover:bg-[#1a9e8c] transition-colors duration-300">
                                                    <Briefcase className="h-6 w-6 text-slate-400 group-hover:text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black text-[#111827] mb-1 group-hover:text-[#1a9e8c] transition-colors">{job.title}</h3>
                                                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
                                                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {job.type}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                                <Badge variant="outline" className="border-black/5 text-slate-500 font-bold px-4 py-1.5 h-auto rounded-full">{job.department}</Badge>
                                                <div className="h-10 w-10 rounded-full border border-black/5 flex items-center justify-center group-hover:bg-[#111827] group-hover:text-white transition-all">
                                                    <ArrowRight className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="mt-16 text-center">
                            <p className="text-slate-500 font-medium mb-6">Don't see a role that fits? We're always looking for exceptional talent.</p>
                            <Button variant="outline" className="h-12 px-8 border-black/10 rounded-xl font-bold hover:bg-black hover:text-white transition-all">Send General Application</Button>
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-32">
                    <div className="container mx-auto px-6">
                        <div className="bg-[#111827] rounded-[3rem] p-12 lg:p-24 text-white flex flex-col items-center text-center overflow-hidden relative">
                            <div className="relative z-10 max-w-2xl">
                                <h2 className="text-4xl font-black mb-8 leading-tight">Beyond the paycheck</h2>
                                <p className="text-white/60 text-lg font-medium mb-12">We provide a comprehensive benefits package designed to help our team grow and thrive both personally and professionally.</p>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                                    <div className="space-y-3">
                                        <p className="text-3xl font-black text-[#1a9e8c]">28d</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Paid Holiday</p>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-3xl font-black text-[#1a9e8c]">100%</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Remote Friendly</p>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-3xl font-black text-[#1a9e8c]">Private</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Healthcare</p>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-3xl font-black text-[#1a9e8c]">Equity</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Stock Options</p>
                                    </div>
                                </div>
                            </div>
                            {/* Abstract Shape */}
                            <div className="absolute bottom-0 right-0 h-full w-1/2 bg-gradient-to-l from-[#1a9e8c]/20 to-transparent pointer-events-none" />
                        </div>
                    </div>
                </section>
            </main>

            <ChatWidget />
            <Footer />
        </div>
    );
};

export default Careers;
