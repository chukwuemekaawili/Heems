import { useState } from "react";

// Clearbit Logo API returns proper high-res PNGs (better than favicons)
export const SOURCE_LOGOS: Record<string, string> = {
    "NHS England": "https://logo.clearbit.com/england.nhs.uk",
    "Age UK": "https://logo.clearbit.com/ageuk.org.uk",
    "CQC": "https://logo.clearbit.com/cqc.org.uk",
    "Skills for Care": "https://logo.clearbit.com/skillsforcare.org.uk",
    "Homecare Association": "https://logo.clearbit.com/homecareassociation.org.uk",
    "Community Care": "https://logo.clearbit.com/communitycare.co.uk",
    "NICE": "https://logo.clearbit.com/nice.org.uk",
    "Carers UK": "https://logo.clearbit.com/carersuk.org",
    "DHSC": "https://logo.clearbit.com/gov.uk",
    "CB Insights": "https://logo.clearbit.com/cbinsights.com",
    "Heems Team": "/logo.png",
};

// Brand colours + short abbreviations used as crisp text fallbacks
export const SOURCE_META: Record<string, { bg: string; text: string; abbr: string }> = {
    "NHS England": { bg: "bg-[#005EB8]", text: "text-white", abbr: "NHS" },
    "Age UK": { bg: "bg-[#E4003B]", text: "text-white", abbr: "Age UK" },
    "CQC": { bg: "bg-[#6B2D8B]", text: "text-white", abbr: "CQC" },
    "Skills for Care": { bg: "bg-[#007A5E]", text: "text-white", abbr: "SfC" },
    "Homecare Association": { bg: "bg-[#1D4ED8]", text: "text-white", abbr: "HCA" },
    "Community Care": { bg: "bg-[#0369A1]", text: "text-white", abbr: "CC" },
    "NICE": { bg: "bg-[#312E81]", text: "text-white", abbr: "NICE" },
    "Carers UK": { bg: "bg-[#BE185D]", text: "text-white", abbr: "CUK" },
    "DHSC": { bg: "bg-[#1E3A5F]", text: "text-white", abbr: "DHSC" },
    "CB Insights": { bg: "bg-[#1B2A4A]", text: "text-white", abbr: "CBI" },
    "Heems Team": { bg: "bg-[#1a9e8c]", text: "text-white", abbr: "H" },
};

export function SourceFallback({ source, className }: { source: string; className?: string }) {
    const [failed, setFailed] = useState(false);
    const logoUrl = SOURCE_LOGOS[source];
    const meta = SOURCE_META[source] ?? {
        bg: "bg-slate-700",
        text: "text-white",
        abbr: source.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 4),
    };

    // No logo or it failed to load — show branded text badge
    if (!logoUrl || failed) {
        return (
            <div className={`absolute inset-0 flex flex-col items-center justify-center gap-1.5 ${meta.bg} ${className || ""}`}>
                <span className="text-3xl font-black text-white tracking-tight leading-none">{meta.abbr}</span>
                <span className="text-[9px] font-black text-white/50 uppercase tracking-widest text-center px-3 leading-tight">
                    {source}
                </span>
            </div>
        );
    }

    return (
        <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 ${meta.bg} ${className || ""}`}>
            <img
                src={logoUrl}
                alt={source}
                className="w-14 h-14 object-contain drop-shadow-lg"
                onError={() => setFailed(true)}
            />
            <span className="text-[9px] font-black text-white/50 uppercase tracking-widest text-center px-3">
                {source}
            </span>
        </div>
    );
}
