import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import { motion } from "framer-motion";

const HowItWorks = () => {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main>
                {/* ─── HERO (Cinematic) ─── */}
                <section className="relative min-h-[75vh] flex items-center pt-32 pb-20 overflow-hidden bg-[#0B1120]">
                    {/* Background Image & Cinematic Overlays */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/how_it_works_hero.png" /* Fallback handled by CSS gradient if missing */
                            alt="How Heems Works"
                            className="w-full h-full object-cover opacity-30 object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1120] via-[#0B1120]/90 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent" />
                    </div>

                    {/* Accent orbs */}
                    <div className="absolute top-1/4 right-[10%] w-[400px] h-[400px] rounded-full bg-[#1a9e8c]/15 blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-1/4 left-[5%] w-[300px] h-[300px] rounded-full bg-blue-500/15 blur-[100px] pointer-events-none" />

                    <div className="container mx-auto px-6 lg:px-12 relative z-10 w-full mt-10">
                        <div className="max-w-4xl">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <span className="inline-block text-[10px] font-black text-[#1a9e8c] uppercase tracking-[0.2em] mb-6 bg-[#1a9e8c]/10 px-4 py-2 rounded-full border border-[#1a9e8c]/20 shadow-xl backdrop-blur-md">
                                    Process &amp; Platform
                                </span>
                                <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-6 tracking-tight leading-[1.05]">
                                    How It Works
                                </h1>
                                <p className="text-lg lg:text-xl text-white/70 font-medium max-w-2xl leading-relaxed mb-10">
                                    Whether you're a family seeking care or a professional offering it, our platform provides the tools to connect, verify, and manage care safely.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                <HowItWorksSection />
            </main>
            <Footer />
        </div>
    );
};

export default HowItWorks;
