-- System Logs Table for Automated Tasks and Monitoring
-- Tracks cron jobs, automated processes, and system events

CREATE TABLE IF NOT EXISTS system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_system_logs_event_type ON system_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at DESC);

-- Enable Row Level Security
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Only admins can view system logs
DROP POLICY IF EXISTS "Admins can view system logs" ON system_logs;
CREATE POLICY "Admins can view system logs"
ON system_logs FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- RLS Policy: System (service role) can insert logs
DROP POLICY IF EXISTS "System can insert logs" ON system_logs;
CREATE POLICY "System can insert logs"
ON system_logs FOR INSERT
TO service_role
WITH CHECK (true);

-- Verify table created
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'system_logs') as column_count
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'system_logs';

-- Example queries:

-- View recent expiry checks
-- SELECT * FROM system_logs 
-- WHERE event_type = 'document_expiry_check' 
-- ORDER BY created_at DESC 
-- LIMIT 10;

-- View today's logs
-- SELECT * FROM system_logs 
-- WHERE created_at >= CURRENT_DATE 
-- ORDER BY created_at DESC;

-- Count logs by type
-- SELECT event_type, COUNT(*) as count 
-- FROM system_logs 
-- GROUP BY event_type 
-- ORDER BY count DESC;
