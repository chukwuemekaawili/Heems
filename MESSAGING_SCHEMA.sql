-- Phase 5: Messaging System Database Schema
-- CQC Compliant with Keyword Filtering

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  is_flagged BOOLEAN DEFAULT false, -- Flagged for CQC compliance review
  flagged_keywords TEXT[], -- Array of detected prohibited keywords
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create conversations table for grouping messages
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  participant_2_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(participant_1_id, participant_2_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_conversations_participants ON conversations(participant_1_id, participant_2_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON conversations(last_message_at DESC);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for messages
-- Users can view messages where they are sender or receiver
DROP POLICY IF EXISTS "Users can view their own messages" ON messages;
CREATE POLICY "Users can view their own messages"
ON messages FOR SELECT
TO authenticated
USING (
  auth.uid() = sender_id OR auth.uid() = receiver_id
);

-- Users can insert messages
DROP POLICY IF EXISTS "Users can send messages" ON messages;
CREATE POLICY "Users can send messages"
ON messages FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = sender_id);

-- Users can update their received messages (mark as read)
DROP POLICY IF EXISTS "Users can update received messages" ON messages;
CREATE POLICY "Users can update received messages"
ON messages FOR UPDATE
TO authenticated
USING (auth.uid() = receiver_id);

-- Admins can view all messages (for compliance)
DROP POLICY IF EXISTS "Admins can view all messages" ON messages;
CREATE POLICY "Admins can view all messages"
ON messages FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- RLS Policies for conversations
DROP POLICY IF EXISTS "Users can view their conversations" ON conversations;
CREATE POLICY "Users can view their conversations"
ON conversations FOR SELECT
TO authenticated
USING (
  auth.uid() = participant_1_id OR auth.uid() = participant_2_id
);

DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
CREATE POLICY "Users can create conversations"
ON conversations FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = participant_1_id OR auth.uid() = participant_2_id
);

-- Function to update conversation last_message_at
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET last_message_at = NEW.created_at
  WHERE (participant_1_id = NEW.sender_id AND participant_2_id = NEW.receiver_id)
     OR (participant_1_id = NEW.receiver_id AND participant_2_id = NEW.sender_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update conversation timestamp on new message
DROP TRIGGER IF EXISTS update_conversation_on_message ON messages;
CREATE TRIGGER update_conversation_on_message
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_timestamp();

-- Function to create conversation if it doesn't exist
CREATE OR REPLACE FUNCTION ensure_conversation_exists()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO conversations (participant_1_id, participant_2_id)
  VALUES (
    LEAST(NEW.sender_id, NEW.receiver_id),
    GREATEST(NEW.sender_id, NEW.receiver_id)
  )
  ON CONFLICT (participant_1_id, participant_2_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to ensure conversation exists before inserting message
DROP TRIGGER IF EXISTS ensure_conversation_before_message ON messages;
CREATE TRIGGER ensure_conversation_before_message
BEFORE INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION ensure_conversation_exists();

-- Verify tables created
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_name IN ('messages', 'conversations')
ORDER BY table_name;

-- Test query: Get unread message count
-- SELECT COUNT(*) FROM messages WHERE receiver_id = auth.uid() AND is_read = false;

-- Test query: Get conversation with message count
-- SELECT 
--   c.*,
--   COUNT(m.id) as message_count,
--   COUNT(CASE WHEN m.is_read = false AND m.receiver_id = auth.uid() THEN 1 END) as unread_count
-- FROM conversations c
-- LEFT JOIN messages m ON (
--   (m.sender_id = c.participant_1_id AND m.receiver_id = c.participant_2_id) OR
--   (m.sender_id = c.participant_2_id AND m.receiver_id = c.participant_1_id)
-- )
-- WHERE c.participant_1_id = auth.uid() OR c.participant_2_id = auth.uid()
-- GROUP BY c.id
-- ORDER BY c.last_message_at DESC;
