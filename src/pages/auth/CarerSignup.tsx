import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, ArrowLeft, MapPin, ShieldCheck, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PostcodeAddressLookup } from "@/components/shared/PostcodeAddressLookup";

const careTypes = [
  "Personal Care",
  "Companionship",
  "Dementia Care",
  "Palliative Care",
  "Learning Disabilities",
  "Mental Health",
  "Physical Disabilities",
  "Nursing Care",
];

const CarerSignup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    postcode: "",
    address: "",
    experience: "",
    careTypes: [] as string[],
    hasDBS: false,
    hasInsurance: false,
    hasTransport: false,
    hasRightToWork: false,
    referral1Name: "",
    referral1Email: "",
    referral2Name: "",
    referral2Email: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect logged-in users to their dashboard
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const role = session.user.user_metadata?.role;
        if (role) {
          navigate(`/${role}/dashboard`, { replace: true });
        } else {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          navigate(`/${profile?.role || 'carer'}/dashboard`, { replace: true });
        }
      }
    };
    checkUser();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleCareType = (type: string) => {
    setFormData({
      ...formData,
      careTypes: formData.careTypes.includes(type)
        ? formData.careTypes.filter((t) => t !== type)
        : [...formData.careTypes, type],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please check your credentials.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            role: 'carer',
          }
        }
      });

      if (authError) {
        toast({
          title: "Signup failed",
          description: authError.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (authData.user) {
        // Wait for trigger to create profile
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Upsert profile with role
        await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            full_name: `${formData.firstName} ${formData.lastName}`,
            phone: formData.phone,
            role: 'carer',
          }, {
            onConflict: 'id'
          });

        // Create carer details
        await supabase
          .from('carer_details')
          .insert({
            id: authData.user.id,
            postcode: formData.postcode,
            address: formData.address,
            experience_years: formData.experience,
            specializations: formData.careTypes,
            has_dbs: formData.hasDBS,
            has_insurance: formData.hasInsurance,
            has_transportation: formData.hasTransport,
            has_right_to_work: formData.hasRightToWork,
          });

        // Redirect to success page instead of login
        navigate("/signup/success", { state: { role: 'carer' } });
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
      title={step === 1 ? "Elite Carer Onboarding" : "Professional Vetting"}
      subtitle={step === 1 ? "Step 1 of 2: Credentials" : "Step 2 of 2: Compliance"}
    >
      <form onSubmit={handleSubmit} className="space-y-4 animate-in-up">
        {/* Back Link */}
        <button
          type="button"
          onClick={() => (step === 1 ? navigate("/signup") : setStep(step - 1))}
          className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#111827] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          {step === 1 ? "Exit Onboarding" : "Previous Step"}
        </button>

        {/* Improved Progress Bar */}
        <div className="flex gap-1.5 py-2">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? "bg-[#1a9e8c]" : "bg-slate-100"
                }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">First Name</Label>
                <Input name="firstName" placeholder="Jane" value={formData.firstName} onChange={handleChange} className="h-14 bg-white border-slate-200 shadow-inner rounded-2xl text-sm font-medium focus-visible:ring-[#1a9e8c]/30 focus-visible:ring-offset-0 focus-visible:border-[#1a9e8c] transition-all px-4" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Last Name</Label>
                <Input name="lastName" placeholder="Smith" value={formData.lastName} onChange={handleChange} className="h-14 bg-white border-slate-200 shadow-inner rounded-2xl text-sm font-medium focus-visible:ring-[#1a9e8c]/30 focus-visible:ring-offset-0 focus-visible:border-[#1a9e8c] transition-all px-4" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input name="email" type="email" placeholder="jane@healthcare.com" value={formData.email} onChange={handleChange} className="pl-12 h-14 bg-white border-slate-200 shadow-inner rounded-2xl text-sm font-medium focus-visible:ring-[#1a9e8c]/30 focus-visible:ring-offset-0 focus-visible:border-[#1a9e8c] transition-all" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Password</Label>
              <Input name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} className="h-14 bg-white border-slate-200 shadow-inner rounded-2xl text-sm font-medium focus-visible:ring-[#1a9e8c]/30 focus-visible:ring-offset-0 focus-visible:border-[#1a9e8c] transition-all px-4" required />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Confirm Password</Label>
              <Input name="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} className="h-14 bg-white border-slate-200 shadow-inner rounded-2xl text-sm font-medium focus-visible:ring-[#1a9e8c]/30 focus-visible:ring-offset-0 focus-visible:border-[#1a9e8c] transition-all px-4" required />
            </div>

            <Button type="button" className="w-full h-16 rounded-2xl bg-[#111827] text-white font-black text-sm uppercase tracking-[0.2em] hover:bg-[#1a9e8c] shadow-[0_8px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_rgba(26,158,140,0.3)] hover:-translate-y-1 transition-all duration-500"
              onClick={() => {
                if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
                  toast({
                    title: "Missing Information",
                    description: "Please fill in all fields to continue.",
                    variant: "destructive",
                  });
                  return;
                }
                setStep(2);
              }}
            >
              Continue to Compliance
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <PostcodeAddressLookup
                postcode={formData.postcode}
                onPostcodeChange={(pc) => setFormData({ ...formData, postcode: pc })}
                onAddressSelect={(addr) => setFormData({ ...formData, address: addr })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Care Experience</Label>
              <Select value={formData.experience} onValueChange={(v) => setFormData({ ...formData, experience: v })}>
                <SelectTrigger className="h-14 bg-white border-slate-200 shadow-inner rounded-2xl text-sm font-medium focus:ring-[#1a9e8c]/30 focus:ring-offset-0 focus:border-[#1a9e8c] transition-all px-4">
                  <SelectValue placeholder="Years in Service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1+ Years</SelectItem>
                  <SelectItem value="1-3">1-3 Years</SelectItem>
                  <SelectItem value="3-5">3-5 Years</SelectItem>
                  <SelectItem value="5-10">5-10 Years</SelectItem>
                  <SelectItem value="10+">10+ Years (Senior)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-black/[0.03]">
                <Checkbox id="hasDBS" checked={formData.hasDBS} onCheckedChange={(c) => setFormData({ ...formData, hasDBS: !!c })} />
                <Label htmlFor="hasDBS" className="text-xs font-bold text-[#111827]">DBS Certificate (Enhanced)</Label>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-black/[0.03]">
                <Checkbox id="hasInsurance" checked={formData.hasInsurance} onCheckedChange={(c) => setFormData({ ...formData, hasInsurance: !!c })} />
                <Label htmlFor="hasInsurance" className="text-xs font-bold text-[#111827]">Professional Liability Insurance</Label>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-black/[0.03]">
                <Checkbox id="hasRTW" checked={formData.hasRightToWork} onCheckedChange={(c) => setFormData({ ...formData, hasRightToWork: !!c })} />
                <Label htmlFor="hasRTW" className="text-xs font-bold text-[#111827]">Valid Right to Work in UK</Label>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-black/[0.03]">
                <Checkbox id="hasTransport" checked={formData.hasTransport} onCheckedChange={(c) => setFormData({ ...formData, hasTransport: !!c })} />
                <Label htmlFor="hasTransport" className="text-xs font-bold text-[#111827]">Do you drive?</Label>
              </div>
            </div>

            <div className="flex items-start gap-3 py-4">
              <Checkbox id="terms" checked={agreeTerms} onCheckedChange={(c) => setAgreeTerms(!!c)} />
              <Label htmlFor="terms" className="text-[11px] font-bold text-slate-500 leading-tight">
                I agree to the Terms of Service and understand that I will need to complete verification before accepting bookings.
              </Label>
            </div>

            <Button type="submit" className="w-full h-16 rounded-2xl bg-[#111827] text-white font-black text-sm uppercase tracking-[0.2em] hover:bg-[#1a9e8c] shadow-[0_8px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_rgba(26,158,140,0.3)] hover:-translate-y-1 transition-all duration-500 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none" disabled={isLoading || !agreeTerms}>
              {isLoading ? "Creating Account..." : "Create Account & Start Vetting"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Step 3 removed as per user request */}

        {/* Step 3 was here: Referrals */}

        {/* Sign In Link */}
        <p className="text-center text-sm font-bold text-[#475569] pt-4">
          Already a vetted carer?{" "}
          <Link to="/login" className="text-[#111827] font-black hover:text-[#1a9e8c] transition-colors">
            Sign in here
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default CarerSignup;
