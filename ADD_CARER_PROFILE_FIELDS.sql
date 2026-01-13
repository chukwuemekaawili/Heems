-- HEEMS - ADD MISSING CARER & PROFILE COLUMNS
-- This migration adds columns required by the Carer Profile UI that are missing from the schema

-- 1. Add missing columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS postcode TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'UK';

-- 2. Add missing preference columns to carer_details
ALTER TABLE public.carer_details
ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS travel_radius INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS min_booking_duration INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS instant_booking BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS emergency_availability BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS night_shifts BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS live_in_care BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS show_on_search BOOLEAN DEFAULT true;

-- Update specializations comment (already exists but for clarity)
COMMENT ON COLUMN public.carer_details.specializations IS 'Array of care specialisms (e.g. Dementia Care, Personal Care)';
COMMENT ON COLUMN public.carer_details.languages IS 'Array of languages spoken by the carer';
