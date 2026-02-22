import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Heart, Mail, Phone, MapPin, Linkedin, Youtube, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  product: [
    { name: "Features", href: "/#features" },
    { name: "How it Works", href: "/how-it-works" },
    { name: "Pricing", href: "/#pricing" },
    { name: "For Carers", href: "/#for-carers" },
    { name: "For Organisations", href: "/#for-organisations" },
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

            {/* Social Icons */}
            <div className="flex items-center gap-4 mb-8">
              <a href="#" className="h-10 w-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors" aria-label="X (Twitter)">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>

            {/* App Store Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#" className="flex flex-1 sm:flex-none items-center justify-center gap-3 bg-black border border-white/20 rounded-xl px-4 py-2 hover:bg-white/5 transition-colors">
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="url(#playGrad)">
                  <defs>
                    <linearGradient id="playGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2196f3" />
                      <stop offset="50%" stopColor="#4caf50" />
                      <stop offset="100%" stopColor="#ffc107" />
                    </linearGradient>
                  </defs>
                  <path d="M4.5 2.5v19l16-9.5-16-9.5z" />
                </svg>
                <div className="text-left">
                  <p className="text-[10px] text-white/70 leading-none mb-1 uppercase">Get it on</p>
                  <p className="text-sm font-semibold text-white leading-none">Google Play</p>
                </div>
              </a>
              <a href="#" className="flex flex-1 sm:flex-none items-center justify-center gap-3 bg-black border border-white/20 rounded-xl px-4 py-2 hover:bg-white/5 transition-colors">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                  <path d="M17.523 15.3414C17.523 15.3414 17.523 15.3419 17.523 15.3414C17.5002 15.4299 17.4851 15.5204 17.478 15.6119C17.4258 16.3245 17.708 17.0263 18.2199 17.5303C18.7317 18.0343 19.4316 18.3 20.1444 18.2389C20.2173 18.2323 20.2897 18.2195 20.3609 18.2007C20.3346 18.2974 20.2974 18.3905 20.2498 18.4789C19.8219 19.3364 19.2941 20.1415 18.6749 20.8809C17.7497 21.9961 16.8906 23.011 15.6881 23.0125C14.4857 23.0141 14.102 22.28 12.7214 22.28C11.3408 22.28 10.9169 22.9922 9.77508 23.0329C8.61285 23.0532 7.64333 21.9147 6.69733 20.5522C4.78201 17.7656 3.38575 13.9118 4.60673 11.2334C5.4055 9.4754 7.1121 8.35626 8.95195 8.35626C10.0827 8.35626 11.1274 8.87737 11.8385 8.87737C12.5496 8.87737 13.8016 8.24357 15.1581 8.24357C15.6791 8.24357 16.2081 8.31298 16.7118 8.44857C17.7845 8.75051 18.7188 9.38127 19.3879 10.2526C16.9632 11.7241 17.5619 15.2678 17.523 15.3414ZM14.6367 5.48003C15.3262 4.63972 15.6961 3.5539 15.6811 2.45071C14.6543 2.50284 13.6826 2.94639 12.9431 3.69315C12.2801 4.35928 11.854 5.25725 11.751 6.20573C12.8273 6.26871 13.8471 5.86178 14.6367 5.48003Z" />
                </svg>
                <div className="text-left">
                  <p className="text-[10px] text-white/70 leading-none mb-1">Download on the</p>
                  <p className="text-sm font-semibold text-white leading-none">App Store</p>
                </div>
              </a>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-12 lg:gap-8">
            <div>
              <h4 className="text-xs font-black text-[#1a9e8c] uppercase tracking-widest mb-8">Ecosystem</h4>
              <ul className="space-y-4">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith('/#') ? (
                      <a href={link.href} className="text-sm font-bold text-white/60 hover:text-white transition-colors">
                        {link.name}
                      </a>
                    ) : (
                      <Link to={link.href} className="text-sm font-bold text-white/60 hover:text-white transition-colors">
                        {link.name}
                      </Link>
                    )}
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

          <div className="flex flex-col md:flex-row gap-8 text-xs font-bold text-white/40 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" /> support@heems.com
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5" /> 020 1234 5678
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" /> 71-75 Shelton Street, London, WC2H 9JQ
            </div>
          </div>
        </div>
      </div>
    </footer >
  );
};

export default Footer;
