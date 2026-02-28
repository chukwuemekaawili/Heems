import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, CheckCircle } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 lg:py-40 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1a9e8c]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#111827]/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="relative rounded-[3rem] overflow-hidden bg-[#0B1120] px-8 py-20 lg:px-20 lg:py-32 shadow-[0_20px_80px_rgba(0,0,0,0.15)] group">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, #1a9e8c 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }} />
          </div>

          {/* Floating Elements */}
          <div className="absolute top-10 right-10 w-32 h-32 border border-[#1a9e8c]/20 rounded-full animate-pulse" />
          <div className="absolute bottom-10 left-10 w-24 h-24 border border-[#1a9e8c]/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white/90 text-xs font-black uppercase tracking-[0.2em] mb-10 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
              <Sparkles className="w-3.5 h-3.5 text-[#1a9e8c]" />
              Join the Elite Care Network
            </div>

            <h2 className="text-5xl lg:text-7xl font-black text-white mb-8 tracking-tight leading-[1.1]">
              Transform your <br />
              <span className="text-[#1a9e8c]">care experience.</span>
            </h2>

            <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto mb-14 leading-relaxed">
              Join thousands of families, independent professionals, and healthcare organisations who trust Heems for quality-verified care across the UK.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
              <div className="flex items-center gap-2 text-white/60 text-sm font-bold">
                <CheckCircle className="w-4 h-4 text-[#1a9e8c]" />
                <span>No commitment</span>
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm font-bold">
                <CheckCircle className="w-4 h-4 text-[#1a9e8c]" />
                <span>Secure payments</span>
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm font-bold">
                <CheckCircle className="w-4 h-4 text-[#1a9e8c]" />
                <span>Fully Verified</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mt-4">
              <Button size="lg" className="h-16 px-12 rounded-2xl bg-[#1a9e8c] hover:bg-[#158f7e] text-white font-bold text-lg shadow-[0_10px_30px_rgba(26,158,140,0.3)] hover:shadow-[0_15px_40px_rgba(26,158,140,0.4)] hover:-translate-y-1 transition-all duration-500 group" asChild>
                <Link to="/signup">
                  Get Started Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-16 px-12 rounded-2xl font-bold text-lg text-white border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/30 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-500" asChild>
                <Link to="/marketplace">
                  Find a Carer
                </Link>
              </Button>
            </div>


          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
