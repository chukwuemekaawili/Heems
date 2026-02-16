import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/landing/Footer";

const Safeguarding = () => {
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
                <h1 className="text-4xl font-bold mb-8 text-[#111827]">Safeguarding Policy</h1>

                <div className="prose prose-lg max-w-none text-slate-600">
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">2.1 Our Safeguarding Approach</h2>
                        <p>
                            Heems is committed to promoting safety, dignity, and respectful treatment for adults and children who may be vulnerable when using the platform. Although Heems does not deliver regulated care services and is not a care provider, we recognise the importance of acting responsibly and proportionately where safeguarding concerns are identified in connection with platform use.
                        </p>
                        <p className="mt-4">
                            Our approach focuses on early identification of potential risks, appropriate escalation of concerns, and cooperation with relevant authorities where required by law. We aim to create a platform environment that supports safe interactions between clients, families, and independent carers, while respecting individual rights and autonomy.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">2.2 Scope</h2>
                        <p className="mb-4">This Safeguarding Policy applies to all individuals and entities interacting with the Heems platform, including but not limited to:</p>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                            <li>Heems employees and authorised representatives;</li>
                            <li>Clients, families, and other users of the platform;</li>
                            <li>Independent, self-employed carers who offer services through the platform.</li>
                        </ul>
                        <p>All parties are expected to act in a manner that supports safety, respect, and lawful conduct when using the platform.</p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">2.3 Safeguarding Principles</h2>
                        <p className="mb-4">Heems’ safeguarding approach is informed by widely recognised safeguarding principles and good practice, including:</p>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                            <li><strong>Empowerment</strong> – supporting individuals to make informed choices and respecting their wishes wherever possible;</li>
                            <li><strong>Prevention</strong> – taking reasonable steps to reduce the likelihood of harm occurring;</li>
                            <li><strong>Proportionality</strong> – responding to concerns in a manner that is appropriate to the level of risk identified;</li>
                            <li><strong>Protection</strong> – supporting individuals who may be at risk of harm, abuse, or neglect;</li>
                            <li><strong>Partnership</strong> – working cooperatively with relevant authorities, professionals, or organisations where legally required;</li>
                            <li><strong>Accountability</strong> – ensuring concerns are recorded, reviewed, and handled responsibly.</li>
                        </ul>
                        <p>These principles guide how safeguarding matters are identified, assessed, and escalated through the platform.</p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">2.4 Recognising Risk</h2>
                        <p className="mb-4">Safeguarding concerns may arise in a variety of ways, including but not limited to:</p>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                            <li>Direct disclosures from clients, carers, or family members;</li>
                            <li>Observed behaviours or interactions that raise concern;</li>
                            <li>Complaints or reports submitted through the platform;</li>
                            <li>Information received from third parties or relevant authorities.</li>
                        </ul>
                        <p>All safeguarding concerns are taken seriously. Reports are reviewed promptly and handled in line with this policy and applicable legal requirements.</p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">2.5 Types of Abuse and Harm</h2>
                        <p className="mb-4">Safeguarding concerns may relate to a range of potential risks or harms, including (but not limited to):</p>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                            <li>Physical harm or inappropriate physical treatment;</li>
                            <li>Emotional or psychological harm;</li>
                            <li>Financial abuse, exploitation, or coercion;</li>
                            <li>Sexual abuse or inappropriate conduct;</li>
                            <li>Neglect or acts of omission, including self-neglect;</li>
                            <li>Discriminatory abuse;</li>
                            <li>Exploitation, undue influence, or controlling behaviour.</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">2.6 Reporting Concerns</h2>
                        <p className="mb-4">Anyone who becomes aware of a safeguarding concern should take appropriate action without delay.</p>
                        <p className="mb-2">This may include:</p>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                            <li>Contacting emergency services where there’s an immediate risk of harm</li>
                            <li>Reporting concern to the relevant local authority or safeguarding body</li>
                            <li>Notifying Heems where the concern relates to the use of the platform</li>
                        </ul>
                        <p className="mt-4">Heems will escalate concerns to appropriate authorities when legally required.</p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">2.7 Mental Capacity</h2>
                        <p>
                            Where questions arise regarding an individual’s capacity to make decisions, any actions taken by carers or families should be guided by the principles of the Mental Capacity Act 2005.
                        </p>
                        <p className="mt-4 mb-2">This includes:</p>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                            <li>Presuming capacity unless it is clearly established otherwise</li>
                            <li>Supporting the individual to make their own decisions wherever possible</li>
                            <li>Ensuring that any decision made on behalf of an individual who lacks capacity is made in their best interests</li>
                            <li>Choosing the least restrictive option available when acting or making decisions</li>
                        </ul>
                        <p className="mt-4">
                            Heems does not assess mental capacity and does not make decisions on behalf of clients. Responsibility for complying with the Mental Capacity Act rests with the individuals involved in the care arrangement and any relevant legal representatives or authorities.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-[#111827] mb-4">2.8 Confidentiality and Information Sharing</h2>
                        <p>
                            Any information relating to safeguarding concerns will be handled with appropriate care and confidentiality.
                        </p>
                        <p className="mt-4 mb-2">Information will be:</p>
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                            <li>Shared only where necessary and on a need-to-know basis</li>
                            <li>Processed in accordance with applicable data protection and privacy legislation, including the UK GDPR and Data Protection Act 2018</li>
                            <li>Disclosed to relevant authorities or safeguarding bodies only where required by law or where there is a serious risk to an individual’s safety</li>
                        </ul>
                        <p className="mt-4">
                            Heems does not investigate safeguarding matters but may share relevant platform-related information with appropriate authorities when legally obligated to do so.
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Safeguarding;
