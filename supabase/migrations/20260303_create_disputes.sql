-- Create disputes table for admins to resolve conflicts

CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES profiles(id),
  carer_id UUID NOT NULL REFERENCES profiles(id),
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open', -- 'open', 'resolved', 'closed'
  resolution_notes TEXT,
  refund_amount NUMERIC(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Clients can view their own disputes"
  ON disputes FOR SELECT
  USING (client_id = auth.uid());

CREATE POLICY "Carers can view their own disputes"
  ON disputes FOR SELECT
  USING (carer_id = auth.uid());

CREATE POLICY "Clients can create disputes"
  ON disputes FOR INSERT
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "Admins can view all disputes"
  ON disputes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update disputes"
  ON disputes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_disputes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_disputes_timestamp ON disputes;
CREATE TRIGGER update_disputes_timestamp
  BEFORE UPDATE ON disputes
  FOR EACH ROW
  EXECUTE FUNCTION update_disputes_updated_at();
