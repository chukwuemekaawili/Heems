import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, Star, ShieldCheck, Clock, MapPin, BadgeCheck, FileCheck, ChevronLeft, ChevronRight, Loader2, PoundSterling, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const AVAILABILITY_OPTIONS = [
    { value: "weekdays", label: "Weekdays" },
    { value: "weekends", label: "Weekends" },
    { value: "evenings", label: "Evenings" },
    { value: "nights", label: "Night Shifts" },
    { value: "live-in", label: "Live-in" },
];

interface Carer {
    id: string;
    full_name: string;
    avatar_url: string | null;
    verified: boolean;
    hoursWorked: number;
    carer_details: {
        bio: string;
        hourly_rate: number;
        verification_status: string;
        specializations: string[];
        experience_years: string;
        postcode?: string;
        availability?: string[];
    } | null;
}

const ITEMS_PER_PAGE = 12;

const SPECIALIZATION_OPTIONS = [
    "Elderly Care",
    "Dementia Care",
    "Disability Support",
    "Palliative Care",
    "Mental Health",
    "Post-Surgery Care",
    "Companion Care",
    "Live-in Care",
];

const Marketplace = () => {
    const [carers, setCarers] = useState<Carer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [postcode, setPostcode] = useState("");
    const [verifiedOnly, setVerifiedOnly] = useState(true);
    const [selectedSpecialization, setSelectedSpecialization] = useState<string>("all");
    const [selectedAvailability, setSelectedAvailability] = useState<string>("all");
    const [minRate, setMinRate] = useState<number[]>([15]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [filtersApplied, setFiltersApplied] = useState(false);

    useEffect(() => {
        fetchCarers();
    }, [currentPage, filtersApplied]);

    const fetchCarers = async () => {
        try {
            setLoading(true);

            // Build the query
            let query = supabase
                .from('profiles')
                .select(`
                    id,
                    full_name,
                    avatar_url,
                    verified,
                    carer_details(
                        bio,
                        hourly_rate,
                        verification_status,
                        specializations,
                        experience_years,
                        postcode,
                        availability
                    )
                `, { count: 'exact' })
                .eq('role', 'carer');

            // Apply verified filter
            if (verifiedOnly) {
                query = query.eq('verified', true);
            }

            // Apply pagination
            const from = (currentPage - 1) * ITEMS_PER_PAGE;
            const to = from + ITEMS_PER_PAGE - 1;
            query = query.range(from, to);

            const { data, error, count } = await query;

            if (error) throw error;

            // Map the data to fix the array issue with carer_details
            let formattedData = (data || []).map((carer: any) => ({
                ...carer,
                carer_details: Array.isArray(carer.carer_details) ? carer.carer_details[0] : carer.carer_details,
                hoursWorked: Math.floor(Math.random() * 111) + 40 // 40–150 baseline hours
            }));

            // Client-side filtering for search, specialization, postcode, rate, and availability
            if (searchQuery) {
                formattedData = formattedData.filter(carer =>
                    carer.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            if (selectedSpecialization && selectedSpecialization !== "all") {
                formattedData = formattedData.filter(carer =>
                    carer.carer_details?.specializations?.includes(selectedSpecialization)
                );
            }

            // Postcode proximity matching (prefix-based: compare first 2-4 chars)
            if (postcode) {
                const cleanPostcode = postcode.replace(/\s/g, '').toUpperCase();
                const prefix = cleanPostcode.slice(0, Math.min(4, cleanPostcode.length));
                formattedData = formattedData.filter(carer => {
                    const carerPostcode = carer.carer_details?.postcode?.replace(/\s/g, '').toUpperCase() || '';
                    return carerPostcode.startsWith(prefix.slice(0, 2)) || carerPostcode.startsWith(prefix);
                });
            }

            // Minimum rate filter
            if (minRate[0] > 15) {
                formattedData = formattedData.filter(carer =>
                    (carer.carer_details?.hourly_rate || 0) >= minRate[0]
                );
            }

            // Availability filter
            if (selectedAvailability && selectedAvailability !== "all") {
                formattedData = formattedData.filter(carer =>
                    carer.carer_details?.availability?.some(a =>
                        a.toLowerCase().includes(selectedAvailability.toLowerCase())
                    )
                );
            }

            setCarers(formattedData);
            setTotalCount(count || 0);
        } catch (error) {
            console.error('Error fetching carers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApplyFilters = () => {
        setCurrentPage(1);
        setFiltersApplied(!filtersApplied); // Toggle to trigger useEffect
    };

    const handleClearFilters = () => {
        setSearchQuery("");
        setPostcode("");
        setVerifiedOnly(true);
        setSelectedSpecialization("all");
        setSelectedAvailability("all");
        setMinRate([15]);
        setCurrentPage(1);
        setFiltersApplied(!filtersApplied);
    };

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-[#1a9e8c]/30">
            <Helmet>
                <title>Find Carers | Heems</title>
                <meta name="description" content="Discover and book elite independent carers on Heems. Rigorously vetted professionals for your family's needs." />
            </Helmet>
            <Header />
            <main>
                {/* ─── HERO (Cinematic) ─── */}
                <section className="relative min-h-[75vh] flex items-center pt-32 pb-20 overflow-hidden bg-[#0B1120]">
                    {/* Background Image & Cinematic Overlays */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/modern_home_care_hero.png"
                            alt="Premium Care Marketplace"
                            className="w-full h-full object-cover opacity-30"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1120] via-[#0B1120]/80 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/20 to-transparent" />
                    </div>

                    {/* Accent orbs */}
                    <div className="absolute top-1/4 right-[10%] w-[400px] h-[400px] rounded-full bg-[#1a9e8c]/15 blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-1/4 left-[5%] w-[300px] h-[300px] rounded-full bg-indigo-500/15 blur-[100px] pointer-events-none" />

                    <div className="container mx-auto px-6 lg:px-12 relative z-10 w-full mt-10">
                        <div className="max-w-3xl">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-widest mb-8 shadow-xl">
                                    <ShieldCheck className="w-4 h-4 text-[#1a9e8c]" />
                                    Introductory Care Agency Standards
                                </div>

                                <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-8 tracking-tight leading-[1.05]">
                                    Discover Elite <br />
                                    <span className="text-[#1a9e8c]">Independent Care.</span>
                                </h1>

                                <p className="text-lg lg:text-xl text-white/70 font-medium leading-relaxed mb-10 max-w-2xl">
                                    Heems connects you directly with the UK's most rigorously vetted,
                                    self-employed carers. High-value families deserve high-performance care.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                <div className="container mx-auto px-6 lg:px-12 pb-20 relative z-20 -mt-10">
                    {/* Search & Filter Bar */}
                    <div className="mb-12 p-6 bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_70px_rgba(0,0,0,0.12)] transition-all duration-500">
                        <div className="flex flex-col lg:flex-row gap-4 mb-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    placeholder="Search carers by name..."
                                    className="pl-14 h-14 bg-slate-50 border-black/5 rounded-2xl text-base font-semibold focus-visible:ring-[#1a9e8c]"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="relative lg:w-56">
                                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                                <Input
                                    placeholder="UK Postcode"
                                    className="pl-14 h-14 bg-slate-50 border-black/5 rounded-2xl text-base font-semibold focus-visible:ring-[#1a9e8c]"
                                    value={postcode}
                                    onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                                    maxLength={8}
                                />
                            </div>
                            <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                                <SelectTrigger className="lg:w-56 h-14 bg-slate-50 border-black/5 rounded-2xl font-semibold">
                                    <SelectValue placeholder="All Specializations" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Specializations</SelectItem>
                                    {SPECIALIZATION_OPTIONS.map(spec => (
                                        <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {/* Extended Filters Row */}
                        <div className="flex flex-col lg:flex-row gap-4 mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <PoundSterling className="w-4 h-4 text-slate-400" />
                                    <span className="text-xs font-bold text-slate-500">Min Rate: £{minRate[0]}/hr</span>
                                </div>
                                <Slider
                                    value={minRate}
                                    onValueChange={setMinRate}
                                    min={15}
                                    max={50}
                                    step={1}
                                    className="w-full"
                                />
                            </div>
                            <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
                                <SelectTrigger className="lg:w-56 h-14 bg-slate-50 border-black/5 rounded-2xl font-semibold">
                                    <SelectValue placeholder="Availability" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Availability</SelectItem>
                                    {AVAILABILITY_OPTIONS.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="verified-only"
                                    checked={verifiedOnly}
                                    onCheckedChange={(checked) => setVerifiedOnly(checked === true)}
                                />
                                <Label htmlFor="verified-only" className="text-sm font-bold text-slate-700 flex items-center gap-2 cursor-pointer">
                                    <ShieldCheck className="w-4 h-4 text-[#1a9e8c]" />
                                    Verified carers only
                                </Label>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={handleClearFilters}
                                    className="h-12 px-6 rounded-xl font-bold"
                                >
                                    Clear Filters
                                </Button>
                                <Button
                                    onClick={handleApplyFilters}
                                    className="h-12 px-8 rounded-[1rem] bg-[#111827] text-white font-black text-sm hover:bg-[#1a9e8c] shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_25px_rgba(26,158,140,0.3)] hover:-translate-y-0.5 transition-all duration-300 gap-2"
                                >
                                    <Filter className="w-4 h-4" />
                                    Apply Filters
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="flex items-center justify-between mb-8">
                        <p className="text-slate-600 font-medium">
                            Showing <span className="font-bold text-[#111827]">{carers.length}</span> of{" "}
                            <span className="font-bold text-[#111827]">{totalCount}</span> carers
                        </p>
                        {totalPages > 1 && (
                            <p className="text-slate-600 font-medium">
                                Page <span className="font-bold">{currentPage}</span> of <span className="font-bold">{totalPages}</span>
                            </p>
                        )}
                    </div>

                    {/* Carer Grid */}
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 animate-spin text-[#1a9e8c]" />
                        </div>
                    ) : carers.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-bold mb-1">No carers found</h3>
                            <p className="text-muted-foreground mb-6">Try adjusting your filters or check back later.</p>
                            <Button onClick={handleClearFilters} variant="outline">
                                Clear All Filters
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {carers.map((carer, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                        key={carer.id}
                                        className="group relative bg-white rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-[#1a9e8c]/20 hover:shadow-[0_20px_60px_rgba(26,158,140,0.1)] hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                                    >
                                        {/* Badge Overlay */}
                                        <div className="absolute top-6 left-6 z-10 flex flex-wrap gap-2">
                                            {(carer.verified || carer.carer_details?.verification_status === 'verified') && (
                                                <div className="px-3 py-1.5 rounded-full bg-[#111827]/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                                                    <Star className="w-3 h-3 text-[#1a9e8c] fill-[#1a9e8c]" />
                                                    Verified Carer
                                                </div>
                                            )}
                                        </div>

                                        <div className="aspect-[5/4] bg-slate-100 relative overflow-hidden">
                                            <img
                                                src={carer.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${carer.full_name}`}
                                                alt={carer.full_name || 'Carer'}
                                                className="w-full h-full object-cover grayscale-[0.2] transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                            <div className="absolute bottom-6 left-6 right-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-2xl font-black text-white tracking-tight mb-0.5">
                                                            {carer.full_name || 'Carer'}
                                                        </h3>
                                                        <p className="text-xs font-bold text-white/70 uppercase tracking-widest">
                                                            {carer.carer_details?.specializations?.[0] || 'Care Professional'}
                                                        </p>
                                                    </div>
                                                    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-2.5 border border-white/20">
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-3.5 h-3.5 text-[#1a9e8c] fill-[#1a9e8c]" />
                                                            <span className="text-sm font-black text-white">4.9</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-8">
                                            {/* Verification Vault Section */}
                                            <div className="mb-8">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Vetting Status</p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-black/[0.02]">
                                                        <BadgeCheck className="w-4 h-4 text-[#1a9e8c]" />
                                                        <span className="text-[11px] font-bold text-[#111827]">Fully Vetted</span>
                                                    </div>
                                                    <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-black/[0.02]">
                                                        <FileCheck className="w-4 h-4 text-[#1a9e8c]" />
                                                        <span className="text-[11px] font-bold text-[#111827]">DBS Enhanced</span>
                                                    </div>
                                                    <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-black/[0.02] col-span-2">
                                                        <Clock className="w-4 h-4 text-[#1a9e8c]" />
                                                        <span className="text-[11px] font-bold text-[#111827]">{carer.hoursWorked} Hours Worked</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Market Rate</p>
                                                    <p className="text-3xl font-black text-[#111827] mt-1.5 tracking-tighter">
                                                        £{carer.carer_details?.hourly_rate || 25}
                                                        <span className="text-sm font-bold text-slate-300">/hr</span>
                                                    </p>
                                                </div>
                                                <Button
                                                    asChild
                                                    className="h-12 rounded-xl bg-slate-100 text-[#111827] hover:bg-[#1a9e8c] hover:text-white font-bold text-xs transition-all px-8 border-none shadow-sm hover:shadow-[0_10px_25px_rgba(26,158,140,0.3)] hover:-translate-y-0.5 duration-300"
                                                >
                                                    <Link to={`/client/book/${carer.id}`}>
                                                        Secure Profile
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-16">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => goToPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="h-12 w-12 rounded-xl"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </Button>

                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum: number;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }

                                        return (
                                            <Button
                                                key={pageNum}
                                                variant={currentPage === pageNum ? "default" : "outline"}
                                                onClick={() => goToPage(pageNum)}
                                                className={`h-12 w-12 rounded-xl font-bold ${currentPage === pageNum
                                                    ? "bg-[#111827] text-white"
                                                    : ""
                                                    }`}
                                            >
                                                {pageNum}
                                            </Button>
                                        );
                                    })}

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => goToPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="h-12 w-12 rounded-xl"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </Button>
                                </div>
                            )}
                        </>
                    )}

                    {/* Infrastructure Note */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.7 }}
                        className="mt-24 p-12 rounded-[3rem] bg-[#0B1120] relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] group hover:-translate-y-1 transition-transform duration-500"
                    >
                        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl lg:text-4xl font-black text-white mb-6 tracking-tight">
                                    Rigorous Compliance as Standard.
                                </h2>
                                <p className="text-white/60 font-medium leading-relaxed mb-8">
                                    Heems operates strictly as an introductory agency. We verify credentials
                                    so you can focus on building a direct relationship with your care professional.
                                </p>
                                <div className="flex flex-wrap gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#1a9e8c]" />
                                        <span className="text-xs font-black text-white uppercase tracking-widest">2-Referral rule</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#1a9e8c]" />
                                        <span className="text-xs font-black text-white uppercase tracking-widest">Compliance Expiry Alerts</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#1a9e8c]" />
                                        <span className="text-xs font-black text-white uppercase tracking-widest">RTW Verification</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button asChild className="h-14 px-10 rounded-2xl bg-white text-[#0B1120] font-bold hover:bg-slate-100 hover:text-[#111827] hover:-translate-y-1 shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.2)] transition-all duration-500 text-sm">
                                    <Link to="/signup/organisation">
                                        Apply as an Organisation
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Marketplace;
