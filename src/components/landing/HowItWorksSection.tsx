import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, UserCheck, Calendar, Heart, Sparkles, User, Lock, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Define Your Needs",
    description: "Tell us about your requirements. Our system starts matching instantly based on care experience and personality.",
  },
  {
    number: "02",
    icon: UserCheck,
    title: "Select Your Carer",
    description: "Review elite profiles verified with our 20-point vetting process. Video interview them before you book.",
  },
  {
    number: "03",
    icon: Calendar,
    title: "Seamless Booking",
    description: "Schedule one-off visits or complex recurring care plans. Secure and fully managed within the Heems platform.",
  },
  {
    number: "04",
    icon: Heart,
    title: "Expert Care Delivery",
    description: "Receive world-class care at home. Track every visit with real-time logs and secure digital payments.",
  },
];

const PhoneScreen = () => {
  const [screen, setScreen] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setScreen((prev) => (prev + 1) % 3);
    }, 4000); // Change screen every 4 seconds
    return () => clearInterval(timer);
  }, []);

  const variants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="relative w-[300px] h-[600px] bg-[#111827] rounded-[3rem] border-8 border-[#1a1f2e] shadow-2xl overflow-hidden mx-auto">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1a1f2e] rounded-b-2xl z-20" />

      {/* Screen Content */}
      <div className="w-full h-full bg-slate-50 relative pt-12 p-6 flex flex-col">
        <AnimatePresence mode="wait">
          {screen === 0 && (
            <motion.div
              key="register"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="flex flex-col h-full"
            >
              <div className="flex items-center justify-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-[#1a9e8c] flex items-center justify-center">
                  <Sparkles className="text-white w-6 h-6" />
                </div>
              </div>
              <h3 className="text-xl font-black text-[#111827] text-center mb-6">Create Account</h3>
              <div className="space-y-3">
                <div className="h-10 bg-white rounded-lg border border-slate-200" />
                <div className="h-10 bg-white rounded-lg border border-slate-200" />
                <div className="h-10 bg-[#111827] rounded-lg mt-4" />
              </div>
            </motion.div>
          )}

          {screen === 1 && (
            <motion.div
              key="login"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="flex flex-col h-full"
            >
              <div className="flex items-center justify-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-[#111827] flex items-center justify-center">
                  <Lock className="text-white w-6 h-6" />
                </div>
              </div>
              <h3 className="text-xl font-black text-[#111827] text-center mb-6">Welcome Back</h3>
              <div className="space-y-3">
                <div className="h-10 bg-white rounded-lg border border-slate-200" />
                <div className="h-10 bg-[#1a9e8c] rounded-lg mt-4 shadow-lg shadow-[#1a9e8c]/20" />
              </div>
            </motion.div>
          )}

          {screen === 2 && (
            <motion.div
              key="dashboard"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200" />
                  <div className="h-3 w-20 bg-slate-200 rounded" />
                </div>
                <LayoutDashboard className="text-slate-300 w-5 h-5" />
              </div>

              <h3 className="text-lg font-black text-[#111827] mb-4">Find Care</h3>

              <div className="space-y-3 flex-grow">
                {/* Carer Card 1 */}
                <div className="p-3 bg-white rounded-xl border border-black/5 flex gap-3 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-slate-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-24 bg-slate-100 rounded" />
                    <div className="h-2 w-16 bg-slate-100 rounded" />
                  </div>
                </div>
                {/* Carer Card 2 */}
                <div className="p-3 bg-white rounded-xl border border-black/5 flex gap-3 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-slate-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-24 bg-slate-100 rounded" />
                    <div className="h-2 w-16 bg-slate-100 rounded" />
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                <div className="h-12 bg-[#1a9e8c] rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-xl shadow-[#1a9e8c]/20">
                  Connect Now
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const HowItWorksSection = () => {
  return (
    <section className="py-24 lg:py-40 bg-gradient-to-b from-slate-50 to-white border-b border-black/[0.03] relative overflow-hidden" id="how-it-works">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-[#1a9e8c]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-[#111827]/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header with Phone Animation */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24 lg:mb-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a9e8c]/10 border border-[#1a9e8c]/20 text-[#1a9e8c] text-xs font-black uppercase tracking-[0.25em] mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              How It Works
            </div>
            <h2 className="text-5xl lg:text-8xl font-black text-[#111827] leading-[0.95] tracking-tighter mb-10">
              A Better Path <br />
              <span className="text-[#1a9e8c]">to Quality Care.</span>
            </h2>
            <p className="text-xl text-[#4B5563] font-medium leading-relaxed max-w-xl">
              We've combined rigorous vetting with advanced matching algorithms to create the UK's most efficient care path.
            </p>
          </div>

          {/* Animated Phone */}
          <div className="relative h-[600px] flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a9e8c]/20 to-transparent rounded-full blur-3xl opacity-30 animate-pulse" />
            <PhoneScreen />
          </div>
        </div>

        {/* Steps with Modern Card Design */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="group relative bg-white p-10 rounded-[2.5rem] border border-black/[0.05] hover:border-[#1a9e8c]/30 hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              {/* Gradient Background on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a9e8c]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-12">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#111827] to-[#1a9e8c] text-white flex items-center justify-center font-black shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <span className="text-5xl font-black text-slate-100 group-hover:text-[#1a9e8c]/20 transition-colors">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-black text-[#111827] mb-4 tracking-tight group-hover:text-[#1a9e8c] transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-[#4B5563] font-medium leading-relaxed">
                  {step.description}
                </p>

                {/* Progress Indicator */}
                {index < steps.length - 1 && (
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 hidden lg:block">
                    <ArrowRight className="w-6 h-6 text-[#1a9e8c]/30" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced CTA */}
        <div className="mt-24 p-12 rounded-[3rem] bg-gradient-to-r from-[#111827] to-[#1a9e8c] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="max-w-md text-white">
              <p className="text-2xl font-black mb-2">Ready to experience the difference?</p>
              <p className="text-white/70 font-medium">Start browsing verified carers in your area today.</p>
            </div>
            <Button size="lg" className="h-16 px-12 rounded-2xl bg-white text-[#111827] font-black text-lg hover:bg-[#1a9e8c] hover:text-white shadow-2xl transition-all" asChild>
              <Link to="/marketplace">
                Find a Carer
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
