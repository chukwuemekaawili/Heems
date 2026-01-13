import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Shield, Eye, Lock, RefreshCcw } from "lucide-react";
import { ChatWidget } from "@/components/shared/ChatWidget";

const Privacy = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            <main className="pt-24 pb-24">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="bg-white rounded-[3rem] shadow-2xl shadow-black/5 border border-black/5 overflow-hidden mt-12">
                        {/* Header Section */}
                        <div className="p-12 lg:p-20 bg-[#111827] text-white">
                            <Badge className="mb-6 bg-[#1a9e8c] text-white border-none py-1 px-4 text-xs font-black uppercase tracking-widest">Legal & Privacy</Badge>
                            <h1 className="text-5xl font-black mb-6 leading-tight">Privacy Policy</h1>
                            <div className="flex flex-wrap items-center gap-8 text-white/40 text-sm font-bold uppercase tracking-widest">
                                <span className="flex items-center gap-2"><FileText className="h-4 w-4" /> Version 2.4</span>
                                <span className="flex items-center gap-2"><RefreshCcw className="h-4 w-4" /> Updated: Jan 2026</span>
                                <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-[#1a9e8c]" /> GDPR COMPLIANT</span>
                            </div>
                        </div>

                        <div className="p-12 lg:p-20">
                            <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed">
                                <h2 className="text-3xl font-black text-[#111827] mb-8">1. Introduction</h2>
                                <p className="mb-8">At Heems Care Ltd (\"Heems\", \"we\", \"us\", or \"our\"), we are committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our platform.</p>

                                <div className="grid md:grid-cols-2 gap-12 mb-16">
                                    <div className="p-8 rounded-3xl bg-slate-50 border border-black/5">
                                        <div className="h-12 w-12 rounded-2xl bg-[#1a9e8c] flex items-center justify-center mb-6">
                                            <Eye className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-black text-[#111827] mb-4">What we collect</h3>
                                        <p className="text-sm">We collect clinical data, identity documents for vetting, contact information, and payment details to provide our care matching services.</p>
                                    </div>
                                    <div className="p-8 rounded-3xl bg-slate-50 border border-black/5">
                                        <div className="h-12 w-12 rounded-2xl bg-[#1a9e8c] flex items-center justify-center mb-6">
                                            <Lock className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-black text-[#111827] mb-4">How we protect it</h3>
                                        <p className="text-sm">Bank-grade encryption, clinical-grade data centers, and rigorous access controls ensure your sensitive care data is safe.</p>
                                    </div>
                                </div>

                                <h2 className="text-3xl font-black text-[#111827] mb-8">2. Information We Collect</h2>
                                <h3 className="text-xl font-bold text-[#111827] mb-4 underline decoration-[#1a9e8c] decoration-4 underline-offset-4">Personal Data</h3>
                                <p className="mb-6">Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Site or our mobile application.</p>

                                <h3 className="text-xl font-bold text-[#111827] mb-4 underline decoration-[#1a9e8c] decoration-4 underline-offset-4">Sensitive Care Information</h3>
                                <p className="mb-8">Given the nature of our specialist care platform, we may collect information regarding health conditions, medical history, and care requirements. This data is subject to enhanced security protocols and is only shared with verified carers or organisations with your explicit consent.</p>

                                <h2 className="text-3xl font-black text-[#111827] mb-8">3. Use of Your Information</h2>
                                <p className="mb-6">Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
                                <ul className="list-disc pl-6 space-y-4 mb-12">
                                    <li>Create and manage your account.</li>
                                    <li>Verify your identity and eligibility to use the platform.</li>
                                    <li>Match families with specialist carers based on clinical requirements.</li>
                                    <li>Process payments and refunds securely via Stripe.</li>
                                    <li>Increase the efficiency and operation of the Site.</li>
                                    <li>Monitor and analyze usage and trends to improve your experience.</li>
                                </ul>

                                <h2 className="text-3xl font-black text-[#111827] mb-8">4. Disclosure of Your Information</h2>
                                <p className="mb-8 font-black text-[#111827]">We do not sell, rent, or trade your personal information to third parties for marketing purposes.</p>

                                <div className="p-10 bg-[#111827] rounded-[2.5rem] text-white">
                                    <h2 className="text-2xl font-black mb-6">Your Rights Under GDPR</h2>
                                    <p className="mb-8 text-white/60">As a resident of the European Economic Area (EEA), you have certain data protection rights. Heems aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data.</p>
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        {[
                                            "Right of access",
                                            "Right of rectification",
                                            "Right to object",
                                            "Right to restriction",
                                            "Right to data portability",
                                            "Right to erasure"
                                        ].map((right, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="h-2 w-2 rounded-full bg-[#1a9e8c]" />
                                                <span className="text-sm font-bold uppercase tracking-widest text-white/80">{right}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <ChatWidget />
            <Footer />
        </div>
    );
};

export default Privacy;
