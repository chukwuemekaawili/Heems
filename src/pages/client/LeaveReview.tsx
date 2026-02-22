import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function LeaveReview() {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [booking, setBooking] = useState<any>(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [hoveredRating, setHoveredRating] = useState(0);

    useEffect(() => {
        if (bookingId) {
            fetchBookingDetails();
        }
    }, [bookingId]);

    const fetchBookingDetails = async () => {
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select(`
          *,
          carer:profiles!bookings_carer_id_fkey(id, full_name, avatar_url)
        `)
                .eq('id', bookingId)
                .single();

            if (error) throw error;
            setBooking(data);
        } catch (error) {
            console.error("Error fetching booking:", error);
            toast({
                title: "Error",
                description: "Could not load booking details.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            toast({
                title: "Rating required",
                description: "Please select a star rating.",
                variant: "destructive",
            });
            return;
        }

        setSubmitting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { error } = await supabase
                .from('reviews')
                .insert({
                    booking_id: bookingId,
                    reviewer_id: user.id,
                    reviewee_id: booking.carer_id,
                    rating,
                    comment
                });

            if (error) throw error;

            // Update review_request status if it exists
            await supabase
                .from('review_requests')
                .update({ status: 'completed' })
                .eq('booking_id', bookingId);

            toast({
                title: "Review submitted",
                description: "Thank you for your feedback!",
            });

            navigate('/client/bookings');
        } catch (error: any) {
            console.error("Error submitting review:", error);
            toast({
                title: "Submission failed",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="container max-w-lg py-12">
                <Card>
                    <CardContent className="pt-6 text-center">
                        Booking not found.
                        <Button onClick={() => navigate('/client/bookings')} className="mt-4 block w-full">Back to Bookings</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container max-w-lg py-12 animate-fade-in">
            <Card className="border-2 border-black/5 shadow-xl">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl font-black">Rate Your Experience</CardTitle>
                    <CardDescription>How was your care session with {booking.carer?.full_name}?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="flex flex-col items-center gap-4">
                        <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                            <AvatarImage src={booking.carer?.avatar_url} />
                            <AvatarFallback className="text-xl">{booking.carer?.full_name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="text-center">
                            <h3 className="font-bold text-lg">{booking.carer?.full_name}</h3>
                            <p className="text-sm text-muted-foreground">Care Professional</p>
                        </div>
                    </div>

                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="transition-transform hover:scale-110 focus:outline-none"
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                onClick={() => setRating(star)}
                            >
                                <Star
                                    className={`h-10 w-10 ${star <= (hoveredRating || rating)
                                            ? "fill-amber-400 text-amber-400"
                                            : "fill-slate-100 text-slate-300"
                                        } transition-colors`}
                                />
                            </button>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
                            <span>Poor</span>
                            <span>Excellent</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Textarea
                            placeholder="Share details about your experience..."
                            className="min-h-[120px] resize-none rounded-xl border-black/10 bg-slate-50 p-4 focus:bg-white transition-colors"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <Button
                            className="w-full h-12 rounded-xl font-bold text-base shadow-lg shadow-primary/20"
                            onClick={handleSubmit}
                            disabled={submitting || rating === 0}
                        >
                            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Submit Review
                        </Button>
                        <Button variant="ghost" className="w-full" onClick={() => navigate('/client/bookings')}>
                            Skip for now
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
