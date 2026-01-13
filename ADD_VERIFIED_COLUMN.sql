-- Add verified column to profiles table
-- This column is used by the admin dashboard to track user verification status

-- Add the verified column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;

-- Add comment to the column
COMMENT ON COLUMN public.profiles.verified IS 'Indicates whether the user has been verified by an admin';

-- Update existing users based on carer_verification status (optional)
-- This syncs the verified status for carers who have been verified
UPDATE public.profiles p
SET verified = true
WHERE p.role = 'carer' 
AND EXISTS (
  SELECT 1 FROM public.carer_verification cv 
  WHERE cv.id = p.id 
  AND cv.overall_status = 'verified'
);

-- Create an index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_verified ON public.profiles(verified);

-- Add a trigger to sync carer verification status (optional but recommended)
CREATE OR REPLACE FUNCTION sync_carer_verification_status()
RETURNS TRIGGER AS $$
BEGIN
  -- When carer_verification overall_status changes to 'verified', update profiles.verified
  IF NEW.overall_status = 'verified' AND (OLD.overall_status IS NULL OR OLD.overall_status != 'verified') THEN
    UPDATE public.profiles
    SET verified = true
    WHERE id = NEW.id AND role = 'carer';
  END IF;
  
  -- When carer_verification overall_status changes from 'verified', update profiles.verified
  IF NEW.overall_status != 'verified' AND OLD.overall_status = 'verified' THEN
    UPDATE public.profiles
    SET verified = false
    WHERE id = NEW.id AND role = 'carer';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS trigger_sync_carer_verification ON public.carer_verification;

-- Create the trigger
CREATE TRIGGER trigger_sync_carer_verification
AFTER UPDATE ON public.carer_verification
FOR EACH ROW
EXECUTE FUNCTION sync_carer_verification_status();
