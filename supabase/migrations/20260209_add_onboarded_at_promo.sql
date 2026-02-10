-- Add onboarded_at column to carer_details
ALTER TABLE public.carer_details 
ADD COLUMN IF NOT EXISTS onboarded_at TIMESTAMPTZ;

-- Function to set onboarded_at when verification_status becomes 'verified'
CREATE OR REPLACE FUNCTION set_onboarded_at()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if status changed to 'verified' AND onboarded_at is NULL
  IF NEW.verification_status = 'verified' AND OLD.verification_status != 'verified' AND NEW.onboarded_at IS NULL THEN
    NEW.onboarded_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function
DROP TRIGGER IF EXISTS trigger_set_onboarded_at ON public.carer_details;
CREATE TRIGGER trigger_set_onboarded_at
BEFORE UPDATE ON public.carer_details
FOR EACH ROW
EXECUTE FUNCTION set_onboarded_at();

-- Backfill: Set onboarded_at for existing verified carers who don't have it
-- We'll use their created_at as a fallback or just NOW() if we want the promo to start now for them.
-- BUSINESS DECISION: For this script, we'll leave existing NULL to avoid accidentally giving 6 months free to old users unless requested. 
-- However, if the requirement is "All new Carers", existing ones might be excluded from the promo anyway.
-- Let's set it to NOW() for existing verified carers so they get the benefit too? 
-- User said: "All new Carers... First 6 months... From Date Onboarded/Verified"
-- Safe bet: If already verified, set onboarded_at = created_at (assuming they were verified then) or NOW().
-- Let's just create the column for now. Admin can backfill if needed.
