// Modern, Sleek Hero Section with App Download
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Star,
  Shield,
  Sparkles,
  Download,
  Smartphone,
  CheckCircle,
  Play
} from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 flex items-center overflow-hidden bg-[#0B1120]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Cinematic Gradient Orbs */}
        <div className="absolute top-0 -left-10 w-[500px] h-[500px] bg-[#1a9e8c]/20 rounded-full mix-blend-screen filter blur-[120px] opacity-100 animate-pulse-slow"></div>
        <div className="absolute bottom-0 -right-10 w-[600px] h-[600px] bg-emerald-500/10 rounded-full mix-blend-screen filter blur-[120px] opacity-100 animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#1a9e8c]/5 rounded-full filter blur-[150px] opacity-100"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bS0yIDB2Mmgydi0yaC0yem0tMiAwdjJoMnYtMmgtMnptLTIgMHYyaDJ2LTJoLTJ6bS0yIDB2Mmgydi0yaC0yem0tMiAwdjJoMnYtMmgtMnptLTIgMHYyaDJ2LTJoLTJ6bS0yIDB2Mmgydi0yaC0yem0tMiAwdjJoMnYtMmgtMnptLTIgMHYyaDJ2LTJoLTJ6TTIgMnYyaDJ2LTJIMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>

        {/* Floating Particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#1a9e8c] rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-purple-400 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-float animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-white space-y-8 animate-fade-in-up">
            {/* Premium Trust Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
              <Shield className="h-4 w-4 text-[#1a9e8c]" />
              <span className="text-sm font-bold text-white/90">2000+ verified carers</span>
              <div className="flex items-center gap-1 ml-2 border-l border-white/20 pl-3">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-bold text-white">4.9</span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                Quality Care,
                <br />
                <span className="bg-gradient-to-r from-[#1a9e8c] via-emerald-400 to-teal-300 bg-clip-text text-transparent animate-gradient">
                  On Demand
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-400 font-medium leading-relaxed max-w-xl">
                Connect with verified, elite-standard carers in minutes.
                The UK's most trusted introductory care marketplace.
              </p>
            </div>

            {/* Key Benefits */}
            <div className="flex flex-wrap gap-4">
              {[
                { icon: CheckCircle, text: "Verified Carers" },
                { icon: Shield, text: "DBS Checked and Insured" },
                { icon: Sparkles, text: "Instant Booking" }
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:-translate-y-0.5 shadow-sm transition-all duration-300"
                >
                  <benefit.icon className="h-4 w-4 text-[#1a9e8c]" />
                  <span className="text-sm font-bold text-slate-300">{benefit.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                onClick={() => navigate("/signup/client")}
                className="group relative bg-[#1a9e8c] hover:bg-[#158f7e] text-white px-8 py-7 text-lg font-bold rounded-2xl shadow-[0_10px_40px_rgba(26,158,140,0.3)] hover:shadow-[0_15px_50px_rgba(26,158,140,0.5)] transition-all duration-500 hover:-translate-y-1"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Find a Carer Now
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/signup/carer")}
                className="group px-8 py-7 text-lg font-bold rounded-2xl border-2 border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 backdrop-blur-sm shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
              >
                <span className="flex items-center gap-2">
                  Become a Carer
                </span>
              </Button>
            </div>



          </div>

          {/* Right Column - Hero Visual with Carer & App Mockup */}
          <div className="relative lg:block hidden animate-fade-in-up animation-delay-300">
            {/* 3D Animated Hero Image Container */}
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#1a9e8c] to-purple-500 rounded-3xl blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse-slow"></div>

              {/* Main Hero Image with 3D Transform */}
              <div className="relative transform perspective-1000 animate-float3d overflow-hidden rounded-[2.5rem] shadow-2xl border-4 border-white/20">
                <img
                  src="/compassionate_care_hero.png"
                  alt="Compassionate caregiver sharing a warm moment with an elderly person at home"
                  className="w-full max-w-lg mx-auto object-cover aspect-[4/5] transform hover:scale-105 transition-transform duration-700"
                />

                {/* Animated Ring Effect Overlay */}
                <div className="absolute inset-0 border-2 border-[#1a9e8c]/30 rounded-[2.5rem] animate-pulse-slow pointer-events-none"></div>
                <div className="absolute inset-2 border border-[#1a9e8c]/20 rounded-[2rem] animate-pulse-slow animation-delay-1000 pointer-events-none"></div>
              </div>

              {/* Floating Elements */}
              <div className="absolute top-[10%] -right-4 bg-white rounded-2xl p-4 shadow-[0_20px_40px_rgba(0,0,0,0.15)] border border-slate-100 animate-float z-20">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  <span className="text-sm font-bold text-slate-800">Elite Verification</span>
                </div>
              </div>

              <div className="absolute bottom-[15%] -left-6 bg-white rounded-2xl p-4 shadow-[0_20px_40px_rgba(0,0,0,0.15)] border border-slate-100 animate-float animation-delay-1000 z-20">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-bold text-slate-800">5-Star Service</span>
                </div>
              </div>

              <div className="absolute top-1/2 -right-8 bg-gradient-to-r from-[#1a9e8c] to-emerald-500 rounded-2xl p-3 shadow-2xl animate-float animation-delay-2000 z-20">
                <div className="flex items-center gap-2 text-white">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs font-bold">Instant Match</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white rounded-full animate-scroll"></div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes scroll {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(12px); opacity: 0; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-gradient { 
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-scroll { animation: scroll 2s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .perspective-1000 { perspective: 1000px; }
        .rotate-y-3:hover { transform: rotateY(3deg) rotateX(2deg); }
        @keyframes float3d {
          0%, 100% { transform: translateY(0) rotateY(0deg) rotateX(0deg); }
          25% { transform: translateY(-10px) rotateY(2deg) rotateX(1deg); }
          50% { transform: translateY(-15px) rotateY(-2deg) rotateX(-1deg); }
          75% { transform: translateY(-5px) rotateY(1deg) rotateX(0.5deg); }
        }
        .animate-float3d { animation: float3d 6s ease-in-out infinite; }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
