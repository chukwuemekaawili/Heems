-- Migration: Add Recurrence Fields and Organisation Staff Table

-- 1. Add Recurrence Fields to Bookings
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS recurrence_type text CHECK (recurrence_type IN ('weekly', 'biweekly', 'monthly')),
ADD COLUMN IF NOT EXISTS recurrence_end_date timestamptz;

-- 2. Create Organisation Staff Table
CREATE TABLE IF NOT EXISTS public.organisation_staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    carer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    added_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organisation_id, carer_id)
);

-- 3. Enable RLS
ALTER TABLE public.organisation_staff ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies for Organisation Staff
CREATE POLICY "Organisations can view their staff"
    ON public.organisation_staff
    FOR SELECT
    USING (auth.uid() = organisation_id);

CREATE POLICY "Organisations can manage their staff"
    ON public.organisation_staff
    FOR ALL
    USING (auth.uid() = organisation_id);

-- Optional: Index on organisation_id for performance
CREATE INDEX IF NOT EXISTS idx_organisation_staff_org_id ON public.organisation_staff(organisation_id);
