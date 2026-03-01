import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, MapPin, Calendar, Clock, ArrowRight, User, CheckCircle2, XCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Job {
    id: string;
    title: string;
    description: string;
    service_type: string;
    location: string;
    status: string;
    created_at: string;
    job_applications: Application[];
}

interface Application {
    id: string;
    status: string;
    proposed_rate: number;
    cover_letter: string;
    created_at: string;
    carer: {
        id: string;
        full_name: string;
        avatar_url: string;
    };
}

export default function ClientJobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('jobs')
                .select(`
                    id, title, description, service_type, location, status, created_at,
                    job_applications(
                        id, status, proposed_rate, cover_letter, created_at,
                        carer:profiles!job_applications_carer_id_fkey(id, full_name, avatar_url)
                    )
                `)
                .eq('client_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setJobs(data as unknown as Job[]);
        } catch (error: any) {
            console.error('Error fetching jobs:', error);
            toast({
                title: 'Error',
                description: 'Failed to load your posted jobs.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateApplicationStatus = async (applicationId: string, jobId: string, newStatus: 'accepted' | 'declined') => {
        try {
            const { error } = await supabase
                .from('job_applications')
                .update({ status: newStatus })
                .eq('id', applicationId);

            if (error) throw error;

            toast({
                title: "Application Updated",
                description: `Application has been ${newStatus}.`,
            });

            // Update local state instead of full refetch for faster UI
            const updatedJobs = jobs.map(job => {
                if (job.id === jobId) {
                    return {
                        ...job,
                        job_applications: job.job_applications.map(app =>
                            app.id === applicationId ? { ...app, status: newStatus } : app
                        )
                    }
                }
                return job;
            });
            setJobs(updatedJobs);

            if (selectedJob && selectedJob.id === jobId) {
                const updatedSelectedJob = updatedJobs.find(j => j.id === jobId);
                if (updatedSelectedJob) setSelectedJob(updatedSelectedJob);
            }

        } catch (error: any) {
            console.error('Error updating application:', error);
            toast({
                title: 'Error',
                description: 'Failed to update application status.',
                variant: 'destructive',
            });
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Posted Jobs</h1>
                    <p className="text-muted-foreground">Manage your care requests and review carer applications.</p>
                </div>
                <Button asChild>
                    <Link to="/client/post-job">Post New Job</Link>
                </Button>
            </div>

            {jobs.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 mb-2">No jobs posted yet</h3>
                    <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                        Broadcast your care needs to verified professionals in your area.
                    </p>
                    <Button asChild>
                        <Link to="/client/post-job">Post your first job</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6">
                    {jobs.map((job) => (
                        <Card key={job.id} className="overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b pb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant={job.status === 'open' ? 'default' : 'secondary'} className={job.status === 'open' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                                                {job.status.toUpperCase()}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground font-medium">
                                                Posted {format(new Date(job.created_at), 'MMM do, yyyy')}
                                            </span>
                                        </div>
                                        <CardTitle className="text-xl">{(job.service_type || job.title).replace('_', ' ')} Care</CardTitle>
                                        <CardDescription className="flex items-center gap-2 mt-1">
                                            <MapPin className="h-3.5 w-3.5" />
                                            {job.location}
                                        </CardDescription>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => setSelectedJob(job)}>
                                        View Applications ({job.job_applications.length})
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {job.job_applications.length > 0 ? (
                                    <div className="divide-y">
                                        {job.job_applications.slice(0, 3).map(app => (
                                            <div key={app.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <Avatar>
                                                        <AvatarImage src={app.carer.avatar_url} />
                                                        <AvatarFallback>{app.carer.full_name[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-bold text-sm text-foreground">{app.carer.full_name}</p>
                                                        <p className="text-xs font-medium text-emerald-600">Offered £{app.proposed_rate}/hr</p>
                                                    </div>
                                                </div>
                                                <Badge variant="outline" className={`
                                                    ${app.status === 'pending' ? 'text-amber-600 border-amber-200 bg-amber-50' : ''}
                                                    ${app.status === 'accepted' ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : ''}
                                                    ${app.status === 'declined' ? 'text-slate-500 border-slate-200 bg-slate-50' : ''}
                                                `}>
                                                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                                </Badge>
                                            </div>
                                        ))}
                                        {job.job_applications.length > 3 && (
                                            <div className="p-3 text-center bg-slate-50 text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary transition-colors" onClick={() => setSelectedJob(job)}>
                                                +{job.job_applications.length - 3} more applications
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="p-6 text-center text-sm text-muted-foreground">
                                        No applications received yet. Carers in your area have been notified.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Job Applications</DialogTitle>
                        <DialogDescription>
                            Review offers from carers for your {selectedJob?.service_type.replace('_', ' ')} care request.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedJob && (
                        <div className="mt-4 space-y-6">
                            <div className="bg-slate-50 p-4 rounded-xl text-sm border">
                                <h4 className="font-bold mb-2">Job Details</h4>
                                <p className="text-muted-foreground">{selectedJob.description}</p>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-bold border-b pb-2">Applicants ({selectedJob.job_applications.length})</h4>
                                {selectedJob.job_applications.length === 0 ? (
                                    <p className="text-muted-foreground text-sm text-center py-4">No applicants yet.</p>
                                ) : (
                                    selectedJob.job_applications.map(app => (
                                        <div key={app.id} className="border rounded-xl p-4 gap-4 flex flex-col sm:flex-row">
                                            <div className="flex items-center gap-3 w-full sm:w-1/3 shrink-0">
                                                <Avatar className="h-12 w-12 border-2 border-primary/10">
                                                    <AvatarImage src={app.carer.avatar_url} />
                                                    <AvatarFallback className="bg-primary/10 text-primary">{app.carer.full_name[0]}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <Link to={`/client/book/${app.carer.id}`} className="font-bold hover:underline">
                                                        {app.carer.full_name}
                                                    </Link>
                                                    <p className="text-sm font-black text-emerald-600">£{app.proposed_rate.toFixed(2)}/hr</p>
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="bg-slate-50 text-slate-700 text-sm p-3 rounded-lg border border-slate-100 mb-3 whitespace-pre-wrap">
                                                    {app.cover_letter || "No cover letter provided."}
                                                </div>
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-xs text-muted-foreground">
                                                        Applied {format(new Date(app.created_at), 'MMM do, yyyy')}
                                                    </span>

                                                    {app.status === 'pending' ? (
                                                        <div className="flex gap-2">
                                                            <Button size="sm" variant="outline" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50" onClick={() => handleUpdateApplicationStatus(app.id, selectedJob.id, 'declined')}>
                                                                Decline
                                                            </Button>
                                                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleUpdateApplicationStatus(app.id, selectedJob.id, 'accepted')}>
                                                                Accept & Book
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <Badge variant="outline" className={`
                                                            ${app.status === 'accepted' ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : 'text-slate-500 border-slate-200 bg-slate-50'}
                                                        `}>
                                                            {app.status === 'accepted' ? 'Offer Accepted' : 'Offer Declined'}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
