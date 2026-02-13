import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Heart, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  product: [
    { name: "How It Works", href: "#how-it-works" },
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "For Carers", href: "#for-carers" },
    { name: "For Organisations", href: "#for-organisations" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Press", href: "/press" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Security", href: "/security" },
    { name: "Safeguarding", href: "/safety-guidelines" },
  ],
  support: [
    { name: "Help Centre", href: "/help" },
    { name: "User Guide", href: "/user-guide" },
    { name: "Safety Resources", href: "/safety-guidelines" },
    { name: "Contact Support", href: "/contact" },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-[#111827] text-white pt-24 pb-12">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Top Grid */}
        <div className="grid lg:grid-cols-12 gap-16 mb-24">
          <div className="lg:col-span-4 max-w-sm">
            <Link to="/" className="flex items-center mb-8 group">
              <img
                src="/heems-logo.png"
                alt="Heems"
                className="h-12 w-auto brightness-0 invert"
              />
            </Link>
            <div className="text-white/60 font-medium leading-relaxed mb-10 space-y-4">
              <p>Our platform brings families and independent carers together through secure verification, transparent profiles, and intelligent matching, helping the right people find each other at the right time.</p>
              <p>For families, it’s confidence and clarity.</p>
              <p>For carers, it’s independence, dignity, and choice. For everyone, it’s care built on trust.</p>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-all">
                <Mail className="w-4 h-4 text-white/40" />
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-all">
                <Phone className="w-4 h-4 text-white/40" />
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-all">
                <MapPin className="w-4 h-4 text-white/40" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-12 lg:gap-8">
            <div>
              <h4 className="text-xs font-black text-[#1a9e8c] uppercase tracking-widest mb-8">Ecosystem</h4>
              <ul className="space-y-4">
                <li><Link to="/marketplace" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Find a Carer</Link></li>
                <li><Link to="/carers" className="text-sm font-bold text-white/60 hover:text-white transition-colors">For Carer</Link></li>
                <li><Link to="/types-of-care" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Types of Care</Link></li>
                <li><Link to="/how-it-works" className="text-sm font-bold text-white/60 hover:text-white transition-colors">How it Works</Link></li>

                <li><Link to="/pricing" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black text-[#1a9e8c] uppercase tracking-widest mb-8">Platform</h4>
              <ul className="space-y-4">
                <li><Link to="/login" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Sign In</Link></li>
                <li><Link to="/signup" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Register</Link></li>
                <li><Link to="/help" className="text-sm font-bold text-white/60 hover:text-white transition-colors">FAQs</Link></li>
                <li><Link to="/security" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black text-[#1a9e8c] uppercase tracking-widest mb-8">Company</h4>
              <ul className="space-y-4">
                <li><Link to="/about" className="text-sm font-bold text-white/60 hover:text-white transition-colors">About Heems</Link></li>
                <li><Link to="/blog" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/privacy" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/contact" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black text-[#1a9e8c] uppercase tracking-widest mb-8">Status</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-sm font-bold text-white/80">All Systems Live</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* App Download Section */}
        <div className="mb-16 pt-12 border-t border-white/10">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-black text-white mb-2">Download Our Mobile App</h3>
            <p className="text-white/60 font-medium">Get the Heems experience on your mobile device</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {/* App Store Button */}
            <a
              href="#"
              className="group flex items-center gap-3 px-6 py-3 bg-black hover:bg-slate-900 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <svg className="w-7 h-7 text-white" viewBox="0 0 384 512" fill="currentColor">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-[10px] text-white/50 font-bold uppercase tracking-tight leading-none">Download on the</div>
                <div className="text-xl font-bold text-white tracking-tight leading-none mt-1">App Store</div>
              </div>
            </a>

            {/* Google Play Button */}
            <a
              href="#"
              className="group flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
            >
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-xs text-white/60">GET IT ON</div>
                <div className="text-sm font-bold text-white">Google Play</div>
              </div>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-xs font-bold text-white/30 uppercase tracking-[0.1em]">© {new Date().getFullYear()} Heems -All rights Reserved</p>
          <div className="flex gap-8">
            <Link to="/privacy" className="text-xs font-bold text-white/30 hover:text-white uppercase tracking-[0.1em] transition-colors">Privacy</Link>
            <Link to="/terms" className="text-xs font-bold text-white/30 hover:text-white uppercase tracking-[0.1em] transition-colors">Terms</Link>
            <Link to="/cookies" className="text-xs font-bold text-white/30 hover:text-white uppercase tracking-[0.1em] transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
