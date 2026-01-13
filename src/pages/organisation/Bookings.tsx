import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Calendar,
    Clock,
    PoundSterling,
    Users,
    CheckCircle2,
    AlertCircle,
    Eye,
    Plus,
    MapPin,
    Phone,
    MessageSquare,
    XCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";

interface Booking {
    id: string;
    service_type: string;
    start_time: string;
    end_time: string;
    duration_hours: number;
    total_price: number;
    status: string;
    notes: string;
    carer?: {
        id: string;
        full_name: string;
        avatar_url: string;
    };
}

export default function OrganisationBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                navigate("/login");
                return;
            }

            const { data, error } = await supabase
                .from('bookings')
                .select(`
          *,
          carer:profiles!bookings_carer_id_fkey(id, full_name, avatar_url)
        `)
                .eq('client_id', user.id)
                .order('start_time', { ascending: false });

            if (error) throw error;
            setBookings(data || []);

        } catch (error: any) {
            toast({
                title: "Error loading bookings",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId: string) => {
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status: 'cancelled' })
                .eq('id', bookingId);

            if (error) throw error;

            toast({
                title: "Booking cancelled",
                description: "The booking has been cancelled successfully.",
            });

            fetchBookings();
        } catch (error: any) {
            toast({
                title: "Error cancelling booking",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "confirmed":
                return <Badge className="bg-emerald-500"><CheckCircle2 className="h-3 w-3 mr-1" />Confirmed</Badge>;
            case "pending":
                return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
            case "completed":
                return <Badge className="bg-blue-500"><CheckCircle2 className="h-3 w-3 mr-1" />Completed</Badge>;
            case "cancelled":
                return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
            case "in_progress":
                return <Badge className="bg-amber-500"><Clock className="h-3 w-3 mr-1" />In Progress</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const upcomingBookings = bookings.filter(b => ['pending', 'confirmed'].includes(b.status));
    const activeBookings = bookings.filter(b => b.status === 'in_progress');
    const completedBookings = bookings.filter(b => b.status === 'completed');
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

    const totalSpend = completedBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
    const totalHours = completedBookings.reduce((sum, b) => sum + (b.duration_hours || 0), 0);

    if (loading) {
        return (
            <DashboardLayout role="organisation">
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="organisation">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Care Bookings</h1>
                        <p className="text-muted-foreground">Manage your scheduled care sessions</p>
                    </div>
                    <Button asChild>
                        <Link to="/client/search">
                            <Plus className="h-4 w-4 mr-2" />
                            Book a Carer
                        </Link>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Calendar className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{bookings.length}</p>
                                    <p className="text-sm text-muted-foreground">Total Bookings</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                                    <Clock className="h-6 w-6 text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{upcomingBookings.length}</p>
                                    <p className="text-sm text-muted-foreground">Upcoming</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{totalHours}h</p>
                                    <p className="text-sm text-muted-foreground">Hours Completed</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                                    <PoundSterling className="h-6 w-6 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">£{totalSpend.toFixed(0)}</p>
                                    <p className="text-sm text-muted-foreground">Total Spend</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="upcoming">
                    <TabsList>
                        <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
                        <TabsTrigger value="active">Active ({activeBookings.length})</TabsTrigger>
                        <TabsTrigger value="completed">Completed ({completedBookings.length})</TabsTrigger>
                        <TabsTrigger value="cancelled">Cancelled ({cancelledBookings.length})</TabsTrigger>
                    </TabsList>

                    {/* Upcoming Bookings */}
                    <TabsContent value="upcoming" className="space-y-4 mt-6">
                        {upcomingBookings.length === 0 ? (
                            <Card>
                                <CardContent className="p-12 text-center text-muted-foreground">
                                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p className="font-medium">No upcoming bookings</p>
                                    <p className="text-sm">Book a carer to get started</p>
                                    <Button className="mt-4" asChild>
                                        <Link to="/client/search">Find Carers</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            upcomingBookings.map((booking) => (
                                <Card key={booking.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                            {/* Carer Info */}
                                            <div className="flex items-center gap-4 min-w-[200px]">
                                                <Avatar className="h-14 w-14">
                                                    <AvatarImage src={booking.carer?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${booking.carer?.full_name}`} />
                                                    <AvatarFallback>{booking.carer?.full_name?.[0] || 'C'}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h3 className="font-semibold">{booking.carer?.full_name || 'Pending Assignment'}</h3>
                                                    <p className="text-sm text-muted-foreground">{booking.service_type || 'Care Service'}</p>
                                                </div>
                                            </div>

                                            {/* Booking Details */}
                                            <div className="flex-1 grid sm:grid-cols-3 gap-4">
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase font-medium">Date</p>
                                                    <p className="font-medium">{booking.start_time ? format(new Date(booking.start_time), 'EEE, dd MMM yyyy') : 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase font-medium">Time</p>
                                                    <p className="font-medium">
                                                        {booking.start_time ? format(new Date(booking.start_time), 'HH:mm') : 'TBD'} - {booking.end_time ? format(new Date(booking.end_time), 'HH:mm') : 'TBD'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase font-medium">Cost</p>
                                                    <p className="font-medium text-primary">£{booking.total_price}</p>
                                                </div>
                                            </div>

                                            {/* Status & Actions */}
                                            <div className="flex items-center gap-3">
                                                {getStatusBadge(booking.status)}
                                                <Button variant="outline" size="sm">
                                                    <MessageSquare className="h-4 w-4 mr-2" />
                                                    Message
                                                </Button>
                                                {booking.status === 'pending' && (
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleCancelBooking(booking.id)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </TabsContent>

                    {/* Active Bookings */}
                    <TabsContent value="active" className="space-y-4 mt-6">
                        {activeBookings.length === 0 ? (
                            <Card>
                                <CardContent className="p-12 text-center text-muted-foreground">
                                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No active sessions</p>
                                </CardContent>
                            </Card>
                        ) : (
                            activeBookings.map((booking) => (
                                <Card key={booking.id} className="border-amber-200 bg-amber-50/50">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-3 w-3 rounded-full bg-amber-500 animate-pulse" />
                                                <Avatar className="h-12 w-12">
                                                    <AvatarImage src={booking.carer?.avatar_url} />
                                                    <AvatarFallback>{booking.carer?.full_name?.[0]}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h3 className="font-semibold">{booking.carer?.full_name}</h3>
                                                    <p className="text-sm text-muted-foreground">Session in progress</p>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm">Started at {booking.start_time ? format(new Date(booking.start_time), 'HH:mm') : 'N/A'}</p>
                                            </div>
                                            <Button variant="outline" size="sm">
                                                <Phone className="h-4 w-4 mr-2" />
                                                Contact
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </TabsContent>

                    {/* Completed Bookings */}
                    <TabsContent value="completed" className="space-y-4 mt-6">
                        {completedBookings.length === 0 ? (
                            <Card>
                                <CardContent className="p-12 text-center text-muted-foreground">
                                    <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No completed bookings yet</p>
                                </CardContent>
                            </Card>
                        ) : (
                            completedBookings.map((booking) => (
                                <Card key={booking.id} className="opacity-90">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                            <div className="flex items-center gap-4 min-w-[200px]">
                                                <Avatar className="h-12 w-12">
                                                    <AvatarImage src={booking.carer?.avatar_url} />
                                                    <AvatarFallback>{booking.carer?.full_name?.[0]}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h3 className="font-semibold">{booking.carer?.full_name}</h3>
                                                    <p className="text-sm text-muted-foreground">{booking.service_type}</p>
                                                </div>
                                            </div>
                                            <div className="flex-1 grid sm:grid-cols-3 gap-4">
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Date</p>
                                                    <p className="font-medium">{booking.start_time ? format(new Date(booking.start_time), 'dd MMM yyyy') : 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Duration</p>
                                                    <p className="font-medium">{booking.duration_hours}h</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Paid</p>
                                                    <p className="font-medium text-emerald-600">£{booking.total_price}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {getStatusBadge(booking.status)}
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link to={`/client/book/${booking.carer?.id}`}>
                                                        Rebook
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </TabsContent>

                    {/* Cancelled Bookings */}
                    <TabsContent value="cancelled" className="space-y-4 mt-6">
                        {cancelledBookings.length === 0 ? (
                            <Card>
                                <CardContent className="p-12 text-center text-muted-foreground">
                                    <XCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No cancelled bookings</p>
                                </CardContent>
                            </Card>
                        ) : (
                            cancelledBookings.map((booking) => (
                                <Card key={booking.id} className="opacity-60">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-12 w-12 grayscale">
                                                    <AvatarImage src={booking.carer?.avatar_url} />
                                                    <AvatarFallback>{booking.carer?.full_name?.[0]}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h3 className="font-semibold">{booking.carer?.full_name || 'Unassigned'}</h3>
                                                    <p className="text-sm text-muted-foreground">{booking.start_time ? format(new Date(booking.start_time), 'dd MMM yyyy') : 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-muted-foreground">
                                                    Was scheduled for {booking.duration_hours}h · £{booking.total_price}
                                                </p>
                                            </div>
                                            {getStatusBadge(booking.status)}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}
