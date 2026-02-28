import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight } from "lucide-react";

const CareTypesSection: FC = () => {
    const careTypes = [
        {
            title: "Visiting care",
            description:
                "Flexible visits for support as you need it—perfect for daily routines, meals, and companionship. Regular or one-off support.",
            image: "/carer_black_female_1.png",
        },
        {
            title: "Overnight care",
            description:
                "A carer remains present during the night to provide reassurance, assistance with medication, and safe bathroom visits.",
            image: "/carer_client_home.png",
        },
        {
            title: "Live-in care",
            description:
                "Comprehensive, round-the-clock support with a dedicated carer living at home. Ensures continuity and personalised care.",
            image: "/carer_black_male_1.png",
        },
    ];

    const navigate = useNavigate();

    const handleCardClick = async (title: string) => {
        const filterMap: Record<string, string> = {
            "Visiting care": "Visiting Care",
            "Overnight care": "Overnight Care",
            "Live-in care": "Live-in Care"
        };
        const filterValue = filterMap[title] || title;
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            navigate("/signup/client");
        } else {
            navigate(`/client/search?type=${encodeURIComponent(filterValue)}`);
        }
    };

    return (
        <section className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden">
            {/* Background Accent Mesh */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1a9e8c]/5 rounded-full blur-[100px] transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px] transform -translate-x-1/3 translate-y-1/3"></div>
            </div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
                    <span className="inline-block px-4 py-2 rounded-full bg-slate-200 text-[#111827] font-bold text-xs uppercase tracking-widest mb-6 border border-slate-300 shadow-sm">
                        Tailored Options
                    </span>
                    <h2 className="text-4xl lg:text-5xl font-black text-[#111827] mb-6 tracking-tight leading-tight">
                        Care designed around <span className="text-[#1a9e8c]">your life.</span>
                    </h2>
                    <p className="text-lg text-slate-600 font-medium leading-relaxed">
                        Whether you need a quick daily visit or full-time live-in support, our platform connects you with the exact level of care you require.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
                    {careTypes.map((type, index) => (
                        <div
                            key={index}
                            onClick={() => handleCardClick(type.title)}
                            className="group flex flex-col bg-white rounded-[2rem] p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-slate-100 hover:shadow-[0_20px_60px_rgba(26,158,140,0.1)] hover:-translate-y-2 hover:border-[#1a9e8c]/20 cursor-pointer transition-all duration-500 overflow-hidden"
                        >
                            <div className="relative w-full aspect-[4/3] mb-6 overflow-hidden rounded-[1.5rem] bg-slate-100">
                                <img
                                    src={type.image}
                                    alt={type.title}
                                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>

                            <div className="flex flex-col flex-1 px-3">
                                <h3 className="text-2xl font-black text-[#111827] mb-3 tracking-tight group-hover:text-[#1a9e8c] transition-colors duration-300">
                                    {type.title}.
                                </h3>
                                <p className="text-slate-500 font-medium leading-relaxed flex-1 mb-6">
                                    {type.description}
                                </p>

                                <div className="flex items-center text-[#1a9e8c] font-bold text-sm uppercase tracking-wide opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                    Find {type.title} <ArrowRight className="w-4 h-4 ml-1.5" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CareTypesSection;
