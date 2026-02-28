import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "Check your email",
        description: "We've sent you a password reset link.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="We've sent you a reset link"
      >
        <div className="space-y-6 animate-in-up">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-[#1a9e8c]/10 flex items-center justify-center border border-[#1a9e8c]/20 shadow-[0_8px_30px_rgba(26,158,140,0.15)]">
              <CheckCircle2 className="w-10 h-10 text-[#1a9e8c]" />
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-[#475569] mb-4">
              We've sent a password reset link to:
            </p>
            <p className="text-lg font-black text-[#111827] mb-8">{email}</p>
            <p className="text-xs font-bold text-[#64748b]">
              Didn't receive the email? Check your spam folder or{" "}
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-[#1a9e8c] hover:underline font-black"
              >
                try again
              </button>
            </p>
          </div>

          <Button variant="outline" className="w-full h-16 rounded-2xl border-slate-200 font-bold text-[#111827] hover:bg-slate-50 hover:-translate-y-0.5 transition-all duration-300" asChild>
            <Link to="/login">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to sign in
            </Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Enter your email to receive a link"
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
              className="pl-12 h-14 bg-white border-slate-200 shadow-inner rounded-2xl text-sm font-medium focus-visible:ring-[#1a9e8c]/30 focus-visible:ring-offset-0 focus-visible:border-[#1a9e8c] transition-all"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full h-16 rounded-2xl bg-[#111827] text-white font-black text-sm uppercase tracking-[0.2em] hover:bg-[#1a9e8c] shadow-[0_8px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_rgba(26,158,140,0.3)] hover:-translate-y-1 transition-all duration-500 disabled:opacity-50" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Reset Link"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>

        {/* Sign Up Link */}
        <div className="pt-4 text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-xs font-black text-[#64748b] hover:text-[#111827] uppercase tracking-widest transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-2" />
            Back to sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
