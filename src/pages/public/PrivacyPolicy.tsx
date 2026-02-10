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
                    {/* 1.1 */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">1.1 Our Commitment to Privacy</h2>
                        <p>
                            Heems is committed to protecting the privacy and personal data of all individuals who use our platform. We recognise the importance of handling personal information responsibly, transparently, and in accordance with applicable data protection laws, including the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. This policy explains how personal information is collected, used, stored, and protected when you interact with Heems.
                        </p>
                    </section>

                    {/* 1.2 */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">1.2 Role as Data Controller</h2>
                        <p>
                            Heems acts as a data controller in respect of personal data processed through the platform. This means we determine how and why personal data is collected and used in connection with our services. The type and amount of personal data we collect depends on how individuals interact with the platform, including whether they are using Heems as a client, family member, independent carer, or organisational user. We are committed to collecting and processing only personal data that is relevant, necessary, and proportionate to the operation, security, and functionality of the platform.
                        </p>
                    </section>

                    {/* 1.3 */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">1.3 Information We Collect</h2>
                        <p className="mb-4">We may collect and process the following categories of personal information:</p>

                        <h3 className="text-lg font-bold text-[#111827] mb-2">a) Information you provide directly</h3>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                            <li>Full name</li>
                            <li>Date of birth</li>
                            <li>Contact information (email address, phone number, postal address)</li>
                            <li>Relationship to the person receiving care (where applicable)</li>
                            <li>Payment and billing information (processed securely by third-party providers)</li>
                            <li>Communication preferences</li>
                            <li>Any messages or information submitted through forms or via in-app communication</li>
                        </ul>

                        <h3 className="text-lg font-bold text-[#111827] mb-2">b) Information related to care arrangements and use of services</h3>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                            <li>Details of care needs and support preferences</li>
                            <li>Care schedules and bookings</li>
                            <li>Interaction history with carers and service providers</li>
                            <li>Relevant health-related information (only where explicitly provided and necessary for care coordination)</li>
                        </ul>

                        <h3 className="text-lg font-bold text-[#111827] mb-2">c) Technical and usage information</h3>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                            <li>Device and browser information</li>
                            <li>IP address</li>
                            <li>Login activity and timestamps</li>
                            <li>User actions and navigation patterns on the platform</li>
                            <li>Cookies and similar tracking technologies (see Section 1.10)</li>
                        </ul>
                    </section>

                    {/* 1.4 */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">1.4 How We Use Personal Information</h2>
                        <p className="mb-4">We use personal data for the following purposes:</p>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                            <li>To provide and manage access to the Heems platform</li>
                            <li>To facilitate care coordination, scheduling, and service delivery</li>
                            <li>To communicate with users about their account, bookings, or inquiries</li>
                            <li>To manage payments and subscriptions</li>
                            <li>To improve the platform’s performance, usability, and user experience</li>
                            <li>To ensure platform safety, prevent misuse, and detect fraud</li>
                            <li>To meet legal or regulatory obligations</li>
                        </ul>
                        <p>We will only process personal data when we have a lawful basis to do so (see Section 1.5).</p>
                    </section>

                    {/* 1.5 */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">1.5 Legal Bases for Processing</h2>
                        <p className="mb-4">Under UK GDPR, we rely on the following lawful bases for processing personal data:</p>

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-bold text-[#111827]">a) Contractual necessity</h3>
                                <p>Processing is necessary to fulfil our service agreement with users, such as managing bookings and platform access.</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-[#111827]">b) Legitimate interests</h3>
                                <p>Processing is necessary for our legitimate interests, such as improving the platform, ensuring security, and preventing misuse, provided those interests do not override your rights.</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-[#111827]">c) Consent</h3>
                                <p>In certain cases, we may ask for your consent to process specific types of data, such as marketing communication or sensitive data. You can withdraw consent at any time.</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-[#111827]">d) Legal obligation</h3>
                                <p>Processing is necessary to comply with legal duties, including tax, financial reporting, or safeguarding requirements.</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-[#111827]">e) Vital interests</h3>
                                <p>In rare cases, we may process data where it is necessary to protect someone’s life or health.</p>
                            </div>
                        </div>
                    </section>

                    {/* 1.6 */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">1.6 Special Category Data</h2>
                        <p className="mb-4">Some information collected through Heems may be considered “special category data” under UK GDPR, such as health-related details. We will only process this data when:</p>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                            <li>It is necessary for care coordination and service delivery, and</li>
                            <li>You have provided it voluntarily or given explicit consent, and</li>
                            <li>Appropriate safeguards are in place.</li>
                        </ul>
                        <p>Special category data is treated with heightened security and access controls.</p>
                    </section>

                    {/* 1.7 */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">1.7 Data Sharing and Disclosure</h2>
                        <p className="mb-4">We may share personal data with:</p>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                            <li>Registered carers and service providers, where necessary to deliver agreed support</li>
                            <li>Payment processors (e.g., Stripe or similar providers), for handling transactions securely</li>
                            <li>Hosting and infrastructure providers, for platform operation and maintenance</li>
                            <li>Analytics and performance tools, used to understand and improve user experience</li>
                            <li>Professional advisers (legal, financial) as required</li>
                            <li>Law enforcement or regulators, where disclosure is required by law</li>
                        </ul>
                        <p>We do not sell personal data to third parties. We only share information where necessary and with appropriate safeguards.</p>
                    </section>

                    {/* 1.8 */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">1.8 International Transfers</h2>
                        <p className="mb-4">If we transfer personal data outside the UK, we ensure appropriate protections are in place, such as:</p>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                            <li>Transfers to countries with adequacy decisions, or</li>
                            <li>Use of Standard Contractual Clauses or equivalent legal safeguards</li>
                        </ul>
                        <p>Where relevant, users will be informed of the transfer and protections used.</p>
                    </section>

                    {/* 1.9 */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">1.9 Data Retention</h2>
                        <p>
                            We retain personal data only for as long as needed to fulfil the purposes outlined in this policy, including legal, operational, and contractual obligations. Retention periods may vary depending on the type of data and how the platform is used. When data is no longer required, it is securely deleted or anonymised.
                        </p>
                    </section>

                    {/* 1.10 */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">1.10 Cookies and Tracking Technologies</h2>
                        <p className="mb-4">Heems uses cookies and similar technologies to:</p>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                            <li>Enable essential platform functionality (e.g., login sessions)</li>
                            <li>Understand user behaviour and improve performance</li>
                            <li>Maintain security and prevent fraud</li>
                        </ul>
                        <p>You can manage cookie preferences through your browser settings. Some cookies may be necessary for the platform to operate properly.</p>
                    </section>

                    {/* 1.11 */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">1.11 Data Security</h2>
                        <p className="mb-4">We take data protection seriously and apply appropriate technical and organisational measures to safeguard personal information, including:</p>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                            <li>Encryption of data in transit and (where applicable) at rest</li>
                            <li>Secure user authentication and access control</li>
                            <li>Routine monitoring, logging, and vulnerability management</li>
                            <li>Role-based access to sensitive information</li>
                            <li>Staff and contractor confidentiality obligations</li>
                        </ul>
                        <p>While we take every reasonable precaution, no system can guarantee absolute security. Users are encouraged to keep login credentials secure.</p>
                    </section>

                    {/* 1.12 */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">1.12 Your Rights</h2>
                        <p className="mb-4">Under UK GDPR, you have the right to:</p>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                            <li>Access the personal data we hold about you</li>
                            <li>Request correction of inaccurate or incomplete data</li>
                            <li>Request deletion of your personal data (subject to legal limits)</li>
                            <li>Restrict or object to certain processing activities</li>
                            <li>Request data portability (where applicable)</li>
                            <li>Withdraw consent (where processing is based on consent)</li>
                            <li>Lodge a complaint with the Information Commissioner’s Office (ICO)</li>
                        </ul>
                        <p>To exercise any of these rights, contact us using the details in Section 1.14.</p>
                    </section>

                    {/* 1.13 */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">1.13 Children’s Data</h2>
                        <p>
                            Heems is not intended for use by children under 16 without appropriate adult supervision. Where data relating to minors is processed (e.g., for care coordination), it is handled carefully and only where necessary, lawful, and supported by appropriate consent or authority.
                        </p>
                    </section>

                    {/* 1.14 */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">1.14 Contact Information</h2>
                        <p className="mb-4">If you have questions about this policy or wish to exercise your rights, please contact:</p>
                        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                            <p className="font-bold">Heems</p>
                            <p>Email: [Insert support or privacy email]</p>
                            <p>Address: [Insert registered address]</p>
                        </div>
                        <p className="mt-4">
                            If you are unsatisfied with how your data is handled, you may contact the Information Commissioner’s Office (ICO) at <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ico.org.uk</a>.
                        </p>
                    </section>

                    {/* 1.15 */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">1.15 Updates to This Policy</h2>
                        <p>
                            We may update this policy from time to time to reflect changes in legal requirements or platform practices. Where changes are significant, we will notify users through the platform or by email. The most recent version will always be available within the platform.
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
