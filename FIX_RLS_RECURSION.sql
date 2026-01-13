-- FIX RLS RECURSION ERROR
-- This script fixes the infinite loop in RLS policies by using a SECURITY DEFINER function to check admin status.

-- 1. Create a helper function that bypasses RLS
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT (role = 'admin')
    FROM public.profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Update Profiles Policies to avoid recursion
DROP POLICY IF EXISTS "Admins can do everything on profiles" ON public.profiles;
CREATE POLICY "Admins can do everything on profiles" ON public.profiles
    FOR ALL USING (
        (SELECT public.check_is_admin())
    );

-- 3. Update other policies for consistency and safety
DROP POLICY IF EXISTS "Admins can view settings" ON public.platform_settings;
CREATE POLICY "Admins can view settings" ON public.platform_settings
    FOR SELECT USING (
        (SELECT public.check_is_admin())
    );

DROP POLICY IF EXISTS "Admins can update settings" ON public.platform_settings;
CREATE POLICY "Admins can update settings" ON public.platform_settings
    FOR UPDATE USING (
        (SELECT public.check_is_admin())
    );

DROP POLICY IF EXISTS "Admins can do everything on bookings" ON public.bookings;
CREATE POLICY "Admins can do everything on bookings" ON public.bookings
    FOR ALL USING (
        (SELECT public.check_is_admin())
    );

DROP POLICY IF EXISTS "Admins can do everything on carer_details" ON public.carer_details;
CREATE POLICY "Admins can do everything on carer_details" ON public.carer_details
    FOR ALL USING (
        (SELECT public.check_is_admin())
    );

DROP POLICY IF EXISTS "Admins can do everything on organisation_details" ON public.organisation_details;
CREATE POLICY "Admins can do everything on organisation_details" ON public.organisation_details
    FOR ALL USING (
        (SELECT public.check_is_admin())
    );

DROP POLICY IF EXISTS "Admins can do everything on client_details" ON public.client_details;
CREATE POLICY "Admins can do everything on client_details" ON public.client_details
    FOR ALL USING (
        (SELECT public.check_is_admin())
    );

DROP POLICY IF EXISTS "Admins can do everything on messages" ON public.messages;
CREATE POLICY "Admins can do everything on messages" ON public.messages
    FOR ALL USING (
        (SELECT public.check_is_admin())
    );

DROP POLICY IF EXISTS "Admins can do everything on conversations" ON public.conversations;
CREATE POLICY "Admins can do everything on conversations" ON public.conversations
    FOR ALL USING (
        (SELECT public.check_is_admin())
    );

DROP POLICY IF EXISTS "Admins can do everything on call_logs" ON public.call_logs;
CREATE POLICY "Admins can do everything on call_logs" ON public.call_logs
    FOR ALL USING (
        (SELECT public.check_is_admin())
    );

DROP POLICY IF EXISTS "Admins can do everything on care_plans" ON public.care_plans;
CREATE POLICY "Admins can do everything on care_plans" ON public.care_plans
    FOR ALL USING (
        (SELECT public.check_is_admin())
    );
