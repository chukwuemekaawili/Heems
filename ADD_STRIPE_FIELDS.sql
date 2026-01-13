-- Add Stripe Connect fields to carer_details table
-- Phase 4: Stripe Connect Integration

-- Add Stripe-related columns
ALTER TABLE carer_details
ADD COLUMN IF NOT EXISTS stripe_account_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_onboarding_complete BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS stripe_charges_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS stripe_payouts_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS stripe_onboarded_at TIMESTAMPTZ;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_carer_details_stripe_account 
ON carer_details(stripe_account_id) 
WHERE stripe_account_id IS NOT NULL;

-- Verify columns added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'carer_details'
AND column_name LIKE 'stripe%'
ORDER BY column_name;

-- Example query to check Stripe status
SELECT 
  id,
  stripe_account_id,
  stripe_onboarding_complete,
  stripe_charges_enabled,
  stripe_payouts_enabled,
  stripe_onboarded_at
FROM carer_details
WHERE stripe_account_id IS NOT NULL;
