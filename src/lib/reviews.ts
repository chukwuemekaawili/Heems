import { supabase } from "@/integrations/supabase/client";

export const scheduleReviewRequest = async (bookingId: string, clientId: string, carerId: string) => {
    try {
        const { data, error } = await supabase
            .from('review_requests')
            .insert({
                booking_id: bookingId,
                client_id: clientId,
                carer_id: carerId,
                status: 'pending',
                scheduled_for: new Date(Date.now() + 1000 * 60 * 60).toISOString(), // 1 hour from now
            })
            .select()
            .single();

        if (error) {
            console.error('Error scheduling review request:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Failed to schedule review request:', error);
        throw error;
    }
};
