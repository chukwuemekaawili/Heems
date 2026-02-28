import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/landing/Footer";

interface LegalPageLayoutProps {
    title: string;
    subtitle?: string;
    lastUpdated?: string;
    children: ReactNode;
}

/**
 * Premium Documentation Layout for legal / policy pages.
 * Narrow editorial column on a warm off-white background with a
 * sticky branded mini-header for clean context.
 */
const LegalPageLayout = ({ title, subtitle, lastUpdated, children }: LegalPageLayoutProps) => {
    return (
        <div className="min-h-screen bg-[#FAFAF9]">
            {/* Sticky Mini-Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-black/[0.04] shadow-[0_1px_20px_rgba(0,0,0,0.04)]">
                <div className="container mx-auto px-6 h-18 flex items-center justify-between py-4">
                    <Link to="/" className="flex items-center gap-2 group">
                        <img src="/heems-logo.png" alt="Heems" className="h-9 w-auto transition-opacity group-hover:opacity-80" />
                    </Link>
                    <Button variant="ghost" size="sm" asChild className="text-slate-500 hover:text-[#111827] font-bold text-xs uppercase tracking-widest">
                        <Link to="/">
                            <ArrowLeft className="w-3.5 h-3.5 mr-2" />
                            Back to Home
                        </Link>
                    </Button>
                </div>
            </header>

            {/* Hero Bar */}
            <div className="pt-24 pb-16 bg-white border-b border-black/[0.04]">
                <div className="container mx-auto px-6 max-w-3xl">
                    <span className="inline-block text-xs font-black text-[#1a9e8c] uppercase tracking-[0.25em] mb-4">
                        Heems Legal
                    </span>
                    <h1 className="text-4xl lg:text-6xl font-black text-[#111827] leading-[1.1] tracking-tight mb-4">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-lg text-slate-500 font-medium leading-relaxed">{subtitle}</p>
                    )}
                    {lastUpdated && (
                        <p className="mt-6 inline-flex items-center text-xs font-bold text-slate-400 bg-slate-50 border border-slate-200 rounded-full px-4 py-1.5 uppercase tracking-widest">
                            Last updated: {lastUpdated}
                        </p>
                    )}
                </div>
            </div>

            {/* Content */}
            <main className="container mx-auto px-6 py-16 max-w-3xl">
                <article className="prose prose-lg prose-slate max-w-none
                    prose-headings:font-black prose-headings:tracking-tight prose-headings:text-[#111827]
                    prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-100 prose-h2:pb-3
                    prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                    prose-p:text-slate-600 prose-p:leading-relaxed prose-p:font-medium
                    prose-li:text-slate-600 prose-li:font-medium
                    prose-strong:text-[#111827] prose-strong:font-black
                    prose-a:text-[#1a9e8c] prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                    prose-ul:space-y-1
                ">
                    {children}
                </article>

                {/* Contact Card */}
                <div className="mt-16 p-8 bg-white rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                    <p className="text-xs font-black text-[#1a9e8c] uppercase tracking-widest mb-2">Questions?</p>
                    <p className="text-xl font-black text-[#111827] mb-1">Contact our team</p>
                    <p className="text-slate-500 font-medium text-sm mb-4">
                        If you have any questions about this document, reach out to us.
                    </p>
                    <a
                        href="mailto:support@heems.com"
                        className="inline-flex items-center gap-2 text-sm font-black text-[#111827] hover:text-[#1a9e8c] transition-colors"
                    >
                        support@heems.com →
                    </a>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default LegalPageLayout;
