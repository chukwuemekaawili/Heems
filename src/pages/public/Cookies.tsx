import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/landing/Footer";

const Cookies = () => {
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
                <h1 className="text-4xl font-bold mb-8 text-[#111827]">Cookie Policy</h1>

                <div className="prose prose-lg max-w-none text-slate-600">
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">What Are Cookies?</h2>
                        <p>
                            Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">How We Use Cookies</h2>
                        <p className="mb-4">Heems uses cookies for several reasons:</p>
                        <ul className="list-disc pl-6 mb-4 space-y-2">
                            <li><strong>Essential Cookies:</strong> These are necessary for the platform to function properly. They enable core features like secure login, session management, and load balancing. Without these, the site cannot perform as intended.</li>
                            <li><strong>Analytical Cookies:</strong> We use these to understand how visitors interact with our platform. They help us track performance, identify issues, and improve the overall user experience. This data is aggregated and anonymous.</li>
                            <li><strong>Functional Cookies:</strong> These allow the platform to remember choices you make (such as your language or region) and provide enhanced, more personal features.</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">Managing Your Preferences</h2>
                        <p>
                            Most web browsers allow you to control cookies through their settings. You can set your browser to block cookies or alert you when a cookie is being sent. However, please note that if you disable essential cookies, some parts of the Heems platform may not function correctly.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">Third-Party Cookies</h2>
                        <p>
                            We may also use third-party cookies provided by trusted partners (such as Stripe for payments or Google Analytics for performance tracking). These third parties may use cookies to gather information about your activities on our platform for their own purposes.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">Updates to This Policy</h2>
                        <p>
                            We may update our Cookie Policy from time to time to reflect changes in our practices or for legal and regulatory reasons. We encourage you to review this page periodically for the latest information on our use of cookies.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">Contact Us</h2>
                        <p>
                            If you have any questions about our use of cookies, please contact us at <a href="mailto:support@heemscare.com" className="text-primary hover:underline">support@heemscare.com</a>.
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Cookies;
