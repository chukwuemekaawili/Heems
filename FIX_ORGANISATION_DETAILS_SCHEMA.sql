-- HEEMS - FIX ORGANISATION DETAILS SCHEMA
-- Run this in Supabase SQL Editor to add missing columns to organisation_details

ALTER TABLE public.organisation_details 
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS email TEXT;

-- Migration: Copy email from profiles if exists
UPDATE public.organisation_details od
SET email = p.email
FROM public.profiles p
WHERE od.id = p.id AND od.email IS NULL;

COMMENT ON TABLE public.organisation_details IS 'Detailed information for organisation-type users';
