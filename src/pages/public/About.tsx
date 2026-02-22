import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Users, Scale, Quote, Target, Rocket, Award } from "lucide-react";
import { ChatWidget } from "@/components/shared/ChatWidget";

const About = () => {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="pt-24">

                {/* Hero (Old Content) */}
                <section className="py-24 bg-slate-50 relative overflow-hidden">
                    <div className="container mx-auto px-6 text-center relative z-10">
                        <div className="max-w-3xl mx-auto">
                            <span className="inline-block text-xs font-black text-[#1a9e8c] uppercase tracking-widest mb-6">
                                About Heems
                            </span>
                            <h1 className="text-5xl lg:text-6xl font-black text-[#111827] mb-8 leading-tight">We're on a mission to <span className="text-[#1a9e8c]">fix private care</span>.</h1>
                            <p className="text-xl text-slate-600 font-medium leading-relaxed">
                                Heems was created with one clear belief: arranging care for someone you love should feel human, transparent, and dignified — not urgent, confusing, or overwhelming.
                            </p>
                        </div>
                    </div>
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-[#1a9e8c]/5 rounded-full blur-[100px]" />
                </section>

                {/* Founder Note (New Content) */}
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
                        <div className="bg-slate-50 rounded-3xl p-10 lg:p-16 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-4 mb-8">
                                <Quote className="w-10 h-10 text-[#1a9e8c]/30" />
                                <h2 className="text-2xl font-black text-[#111827]">A note from the Founder</h2>
                            </div>

                            <div className="prose prose-lg prose-slate max-w-none space-y-6 text-slate-700 leading-relaxed">
                                <p>
                                    Over years working within the wider health and care landscape, one recurring pattern became impossible to ignore.
                                </p>
                                <p className="font-semibold text-[#111827]">Care needs rarely arrive at convenient moments.</p>
                                <ul className="list-none space-y-1 pl-4 border-l-2 border-[#1a9e8c]/30 not-prose">
                                    <li className="text-slate-600">They follow accidents.</li>
                                    <li className="text-slate-600">Unexpected diagnoses.</li>
                                    <li className="text-slate-600">Complex disabilities.</li>
                                    <li className="text-slate-600">Mental health crises.</li>
                                    <li className="text-slate-600">Recovery after surgery.</li>
                                    <li className="text-slate-600">Chronic illness.</li>
                                    <li className="text-slate-600">Or the gradual realisation that extra support is needed at home.</li>
                                </ul>
                                <p>
                                    Again and again, families found themselves facing the same question:
                                </p>
                                <p className="text-xl font-bold text-[#111827] italic">
                                    "How do we find the right support — clearly, confidently, and without unnecessary confusion?"
                                </p>
                                <p>
                                    Hospital discharge dates approached. Rehabilitation plans changed. Community referrals were delayed. Phone calls were made between work commitments. Options were unclear. Availability shifted. Every provider offered reassurance — yet the process often felt fragmented and difficult to navigate.
                                </p>
                                <p>
                                    The stress did not come from a lack of dedicated professionals. <strong>It came from a lack of clarity.</strong>
                                </p>
                                <div className="bg-[#111827] text-white rounded-2xl p-8 not-prose">
                                    <p className="text-white/80 italic text-lg leading-relaxed">
                                        "I just want to feel normal again — even if it's just at home."
                                    </p>
                                    <p className="text-white/40 text-sm mt-3">— A young adult recovering from a life-altering injury</p>
                                </div>
                                <p>
                                    That sentiment transcends age. Whether it is a person requiring extra support, a parent rebuilding strength after illness, a partner managing a long-term condition, or an older relative wishing to remain independent — the underlying need is the same:
                                </p>
                                <ul className="list-none space-y-1 pl-4 border-l-2 border-[#1a9e8c]/30 not-prose">
                                    <li className="text-slate-600 font-medium">To feel safe.</li>
                                    <li className="text-slate-600 font-medium">To feel seen.</li>
                                    <li className="text-slate-600 font-medium">To feel at home.</li>
                                </ul>
                                <p>
                                    By providing clear information and visibility of independent care professionals, Heems enables families to make informed decisions with confidence.
                                </p>
                                <p className="text-[#111827] font-semibold">Care is personal — at every stage of life. Decisions about care should be supported by clarity, dignity, and confidence. Heems exists to make that possible.</p>
                            </div>
                            <div className="mt-10 pt-8 border-t border-slate-200 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-[#1a9e8c] flex items-center justify-center text-white font-bold text-lg">F</div>
                                <div>
                                    <p className="font-black text-[#111827]">Founder, Heems</p>
                                    <p className="text-sm text-slate-500">London, UK</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Vision Section (Old Content) */}
                <section className="py-24">
                    <div className="container mx-auto px-6 lg:px-12">
                        <div className="grid lg:grid-cols-2 gap-24 items-center">
                            <div>
                                <h2 className="text-4xl font-black text-[#111827] mb-8 leading-tight">The problem we're solving</h2>
                                <div className="space-y-6 text-lg text-slate-600 font-medium leading-relaxed">
                                    <p>The traditional care industry is fragmented, slow, and often lacks the necessary oversight to ensure safety and quality. Families are left to navigate complex regulations and vetting processes on their own.</p>
                                    <p>Heems provides a clinical-grade platform that automates vetting, matching, and management, allowing families to focus on what matters most: quality care for their loved ones.</p>
                                </div>
                                <div className="mt-10 flex gap-4">
                                    <Button className="h-14 px-8 bg-[#111827] hover:bg-[#1a9e8c] text-white rounded-xl font-black" asChild>
                                        <Link to="/marketplace">Browse Our Care Ecosystem</Link>
                                    </Button>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="aspect-square bg-slate-100 rounded-[3rem] overflow-hidden shadow-2xl">
                                    <img
                                        src="/about-care.png"
                                        alt="Professional carer with elderly client"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {/* Stats Overlay */}
                                <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-2xl shadow-black/5 border border-black/5 hidden md:block">
                                    <p className="text-4xl font-black text-[#111827] mb-1">100%</p>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Vetted Professionals</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section (Old Content) */}
                <section className="py-24 bg-[#111827] text-white">
                    <div className="container mx-auto px-6 lg:px-12">
                        <div className="text-center mb-24">
                            <h2 className="text-4xl font-black mb-6">Our Core Values</h2>
                            <p className="text-white/60 text-lg font-medium max-w-2xl mx-auto">These principles guide every decision we make and every feature we build.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-12">
                            {[
                                {
                                    icon: Shield,
                                    title: "Clinical-Grade Vetting",
                                    desc: "Security isn't a feature; it's our foundation. Every carer undergoes rigorous identity, background, and professional checks."
                                },
                                {
                                    icon: Target,
                                    title: "Hyper-Precision Matching",
                                    desc: "We use data-driven insights to match families with carers who aren't just qualified, but are the right fit for their specific needs."
                                },
                                {
                                    icon: Users,
                                    title: "Empowering Organisations",
                                    desc: "We provide the infrastructure for care agencies to scale safely and efficiently, raising the standard for the entire industry."
                                }
                            ].map((value, i) => (
                                <div key={i} className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="h-14 w-14 rounded-2xl bg-[#1a9e8c] flex items-center justify-center mb-8">
                                        <value.icon className="h-7 w-7 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-black mb-4">{value.title}</h3>
                                    <p className="text-white/60 font-medium leading-relaxed">{value.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why We Exist (New Content) */}
                <section className="py-24">
                    <div className="container mx-auto px-6 lg:px-12">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-4xl lg:text-5xl font-black text-[#111827] mb-6">Why We Exist</h2>
                            <p className="text-xl text-slate-600 leading-relaxed mb-16">
                                Home is where life has been built. It carries history, routine, and identity. It is where independence feels strongest and dignity feels protected.
                            </p>

                            <div className="grid md:grid-cols-3 gap-8 mb-16">
                                {[
                                    {
                                        icon: Heart,
                                        title: "Care should not feel chaotic.",
                                        body: "Arranging support at home should not feel like negotiating in the dark. Clear rates. Clear availability. Clear terms. Clear responsibilities. Because trust is built through structure."
                                    },
                                    {
                                        icon: Scale,
                                        title: "Independence matters",
                                        body: "It matters for those receiving care, and equally for those providing it. Heems supports a more balanced model where both families and carers have clarity, autonomy, and structure."
                                    },
                                    {
                                        icon: Users,
                                        title: "Empowering Carers.",
                                        body: "Heems supports carers as independent professionals — offering a transparent environment to present experience, set own rates, manage availability, and accept bookings that align with their preferences."
                                    }
                                ].map((item, i) => (
                                    <div key={i} className="group p-8 rounded-3xl border border-slate-100 hover:border-[#1a9e8c]/30 hover:shadow-xl transition-all duration-300">
                                        <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-[#1a9e8c] transition-colors">
                                            <item.icon className="h-7 w-7 text-slate-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <h3 className="text-xl font-black text-[#111827] mb-4">{item.title}</h3>
                                        <p className="text-slate-600 leading-relaxed">{item.body}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team/Impact Section */}
                <section className="py-24 bg-slate-50">
                    <div className="container mx-auto px-6 lg:px-12 text-center">
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-4xl font-black text-[#111827] mb-8 leading-tight">Built by technology experts, guided by care specialists</h2>
                            <p className="text-lg text-slate-600 font-medium leading-relaxed mb-10">
                                Our team brings together veterans from the healthtech, fintech, and specialist care sectors. We combined high-trust infrastructure principles with deep clinical empathy to create Heems.
                            </p>
                            <Button className="h-14 px-10 bg-[#111827] text-white hover:bg-[#111827]/90 rounded-xl font-black transition-all" asChild>
                                <Link to="/careers">Join Our Mission</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Regulatory Status (New Content) */}
                <section className="py-24">
                    <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
                        <div className="mb-12">
                            <span className="inline-block text-xs font-black text-[#1a9e8c] uppercase tracking-widest mb-4">Transparency</span>
                            <h2 className="text-4xl font-black text-[#111827] mb-6">Regulatory Status</h2>
                            <p className="text-xl text-slate-600 leading-relaxed">
                                The Care Quality Commission (CQC) regulates organisations in England that directly provide regulated health and social care activities. Heems is structured differently.
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm mb-8">
                            <div className="flex items-start gap-4 mb-8">
                                <div className="h-10 w-10 rounded-full bg-[#1a9e8c]/10 flex items-center justify-center shrink-0 mt-1">
                                    <Shield className="h-5 w-5 text-[#1a9e8c]" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-[#111827] mb-2">Heems operates as an introductory platform.</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        We provide a digital environment through which families can identify, engage, and arrange support with independent, self-employed carers.
                                    </p>
                                </div>
                            </div>

                            <h4 className="font-black text-[#111827] mb-4 text-sm uppercase tracking-widest">What This Means</h4>
                            <div className="space-y-4">
                                {[
                                    "The provision of care does not take place under the direction or control of the platform.",
                                    "Responsibility for day-to-day service delivery rests with the independent carer and the family engaging their services.",
                                    "Clinical, nursing, or regulated healthcare activities are outside the scope of the platform's operations.",
                                    "The platform does not act as a healthcare provider and does not substitute medical or regulated professional oversight."
                                ].map((point, i) => (
                                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-slate-50">
                                        <span className="text-xs font-black text-[#1a9e8c] mt-0.5 shrink-0">{i + 1}.</span>
                                        <p className="text-slate-600 leading-relaxed">{point}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#111827] text-white rounded-3xl p-10">
                            <h3 className="text-2xl font-black mb-4">Scope of Services & Professional Responsibility</h3>
                            <p className="text-white/70 leading-relaxed mb-4">
                                Because Heems operates as an introductory platform, independent carers are responsible for ensuring they work within the scope of their training, qualifications, and professional experience.
                            </p>
                            <p className="text-white/70 leading-relaxed mb-4">
                                Where specialist, clinical, or medical support is required, families should coordinate directly with appropriately qualified healthcare professionals.
                            </p>
                            <p className="text-white/50 text-sm leading-relaxed border-t border-white/10 pt-6 mt-6">
                                Heems is a marketplace platform. We facilitate connection and provide secure infrastructure. The agreement for services exists directly between the family and the independent carer. Under this structure, Heems operates as an introductory agency rather than a provider of regulated care services and, as such, does not require registration with the Care Quality Commission (CQC).
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA (New Content) */}
                <section className="py-24 bg-slate-50">
                    <div className="container mx-auto px-6 lg:px-12 text-center max-w-2xl">
                        <h2 className="text-4xl font-black text-[#111827] mb-6">Care built on trust.</h2>
                        <p className="text-slate-600 text-xl leading-relaxed mb-10">
                            Join thousands of families and independent carers who trust Heems to facilitate clarity, structure, and confidence in care.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild className="bg-[#1a9e8c] hover:bg-[#1a9e8c]/90 text-white font-bold px-10 py-6 rounded-2xl text-base">
                                <Link to="/signup">Get Started</Link>
                            </Button>
                            <Button asChild variant="outline" className="font-bold px-10 py-6 rounded-2xl text-base border-slate-200">
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
