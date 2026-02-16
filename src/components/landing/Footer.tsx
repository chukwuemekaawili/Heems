import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Heart, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "For Carers", href: "#for-carers" },
    { name: "For Organisations", href: "#for-organisations" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Press", href: "/press" },
    { name: "Blog", href: "/blog" },
    { name: "Contact Us", href: "/contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Safeguarding Policy", href: "/safety-guidelines" },
    { name: "Equality Policy", href: "/equality" },
    { name: "Complaints Policy", href: "/complaints" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Security", href: "/security" },
  ],
  support: [
    { name: "Help Centre", href: "/help" },
    { name: "User Guide", href: "/user-guide" },
    { name: "Contact Support", href: "/contact" },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-[#111827] text-white pt-24 pb-12">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Main Grid */}
        <div className="grid lg:grid-cols-12 gap-16">
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
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-12 lg:gap-8">
            <div>
              <h4 className="text-xs font-black text-[#1a9e8c] uppercase tracking-widest mb-8">Ecosystem</h4>
              <ul className="space-y-4">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="text-sm font-bold text-white/60 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black text-[#1a9e8c] uppercase tracking-widest mb-8">Platform</h4>
              <ul className="space-y-4">
                <li><Link to="/login" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Sign In</Link></li>
                <li><Link to="/signup" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Register</Link></li>
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="text-sm font-bold text-white/60 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black text-[#1a9e8c] uppercase tracking-widest mb-8">Company</h4>
              <ul className="space-y-4">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="text-sm font-bold text-white/60 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black text-[#1a9e8c] uppercase tracking-widest mb-8">Legal</h4>
              <ul className="space-y-4">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="text-sm font-bold text-white/60 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
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

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold text-white/30 uppercase tracking-[0.1em] text-center md:text-left">
            © {new Date().getFullYear()} Heems. All rights Reserved.
          </p>

          <div className="flex gap-4">
            <Link to="/contact" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-all group">
              <Mail className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
            </Link>
            <Link to="/contact" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-all group">
              <Phone className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
            </Link>
            <Link to="/contact" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-all group">
              <MapPin className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </footer >
  );
};

export default Footer;
