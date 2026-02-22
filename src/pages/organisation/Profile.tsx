import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Building2, Phone, Mail, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

const OrganisationProfile = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [formData, setFormData] = useState({
        companyName: "",
        registrationNumber: "",
        description: "",
        postcode: "",
        serviceRadius: "10",
        phone: "",
        email: "",
        isVerified: false,
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
            setFetching(false);
            return;
        }

        try {
            setFetching(true);
            const { data, error } = await supabase
                .from('organisation_details')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                throw error;
            }

            if (data) {
                setFormData(prev => ({
                    ...prev,
                    companyName: data.company_name || "",
                    registrationNumber: data.registration_number || "",
                    description: data.description || "",
                    postcode: data.postcode || "",
                    serviceRadius: data.service_radius_miles?.toString() || "10",
                    isVerified: data.is_verified || false,
                    email: session.user.email || prev.email,
                }));
            } else {
                setFormData(prev => ({ ...prev, email: session.user.email || prev.email }));
            }
        } catch (error) {
            console.error("Error fetching org profile:", error);
        } finally {
            setFetching(false);
        }
    };

    const handleSave = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) return;

        try {
            setLoading(true);

            const updateData = {
                id: session.user.id,
                company_name: formData.companyName,
                registration_number: formData.registrationNumber,
                description: formData.description,
                postcode: formData.postcode,
                service_radius_miles: parseInt(formData.serviceRadius) || 10,
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase
                .from('organisation_details')
                .upsert(updateData);

            if (error) throw error;

            toast({
                title: "Profile Updated",
                description: "Your organisation details have been saved successfully.",
            });

        } catch (error: any) {
            toast({
                title: "Error saving profile",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 py-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="h-2 w-2 rounded-full bg-[#1a9e8c]" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Organisation Profile</span>
                    </div>
                    <h1 className="text-3xl font-black text-[#111827] tracking-tight">Company Details</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage your organisation's public information and service area.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Badge variant={formData.isVerified ? "default" : "secondary"} className={`px-4 py-2 text-sm font-bold ${formData.isVerified ? 'bg-[#1a9e8c]' : 'bg-amber-100 text-amber-700'}`}>
                        {formData.isVerified ? (
                            <><CheckCircle2 className="w-4 h-4 mr-2" /> Verified Organisation</>
                        ) : (
                            <><AlertCircle className="w-4 h-4 mr-2" /> Pending Verification</>
                        )}
                    </Badge>
                    <Button
                        className="h-12 px-8 bg-[#111827] hover:bg-[#1a9e8c] text-white font-black rounded-xl shadow-xl shadow-black/10 transition-all"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* General Information */}
                    <Card className="rounded-[2rem] border-black/[0.05] shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-black/[0.05] p-8">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold">General Information</CardTitle>
                                    <CardDescription>Core details about your care organisation</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Company Name</Label>
                                    <Input
                                        className="h-12 rounded-xl bg-slate-50 border-black/5 focus:bg-white"
                                        placeholder="e.g. Sunrise Care Ltd"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Registration Number</Label>
                                    <Input
                                        className="h-12 rounded-xl bg-slate-50 border-black/5 focus:bg-white"
                                        placeholder="CQC or Company Reg"
                                        value={formData.registrationNumber}
                                        onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Company Description</Label>
                                <Textarea
                                    className="min-h-[120px] rounded-xl bg-slate-50 border-black/5 focus:bg-white resize-none"
                                    placeholder="Describe your organisation, services provided, and values..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Location & Coverage */}
                    <Card className="rounded-[2rem] border-black/[0.05] shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-black/[0.05] p-8">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold">Location & Coverage</CardTitle>
                                    <CardDescription>Where you operate and provide care</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Primary Postcode</Label>
                                    <Input
                                        className="h-12 rounded-xl bg-slate-50 border-black/5 focus:bg-white uppercase"
                                        placeholder="e.g. SW1A 1AA"
                                        value={formData.postcode}
                                        onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Service Radius (Miles)</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        max="100"
                                        className="h-12 rounded-xl bg-slate-50 border-black/5 focus:bg-white"
                                        value={formData.serviceRadius}
                                        onChange={(e) => setFormData({ ...formData, serviceRadius: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3 text-amber-800 text-sm">
                                <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
                                <p>This information is used to match you with local carers and clients in your operational area.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <Card className="rounded-[2rem] border-black/[0.05] shadow-sm overflow-hidden">
                        <CardHeader className="p-6 pb-4">
                            <CardTitle className="text-lg font-bold">Contact Details</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</Label>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-black/5">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm font-medium text-slate-700 truncate">{formData.email}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</Label>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-black/5 focus-within:bg-white focus-within:ring-2 ring-primary/20 transition-all">
                                    <Phone className="w-4 h-4 text-slate-400" />
                                    <input
                                        className="bg-transparent border-none outline-none text-sm font-medium text-slate-900 w-full"
                                        placeholder="Add phone number"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default OrganisationProfile;
