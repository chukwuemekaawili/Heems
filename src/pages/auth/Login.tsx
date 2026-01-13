import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Authentication failed",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (data.user) {
        toast({
          title: "Welcome back!",
          description: "Successfully signed in to your account.",
        });

        // Get user profile to determine role and redirect accordingly
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        console.log('Profile data:', profile);
        console.log('Profile error:', profileError);
        console.log('User metadata:', data.user.user_metadata);

        // Determine role from profile or fallback to user metadata
        let userRole = profile?.role;

        // If no role in profile, check user metadata
        if (!userRole || userRole === '') {
          userRole = data.user.user_metadata?.role;
          console.log('Using metadata role:', userRole);

          // If we found a role in metadata, try to save it to profile
          if (userRole) {
            await supabase
              .from('profiles')
              .upsert({
                id: data.user.id,
                email: data.user.email,
                role: userRole,
              }, {
                onConflict: 'id'
              });
          }
        }

        console.log('Final role for redirect:', userRole);

        // Redirect based on user role
        if (userRole === 'admin') {
          navigate('/admin/dashboard');
        } else if (userRole === 'carer') {
          navigate('/carer/dashboard');
        } else if (userRole === 'organisation') {
          navigate('/organisation/dashboard');
        } else {
          // Default to client dashboard
          navigate('/client/dashboard');
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
    >
      <form onSubmit={handleSubmit} className="space-y-4 animate-in-up">
        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8]">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-11 h-12 bg-slate-50 border-black/[0.05] rounded-xl text-sm font-medium focus-visible:ring-[#1a9e8c]"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8]">Password</Label>
            <Link
              to="/forgot-password"
              className="text-[10px] font-black text-[#1a9e8c] hover:underline uppercase tracking-tighter"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-11 pr-11 h-12 bg-slate-50 border-black/[0.05] rounded-xl text-sm font-medium focus-visible:ring-[#1a9e8c]"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#111827]"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            className="rounded border-[#cbd5e1] text-[#1a9e8c] focus:ring-[#1a9e8c]"
          />
          <Label htmlFor="remember" className="text-xs font-bold text-[#475569] cursor-pointer">
            Remember me
          </Label>
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full h-14 rounded-xl bg-[#111827] text-white font-black hover:bg-[#1a9e8c] transition-all shadow-xl shadow-black/5" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>

        {/* Divider */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-black/[0.05]" />
          </div>
          <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
            <span className="bg-white px-4 text-[#94a3b8]">Secure Authentication</span>
          </div>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-sm font-bold text-[#475569]">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#111827] font-black hover:text-[#1a9e8c] transition-colors">
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
