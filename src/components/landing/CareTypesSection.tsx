import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const CareTypesSection: FC = () => {
    const careTypes = [
        {
            title: "Visiting care.",
            description:
                "Flexible visits for support as you need it—perfect for daily routines such as meals preparation, walks, household tasks, or companionship. Visits may be arranged regularly or as one-off support.",
            image: "/visiting_care.png",
        },
        {
            title: "Overnight care.",
            description:
                "A carer remains present during the night to provide reassurance and assistance with routine, such as medication prompting, safe bathroom visits, and responding to overnight needs, helping to maintain comfort and peace of mind.",
            image: "/overnight_care.png",
        },
        {
            title: "Live-in care.",
            description:
                "Comprehensive, round-the-clock support with a dedicated carer living at home. Ensures continuity, companionship, and personalised care tailored to your needs.",
            image: "/live_in_care.png",
        },
    ];

    const navigate = useNavigate();

    const handleCardClick = async (title: string) => {
        // Remove trailing dot if present
        const cleanTitle = title.replace(/\.$/, "");
        // Map to search filter values if needed, but currently they align (case sensitive check might be needed)
        // Ensure first letter of each word is capitalized for the filter
        const filterValue = cleanTitle;

        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            navigate("/signup/client");
        } else {
            navigate(`/client/search?type=${encodeURIComponent(filterValue)}`);
        }
    };

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
                    {careTypes.map((type, index) => (
                        <div
                            key={index}
                            onClick={() => handleCardClick(type.title)}
                            className="flex flex-col items-center text-center group cursor-pointer"
                        >
                            <div className="relative w-full aspect-square mb-10 overflow-hidden rounded-[2.5rem] transition-transform duration-500 group-hover:scale-105">
                                <img
                                    src={type.image}
                                    alt={type.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="text-2xl font-black text-[#111827] mb-4 tracking-tight group-hover:text-[#1a9e8c] transition-colors">
                                {type.title}
                            </h3>
                            <p className="text-slate-500 font-medium leading-relaxed max-w-sm">
                                {type.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CareTypesSection;
