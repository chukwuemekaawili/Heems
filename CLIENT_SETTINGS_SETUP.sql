-- HEEMS - CLIENT SETTINGS & PAYMENT FIELDS
-- This migration adds the necessary infrastructure for real client settings and Stripe payments

-- 1. Create client_details table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.client_details (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  stripe_customer_id TEXT,
  email_bookings BOOLEAN DEFAULT true,
  email_messages BOOLEAN DEFAULT true,
  email_reminders BOOLEAN DEFAULT true,
  sms_bookings BOOLEAN DEFAULT false,
  sms_reminders BOOLEAN DEFAULT true,
  two_factor BOOLEAN DEFAULT false,
  login_alerts BOOLEAN DEFAULT true,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  medical_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.client_details ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
DROP POLICY IF EXISTS "Clients can view their own details." ON public.client_details;
CREATE POLICY "Clients can view their own details." 
ON public.client_details FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Clients can update their own details." ON public.client_details;
CREATE POLICY "Clients can update their own details." 
ON public.client_details FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Clients can insert their own details." ON public.client_details;
CREATE POLICY "Clients can insert their own details." 
ON public.client_details FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- 4. Create trigger to create client_details on profile creation for clients
CREATE OR REPLACE FUNCTION public.handle_new_client_details()
RETURNS TRIGGER AS $$
BEGIN
  IF (new.role = 'client') THEN
    INSERT INTO public.client_details (id)
    VALUES (new.id)
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_created_client ON public.profiles;
CREATE TRIGGER on_profile_created_client
  AFTER INSERT OR UPDATE OF role ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_client_details();

-- 5. Add stripe_customer_id to profiles just in case (redundant but sometimes useful for quicker access)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
