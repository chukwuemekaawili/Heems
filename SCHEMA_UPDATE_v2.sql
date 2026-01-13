-- HEEMS - ADVANCED SUPABASE SCHEMA (v2.3.2 COMPLIANT)

-- 1. Organisation Details
CREATE TABLE IF NOT EXISTS public.organisation_details (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  company_name TEXT NOT NULL,
  registration_number TEXT,
  postcode TEXT,
  service_radius_miles INTEGER DEFAULT 10,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Expanded Carer Verification
CREATE TABLE IF NOT EXISTS public.carer_verification (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  id_status TEXT CHECK (id_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  dbs_status TEXT CHECK (dbs_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  rtw_status TEXT CHECK (rtw_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  insurance_status TEXT CHECK (insurance_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  
  dbs_expiry DATE,
  insurance_expiry DATE,
  rtw_expiry DATE,
  
  last_vetted_at TIMESTAMPTZ,
  overall_status TEXT CHECK (overall_status IN ('unverified', 'pending', 'verified', 'expired')) DEFAULT 'unverified'
);

-- 3. Carer Referrals (Min 2 required)
CREATE TABLE IF NOT EXISTS public.carer_referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  carer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  referee_name TEXT NOT NULL,
  referee_email TEXT NOT NULL,
  referee_phone TEXT,
  relationship TEXT,
  status TEXT CHECK (status IN ('pending', 'notified', 'verified', 'rejected')) DEFAULT 'pending',
  verification_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. System Configuration & Phase Tracking
CREATE TABLE IF NOT EXISTS public.system_config (
  id TEXT PRIMARY KEY, -- e.g. 'pricing_phase'
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Initial Phase
INSERT INTO public.system_config (id, value, description)
VALUES ('active_phase', '1', 'Current pricing phase (1 or 2)')
ON CONFLICT (id) DO NOTHING;

-- 5. Enhanced Bookings (with fixed fee splits)
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS rate_per_hour NUMERIC(10, 2);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS client_fee NUMERIC(10, 2);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS carer_fee NUMERIC(10, 2);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS stripe_transfer_id TEXT;

-- 6. RLS Policies
ALTER TABLE public.organisation_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carer_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carer_referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organisations viewable by everyone" ON public.organisation_details FOR SELECT USING (true);
CREATE POLICY "Orgs can update their own details" ON public.organisation_details FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Carer verification viewable by owner and admin" ON public.carer_verification 
  FOR SELECT USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Carer referrals viewable by owner and admin" ON public.carer_referrals 
  FOR SELECT USING (auth.uid() = carer_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
