-- HEEMS - ADMIN FULL ACCESS AND PLATFORM SETTINGS
-- This script establishes global platform settings and ensures Admins have full CRUD access across all tables.

-- 1. Create Platform Settings Table
CREATE TABLE IF NOT EXISTS public.platform_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    platform_name TEXT DEFAULT 'Heems Care',
    support_email TEXT DEFAULT 'support@heemscare.com',
    platform_url TEXT DEFAULT 'https://heemscare.com',
    email_notifications BOOLEAN DEFAULT true,
    verification_alerts BOOLEAN DEFAULT true,
    booking_notifications BOOLEAN DEFAULT true,
    maintenance_mode BOOLEAN DEFAULT false,
    two_factor_auth BOOLEAN DEFAULT true,
    auto_logout BOOLEAN DEFAULT true,
    auto_backup BOOLEAN DEFAULT true,
    backup_retention_days INTEGER DEFAULT 30,
    stripe_secret_key TEXT,
    supabase_service_key TEXT,
    sendgrid_api_key TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default row if not exists
INSERT INTO public.platform_settings (id) 
VALUES (1) 
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Only Admins can view/update settings
DROP POLICY IF EXISTS "Admins can view settings" ON public.platform_settings;
CREATE POLICY "Admins can view settings" ON public.platform_settings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins can update settings" ON public.platform_settings;
CREATE POLICY "Admins can update settings" ON public.platform_settings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 2. Grant Admins full CRUD access to core tables

-- Profiles
DROP POLICY IF EXISTS "Admins can do everything on profiles" ON public.profiles;
CREATE POLICY "Admins can do everything on profiles" ON public.profiles
    FOR ALL USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    );

-- Bookings
DROP POLICY IF EXISTS "Admins can do everything on bookings" ON public.bookings;
CREATE POLICY "Admins can do everything on bookings" ON public.bookings
    FOR ALL USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    );

-- Carer Details
DROP POLICY IF EXISTS "Admins can do everything on carer_details" ON public.carer_details;
CREATE POLICY "Admins can do everything on carer_details" ON public.carer_details
    FOR ALL USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    );

-- Organisation Details
DROP POLICY IF EXISTS "Admins can do everything on organisation_details" ON public.organisation_details;
CREATE POLICY "Admins can do everything on organisation_details" ON public.organisation_details
    FOR ALL USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    );

-- Client Details
DROP POLICY IF EXISTS "Admins can do everything on client_details" ON public.client_details;
CREATE POLICY "Admins can do everything on client_details" ON public.client_details
    FOR ALL USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    );

-- Messages
DROP POLICY IF EXISTS "Admins can do everything on messages" ON public.messages;
CREATE POLICY "Admins can do everything on messages" ON public.messages
    FOR ALL USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    );

-- Conversations
DROP POLICY IF EXISTS "Admins can do everything on conversations" ON public.conversations;
CREATE POLICY "Admins can do everything on conversations" ON public.conversations
    FOR ALL USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    );

-- Call Logs
DROP POLICY IF EXISTS "Admins can do everything on call_logs" ON public.call_logs;
CREATE POLICY "Admins can do everything on call_logs" ON public.call_logs
    FOR ALL USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    );

-- Care Plans
DROP POLICY IF EXISTS "Admins can do everything on care_plans" ON public.care_plans;
CREATE POLICY "Admins can do everything on care_plans" ON public.care_plans
    FOR ALL USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    );
