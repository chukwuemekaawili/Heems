import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import HowItWorksSection from "@/components/landing/HowItWorksSection";

const HowItWorks = () => {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="lg:mt-0">
                <HowItWorksSection />
            </main>
            <Footer />
        </div>
    );
};

export default HowItWorks;
