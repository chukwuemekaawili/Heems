import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, ExternalLink, BookOpen, Award, PlayCircle, CheckCircle2, Clock, Shield } from "lucide-react";

// Mock courses data
const COURSES = [
    {
        id: "safeguarding-adults",
        title: "Safeguarding Adults (Level 2)",
        provider: "Florence Academy",
        description: "Essential training on identifying and reporting abuse or neglect in adult social care.",
        difficulty: "Beginner",
        duration: "45 mins",
        link: "https://www.florence.co.uk/academy",
        category: "Mandatory"
    },
    {
        id: "moving-handling",
        title: "Moving and Handling",
        provider: "Skills for Care",
        description: "Learn safe techniques for assisting clients with mobility to prevent injuries.",
        difficulty: "Intermediate",
        duration: "1.5 hours",
        link: "https://www.skillsforcare.org.uk",
        category: "Safety"
    },
    {
        id: "dementia-awareness",
        title: "Dementia Awareness",
        provider: "Florence Academy",
        description: "Understand the different types of dementia and how to provide person-centred care.",
        difficulty: "Intermediate",
        duration: "1 hour",
        link: "https://www.florence.co.uk/academy",
        category: "Specialised"
    },
    {
        id: "medication-administration",
        title: "Safe Administration of Medication",
        provider: "Heems Internal",
        description: "Platform guidelines and legal requirements for assisting with client medication.",
        difficulty: "Advanced",
        duration: "2 hours",
        link: "#",
        category: "Clinical"
    },
    {
        id: "first-aid-basic",
        title: "Basic Life Support & First Aid",
        provider: "Skills for Care",
        description: "Critical emergency response skills every care professional must know.",
        difficulty: "Advanced",
        duration: "3 hours",
        link: "https://www.skillsforcare.org.uk",
        category: "Mandatory"
    },
    {
        id: "infection-control",
        title: "Infection Prevention & Control",
        provider: "Florence Academy",
        description: "Best practices for maintaining hygiene and preventing the spread of infections.",
        difficulty: "Beginner",
        duration: "45 mins",
        link: "https://www.florence.co.uk/academy",
        category: "Safety"
    }
];

