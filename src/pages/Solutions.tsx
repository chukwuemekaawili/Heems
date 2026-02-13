import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { ShieldCheck, BarChart3, Users, Zap, Building2, UserPlus, FileSearch, LineChart } from "lucide-react";
import { Link } from "react-router-dom";

const Solutions = () => {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="pt-24 lg:pt-32">
                {/* Solution Hero */}
                <section className="container mx-auto px-6 lg:px-12 py-16 lg:py-24">
                    <div className="max-w-4xl mx-auto text-center mb-16 lg:mb-24">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111827]/5 border border-[#111827]/10 text-[#111827] text-xs font-bold uppercase tracking-widest mb-8">
                            <Building2 className="w-3 h-3" />
                            Enterprise Solutions
                        </div>
                        <h1 className="text-5xl lg:text-8xl font-black text-[#111827] tracking-tighter leading-none mb-8">
                            Care Infrastructure, <br />
                            <span className="text-[#1a9e8c]">Digitally Optimized.</span>
                        </h1>
                        <p className="text-xl text-[#4B5563] font-medium leading-relaxed max-w-2xl mx-auto mb-10">
                            Heems provides healthcare organisations, councils, and care homes with a high-performance workforce ecosystem and real-time compliance tracking.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button className="h-14 px-10 rounded-2xl bg-[#111827] text-white font-bold text-base hover:bg-[#1a9e8c] shadow-lg shadow-[#111827]/10 transition-all" asChild>
                                <Link to="/contact">Request Demo</Link>
                            </Button>
                            <Button variant="outline" className="h-14 px-10 rounded-2xl font-bold border-black/5 hover:bg-slate-50 transition-all text-base" asChild>
                                <Link to="/signup/organisation">Register Organisation</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="relative max-w-6xl mx-auto px-10 py-10 bg-slate-50 border border-black/5 rounded-[4rem] overflow-hidden">
                        <img
                            src="/carer-dashboard-mockup.png"
                            alt="Heems Enterprise Dashboard"
                            className="w-full rounded-3xl shadow-2xl border border-black/10"
                        />
                    </div>
                </section>

                {/* Enterprise Modules */}
                <section className="bg-white py-24 lg:py-40">
                    <div className="container mx-auto px-6 lg:px-12">
                        <div className="grid lg:grid-cols-2 gap-24 items-center">
                            <div className="space-y-12">
                                <div className="flex flex-col gap-3">
                                    <h2 className="text-3xl lg:text-5xl font-black text-[#111827] tracking-tight">Unified Workforce Management.</h2>
                                    <p className="text-[#4B5563] font-medium leading-relaxed">Stop managing spreadsheets. Our enterprise layer allows you to source, vet, and deploy carers across multiple sites in real-time.</p>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-8">
                                    {[
                                        { title: "Smart Matching", icon: Zap, desc: "Algorithmic placement based on skills and location." },
                                        { title: "Auto-Compliance", icon: ShieldCheck, desc: "Real-time auditing of DBS and training status." },
                                        { title: "Live Reporting", icon: LineChart, desc: "Visual data on care outcomes and staffing costs." },
                                        { title: "Role-Based Access", icon: Users, desc: "Secure permissions for managers and admins." }
                                    ].map((feat, i) => (
                                        <div key={i} className="space-y-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-black/[0.03]">
                                                <feat.icon className="w-5 h-5 text-[#1a9e8c]" />
                                            </div>
                                            <h4 className="font-bold text-[#111827]">{feat.title}</h4>
                                            <p className="text-xs text-[#4B5563] leading-relaxed font-medium">{feat.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4 pt-12">
                                    <div className="h-64 bg-slate-50 rounded-[2rem] border border-black/5 p-8 flex flex-col justify-end">
                                        <BarChart3 className="w-10 h-10 text-[#1a9e8c] mb-4" />
                                        <h4 className="font-bold text-[#111827]">Efficiency</h4>
                                    </div>
                                    <div className="h-48 bg-[#111827] rounded-[2rem] p-8 flex flex-col justify-end text-white">
                                        <Zap className="w-10 h-10 text-[#1a9e8c] mb-4" />
                                        <h4 className="font-bold">Real-time</h4>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-48 bg-[#1a9e8c] rounded-[2rem] p-8 flex flex-col justify-end text-white text-right">
                                        <ShieldCheck className="w-10 h-10 text-white mb-4 ml-auto" />
                                        <h4 className="font-bold">Compliant</h4>
                                    </div>
                                    <div className="h-64 bg-slate-50 rounded-[2rem] border border-black/5 p-8 flex flex-col justify-end">
                                        <UserPlus className="w-10 h-10 text-[#1a9e8c] mb-4" />
                                        <h4 className="font-bold text-[#111827]">Onboarding</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Dynamic CTA */}
                <section className="bg-[#111827] py-24 lg:py-40">
                    <div className="container mx-auto px-6 lg:px-12 text-center text-white">
                        <h2 className="text-4xl lg:text-7xl font-black mb-8 tracking-tighter">Modernize your care layer.</h2>
                        <p className="text-white/60 font-medium mb-12 max-w-xl mx-auto">Join the forward-thinking healthcare organisers using Heems to deliver better outcomes.</p>
                        <Button size="lg" className="h-16 px-12 rounded-2xl bg-[#1a9e8c] text-white font-black hover:bg-[#15806c] shadow-2xl shadow-[#1a9e8c]/10 text-lg transition-all" asChild>
                            <Link to="/contact">Enterprise Enquiry</Link>
                        </Button>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Solutions;
