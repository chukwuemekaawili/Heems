-- Create messages table for real-time chat
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policies

-- Policy: Users can view messages they sent or received
CREATE POLICY "Users can view their own messages" 
    ON public.messages 
    FOR SELECT 
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Policy: Users can insert messages they are sending
CREATE POLICY "Users can insert messages" 
    ON public.messages 
    FOR INSERT 
    WITH CHECK (auth.uid() = sender_id);

-- Policy: Users can update 'is_read' status for messages they received
CREATE POLICY "Users can update read status of received messages" 
    ON public.messages 
    FOR UPDATE 
    USING (auth.uid() = receiver_id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS messages_sender_id_idx ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS messages_receiver_id_idx ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON public.messages(created_at);

-- Grant access to authenticated users
GRANT ALL ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