export default function HeemsAcademy() {
    const [completedCourses, setCompletedCourses] = useState<string[]>([]);
    const [inProgressCourses, setInProgressCourses] = useState<string[]>([]);

    // Load progress from local storage on mount
    useEffect(() => {
        const savedCompleted = localStorage.getItem("heems_academy_completed");
        const savedInProgress = localStorage.getItem("heems_academy_inprogress");

        if (savedCompleted) setCompletedCourses(JSON.parse(savedCompleted));
        if (savedInProgress) setInProgressCourses(JSON.parse(savedInProgress));
    }, []);

    // Save progress when it changes
    useEffect(() => {
        localStorage.setItem("heems_academy_completed", JSON.stringify(completedCourses));
        localStorage.setItem("heems_academy_inprogress", JSON.stringify(inProgressCourses));
    }, [completedCourses, inProgressCourses]);

    const toggleCourseStatus = (courseId: string) => {
        if (completedCourses.includes(courseId)) {
            // Move from completed to not started
            setCompletedCourses(prev => prev.filter(id => id !== courseId));
        } else if (inProgressCourses.includes(courseId)) {
            // Move from in progress to completed
            setInProgressCourses(prev => prev.filter(id => id !== courseId));
            setCompletedCourses(prev => [...prev, courseId]);
        } else {
            // Move from not started to in progress
            setInProgressCourses(prev => [...prev, courseId]);
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "Beginner": return "bg-blue-100 text-blue-700 hover:bg-blue-200";
            case "Intermediate": return "bg-amber-100 text-amber-700 hover:bg-amber-200";
            case "Advanced": return "bg-purple-100 text-purple-700 hover:bg-purple-200";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const calculateOverallProgress = () => {
        if (COURSES.length === 0) return 0;
        return Math.round((completedCourses.length / COURSES.length) * 100);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 py-4">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-[#111827] rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

                <div className="relative z-10 max-w-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#1a9e8c]/20 flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-[#1a9e8c]" />
                        </div>
                        <span className="text-xs font-black text-[#1a9e8c] uppercase tracking-widest">Training & Development</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                        Heems Academy
                    </h1>
                    <p className="text-slate-300 text-lg font-medium">
                        Elevate your care career with world-class training. Complete mandatory courses to boost your profile visibility and earn higher rates.
                    </p>
                </div>

                {/* Progress Tracker Widget */}
                <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10 w-full md:w-72 shrink-0">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-bold text-slate-300">Overall Progress</span>
                        <span className="text-2xl font-black text-white">{calculateOverallProgress()}%</span>
                    </div>
                    <Progress value={calculateOverallProgress()} className="h-3 bg-white/20 mb-4" />
                    <div className="flex items-center gap-3 text-sm font-medium">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span className="text-slate-200">
                            {completedCourses.length} of {COURSES.length} courses completed
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
                {/* Main Course Grid */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-[#111827]">Available Courses</h2>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        {COURSES.map((course) => {
                            const isCompleted = completedCourses.includes(course.id);
                            const isInProgress = inProgressCourses.includes(course.id);

                            return (
                                <Card key={course.id} className={`rounded-[2rem] border-black/[0.05] shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg ${isCompleted ? 'bg-emerald-50/30' : ''}`}>
                                    <CardHeader className="p-6 pb-4">
                                        <div className="flex justify-between items-start mb-4">
                                            <Badge className={`${getDifficultyColor(course.difficulty)} border-none text-xs font-bold`}>
                                                {course.difficulty}
                                            </Badge>
                                            <Badge variant="outline" className="text-xs font-bold border-black/10">
                                                {course.category}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-xl font-bold leading-tight mb-2">
                                            {course.title}
                                        </CardTitle>
                                        <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <Shield className="w-4 h-4" />
                                                {course.provider}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {course.duration}
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6 pt-0">
                                        <p className="text-sm text-slate-600 line-clamp-2">
                                            {course.description}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="p-6 pt-0 flex gap-3">
                                        <Button
                                            className="flex-1 rounded-xl h-11 font-bold"
                                            variant={isCompleted ? "outline" : "default"}
                                            onClick={() => window.open(course.link, '_blank')}
                                        >
                                            {isCompleted ? (
                                                <>Review Course <ExternalLink className="w-4 h-4 ml-2" /></>
                                            ) : (
                                                <>Start Learning <PlayCircle className="w-4 h-4 ml-2" /></>
                                            )}
                                        </Button>

                                        <Button
                                            size="icon"
                                            className={`h-11 w-11 rounded-xl shrink-0 transition-colors ${isCompleted
                                                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                                    : isInProgress
                                                        ? 'bg-amber-500 hover:bg-amber-600 text-white'
                                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600'
                                                }`}
                                            onClick={() => toggleCourseStatus(course.id)}
                                            title={isCompleted ? "Mark as not started" : isInProgress ? "Mark as completed" : "Mark as in progress"}
                                        >
                                            <CheckCircle2 className={`w-6 h-6 ${isCompleted ? 'fill-current' : ''}`} />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card className="rounded-[2rem] border-black/[0.05] shadow-sm overflow-hidden bg-[#1a9e8c] text-white">
                        <CardHeader className="p-6 pb-4">
                            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                                <Award className="w-6 h-6 text-white" />
                            </div>
                            <CardTitle className="text-xl font-black">Why Get Certified?</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 space-y-4 font-medium">
                            <p className="text-white/90 text-sm">
                                Carers with verified training certificates earn up to 40% more bookings on the platform.
                            </p>
                            <ul className="space-y-3 mt-4 text-sm">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-300" />
                                    <span>Rank higher in client search results</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-300" />
                                    <span>Unlock specialized high-pay care jobs</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-300" />
                                    <span>Earn the "Elite Carer" profile badge</span>
                                </li>
                            </ul>
                            <Button className="w-full mt-6 bg-white text-[#1a9e8c] hover:bg-slate-50 font-black rounded-xl h-11" asChild>
                                <a href="/carer/documents">Upload Certificates</a>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2rem] border-black/[0.05] shadow-sm overflow-hidden">
                        <CardHeader className="p-6 pb-4">
                            <CardTitle className="text-lg font-bold">Partner Providers</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 space-y-4">
                            <div className="p-4 rounded-xl border border-black/5 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                    <BookOpen className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">Florence Academy</h4>
                                    <p className="text-xs text-slate-500">Free CPD-accredited courses</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl border border-black/5 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                                    <Shield className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">Skills for Care</h4>
                                    <p className="text-xs text-slate-500">National care standards</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
