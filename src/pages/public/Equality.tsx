import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/landing/Footer";

const Equality = () => {
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
                <h1 className="text-4xl font-bold mb-8 text-[#111827]">Equality, Diversity & Inclusion Policy</h1>

                <div className="prose prose-lg max-w-none text-slate-600">
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">3.1 Our Commitment</h2>
                        <p>
                            Heems is committed to promoting equality, diversity, and inclusion across its platform. We aim to create a respectful and inclusive environment for all users, including clients, families, carers, and partners.
                        </p>
                        <p className="mt-4">
                            We do not tolerate discrimination, harassment, bullying, or victimisation in any form. All users are expected to treat one another with dignity and respect when using the Heems platform.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">3.2 Protected Characteristics</h2>
                        <p>
                            Heems upholds the principles of the Equality Act 2010 and recognises all protected characteristics, including but not limited to age, disability, gender reassignment, marriage and civil partnership, pregnancy and maternity, race, religion or belief, sex, and sexual orientation.
                        </p>
                        <p className="mt-4">
                            No user will be treated less favourably or excluded from accessing the platform on the basis of any protected characteristic.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">3.3 Fair and Objective Practice</h2>
                        <p>
                            Access to, participation in, and use of the Heems platform is assessed using fair, objective, and transparent criteria. Decisions are based on factors such as platform eligibility, safety requirements, verification standards, availability, and compliance with applicable laws and platform policies.
                        </p>
                        <p className="mt-4">
                            Heems does not make decisions based on personal characteristics unrelated to platform safety, lawful use, or service suitability.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">3.4 Complaints and Concerns</h2>
                        <p>
                            Any concerns or complaints relating to discrimination, unfair treatment, or exclusion may be raised with Heems through the appropriate reporting channels.
                        </p>
                        <p className="mt-4">
                            Heems will review such concerns promptly, impartially, and in accordance with applicable legislation and internal procedures. Where appropriate, actions may be taken to address breaches of this policy, including restriction or removal of access to the platform.
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Equality;
