import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const UpdatePassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is authenticated (link should handle this)
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                toast({
                    title: "Invalid Request",
                    description: "Please request a new password reset link.",
                    variant: "destructive",
                });
                navigate("/forgot-password");
            }
        });
    }, [navigate, toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast({
                title: "Passwords do not match",
                variant: "destructive",
            });
            return;
        }

        if (password.length < 6) {
            toast({
                title: "Password too short",
                description: "Password must be at least 6 characters.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) throw error;

            toast({
                title: "Password Updated",
                description: "Your password has been changed successfully. Please log in.",
            });

            navigate("/login");
        } catch (error: any) {
            toast({
                title: "Update Failed",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Set new password"
            subtitle="Enter your new password below"
        >
            <form onSubmit={handleSubmit} className="space-y-4 animate-in-up">
                <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8]">New Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-11 pr-10 h-12 bg-slate-50 border-black/[0.05] rounded-xl text-sm font-medium focus-visible:ring-[#1a9e8c]"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8]">Confirm Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pl-11 h-12 bg-slate-50 border-black/[0.05] rounded-xl text-sm font-medium focus-visible:ring-[#1a9e8c]"
                            required
                        />
                    </div>
                </div>

                <Button type="submit" className="w-full h-14 rounded-xl bg-[#111827] text-white font-black hover:bg-[#1a9e8c] transition-all shadow-xl shadow-black/5" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Password"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </form>
        </AuthLayout>
    );
};

export default UpdatePassword;
