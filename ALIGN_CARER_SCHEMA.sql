-- HEEMS - ALIGN CARER DETAILS SCHEMA
-- Run this in Supabase SQL Editor to support the enhanced carer data

ALTER TABLE public.carer_details 
ADD COLUMN IF NOT EXISTS experience_years TEXT,
ADD COLUMN IF NOT EXISTS specializations TEXT[],
ADD COLUMN IF NOT EXISTS has_dbs BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_insurance BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_right_to_work BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS dbs_expiry DATE,
ADD COLUMN IF NOT EXISTS insurance_expiry DATE,
ADD COLUMN IF NOT EXISTS rtw_expiry DATE;

-- Migration: Copy data from old columns if they contain data
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'carer_details' AND column_name = 'years_experience') THEN
        UPDATE public.carer_details SET experience_years = years_experience::text WHERE experience_years IS NULL;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'carer_details' AND column_name = 'skills') THEN
        UPDATE public.carer_details SET specializations = skills WHERE specializations IS NULL;
    END IF;
END $$;

COMMENT ON COLUMN public.carer_details.experience_years IS 'Years of experience as a string (e.g. "12 years")';
COMMENT ON COLUMN public.carer_details.specializations IS 'Array of care specialisms';
