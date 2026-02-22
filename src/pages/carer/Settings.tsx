import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Bell, Lock, UserX, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const CarerSettings = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({
        emailNotifs: true,
        smsNotifs: true,
        marketingEmails: false,
        profileVisible: true,
    });

    const handleSave = async () => {
        setLoading(true);
        // In a real implementation this would save to a user_settings table
        setTimeout(() => {
            setLoading(false);
            toast({
                title: "Settings Saved",
                description: "Your preferences have been updated successfully.",
            });
        }, 1000);
    };

    const handlePasswordReset = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
            await supabase.auth.resetPasswordForEmail(user.email, {
                redirectTo: `${window.location.origin}/update-password`,
            });
            toast({
                title: "Password Reset Email Sent",
                description: "Check your inbox for a link to reset your password.",
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div>
                <h1 className="text-3xl font-black text-[#111827] tracking-tight">Account Settings</h1>
                <p className="text-slate-500 font-medium mt-1">Manage your notifications, privacy, and account preferences.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    {/* Notifications */}
                    <Card className="rounded-[2rem] border-black/[0.05] shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-black/[0.05] p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Bell className="w-5 h-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold">Notifications</CardTitle>
                                    <CardDescription>How you receive updates from us</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base font-bold">Email Notifications</Label>
                                    <p className="text-sm text-slate-500">Receive booking requests and updates via email</p>
                                </div>
                                <Switch
                                    checked={settings.emailNotifs}
                                    onCheckedChange={(c) => setSettings({ ...settings, emailNotifs: c })}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base font-bold">SMS Notifications</Label>
                                    <p className="text-sm text-slate-500">Urgent alerts and shift reminders via text</p>
                                </div>
                                <Switch
                                    checked={settings.smsNotifs}
                                    onCheckedChange={(c) => setSettings({ ...settings, smsNotifs: c })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Privacy & Security */}
                    <Card className="rounded-[2rem] border-black/[0.05] shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-black/[0.05] p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold">Privacy</CardTitle>
                                    <CardDescription>Control your visibility</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base font-bold">Profile Visibility</Label>
                                    <p className="text-sm text-slate-500">Allow clients to find you in search results</p>
                                </div>
                                <Switch
                                    checked={settings.profileVisible}
                                    onCheckedChange={(c) => setSettings({ ...settings, profileVisible: c })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Danger Zone */}
                    <Card className="rounded-[2rem] border-red-500/20 shadow-sm overflow-hidden">
                        <CardHeader className="bg-red-50 p-6 border-b border-red-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                                    <UserX className="w-5 h-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold text-red-900">Danger Zone</CardTitle>
                                    <CardDescription className="text-red-700">Irreversible account actions</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-slate-900">Delete Account</h4>
                                    <p className="text-sm text-slate-500 max-w-sm mt-1">
                                        Permanently delete your account and all associated data. This action cannot be undone.
                                    </p>
                                </div>
                                <Button variant="destructive" className="shrink-0 font-bold">
                                    Request Deletion
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-6">
                    <Card className="rounded-[2rem] border-black/[0.05] shadow-sm overflow-hidden sticky top-6">
                        <CardContent className="p-6 space-y-6">
                            <Button
                                className="w-full bg-[#111827] hover:bg-[#1a9e8c] text-white font-bold h-12 rounded-xl"
                                onClick={handleSave}
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>

                            <div className="pt-6 border-t border-black/[0.05]">
                                <h4 className="font-bold text-sm mb-4 text-slate-500 uppercase tracking-wider">Security</h4>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start h-12 rounded-xl font-bold border-black/[0.05]"
                                    onClick={handlePasswordReset}
                                >
                                    <Lock className="w-4 h-4 mr-3" />
                                    Change Password
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CarerSettings;
