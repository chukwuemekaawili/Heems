-- Add Right to Work fields to carer_verification
ALTER TABLE public.carer_verification
ADD COLUMN IF NOT EXISTS rtw_type TEXT, -- 'passport', 'visa', 'indefinite_leave'
ADD COLUMN IF NOT EXISTS rtw_share_code TEXT;

-- Update auto_verify logic (Optional, but good to keep in sync if we start trusting share codes)
-- For now, we just store the data. The admin will manually verify the share code.
