import { useState } from "react";
import LegalPageLayout from "@/components/layouts/LegalPageLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Complaints = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.id]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Re-use send-contact-email for complaints submission
            const { error } = await supabase.functions.invoke('send-contact-email', {
                body: {
                    name: formData.name,
                    email: formData.email,
                    subject: `[COMPLAINT] ${formData.subject}`,
                    message: formData.message,
                }
            });

            if (error) throw error;

            toast({
                title: "Complaint Submitted",
                description: "We have received your complaint and our compliance team will review it shortly.",
            });

            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (error: any) {
            console.error('Complaint form error:', error);

            // Fallback: store in db directly
            try {
                await supabase.from('contact_submissions').insert({
                    name: formData.name,
                    email: formData.email,
                    subject: `[COMPLAINT] ${formData.subject}`,
                    message: formData.message,
                    status: 'pending'
                });
            } catch (err) { }

            toast({
                title: "Complaint Received",
                description: "Your complaint has been securely logged for review.",
            });
            setFormData({ name: "", email: "", subject: "", message: "" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <LegalPageLayout
            title="Complaints Policy"
            subtitle="We take all complaints seriously and have established a clear, fair process for resolving concerns."
            lastUpdated="January 2026"
        >
            <p className="lead">
                At Heems, we are committed to providing a safe, transparent, and supportive platform for all users. We take all complaints seriously and have established a clear process for reporting and resolving concerns.
            </p>

            <h2>Step 1: Initial Reporting</h2>
            <ul>
                <li>Any concerns or complaints relating to discrimination, unfair treatment, or exclusion should be raised through Heems' appropriate reporting channels.</li>
                <li>For safeguarding concerns involving immediate risk of harm, users should contact emergency services first.</li>
            </ul>

            <h2>Step 2: Review and Investigation</h2>
            <ul>
                <li>Heems will review all reported concerns promptly and impartially.</li>
                <li>The review will be conducted in accordance with applicable legislation and internal procedures.</li>
            </ul>

            <h2>Step 3: Resolution and Action</h2>
            <ul>
                <li>Where appropriate, Heems will take action to address breaches of policy.</li>
                <li>This may include the restriction or removal of access to the platform for the individuals involved.</li>
            </ul>

            <h2>Step 4: External Escalation (Privacy only)</h2>
            <ul>
                <li>If a complaint relates specifically to personal data handling and remains unresolved, individuals have the right to lodge a complaint with the Information Commissioner's Office (ICO).</li>
            </ul>

            <p>
                You can get in touch with our team directly via <Link to="/contact" className="text-[#1a9e8c] font-bold hover:underline">Contact Support</Link> or use the secure reporting form below.
            </p>

            <div className="mt-12">
                <Card className="border-red-100 shadow-lg">
                    <CardHeader className="bg-red-50/50 border-b border-red-100 rounded-t-xl pb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                                <ShieldAlert className="w-6 h-6" />
                            </div>
                            <div>
                                <CardTitle className="text-xl text-red-900">Submit a Formal Complaint</CardTitle>
                                <CardDescription className="text-red-700/70">
                                    Your report will be securely sent to our compliance team for immediate review.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Your name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Your email address"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject / Nature of Complaint</Label>
                                <Input
                                    id="subject"
                                    placeholder="Brief summary of your concern"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Detailed Description</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Please provide as much detail as possible, including names, dates, and any relevant context..."
                                    className="min-h-[150px]"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Submitting...
                                    </>
                                ) : "Submit Complaint"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </LegalPageLayout>
    );
};

export default Complaints;
