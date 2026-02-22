// Enhanced Client Bookings Page with Status Management
import { useState, useEffect } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import {
    Calendar,
    Clock,
    MapPin,
    MessageCircle,
    CheckCircle,
    XCircle,
    AlertCircle,
    DollarSign,
    User,
    CreditCard,
    Pencil
} from 'lucide-react';
import { formatCurrency, calculateFees, getCurrentPricingPhase } from '@/lib/fees';
import { format } from 'date-fns';
import { PaymentCheckout } from '@/components/payments/PaymentCheckout';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { BookingSkeleton } from '@/components/shared/BookingSkeleton';
import type { PricingPhase } from '@/types/database';

interface Booking {
    id: string;
    start_time: string;
    end_time: string;
    status: string;
    payment_status: string;
    total_price: number;
    rate_per_hour: number;
    client_fee: number;
    carer_fee: number;
    carer: {
        id: string;
        full_name: string;
        avatar_url: string | null;
        carer_details: {
            stripe_account_id: string | null;
        } | null;
    };
    created_at: string;
}

export default function ClientBookingsEnhanced() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [selectedBookingForPayment, setSelectedBookingForPayment] = useState<Booking | null>(null);
    const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
    const [editDate, setEditDate] = useState('');
    const [editTime, setEditTime] = useState('');
    const [editDuration, setEditDuration] = useState(2);
    const [currentPhase, setCurrentPhase] = useState<PricingPhase>('1');
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        fetchBookings();
        fetchPricingPhase();

        // Check for payment success URL param
        const params = new URLSearchParams(window.location.search);
        if (params.get('payment') === 'success') {
            toast({
                title: "Payment Successful",
                description: "Your booking has been paid for successfully.",
                className: "bg-green-500 text-white border-green-600",
            });
            // Clean URL
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, []);

    const fetchPricingPhase = async () => {
        const phase = await getCurrentPricingPhase();
        setCurrentPhase(phase);
    };

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('bookings')
                .select(`
          *,
          carer:profiles!bookings_carer_id_fkey(
            id, 
            full_name, 
            avatar_url,
            carer_details(stripe_account_id)
          )
        `)
                .eq('client_id', user.id)
                .order('start_time', { ascending: false });

            if (error) throw error;

            // Transform data to match interface structure if needed (Supabase join returns arrays sometimes)
            // But strict typing matches the query structure usually.
            // carer_details is a single object because it's 1:1 with profiles (mostly)
            // We need to cast or ensure typescript is happy.

            const formattedData = data?.map(item => ({
                ...item,
                carer: {
                    ...item.carer,
                    carer_details: Array.isArray(item.carer.carer_details)
                        ? item.carer.carer_details[0]
                        : item.carer.carer_details
                }
            })) as Booking[];

            setBookings(formattedData || []);
        } catch (error: any) {
            console.error('Error fetching bookings:', error);
            toast({
                title: 'Error',
                description: 'Failed to load bookings',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const cancelBooking = async (bookingId: string) => {
        try {
            setLoading(true);
            const { data, error } = await supabase.functions.invoke('cancel-booking', {
                body: { bookingId }
            });

            if (error) throw error;

            toast({
                title: data.status === 'cancelled' ? 'Booking Cancelled' : 'Cancellation Requested',
                description: data.message,
                variant: data.status === 'cancelled' ? 'default' : 'destructive',
            });

            fetchBookings();
        } catch (error: any) {
            console.error('Cancel error:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to cancel booking',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const openEditDialog = (booking: Booking) => {
        setEditingBooking(booking);
        setEditDate(format(new Date(booking.start_time), 'yyyy-MM-dd'));
        setEditTime(format(new Date(booking.start_time), 'HH:mm'));
        const dur = calculateDuration(booking.start_time, booking.end_time);
        setEditDuration(dur);
    };

    const saveEditBooking = async () => {
        if (!editingBooking) return;
        try {
            setLoading(true);
            const newStart = new Date(`${editDate}T${editTime}`);
            const newEnd = new Date(newStart);
            newEnd.setHours(newEnd.getHours() + editDuration);

            const { error } = await supabase
                .from('bookings')
                .update({
                    start_time: newStart.toISOString(),
                    end_time: newEnd.toISOString(),
                })
                .eq('id', editingBooking.id);

            if (error) throw error;

            toast({
                title: 'Booking Updated',
                description: 'Your booking date and time have been updated.',
            });
            setEditingBooking(null);
            fetchBookings();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update booking',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            pending: { color: 'bg-amber-500', icon: Clock, label: 'Pending' },
            confirmed: { color: 'bg-blue-500', icon: CheckCircle, label: 'Confirmed' },
            completed: { color: 'bg-green-500', icon: CheckCircle, label: 'Completed' },
            cancelled: { color: 'bg-red-500', icon: XCircle, label: 'Cancelled' },
            cancellation_requested: { color: 'bg-orange-500', icon: AlertCircle, label: 'Cancel Requested' },
        };
        const badge = badges[status as keyof typeof badges] || badges.pending;
        const Icon = badge.icon;
        return (
            <Badge className={badge.color}>
                <Icon className="h-3 w-3 mr-1" />
                {badge.label}
            </Badge>
        );
    };

    const getPaymentBadge = (status: string) => {
        const badges = {
            pending: { color: 'bg-amber-500', label: 'Payment Pending' },
            paid: { color: 'bg-green-500', label: 'Paid' },
            failed: { color: 'bg-red-500', label: 'Failed' },
        };
        const badge = badges[status as keyof typeof badges] || badges.pending;
        return <Badge className={badge.color}>{badge.label}</Badge>;
    };

    const filterBookings = (status: string) => {
        if (status === 'all') return bookings;
        return bookings.filter(b => b.status === status);
    };

    const calculateDuration = (start: string, end: string) => {
        const hours = (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60);
        return hours;
    };

    const filteredBookings = filterBookings(activeTab);

    // Prepare fee calculation for the selected booking
    const getFeeBreakdownForBooking = (booking: Booking) => {
        const duration = calculateDuration(booking.start_time, booking.end_time);
        return calculateFees(booking.rate_per_hour, duration, currentPhase);
    };

    if (loading && bookings.length === 0) {
        return (
            <div className="space-y-6 max-w-7xl mx-auto py-4">
                <BookingSkeleton />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto py-4">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="h-2 w-2 rounded-full bg-[#1a9e8c]" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        My Bookings
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-[#111827] tracking-tight">Bookings</h1>
                        <p className="text-slate-500 font-medium">Manage your care bookings</p>
                    </div>
                    <Button onClick={() => navigate('/client/search-enhanced')}>
                        <Calendar className="h-4 w-4 mr-2" />
                        New Booking
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total</p>
                                <p className="text-2xl font-black">{bookings.length}</p>
                            </div>
                            <Calendar className="h-8 w-8 text-slate-300" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Confirmed</p>
                                <p className="text-2xl font-black text-blue-600">
                                    {bookings.filter(b => b.status === 'confirmed').length}
                                </p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-blue-300" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Completed</p>
                                <p className="text-2xl font-black text-green-600">
                                    {bookings.filter(b => b.status === 'completed').length}
                                </p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-300" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Spent</p>
                                <p className="text-2xl font-black text-[#1a9e8c]">
                                    {formatCurrency(
                                        bookings
                                            .filter(b => b.payment_status === 'paid')
                                            .reduce((sum, b) => sum + (b.total_price || 0), 0)
                                    )}
                                </p>
                            </div>
                            <DollarSign className="h-8 w-8 text-[#1a9e8c]/30" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bookings List */}
            <Card>
                <CardHeader>
                    <CardTitle>All Bookings</CardTitle>
                    <CardDescription>View and manage your care bookings</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="mb-4">
                            <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
                            <TabsTrigger value="pending">
                                Pending ({bookings.filter(b => b.status === 'pending').length})
                            </TabsTrigger>
                            <TabsTrigger value="confirmed">
                                Confirmed ({bookings.filter(b => b.status === 'confirmed').length})
                            </TabsTrigger>
                            <TabsTrigger value="completed">
                                Completed ({bookings.filter(b => b.status === 'completed').length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value={activeTab} className="space-y-4">
                            {filteredBookings.length === 0 ? (
                                <div className="text-center py-12">
                                    <Calendar className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-slate-700 mb-2">No bookings found</h3>
                                    <p className="text-slate-500 mb-4">
                                        {activeTab === 'all'
                                            ? 'You haven\'t made any bookings yet'
                                            : `No ${activeTab} bookings`}
                                    </p>
                                    <Button onClick={() => navigate('/client/search-enhanced')}>
                                        Find a Carer
                                    </Button>
                                </div>
                            ) : (
                                filteredBookings.map(booking => {
                                    const duration = calculateDuration(booking.start_time, booking.end_time);
                                    const canCancel = booking.status === 'pending' || booking.status === 'confirmed';
                                    const canPay = booking.status === 'confirmed' && booking.payment_status !== 'paid';
                                    const carerStripeConnected = !!booking.carer.carer_details?.stripe_account_id;

                                    return (
                                        <Card key={booking.id} className="hover:shadow-md transition-shadow">
                                            <CardContent className="pt-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-start gap-4">
                                                        <Avatar className="h-12 w-12">
                                                            <AvatarImage
                                                                src={booking.carer.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${booking.carer.full_name}`}
                                                            />
                                                            <AvatarFallback>{booking.carer.full_name[0]}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <h3 className="font-bold text-lg">{booking.carer.full_name}</h3>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                {getStatusBadge(booking.status)}
                                                                {getPaymentBadge(booking.payment_status)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-2xl font-black text-[#1a9e8c]">
                                                            {formatCurrency(booking.total_price)}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {formatCurrency(booking.rate_per_hour)}/hr × {duration}hrs
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <span>{format(new Date(booking.start_time), 'PPP')}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                                        <span>
                                                            {format(new Date(booking.start_time), 'p')} - {format(new Date(booking.end_time), 'p')}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => navigate(`/client/messages?user=${booking.carer.id}`)}
                                                    >
                                                        <MessageCircle className="h-4 w-4 mr-1" />
                                                        Message
                                                    </Button>

                                                    {canPay && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => {
                                                                if (carerStripeConnected) {
                                                                    setSelectedBookingForPayment(booking);
                                                                } else {
                                                                    toast({
                                                                        title: "Payment Unavailable",
                                                                        description: "This carer has not set up their payment details yet. Please contact them.",
                                                                        variant: "destructive"
                                                                    });
                                                                }
                                                            }}
                                                            className="bg-[#1a9e8c] hover:bg-[#15806c]"
                                                        >
                                                            <CreditCard className="h-4 w-4 mr-1" />
                                                            Pay Now
                                                        </Button>
                                                    )}

                                                    {canCancel && (
                                                        <>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => openEditDialog(booking)}
                                                            >
                                                                <Pencil className="h-4 w-4 mr-1" />
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => cancelBooking(booking.id)}
                                                                className="text-red-600 hover:text-red-700"
                                                            >
                                                                <XCircle className="h-4 w-4 mr-1" />
                                                                Cancel
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Payment Modal */}
            <Dialog open={!!selectedBookingForPayment} onOpenChange={(open) => !open && setSelectedBookingForPayment(null)}>
                <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-transparent border-none shadow-none">
                    {selectedBookingForPayment && selectedBookingForPayment.carer.carer_details?.stripe_account_id && (
                        <PaymentCheckout
                            bookingId={selectedBookingForPayment.id}
                            carerId={selectedBookingForPayment.carer.id}
                            carerName={selectedBookingForPayment.carer.full_name}
                            carerStripeAccountId={selectedBookingForPayment.carer.carer_details.stripe_account_id}
                            feeBreakdown={getFeeBreakdownForBooking(selectedBookingForPayment)}
                            onCancel={() => setSelectedBookingForPayment(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Edit Booking Dialog */}
            <Dialog open={!!editingBooking} onOpenChange={(open) => !open && setEditingBooking(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Booking</DialogTitle>
                    </DialogHeader>
                    {editingBooking && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Date</Label>
                                <Input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Start Time</Label>
                                <Input type="time" value={editTime} onChange={e => setEditTime(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Duration (hours)</Label>
                                <div className="flex items-center gap-3">
                                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setEditDuration(Math.max(1, editDuration - 1))}>-</Button>
                                    <span className="text-lg font-bold">{editDuration} hrs</span>
                                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setEditDuration(editDuration + 1)}>+</Button>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingBooking(null)}>Cancel</Button>
                        <Button onClick={saveEditBooking} disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
