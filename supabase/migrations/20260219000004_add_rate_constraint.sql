-- Add check constraint to ensure hourly_rate is at least 15.00
ALTER TABLE public.carer_details
ADD CONSTRAINT check_min_hourly_rate CHECK (hourly_rate >= 15.00);

-- Note: This might fail if existing data violates the constraint.
-- You may need to update existing records first:
-- UPDATE public.carer_details SET hourly_rate = 15.00 WHERE hourly_rate < 15.00;
