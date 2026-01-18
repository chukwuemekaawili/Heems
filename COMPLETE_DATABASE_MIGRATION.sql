-- ============================================
-- HEEMS COMPLETE DATABASE MIGRATION
-- ============================================
-- Run this file in Supabase SQL Editor to set up the complete database
-- This consolidates all migrations into a single file
-- Date: 2026-01-18
-- ============================================

-- ============================================
-- PART 1: CORE TABLES
-- ============================================

-- 1.1 Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('client', 'carer', 'organisation', 'admin')) DEFAULT 'client',
  phone TEXT,
  address TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 1.2 Carer Details Table
CREATE TABLE IF NOT EXISTS public.carer_details (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  bio TEXT,
  years_experience INTEGER DEFAULT 0,
  skills TEXT[],
  hourly_rate NUMERIC(10, 2),
  verification_status TEXT CHECK (verification_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  dbs_check_date DATE,
  availability_status TEXT CHECK (availability_status IN ('available', 'busy', 'away')) DEFAULT 'available',
  -- Stripe Connect fields
  stripe_account_id TEXT,
  stripe_onboarding_complete BOOLEAN DEFAULT false,
  stripe_charges_enabled BOOLEAN DEFAULT false,
  stripe_payouts_enabled BOOLEAN DEFAULT false,
  stripe_onboarded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.carer_details ENABLE ROW LEVEL SECURITY;

-- 1.3 Organisation Details Table
CREATE TABLE IF NOT EXISTS public.organisation_details (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  company_name TEXT NOT NULL,
  registration_number TEXT,
  postcode TEXT,
  service_radius_miles INTEGER DEFAULT 10,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.organisation_details ENABLE ROW LEVEL SECURITY;

-- 1.4 Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.profiles(id) NOT NULL,
  carer_id UUID REFERENCES public.profiles(id) NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
  total_price NUMERIC(10, 2),
  rate_per_hour NUMERIC(10, 2),
  client_fee NUMERIC(10, 2),
  carer_fee NUMERIC(10, 2),
  stripe_transfer_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 1.5 Care Plans Table
CREATE TABLE IF NOT EXISTS public.care_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  medications JSONB DEFAULT '[]',
  routines JSONB DEFAULT '[]',
  emergency_contact JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.care_plans ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PART 2: VERIFICATION SYSTEM
-- ============================================

-- 2.1 Carer Verification Table (with document URLs)
CREATE TABLE IF NOT EXISTS public.carer_verification (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  -- Document statuses
  id_status TEXT CHECK (id_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  dbs_status TEXT CHECK (dbs_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  rtw_status TEXT CHECK (rtw_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  insurance_status TEXT CHECK (insurance_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  -- Document URLs
  id_document_url TEXT,
  dbs_document_url TEXT,
  rtw_document_url TEXT,
  insurance_document_url TEXT,
  -- Expiry dates
  dbs_expiry DATE,
  insurance_expiry DATE,
  rtw_expiry DATE,
  -- Metadata
  last_vetted_at TIMESTAMPTZ,
  overall_status TEXT CHECK (overall_status IN ('unverified', 'pending', 'verified', 'expired')) DEFAULT 'unverified',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.carer_verification ENABLE ROW LEVEL SECURITY;

-- 2.2 Carer Referrals Table
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

ALTER TABLE public.carer_referrals ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PART 3: MESSAGING SYSTEM
-- ============================================

-- 3.1 Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  is_flagged BOOLEAN DEFAULT false,
  flagged_keywords TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 3.2 Conversations Table
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  participant_2_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(participant_1_id, participant_2_id)
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PART 4: SYSTEM CONFIGURATION
-- ============================================

-- 4.1 System Config Table
CREATE TABLE IF NOT EXISTS public.system_config (
  id TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial phase
INSERT INTO public.system_config (id, value, description)
VALUES ('active_phase', '1', 'Current pricing phase (1 or 2)')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- PART 5: INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_verified ON public.profiles(verified);
CREATE INDEX IF NOT EXISTS idx_carer_details_stripe_account ON public.carer_details(stripe_account_id) WHERE stripe_account_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_bookings_client ON public.bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_carer ON public.bookings(carer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON public.messages(is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_conversations_participants ON public.conversations(participant_1_id, participant_2_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON public.conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_carer_referrals_carer ON public.carer_referrals(carer_id);

-- ============================================
-- PART 6: HELPER FUNCTIONS
-- ============================================

-- 6.1 Admin check function (prevents RLS recursion)
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

-- 6.2 Handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_user_meta_data->>'role', 'client')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6.3 Sync carer verification status to profiles
CREATE OR REPLACE FUNCTION public.sync_carer_verification_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.overall_status = 'verified' AND (OLD.overall_status IS NULL OR OLD.overall_status != 'verified') THEN
    UPDATE public.profiles SET verified = true WHERE id = NEW.id AND role = 'carer';
  END IF;
  IF NEW.overall_status != 'verified' AND OLD.overall_status = 'verified' THEN
    UPDATE public.profiles SET verified = false WHERE id = NEW.id AND role = 'carer';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6.4 Update conversation timestamp on new message
CREATE OR REPLACE FUNCTION public.update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET last_message_at = NEW.created_at
  WHERE (participant_1_id = NEW.sender_id AND participant_2_id = NEW.receiver_id)
     OR (participant_1_id = NEW.receiver_id AND participant_2_id = NEW.sender_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6.5 Ensure conversation exists before message
CREATE OR REPLACE FUNCTION public.ensure_conversation_exists()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.conversations (participant_1_id, participant_2_id)
  VALUES (
    LEAST(NEW.sender_id, NEW.receiver_id),
    GREATEST(NEW.sender_id, NEW.receiver_id)
  )
  ON CONFLICT (participant_1_id, participant_2_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- PART 7: TRIGGERS
-- ============================================

-- Drop existing triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS trigger_sync_carer_verification ON public.carer_verification;
DROP TRIGGER IF EXISTS update_conversation_on_message ON public.messages;
DROP TRIGGER IF EXISTS ensure_conversation_before_message ON public.messages;

-- 7.1 Create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7.2 Sync verification status
CREATE TRIGGER trigger_sync_carer_verification
  AFTER UPDATE ON public.carer_verification
  FOR EACH ROW EXECUTE FUNCTION public.sync_carer_verification_status();

-- 7.3 Update conversation timestamp
CREATE TRIGGER update_conversation_on_message
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_conversation_timestamp();

-- 7.4 Ensure conversation exists
CREATE TRIGGER ensure_conversation_before_message
  BEFORE INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.ensure_conversation_exists();

-- ============================================
-- PART 8: RLS POLICIES
-- ============================================

-- 8.1 Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Admins can do everything on profiles" ON public.profiles;

CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can do everything on profiles" ON public.profiles
  FOR ALL USING ((SELECT public.check_is_admin()));

-- 8.2 Carer Details Policies
DROP POLICY IF EXISTS "Carer details are viewable by everyone." ON public.carer_details;
DROP POLICY IF EXISTS "Carers can update their own details." ON public.carer_details;
DROP POLICY IF EXISTS "Carers can insert their own details." ON public.carer_details;
DROP POLICY IF EXISTS "Admins can do everything on carer_details" ON public.carer_details;

CREATE POLICY "Carer details are viewable by everyone." ON public.carer_details
  FOR SELECT USING (true);

CREATE POLICY "Carers can insert their own details." ON public.carer_details
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Carers can update their own details." ON public.carer_details
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can do everything on carer_details" ON public.carer_details
  FOR ALL USING ((SELECT public.check_is_admin()));

-- 8.3 Organisation Details Policies
DROP POLICY IF EXISTS "Organisations viewable by everyone" ON public.organisation_details;
DROP POLICY IF EXISTS "Orgs can insert their own details" ON public.organisation_details;
DROP POLICY IF EXISTS "Orgs can update their own details" ON public.organisation_details;
DROP POLICY IF EXISTS "Admins can do everything on organisation_details" ON public.organisation_details;

CREATE POLICY "Organisations viewable by everyone" ON public.organisation_details
  FOR SELECT USING (true);

CREATE POLICY "Orgs can insert their own details" ON public.organisation_details
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Orgs can update their own details" ON public.organisation_details
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can do everything on organisation_details" ON public.organisation_details
  FOR ALL USING ((SELECT public.check_is_admin()));

-- 8.4 Bookings Policies
DROP POLICY IF EXISTS "Users can view their own bookings." ON public.bookings;
DROP POLICY IF EXISTS "Clients can create bookings." ON public.bookings;
DROP POLICY IF EXISTS "Users can update their own bookings." ON public.bookings;
DROP POLICY IF EXISTS "Admins can do everything on bookings" ON public.bookings;

CREATE POLICY "Users can view their own bookings." ON public.bookings
  FOR SELECT USING (auth.uid() = client_id OR auth.uid() = carer_id);

CREATE POLICY "Clients can create bookings." ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can update their own bookings." ON public.bookings
  FOR UPDATE USING (auth.uid() = client_id OR auth.uid() = carer_id);

CREATE POLICY "Admins can do everything on bookings" ON public.bookings
  FOR ALL USING ((SELECT public.check_is_admin()));

-- 8.5 Care Plans Policies
DROP POLICY IF EXISTS "Clients and assigned carers can view care plans." ON public.care_plans;
DROP POLICY IF EXISTS "Clients can create care plans." ON public.care_plans;
DROP POLICY IF EXISTS "Clients can update their care plans." ON public.care_plans;
DROP POLICY IF EXISTS "Admins can do everything on care_plans" ON public.care_plans;

CREATE POLICY "Clients and assigned carers can view care plans." ON public.care_plans
  FOR SELECT USING (
    auth.uid() = client_id OR
    EXISTS (SELECT 1 FROM public.bookings b WHERE b.client_id = care_plans.client_id AND b.carer_id = auth.uid())
  );

CREATE POLICY "Clients can create care plans." ON public.care_plans
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can update their care plans." ON public.care_plans
  FOR UPDATE USING (auth.uid() = client_id);

CREATE POLICY "Admins can do everything on care_plans" ON public.care_plans
  FOR ALL USING ((SELECT public.check_is_admin()));

-- 8.6 Carer Verification Policies
DROP POLICY IF EXISTS "Carer verification viewable by owner and admin" ON public.carer_verification;
DROP POLICY IF EXISTS "Carers can insert their verification" ON public.carer_verification;
DROP POLICY IF EXISTS "Carers can update their verification" ON public.carer_verification;
DROP POLICY IF EXISTS "Admins can do everything on carer_verification" ON public.carer_verification;

CREATE POLICY "Carer verification viewable by owner and admin" ON public.carer_verification
  FOR SELECT USING (auth.uid() = id OR (SELECT public.check_is_admin()));

CREATE POLICY "Carers can insert their verification" ON public.carer_verification
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Carers can update their verification" ON public.carer_verification
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can do everything on carer_verification" ON public.carer_verification
  FOR ALL USING ((SELECT public.check_is_admin()));

-- 8.7 Carer Referrals Policies
DROP POLICY IF EXISTS "Carer referrals viewable by owner and admin" ON public.carer_referrals;
DROP POLICY IF EXISTS "Carers can insert their referrals" ON public.carer_referrals;
DROP POLICY IF EXISTS "Carers can update their referrals" ON public.carer_referrals;
DROP POLICY IF EXISTS "Admins can do everything on carer_referrals" ON public.carer_referrals;

CREATE POLICY "Carer referrals viewable by owner and admin" ON public.carer_referrals
  FOR SELECT USING (auth.uid() = carer_id OR (SELECT public.check_is_admin()));

CREATE POLICY "Carers can insert their referrals" ON public.carer_referrals
  FOR INSERT WITH CHECK (auth.uid() = carer_id);

CREATE POLICY "Carers can update their referrals" ON public.carer_referrals
  FOR UPDATE USING (auth.uid() = carer_id);

CREATE POLICY "Admins can do everything on carer_referrals" ON public.carer_referrals
  FOR ALL USING ((SELECT public.check_is_admin()));

-- 8.8 Messages Policies
DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update received messages" ON public.messages;
DROP POLICY IF EXISTS "Admins can view all messages" ON public.messages;
DROP POLICY IF EXISTS "Admins can do everything on messages" ON public.messages;

CREATE POLICY "Users can view their own messages" ON public.messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update received messages" ON public.messages
  FOR UPDATE USING (auth.uid() = receiver_id);

CREATE POLICY "Admins can do everything on messages" ON public.messages
  FOR ALL USING ((SELECT public.check_is_admin()));

-- 8.9 Conversations Policies
DROP POLICY IF EXISTS "Users can view their conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;
DROP POLICY IF EXISTS "Admins can do everything on conversations" ON public.conversations;

CREATE POLICY "Users can view their conversations" ON public.conversations
  FOR SELECT USING (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);

CREATE POLICY "Users can create conversations" ON public.conversations
  FOR INSERT WITH CHECK (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);

CREATE POLICY "Admins can do everything on conversations" ON public.conversations
  FOR ALL USING ((SELECT public.check_is_admin()));

-- ============================================
-- PART 9: ENABLE REALTIME
-- ============================================

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;

-- ============================================
-- VERIFICATION QUERY
-- ============================================

SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns c WHERE c.table_name = t.table_name AND c.table_schema = 'public') as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;

