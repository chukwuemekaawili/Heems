import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/landing/Footer";

const Complaints = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/[0.03]">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <img
                            src="/heems-logo.png"
                            alt="Heems"
                            className="h-10 w-auto"
                        />
                    </Link>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" asChild>
                            <Link to="/">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Home
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="container mx-auto px-6 pt-32 pb-24 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8 text-[#111827]">Complaints Policy</h1>

                <div className="prose prose-lg max-w-none text-slate-600">
                    <p className="mb-10 text-xl font-medium leading-relaxed">
                        At Heems, we are committed to providing a safe, transparent, and supportive platform for all users. We take all complaints seriously and have established a clear process for reporting and resolving concerns.
                    </p>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">Step 1: Initial Reporting</h2>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                            <li>Any concerns or complaints relating to discrimination, unfair treatment, or exclusion should be raised through Heems’ appropriate reporting channels.</li>
                            <li>For safeguarding concerns involving immediate risk of harm, users should contact emergency services first.</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">Step 2: Review and Investigation</h2>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                            <li>Heems will review all reported concerns promptly and impartially.</li>
                            <li>The review will be conducted in accordance with applicable legislation and internal procedures.</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">Step 3: Resolution and Action</h2>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                            <li>Where appropriate, Heems will take action to address breaches of policy.</li>
                            <li>This may include the restriction or removal of access to the platform for the individuals involved.</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">Step 4: External Escalation (Privacy only)</h2>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                            <li>If a complaint relates specifically to personal data handling and remains unresolved, individuals have the right to lodge a complaint with the Information Commissioner’s Office (ICO).</li>
                        </ul>
                    </section>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mt-12">
                        <h3 className="text-lg font-bold text-[#111827] mb-2">Need to raise a concern?</h3>
                        <p className="mb-4">
                            You can contact our support team directly or use the reporting tools available within the dashboard.
                        </p>
                        <Button asChild>
                            <Link to="/contact">Contact Support</Link>
                        </Button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Complaints;
