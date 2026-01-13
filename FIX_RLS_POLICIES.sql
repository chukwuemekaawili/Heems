-- HEEMS - FIX ORGANISATION DETAILS RLS POLICIES
-- Run this in Supabase SQL Editor to fix the "New row violates RLS" error

-- 1. Ensure RLS is enabled
ALTER TABLE public.organisation_details ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing restrictive policies
DROP POLICY IF EXISTS "Organisations viewable by everyone" ON public.organisation_details;
DROP POLICY IF EXISTS "Orgs can update their own details" ON public.organisation_details;
DROP POLICY IF EXISTS "Orgs can insert their own details" ON public.organisation_details;

-- 3. Create comprehensive policies
-- Allow everyone to see organization names/profiles
CREATE POLICY "Organisations viewable by everyone" 
ON public.organisation_details 
FOR SELECT 
USING (true);

-- Allow users to insert their own organization details
CREATE POLICY "Orgs can insert their own details" 
ON public.organisation_details 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Allow users to update their own organization details
CREATE POLICY "Orgs can update their own details" 
ON public.organisation_details 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 4. Also fix carer_details while we are at it, as it might have the same issue
ALTER TABLE public.carer_details ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Carer details are viewable by everyone." ON public.carer_details;
DROP POLICY IF EXISTS "Carers can update their own details." ON public.carer_details;
DROP POLICY IF EXISTS "Carers can insert their own details." ON public.carer_details;

CREATE POLICY "Carer details are viewable by everyone." ON public.carer_details
  FOR SELECT USING (true);

CREATE POLICY "Carers can insert their own details." ON public.carer_details
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Carers can update their own details." ON public.carer_details
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

COMMENT ON TABLE public.organisation_details IS 'Detailed information for organisation-type users with fixed RLS';
