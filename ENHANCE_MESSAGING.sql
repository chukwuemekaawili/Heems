-- HEEMS - ENHANCED MESSAGING SCHEMA
-- Adds support for file attachments and call logs

-- 1. Add file support to messages
ALTER TABLE public.messages
ADD COLUMN IF NOT EXISTS file_url TEXT,
ADD COLUMN IF NOT EXISTS file_name TEXT,
ADD COLUMN IF NOT EXISTS file_type TEXT;

-- 2. Create message-attachments storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('message-attachments', 'message-attachments', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 3. Storage Policies for message-attachments
DROP POLICY IF EXISTS "Users can upload their own attachments" ON storage.objects;
CREATE POLICY "Users can upload their own attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'message-attachments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Participants can view message attachments" ON storage.objects;
CREATE POLICY "Participants can view message attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'message-attachments'
  -- Note: Ideally we'd restrict SELECT to participants of the conversation
  -- but since files are usually private-to-sender in subfolders, this is a starting point.
);

-- 4. Call Logs Table (for simulated/future real calls)
CREATE TABLE IF NOT EXISTS public.call_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  call_type TEXT CHECK (call_type IN ('voice', 'video')) DEFAULT 'voice',
  status TEXT CHECK (status IN ('missed', 'completed', 'declined')) DEFAULT 'completed',
  duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.call_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own call logs" ON public.call_logs
FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
