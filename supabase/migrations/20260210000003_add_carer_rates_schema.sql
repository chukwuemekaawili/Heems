-- Add rate columns to carer_details
ALTER TABLE public.carer_details
ADD COLUMN IF NOT EXISTS live_in_rate_weekly NUMERIC,
ADD COLUMN IF NOT EXISTS live_in_rate_daily NUMERIC,
ADD COLUMN IF NOT EXISTS overnight_sleeping_rate NUMERIC,
ADD COLUMN IF NOT EXISTS overnight_waking_rate NUMERIC;

-- Comment on columns for clarity
COMMENT ON COLUMN public.carer_details.live_in_rate_weekly IS 'Weekly rate for live-in care';
COMMENT ON COLUMN public.carer_details.live_in_rate_daily IS 'Daily rate for short-term live-in care';
COMMENT ON COLUMN public.carer_details.overnight_sleeping_rate IS 'Flat rate per sleeping night';
COMMENT ON COLUMN public.carer_details.overnight_waking_rate IS 'Hourly rate for waking night';
