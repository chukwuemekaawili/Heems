import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { ShieldCheck, BarChart3, Users, Zap, Building2, UserPlus, FileSearch, LineChart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Solutions = () => {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-[#1a9e8c]/30">
            <Header />
            <main>
                {/* ─── HERO (Cinematic) ─── */}
                <section className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden bg-[#0B1120]">
                    {/* Background Image & Cinematic Overlays */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/carer_client_home.png"
                            alt="Enterprise Care Solutions"
                            className="w-full h-full object-cover opacity-30 object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1120] via-[#0B1120]/90 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent" />
                    </div>

                    {/* Accent orbs */}
                    <div className="absolute top-1/4 right-[10%] w-[400px] h-[400px] rounded-full bg-[#1a9e8c]/15 blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-1/4 left-[5%] w-[300px] h-[300px] rounded-full bg-blue-500/15 blur-[100px] pointer-events-none" />

                    <div className="container mx-auto px-6 lg:px-12 relative z-10 w-full mt-10">
                        <div className="max-w-3xl">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-widest mb-8 shadow-xl">
                                    <Building2 className="w-4 h-4 text-[#1a9e8c]" />
                                    Enterprise Solutions
                                </div>

                                <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-8 tracking-tight leading-[1.05]">
                                    Care Infrastructure, <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a9e8c] to-emerald-400">Digitally Optimized.</span>
                                </h1>

                                <p className="text-lg lg:text-xl text-white/70 font-medium leading-relaxed mb-10 max-w-2xl">
                                    Heems provides healthcare organisations, councils, and care homes with a high-performance workforce ecosystem and real-time compliance tracking.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                    <Button className="h-14 px-10 rounded-[1.25rem] bg-[#1a9e8c] hover:bg-[#15806c] text-white font-bold text-base shadow-xl transition-all duration-300 hover:shadow-[0_15px_30px_rgba(26,158,140,0.3)] hover:-translate-y-0.5" asChild>
                                        <Link to="/contact">Request Demo</Link>
                                    </Button>
                                    <Button variant="outline" className="h-14 px-10 rounded-[1.25rem] font-bold border-white/20 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 hover:border-white/30 hover:-translate-y-0.5 transition-all duration-300 text-base" asChild>
                                        <Link to="/signup/organisation">Register Organisation</Link>
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                <section className="container mx-auto px-6 lg:px-12 -mt-24 relative z-20 pb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative max-w-6xl mx-auto p-4 lg:p-8 bg-white/90 backdrop-blur-xl border border-white/60 rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#1a9e8c]/5 blur-[100px] pointer-events-none group-hover:bg-[#1a9e8c]/10 transition-colors duration-1000" />
                        <img
                            src="/carer-dashboard-mockup.png"
                            alt="Heems Enterprise Dashboard"
                            className="w-full rounded-[2rem] shadow-2xl border border-black/5 relative z-10 group-hover:scale-[1.01] transition-transform duration-1000"
                        />
                    </motion.div>
                </section>

                {/* Enterprise Modules */}
                <section className="bg-white py-24 lg:py-40 overflow-hidden">
                    <div className="container mx-auto px-6 lg:px-12">
                        <div className="grid lg:grid-cols-2 gap-24 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -60 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8 }}
                                className="space-y-12"
                            >
                                <div className="flex flex-col gap-3">
                                    <h2 className="text-4xl lg:text-5xl xl:text-6xl font-black text-[#111827] tracking-tight leading-[1.05]">Unified Workforce Management.</h2>
                                    <p className="text-xl text-slate-500 font-medium leading-relaxed mt-4">Stop managing spreadsheets. Our enterprise layer allows you to source, vet, and deploy carers across multiple sites in real-time.</p>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-8">
                                    {[
                                        { title: "Smart Matching", icon: Zap, desc: "Algorithmic placement based on skills and location." },
                                        { title: "Auto-Compliance", icon: ShieldCheck, desc: "Real-time auditing of DBS and training status." },
                                        { title: "Live Reporting", icon: LineChart, desc: "Visual data on care outcomes and staffing costs." },
                                        { title: "Role-Based Access", icon: Users, desc: "Secure permissions for managers and admins." }
                                    ].map((feat, i) => (
                                        <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-[#1a9e8c]/20 hover:shadow-[0_20px_60px_rgba(26,158,140,0.1)] hover:-translate-y-2 transition-all duration-500 group">
                                            <div className="w-12 h-12 rounded-xl bg-[#1a9e8c]/5 flex items-center justify-center border border-[#1a9e8c]/10 mb-6 group-hover:bg-[#1a9e8c] transition-colors duration-500">
                                                <feat.icon className="w-5 h-5 text-[#1a9e8c] group-hover:text-white transition-colors duration-500" />
                                            </div>
                                            <h4 className="text-lg font-black text-[#111827] mb-2 tracking-tight">{feat.title}</h4>
                                            <p className="text-sm text-slate-500 leading-relaxed font-medium">{feat.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 60 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8 }}
                                className="grid grid-cols-2 gap-4"
                            >
                                <div className="space-y-4 pt-12">
                                    <div className="h-64 bg-slate-50 rounded-[2.5rem] border border-black/5 p-8 flex flex-col justify-end group hover:border-[#1a9e8c]/30 hover:shadow-[0_15px_40px_rgba(26,158,140,0.1)] hover:-translate-y-2 transition-all duration-500">
                                        <BarChart3 className="w-10 h-10 text-[#1a9e8c] mb-4 group-hover:scale-110 transition-transform duration-500" />
                                        <h4 className="font-bold text-[#111827] text-xl">Efficiency</h4>
                                    </div>
                                    <div className="h-48 bg-[#111827] rounded-[2.5rem] p-8 flex flex-col justify-end text-white group hover:bg-[#0B1120] hover:shadow-[0_15px_40px_rgba(17,24,39,0.2)] hover:-translate-y-2 transition-all duration-500">
                                        <Zap className="w-10 h-10 text-[#1a9e8c] mb-4 group-hover:scale-110 transition-transform duration-500" />
                                        <h4 className="font-bold text-xl">Real-time</h4>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-48 bg-[#1a9e8c] rounded-[2.5rem] p-8 flex flex-col justify-end text-white text-right group hover:bg-emerald-500 hover:shadow-[0_15px_40px_rgba(26,158,140,0.3)] hover:-translate-y-2 transition-all duration-500">
                                        <ShieldCheck className="w-10 h-10 text-white mb-4 ml-auto group-hover:scale-110 transition-transform duration-500" />
                                        <h4 className="font-bold text-xl">Compliant</h4>
                                    </div>
                                    <div className="h-64 bg-slate-50 rounded-[2.5rem] border border-black/5 p-8 flex flex-col justify-end group hover:border-[#1a9e8c]/30 hover:shadow-[0_15px_40px_rgba(26,158,140,0.1)] hover:-translate-y-2 transition-all duration-500">
                                        <UserPlus className="w-10 h-10 text-[#1a9e8c] mb-4 group-hover:scale-110 transition-transform duration-500" />
                                        <h4 className="font-bold text-[#111827] text-xl">Onboarding</h4>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Dynamic CTA */}
                <section className="bg-[#0B1120] py-24 lg:py-40 relative overflow-hidden group">
                    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8 }}
                        className="container mx-auto px-6 lg:px-12 text-center text-white relative z-10"
                    >
                        <h2 className="text-5xl lg:text-7xl font-black mb-8 tracking-tight leading-[1.1]">Modernize your <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a9e8c] to-emerald-400">care layer.</span></h2>
                        <p className="text-slate-400 text-xl font-medium mb-12 max-w-2xl mx-auto">Join the forward-thinking healthcare organisers using Heems to deliver better outcomes.</p>
                        <Button size="lg" className="h-16 px-12 rounded-[1.25rem] bg-[#1a9e8c] text-white font-black hover:bg-emerald-500 shadow-[0_10px_30px_rgba(26,158,140,0.3)] hover:shadow-[0_15px_40px_rgba(26,158,140,0.4)] hover:-translate-y-1 text-lg transition-all duration-500" asChild>
                            <Link to="/contact">Enterprise Enquiry</Link>
                        </Button>
                    </motion.div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Solutions;
