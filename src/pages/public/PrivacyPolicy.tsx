import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/landing/Footer";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/[0.03]">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <img
                            src="/heems-logo.png"
                            alt="Heems"
                            className="h-10 w-auto" // Adjusted size
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
                <h1 className="text-4xl font-bold mb-8 text-[#111827]">Privacy & Data Protection Policy</h1>

                <div className="prose prose-lg max-w-none text-slate-600">
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">1.1 Our Commitment to Privacy</h2>
                        <p>
                            Heems is committed to protecting the privacy and personal data of all individuals who use our platform. We recognise the importance of handling personal information responsibly, transparently, and in accordance with applicable data protection laws, including the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
                        </p>
                        <p className="mt-4">
                            This policy explains how personal information is collected, used, stored, and protected when you interact with Heems.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">1.2 Role as Data Controller</h2>
                        <p>
                            Heems acts as a data controller in respect of personal data processed through the platform. This means we determine how and why personal data is collected and used in connection with our services.
                        </p>
                        <p className="mt-4">
                            The type and amount of personal data we collect depends on how individuals interact with the platform, including whether they are using Heems as a client, family member, independent carer, or organisational user.
                        </p>
                        <p className="mt-4">
                            We are committed to collecting and processing only personal data that is relevant, necessary, and proportionate to the operation, security, and functionality of the platform.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">1.3 Information We Collect</h2>
                        <p className="mb-4">We may collect and process the following categories of personal data:</p>

                        <h3 className="text-xl font-bold text-[#111827] mb-2">General Information</h3>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                            <li>Full name, contact details, and account registration information</li>
                            <li>Login credentials and authentication data</li>
                            <li>Communications sent through the platform or to Heems support</li>
                            <li>Payment, billing, and transaction information</li>
                            <li>Technical and usage data, including IP address, browser type, device information, and log files</li>
                        </ul>

                        <h3 className="text-xl font-bold text-[#111827] mb-2">Clients and Organisations</h3>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                            <li>Information relating to non-clinical support needs or preferences</li>
                            <li>Scheduling details and availability information</li>
                            <li>Reviews, ratings, feedback, and platform usage notes</li>
                        </ul>
                        <p className="mt-2 italic">Heems does not require or request detailed medical records or clinical information.</p>

                        <h3 className="text-xl font-bold text-[#111827] mt-4 mb-2">Independent Carers</h3>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                            <li>Profile information, including experience, availability, and skill descriptions</li>
                            <li>Identity verification, right-to-work checks, and eligibility confirmations</li>
                            <li>Disclosure and Barring Service (DBS) status or equivalent background information, where applicable</li>
                            <li>Bank and payout details required to facilitate payments</li>
                        </ul>

                        <h3 className="text-xl font-bold text-[#111827] mt-4 mb-2">Special Category Data</h3>
                        <p>
                            Where necessary, Heems may process limited special category data, such as health-related information, strictly for safeguarding, safety, or essential platform functionality purposes. Such data is processed only where a valid lawful basis exists and with appropriate safeguards in place.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">1.4 How We Collect Information</h2>
                        <p className="mb-4">Personal data may be collected when you:</p>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                            <li>Create or manage an account on the platform</li>
                            <li>Use Heems’ features, messaging tools, or booking systems</li>
                            <li>Communicate with other users through the platform</li>
                            <li>Contact Heems support or submit enquiries</li>
                            <li>Participate in surveys, reviews, or feedback requests</li>
                            <li>Visit or browse our website, including through the use of cookies and similar technologies</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">1.5 Lawful Basis for Processing</h2>
                        <p className="mb-4">Heems processes personal data only where permitted under data protection law. Lawful bases may include:</p>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                            <li><strong>Performance of a contract</strong>, where processing is necessary to provide platform services</li>
                            <li><strong>Legal obligations</strong>, such as financial, tax, or regulatory requirements</li>
                            <li><strong>Legitimate interests</strong>, where processing is necessary for platform operation, security, fraud prevention, or service improvement and does not override individual rights</li>
                            <li><strong>Consent</strong>, where explicitly provided and capable of being withdrawn</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">1.6 How We Use Personal Information</h2>
                        <p className="mb-4">Personal data may be used to:</p>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                            <li>Operate, maintain, and improve the Heems platform</li>
                            <li>Facilitate communication and coordination between users</li>
                            <li>Process payments and manage transactions</li>
                            <li>Provide customer support and respond to enquiries</li>
                            <li>Monitor platform use to promote safety, prevent misuse, and address breaches</li>
                            <li>Comply with safeguarding responsibilities and legal obligations</li>
                            <li>Detect, prevent, and investigate fraud, security issues, or unauthorised activity</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">1.7 Cookies and Analytics</h2>
                        <p>
                            Heems uses cookies and similar technologies to ensure the website functions effectively, improve user experience, and analyse website traffic and interaction patterns.
                        </p>
                        <p className="mt-4">
                            Users can manage cookie preferences through browser settings or via cookie consent tools made available on the website. Further details are provided in our Cookie Policy.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">1.8 Data Sharing</h2>
                        <p>
                            Heems does not sell, rent, or trade personal data.
                        </p>
                        <p className="mt-4 mb-4">
                            We may share personal information with trusted third parties where necessary, including:
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                            <li>Payment processors and financial service providers</li>
                            <li>Identity verification and background-check providers</li>
                            <li>Hosting, analytics, and technical service providers</li>
                            <li>Legal, regulatory, or law enforcement authorities where disclosure is required by law</li>
                        </ul>
                        <p>
                            All third parties are required to handle personal data securely, confidentially, and only in accordance with our instructions and applicable data protection laws.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">1.9 Data Retention</h2>
                        <p>
                            Personal data is retained only for as long as necessary to fulfil the purposes for which it was collected, including legal, contractual, and operational requirements.
                        </p>
                        <p className="mt-4">
                            Certain records, such as financial and transaction data, may be retained for statutory accounting and compliance periods. When data is no longer required, it is securely deleted or anonymised.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">1.10 Your Rights</h2>
                        <p className="mb-4">Under applicable data protection laws, individuals have the right to:</p>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                            <li>Request access to their personal data</li>
                            <li>Request correction of inaccurate or incomplete information</li>
                            <li>Request erasure of personal data where applicable</li>
                            <li>Restrict or object to certain processing activities</li>
                            <li>Request data portability</li>
                            <li>Withdraw consent at any time where processing is based on consent</li>
                        </ul>
                        <p className="mt-4">
                            Requests can be made by contacting Heems directly. Individuals also have the right to lodge a complaint with the Information Commissioner’s Office (ICO) if they believe their data has been handled unlawfully.
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
