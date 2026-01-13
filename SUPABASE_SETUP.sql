-- HEEMS - SUPABASE SCHEMA SETUP 
-- Copy and paste this into your Supabase SQL Editor

-- 1. Create Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('client', 'carer', 'organisation', 'admin')) DEFAULT 'client',
  phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 2. Create Carer Details Table
CREATE TABLE IF NOT EXISTS public.carer_details (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  bio TEXT,
  years_experience INTEGER DEFAULT 0,
  skills TEXT[], -- Array of skills like 'Dementia Care', 'Wound Care'
  hourly_rate NUMERIC(10, 2),
  verification_status TEXT CHECK (verification_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  dbs_check_date DATE,
  availability_status TEXT CHECK (availability_status IN ('available', 'busy', 'away')) DEFAULT 'available',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.carer_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Carer details are viewable by everyone." ON public.carer_details
  FOR SELECT USING (true);

CREATE POLICY "Carers can update their own details." ON public.carer_details
  FOR UPDATE USING (auth.uid() = id);

-- 3. Create Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.profiles(id) NOT NULL,
  carer_id UUID REFERENCES public.profiles(id) NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
  total_price NUMERIC(10, 2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings." ON public.bookings
  FOR SELECT USING (auth.uid() = client_id OR auth.uid() = carer_id);

CREATE POLICY "Clients can create bookings." ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = client_id);

-- 4. Create Care Plans Table
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

CREATE POLICY "Clients and assigned carers can view care plans." ON public.care_plans
  FOR SELECT USING (
    auth.uid() = client_id OR 
    EXISTS (SELECT 1 FROM public.bookings b WHERE b.client_id = care_plans.client_id AND b.carer_id = auth.uid())
  );

-- 5. Trigger for New User Profile Creation
-- This automatically creates a profile entry when someone signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 'client');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
