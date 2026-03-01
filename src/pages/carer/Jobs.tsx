import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, MapPin, Calendar, Clock, DollarSign, Search, Filter } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Job {
    id: string;
    title: string;
    description: string;
    service_type: string;
    location: string;
    postcode: string;
    budget_range: string;
    status: string;
    created_at: string;
    specific_start_date: string;
    my_application?: Application;
}

interface Application {
    id: string;
    status: string;
    proposed_rate: number;
    created_at: string;
}

export default function CarerJobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [offerRate, setOfferRate] = useState("");
    const [coverLetter, setCoverLetter] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch open jobs
            const { data: jobsData, error: jobsError } = await supabase
                .from('jobs')
                .select('*')
                .eq('status', 'open')
                .order('created_at', { ascending: false });

            if (jobsError) throw jobsError;

            // Fetch carer's applications
            const { data: appsData, error: appsError } = await supabase
                .from('job_applications')
                .select('id, job_id, status, proposed_rate, created_at')
                .eq('carer_id', user.id);

            if (appsError) throw appsError;

            // Merge data
            const mergedJobs = (jobsData || []).map(job => {
                const app = appsData?.find(a => a.job_id === job.id);
                return {
                    ...job,
                    my_application: app
                };
            });

            setJobs(mergedJobs);

        } catch (error: any) {
            console.error('Error fetching jobs:', error);
            toast({
                title: 'Error',
                description: 'Failed to load job board.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async () => {
        if (!selectedJob || !offerRate) return;

        try {
            setSubmitting(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { error } = await supabase
                .from('job_applications')
                .insert({
                    job_id: selectedJob.id,
                    carer_id: user.id,
                    proposed_rate: parseFloat(offerRate),
                    cover_letter: coverLetter,
                    status: 'pending'
                });

            if (error) throw error;

            toast({
                title: "Offer Sent",
                description: "Your application has been sent to the client.",
            });

            // Send email notification via edge function
            supabase.functions.invoke('send-job-application-notification', {
                body: { jobId: selectedJob.id, carerId: user.id }
            }).catch(console.error); // Do not await, let it run in background

            setSelectedJob(null);
            setOfferRate("");
            setCoverLetter("");
            fetchJobs(); // Refresh list to show 'Applied' status

        } catch (error: any) {
            console.error('Error submitting application:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to submit offer.',
                variant: 'destructive',
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Job Board</h1>
                    <p className="text-muted-foreground">Browse local care requests and send custom offers.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search location..." className="pl-9 bg-white" />
                    </div>
                </div>
            </div>

            {jobs.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 mb-2">No jobs available right now</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">
                        Check back later or ensure your profile is fully complete and verified to rank higher in search results.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {jobs.map((job) => (
                        <Card key={job.id} className="overflow-hidden hover:border-primary/30 transition-colors">
                            <CardContent className="p-6 md:p-8">
                                <div className="flex flex-col lg:flex-row gap-6 justify-between">
                                    <div className="space-y-4 flex-1">
                                        <div>
                                            <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
                                                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                                    {(job.service_type || job.title).replace('_', ' ').toUpperCase()} CARE
                                                </Badge>
                                                {job.specific_start_date && (
                                                    <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                                                        Starts {format(new Date(job.specific_start_date), 'MMM do')}
                                                    </Badge>
                                                )}
                                                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    Posted {format(new Date(job.created_at), 'd MMM yyyy')}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">
                                                {job.description ? job.description.slice(0, 100) + '...' : 'Care Request'}
                                            </h3>
                                        </div>

                                        <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
                                            {job.description}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-700">
                                            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100">
                                                <MapPin className="h-4 w-4 text-emerald-600" />
                                                {job.location} {job.postcode && <span className="text-muted-foreground ml-1">({job.postcode.split(' ')[0]})</span>}
                                            </div>
                                            {job.budget_range && (
                                                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100">
                                                    <DollarSign className="h-4 w-4 text-emerald-600" />
                                                    Budget: £{job.budget_range}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 lg:pl-6 lg:border-l">
                                        {job.my_application ? (
                                            <div className="text-right w-full lg:w-auto">
                                                <Badge variant="outline" className={`
                                                    mb-2 px-3 py-1 text-sm
                                                    ${job.my_application.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                                                    ${job.my_application.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                                                    ${job.my_application.status === 'declined' ? 'bg-slate-50 text-slate-700 border-slate-200' : ''}
                                                `}>
                                                    {job.my_application.status === 'pending' ? 'Offer Pending' :
                                                        job.my_application.status === 'accepted' ? 'Offer Accepted' : 'Offer Declined'}
                                                </Badge>
                                                <p className="text-xs font-bold text-slate-500">
                                                    Your offer: £{job.my_application.proposed_rate}/hr
                                                </p>
                                            </div>
                                        ) : (
                                            <Button
                                                className="w-full lg:w-40 font-bold bg-[#111827] hover:bg-[#1f2937] text-white"
                                                onClick={() => setSelectedJob(job)}
                                            >
                                                Send Offer
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Send Custom Offer</DialogTitle>
                        <DialogDescription>
                            Propose your hourly rate and introduce yourself. Once accepted, a booking will be created automatically.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedJob && (
                        <div className="space-y-6 pt-4">
                            <div className="space-y-4 bg-slate-50 p-4 rounded-lg border">
                                <div>
                                    <p className="text-sm font-bold block mb-1">Job Details</p>
                                    <p className="text-sm text-slate-600">{selectedJob.description}</p>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{selectedJob.location}</span>
                                    <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{selectedJob.service_type.replace('_', ' ')}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="rate" className="text-sm font-bold">Your Proposed Rate (£)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">£</span>
                                    <Input
                                        id="rate"
                                        type="number"
                                        className="pl-7 w-1/3 min-w-[120px]"
                                        placeholder="0.00"
                                        value={offerRate}
                                        onChange={(e) => setOfferRate(e.target.value)}
                                    />
                                    <span className="absolute left-[calc(33%+1rem)] top-1/2 -translate-y-1/2 text-slate-400 text-sm">/ hr</span>
                                </div>
                                <p className="text-xs text-muted-foreground">This is the final rate the client will see.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message" className="text-sm font-bold">Cover Message</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Briefly explain why you are a good fit for this role..."
                                    className="min-h-[120px]"
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter className="mt-6">
                        <Button variant="outline" onClick={() => setSelectedJob(null)} disabled={submitting}>Cancel</Button>
                        <Button
                            onClick={handleApply}
                            disabled={!offerRate || submitting}
                            className="bg-primary text-white font-bold"
                        >
                            {submitting ? "Sending..." : "Submit Offer"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
