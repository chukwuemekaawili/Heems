-- Drop previous tables to restart cleanly (Since no production data yet)
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;
DROP TABLE IF EXISTS public.call_logs CASCADE;

-- Create conversations table (using snake_case relative participant_1_id)
CREATE TABLE public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_1_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    participant_2_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    -- Ensure participants are different
    CONSTRAINT participants_must_be_different CHECK (participant_1_id != participant_2_id)
);

-- Unique index to prevent duplicate conversations
-- We enforce that participant_1 < participant_2 for uniqueness check or use least/greatest
CREATE UNIQUE INDEX idx_unique_conversation_participants 
ON public.conversations (LEAST(participant_1_id, participant_2_id), GREATEST(participant_1_id, participant_2_id));

-- Create messages table (using sender_id, receiver_id)
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    is_flagged BOOLEAN DEFAULT FALSE,
    flagged_keywords TEXT[],
    file_url TEXT,
    file_name TEXT,
    file_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for querying messages between two users
CREATE INDEX idx_messages_sender_receiver ON public.messages(sender_id, receiver_id);
CREATE INDEX idx_messages_receiver_sender ON public.messages(receiver_id, sender_id);

-- Create call_logs table (required by MessageThread.tsx)
CREATE TABLE public.call_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES public.profiles(id),
    receiver_id UUID REFERENCES public.profiles(id),
    call_type TEXT,
    status TEXT,
    duration_seconds INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_logs ENABLE ROW LEVEL SECURITY;

-- Conversations RLS
CREATE POLICY "Users can view their conversations"
ON public.conversations FOR SELECT
USING (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);

CREATE POLICY "System can create conversations"
ON public.conversations FOR INSERT
WITH CHECK (true); -- Ideally restricted, but needed for trigger function functionality if run as definer?
-- No, triggers run with privileges of function definer if specified, or invoker.
-- We'll make the trigger function SECURITY DEFINER.

-- Messages RLS
CREATE POLICY "Users can view messages they sent or received"
ON public.messages FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
ON public.messages FOR INSERT
WITH CHECK (auth.uid() = sender_id);

-- Call Logs RLS
CREATE POLICY "Users can insert call logs"
ON public.call_logs FOR INSERT
WITH CHECK (auth.uid() = sender_id);

-- FUNCTION: Automatically manage conversations when a message is sent
CREATE OR REPLACE FUNCTION public.handle_new_message()
RETURNS TRIGGER AS $$
DECLARE
    p1 UUID;
    p2 UUID;
    conv_id UUID;
BEGIN
    -- Determine participant order for conversation lookups
    IF NEW.sender_id < NEW.receiver_id THEN
        p1 := NEW.sender_id;
        p2 := NEW.receiver_id;
    ELSE
        p1 := NEW.receiver_id;
        p2 := NEW.sender_id;
    END IF;

    -- Upsert conversation
    -- We try to update first
    UPDATE public.conversations
    SET last_message_at = NEW.created_at,
        updated_at = NEW.created_at
    WHERE participant_1_id = p1 AND participant_2_id = p2
    RETURNING id INTO conv_id;

    -- If no conversation found, insert one
    IF conv_id IS NULL THEN
        INSERT INTO public.conversations (participant_1_id, participant_2_id, last_message_at)
        VALUES (p1, p2, NEW.created_at);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
DROP TRIGGER IF EXISTS trigger_handle_new_message ON public.messages;
CREATE TRIGGER trigger_handle_new_message
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_message();
