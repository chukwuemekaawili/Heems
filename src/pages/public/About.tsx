import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Users, Target, CheckCircle2, ArrowRight, ChevronDown } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { ChatWidget } from "@/components/shared/ChatWidget";
import { motion } from "framer-motion";
const About = () => {
    return (
        <div className="min-h-screen bg-white font-sans">
            <Helmet>
                <title>About Heems - Fixing Private Care with Transparency and Dignity</title>
                <meta name="description" content="Learn about Heems' mission to transform private care. We connect families with vetted, independent care professionals, ensuring transparency, safety, and dignity." />
                <meta property="og:title" content="About Heems - Fixing Private Care with Transparency and Dignity" />
                <meta property="og:description" content="Learn about Heems' mission to transform private care. We connect families with vetted, independent care professionals, ensuring transparency, safety, and dignity." />
                <meta property="og:url" content="https://www.heems.co.uk/about" />
                <meta property="og:type" content="website" />
            </Helmet>

            <Header />

            <main>

                {/* ─── HERO (Cinematic Photo) ─── */}
                <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#111827]">
                    {/* Background image & gradient overlays */}
                    <div className="absolute inset-0">
                        <img
                            src="/about-team.png"
                            alt="The Heems Team"
                            className="w-full h-full object-cover opacity-30"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#111827] via-[#111827]/90 to-[#111827]/40" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
                    </div>

                    {/* Accent orbs */}
                    <div className="absolute top-1/4 right-[10%] w-[400px] h-[400px] rounded-full bg-[#1a9e8c]/15 blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-1/4 left-[5%] w-[300px] h-[300px] rounded-full bg-blue-500/15 blur-[100px] pointer-events-none" />

                    <div className="container mx-auto px-6 lg:px-12 relative z-10 pt-32 pb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-3xl"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest mb-8">
                                <Users className="w-4 h-4 text-[#1a9e8c]" />
                                About Heems
                            </div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-[1.05]">
                                We're on a mission to <br />
                                <span className="text-[#1a9e8c]">fix private care.</span>
                            </h1>

                            <p className="text-lg lg:text-xl text-white/70 font-medium max-w-2xl leading-relaxed mb-10">
                                Heems connects families with vetted, independent care professionals — transparently, safely, and with dignity at the centre of everything.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    asChild
                                    className="bg-[#1a9e8c] hover:bg-[#15806c] text-white font-bold rounded-xl h-14 px-8 text-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5"
                                >
                                    <Link to="/marketplace">
                                        Find a Carer
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-white/20 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 hover:text-white font-bold rounded-xl h-14 px-8 text-lg transition-all duration-300 pointer-events-none"
                                >
                                    Our Story
                                </Button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="mt-16 flex flex-wrap gap-6 items-center"
                        >
                            {[
                                "DBS Verified Team",
                                "Radical Transparency",
                                "Empowered Professionals"
                            ].map((badge) => (
                                <div key={badge} className="flex items-center gap-2 text-white/50 text-sm font-semibold">
                                    <CheckCircle2 className="w-4 h-4 text-[#1a9e8c]" />
                                    {badge}
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
                        <span className="text-white/30 text-xs font-bold uppercase tracking-widest">Scroll</span>
                        <ChevronDown className="w-5 h-5 text-white/30" />
                    </div>
                </section>

                {/* ─── MISSION (Alternating Scroll-Reveal) ─── */}
                <section className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

                    <div className="container mx-auto px-6 lg:px-12 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -60 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.7 }}
                                className="order-2 lg:order-1 relative"
                            >
                                <img
                                    src="/about-care.png"
                                    alt="Caregiver with client"
                                    className="w-full rounded-[2.5rem] shadow-2xl object-cover h-[450px]"
                                />
                                <div className="absolute -bottom-6 -right-6 p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] hidden md:block max-w-[200px]">
                                    <Target className="w-8 h-8 text-[#1a9e8c] mb-3" />
                                    <p className="text-sm font-bold text-[#111827]">Precision matching sets us apart</p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 60 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                                className="order-1 lg:order-2"
                            >
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-200/50 text-slate-700 text-xs font-bold uppercase tracking-widest mb-6 border border-slate-300">
                                    <Target className="w-3.5 h-3.5 text-[#1a9e8c]" />
                                    The Challenge
                                </div>
                                <h2 className="text-4xl lg:text-5xl font-black text-[#111827] mb-6 tracking-tight leading-tight">
                                    The problem we're solving
                                </h2>
                                <p className="text-lg text-slate-600 font-medium leading-relaxed mb-6">
                                    The traditional care industry is fragmented and opaque. Families are left navigating complex vetting, scheduling, and pricing — often during the most stressful moments of their lives.
                                </p>
                                <p className="text-lg text-slate-600 font-medium leading-relaxed mb-8">
                                    Heems provides a premium marketplace that automates vetting, simplifies matching, and brings full transparency — so families can focus on what truly matters.
                                </p>
                                <Button className="h-14 bg-[#111827] hover:bg-[#1a9e8c] text-white rounded-xl font-bold px-8 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300" asChild>
                                    <Link to="/marketplace">
                                        Browse Carers <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ─── CORE VALUES (Staggered Grid) ─── */}
                <section className="py-24 lg:py-32 relative overflow-hidden">
                    <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[#1a9e8c]/5 blur-[100px] pointer-events-none" />
                    <div className="container mx-auto px-6 lg:px-12 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl lg:text-5xl font-black text-[#111827] mb-6 tracking-tight">Our Core Values</h2>
                            <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                                The principles that guide every decision we make.
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-8 relative z-10">
                            {[
                                {
                                    icon: Shield,
                                    title: "Elite-Standard Vetting",
                                    desc: "Every carer undergoes rigorous identity, background, and professional checks before they appear on our platform.",
                                    shadow: "shadow-[0_10px_40px_rgba(26,158,140,0.08)]"
                                },
                                {
                                    icon: Target,
                                    title: "Precision Matching",
                                    desc: "We use detailed preferences to connect families with professionals who are the right fit — not just the nearest available.",
                                    shadow: "shadow-[0_10px_40px_rgba(59,130,246,0.06)]"
                                },
                                {
                                    icon: Users,
                                    title: "Empowering Professionals",
                                    desc: "Independent carers set their own rates, manage their availability, and choose their clients with full transparency.",
                                    shadow: "shadow-[0_10px_40px_rgba(244,63,94,0.06)]"
                                }
                            ].map((value, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.6, delay: i * 0.15 }}
                                    className={`p-10 rounded-[2.5rem] bg-white border border-slate-100 hover:-translate-y-2 transition-transform duration-500 ${value.shadow}`}
                                >
                                    <div className="h-16 w-16 rounded-2xl bg-[#1a9e8c] flex items-center justify-center mb-8 shadow-lg">
                                        <value.icon className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-black text-[#111827] mb-4">{value.title}</h3>
                                    <p className="text-slate-500 font-medium leading-relaxed text-lg">{value.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── WHY HEEMS ─── */}
                <section className="py-20 bg-[#111827]">
                    <div className="container mx-auto px-6 lg:px-12">
                        <div className="max-w-3xl mx-auto text-center mb-16">
                            <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">Why Heems Exists</h2>
                            <p className="text-white/60 font-medium leading-relaxed">
                                Home is where independence feels strongest and dignity feels protected. Arranging care should support that — not disrupt it.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            {[
                                { icon: Heart, title: "Clarity over chaos", body: "Clear rates, clear availability, clear terms. Trust is built through transparency." },
                                { icon: Shield, title: "Safety first", body: "Every professional is verified. Every booking is secure. Every family is protected." },
                                { icon: Users, title: "Care is personal", body: "Whether recovering from surgery or seeking long-term support — the right care makes all the difference." }
                            ].map((item, i) => (
                                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                    <item.icon className="h-6 w-6 text-[#1a9e8c] mb-4" />
                                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                    <p className="text-white/50 font-medium text-sm leading-relaxed">{item.body}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── TEAM (Split View) ─── */}
                <section className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
                    <div className="container mx-auto px-6 lg:px-12 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -60 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.7 }}
                            >
                                <img
                                    src="/about-team.png"
                                    alt="The Heems team"
                                    className="w-full rounded-[2.5rem] shadow-2xl object-cover h-[450px]"
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 60 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                            >
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-200/50 text-slate-700 text-xs font-bold uppercase tracking-widest mb-6 border border-slate-300">
                                    <Users className="w-3.5 h-3.5 text-[#1a9e8c]" />
                                    Our Team
                                </span>
                                <h2 className="text-4xl lg:text-5xl font-black text-[#111827] mb-6 tracking-tight leading-tight">
                                    Built by tech experts, guided by care specialists
                                </h2>
                                <p className="text-lg text-slate-600 font-medium leading-relaxed mb-8">
                                    Our team brings together veterans from healthtech, fintech, and specialist care. We combined high-trust infrastructure with deep human empathy to build a platform families can rely on.
                                </p>
                                <Button className="h-14 px-8 bg-[#111827] hover:bg-[#1a9e8c] text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300" asChild>
                                    <Link to="/careers">
                                        Join Our Mission <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ─── ABOUT & FOUNDER SPLIT ─── */}
                <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
                    <div className="absolute right-0 top-1/4 w-[460px] h-[460px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
                    <div className="absolute left-0 bottom-0 w-[360px] h-[360px] rounded-full bg-[#1a9e8c]/5 blur-[120px] pointer-events-none" />

                    <div className="container mx-auto px-6 lg:px-12 relative z-10">
                        <div className="grid lg:grid-cols-12 gap-12 items-start">
                            {/* Visual + supporting content around the story box */}
                            <motion.div
                                initial={{ opacity: 0, x: -40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-80px" }}
                                transition={{ duration: 0.7 }}
                                className="lg:col-span-7 space-y-8"
                            >
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="rounded-[2rem] overflow-hidden bg-white border border-slate-100 shadow-2xl">
                                        <img
                                            src="/about-care.png"
                                            alt="Care professional supporting a client"
                                            className="w-full h-[320px] object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="grid gap-4">
                                        <div className="rounded-[2rem] overflow-hidden bg-white border border-slate-100 shadow-xl">
                                            <img
                                                src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80"
                                                alt="Care coordination in action"
                                                className="w-full h-[150px] object-cover"
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="rounded-[2rem] overflow-hidden bg-white border border-slate-100 shadow-xl">
                                            <img
                                                src="https://images.unsplash.com/photo-1524504380856-7a0b4ae9532b?auto=format&fit=crop&w=900&q=80"
                                                alt="Supportive hands symbolizing trust"
                                                className="w-full h-[150px] object-cover"
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-4">
                                    {[
                                        {
                                            title: "Transparent journeys",
                                            body: "Clear pricing, clear profiles, and clear availability so families always know what to expect."
                                        },
                                        {
                                            title: "Independent professionals",
                                            body: "Every carer sets their terms while staying DBS-checked, reference-verified, and identity confirmed."
                                        },
                                        {
                                            title: "Human guidance",
                                            body: "Care coordinators and smart matching tools keep bookings simple during stressful moments."
                                        }
                                    ].map((item) => (
                                        <div key={item.title} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
                                            <h3 className="text-lg font-black text-[#111827] mb-2">{item.title}</h3>
                                            <p className="text-sm text-slate-600 font-medium leading-relaxed">{item.body}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Founder / About text box on the side */}
                            <motion.div
                                initial={{ opacity: 0, x: 40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-80px" }}
                                transition={{ duration: 0.7, delay: 0.15 }}
                                className="lg:col-span-5"
                            >
                                <div className="sticky top-8">
                                    <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-10 lg:p-12 border border-slate-100 shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
                                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-widest mb-4">
                                            <Heart className="w-3.5 h-3.5 text-[#1a9e8c]" />
                                            About Us
                                        </span>
                                        <h2 className="text-3xl lg:text-4xl font-black text-[#111827] mb-2 leading-tight">
                                            A Note from the Founder
                                        </h2>
                                        <p className="text-sm text-slate-500 font-semibold mb-4">Heems was created with one clear belief: arranging care for someone you love should feel human, transparent, and dignified — not urgent, confusing, or overwhelming.</p>

                                        <div className="space-y-4 text-slate-700 font-medium leading-relaxed text-base max-h-[680px] overflow-y-auto pr-1">
                                            <p>Over years working within the wider health and care landscape, one recurring pattern became impossible to ignore. Care needs rarely arrive at convenient moments.</p>
                                            <div>
                                                <p className="font-semibold text-[#111827] mb-1">They follow:</p>
                                                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                                                    <li>Accidents</li>
                                                    <li>Unexpected diagnoses</li>
                                                    <li>Complex disabilities</li>
                                                    <li>Mental health crises</li>
                                                    <li>Recovery after surgery</li>
                                                    <li>Chronic illness</li>
                                                    <li>The gradual realisation that extra support is needed at home</li>
                                                </ul>
                                            </div>
                                            <p>Again and again, families found themselves facing the same question: <span className="font-semibold text-[#111827]">How do we find the right support — clearly, confidently, and without unnecessary confusion?</span></p>
                                            <p>Hospital discharge dates approached. Rehabilitation plans changed. Community referrals were delayed. Phone calls were made between work commitments. Options were unclear. Availability shifted. Every provider offered reassurance — yet the process often felt fragmented and difficult to navigate.</p>
                                            <p>The stress did not come from a lack of dedicated professionals. It came from a lack of clarity.</p>
                                            <p>One moment remains particularly vivid. A young adult recovering from a life-altering injury said quietly: <span className="italic text-[#111827]">“I just want to feel normal again — even if it’s just at home.”</span></p>
                                            <p>That sentiment transcends age. Whether it is a person requiring extra support, a parent rebuilding strength after illness, a partner managing a long-term condition, or an older relative wishing to remain independent — the underlying need is the same: to feel safe, to feel seen, to feel at home.</p>
                                            <p>Families are not simply arranging services. They are protecting someone they love — while navigating systems that can feel opaque, rushed, and impersonal.</p>
                                            <p>Traditional models of home support are essential and valuable. Yet administrative layers and limited visibility can sometimes create distance at the very moment reassurance matters most.</p>
                                            <p>Heems was built to provide clarity within a fragmented landscape. By providing clear information and visibility of independent care professionals, Heems enables families to make informed decisions with confidence.</p>
                                            <p className="font-semibold text-[#111827]">Care is personal — at every stage of life. Decisions about care should be supported by clarity, dignity, and confidence. Heems exists to make that possible.</p>
                                            <p className="font-black text-[#111827]">— Founder Hems</p>
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-4">
                                            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#1a9e8c] to-[#111827] flex items-center justify-center text-white shadow-lg">
                                                <Heart className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-black text-[#111827] text-lg">Founder Hems</p>
                                                <p className="text-sm text-slate-500 font-medium">Championing transparency and dignity in care</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ─── WHY WE EXIST & CLARITY ─── */}
                <section className="py-24 lg:py-32 bg-slate-50 border-y border-slate-100">
                    <div className="container mx-auto px-6 lg:px-12 space-y-10">
                        <div className="text-center max-w-3xl mx-auto">
                            <h2 className="text-4xl lg:text-5xl font-black text-[#111827] mb-4 tracking-tight">Why We Exist</h2>
                            <p className="text-lg text-slate-600 font-medium leading-relaxed">
                                Home is where life has been built. It carries history, routine, and identity. It is where independence feels strongest and dignity feels protected.
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8">
                            <div className="p-8 rounded-3xl bg-white shadow-sm border border-slate-100 space-y-4 text-slate-700 leading-relaxed font-medium">
                                <p>When someone begins to need support, remaining at home should feel reassuring. Yet for many families, the process of arranging care becomes complicated — not because care does not exist, but because access to it feels fragmented, rushed, and unclear.</p>
                                <p>Families are often left navigating a system that was never designed for clarity. Decisions must be made quickly. Information is inconsistent. Costs vary without explanation. Availability shifts daily. Phone calls replace certainty. Stress replaces confidence.</p>
                                <p className="font-semibold text-[#111827]">At one of the most vulnerable moments in a family’s life, what is needed most is structure and trust. Heems exists to change that experience.</p>
                            </div>

                            <div className="p-8 rounded-3xl bg-white shadow-sm border border-slate-100 space-y-4 text-slate-700 leading-relaxed font-medium">
                                <h3 className="text-2xl font-black text-[#111827]">Care should not feel chaotic.</h3>
                                <p>Arranging support at home should not feel like negotiating in the dark. It should not require chasing multiple providers for quotes. It should not involve unclear pricing, last-minute uncertainty, or unanswered questions about who is arriving at the door. It should never reduce deeply personal support into a transactional scramble.</p>
                                <p>Yet too often, the traditional system prioritises process over people. Heems was created to bring balance back.</p>
                                <p className="font-semibold text-[#111827]">By introducing transparency, structured booking systems, and direct visibility of independent professional carers, Heems restores clarity to a moment that too often feels overwhelming. Clear rates. Clear availability. Clear terms. Clear responsibilities.</p>
                                <p className="italic text-slate-600">Because trust is not built through branding alone — it is built through structure.</p>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8">
                            <div className="p-8 rounded-3xl bg-white shadow-sm border border-slate-100 space-y-4 text-slate-700 leading-relaxed font-medium">
                                <h3 className="text-2xl font-black text-[#111827]">Independence matters — for everyone.</h3>
                                <p>It matters for those receiving care, who want to remain in control of their choices and daily lives. And it matters equally for those providing it.</p>
                                <p>Professional carers are the foundation of safe, compassionate support at home. Yet many operate within systems that limit autonomy, compress earnings, and remove flexibility. A sustainable care ecosystem must work for both sides.</p>
                                <p className="font-semibold text-[#111827]">Heems supports a more balanced model — one where families can make informed decisions, carers can work independently and sustainably, agreements are clearly defined, expectations are transparent, and payments are structured and secure.</p>
                                <p>When both sides have clarity, relationships strengthen. When relationships strengthen, care improves.</p>
                            </div>

                            <div className="p-8 rounded-3xl bg-white shadow-sm border border-slate-100 space-y-4 text-slate-700 leading-relaxed font-medium">
                                <h3 className="text-2xl font-black text-[#111827]">Empowering Carers</h3>
                                <p>Heems is not only designed for families seeking clarity — it is equally built to support the professionals who deliver care every day.</p>
                                <p>Independent carers are highly skilled, experienced individuals who often prefer to work outside of traditional agency structures. Many value autonomy, flexibility, and the opportunity to build direct, meaningful relationships with the people they support. Yet too often, existing systems limit that independence — controlling schedules, compressing earnings, and restricting choice.</p>
                                <p>Heems provides an alternative. The platform is structured to support carers as independent professionals, offering a transparent environment where they can present their experience, set their own rates, manage availability, and accept bookings that align with their working preferences.</p>
                                <p>This model recognises carers as autonomous professionals — not allocated resources within a centralised system. Because empowering carers ultimately strengthens the quality, stability, and sustainability of care itself.</p>
                                <p className="font-black text-[#111827]">That is the heart of Heems.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── TRUST SIGNALS ─── */}
                <section className="py-16 bg-slate-50 border-y border-slate-100">
                    <div className="container mx-auto px-6 lg:px-12">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="flex flex-wrap justify-center gap-x-12 gap-y-6"
                        >
                            {[
                                "Enhanced DBS Checked",
                                "Identity Verified",
                                "References Confirmed",
                                "Right to Work Validated",
                                "Skills Assessed"
                            ].map((item, i) => (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: i * 0.1 }}
                                    key={item}
                                    className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100"
                                >
                                    <CheckCircle2 className="w-4 h-4 text-[#1a9e8c]" />
                                    {item}
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* ─── REGULATORY STATUS ─── */}
                <section className="py-24 lg:py-32 bg-white">
                    <div className="container mx-auto px-6 lg:px-12 max-w-5xl space-y-12">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6 }}
                            className="text-center max-w-3xl mx-auto space-y-4"
                        >
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-widest">
                                <Shield className="w-3.5 h-3.5" />
                                Transparency
                            </span>
                            <h2 className="text-4xl font-black text-[#111827] tracking-tight">Regulatory Status</h2>
                            <p className="text-lg text-slate-600 font-medium leading-relaxed">What is Heems’ regulatory status?</p>
                            <p className="text-base text-slate-600 font-medium leading-relaxed">The Care Quality Commission (CQC) regulates organisations in England that directly provide regulated health and social care activities — such as personal care delivered under an organised service, nursing care, or medical treatment.</p>
                            <p className="text-base text-slate-600 font-medium leading-relaxed">Heems is structured differently. Heems operates as an introductory platform, providing a digital environment through which families can identify, engage, and arrange support with independent, self-employed carers.</p>
                        </motion.div>

                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 space-y-4 shadow-sm">
                            <h3 className="text-2xl font-black text-[#111827] mb-1">What This Means</h3>
                            <p className="text-base text-slate-700 leading-relaxed font-medium">As an introductory platform:</p>
                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    "The provision of care does not take place under the direction or control of the platform.",
                                    "Responsibility for day-to-day service delivery rests with the independent carer and the family engaging their services.",
                                    "Clinical, nursing, or regulated healthcare activities are outside the scope of the platform’s operations.",
                                    "The platform does not act as a healthcare provider and does not substitute medical or regulated professional oversight."
                                ].map((point, i) => (
                                    <div key={point} className="p-5 rounded-2xl bg-white border border-slate-100 flex gap-3 items-start shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
                                        <div className="h-8 w-8 rounded-full bg-[#1a9e8c]/10 text-[#1a9e8c] font-black flex items-center justify-center shrink-0 mt-0.5">
                                            {i + 1}
                                        </div>
                                        <p className="text-sm text-slate-700 leading-relaxed font-medium">{point}</p>
                                    </div>
                                ))}
                            </div>
                            <p className="text-base text-slate-700 leading-relaxed font-medium">Any agreement for care is formed directly between the family and the independent carer they choose. Responsibility for the delivery, standard, and scope of support rests with those parties.</p>
                            <p className="text-base text-[#111827] font-semibold leading-relaxed">Under this structure, Heems operates as an introductory agency rather than a provider of regulated care services and, as such, does not require registration with the Care Quality Commission (CQC).</p>
                        </div>

                        <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-4">
                            <h3 className="text-2xl font-black text-[#111827] mb-1">Scope of Services and Professional Responsibility</h3>
                            <p className="text-base text-slate-700 leading-relaxed font-medium">Because Heems operates as an introductory platform, independent carers are responsible for ensuring they work within the scope of their training, qualifications, and professional experience.</p>
                            <p className="text-base text-slate-700 leading-relaxed font-medium">Where specialist, clinical, or medical support is required, families should coordinate directly with appropriately qualified healthcare professionals.</p>
                            <p className="text-base text-slate-700 leading-relaxed font-medium">Heems does not assess clinical competencies, direct care provision, or oversee ongoing service delivery. Its role is limited to facilitating introductions and supporting structured coordination between independent parties.</p>
                            <p className="text-base text-slate-700 leading-relaxed font-medium">Heems is a marketplace platform. We facilitate connection and provide secure infrastructure. The agreement for services exists directly between the family and the independent carer.</p>
                            <p className="text-base text-[#111827] font-semibold leading-relaxed">This model provides flexibility and choice, while preserving professional responsibility where it belongs.</p>
                        </div>
                    </div>
                </section>

                {/* ─── CTA ─── */}
                <section className="py-20 bg-[#111827]">
                    <div className="container mx-auto px-6 lg:px-12 text-center max-w-2xl">
                        <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">Ready to get started?</h2>
                        <p className="text-white/60 font-medium mb-10">
                            Join families and professionals who trust Heems for safe, transparent care.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild className="bg-[#1a9e8c] hover:bg-[#15806c] text-white font-bold px-8 h-14 rounded-xl text-base">
                                <Link to="/signup">Get Started</Link>
                            </Button>
                            <Button asChild variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white font-bold px-8 h-14 rounded-xl text-base">
                                <Link to="/contact">Contact Us</Link>
                            </Button>
                        </div>
                    </div>
                </section>

            </main>

            <ChatWidget />
            <Footer />
        </div>
    );
};

export default About;
