-- FIX PROFILES TABLE: Add missing columns and sync user roles
-- Run this STEP BY STEP in Supabase SQL Editor

-- ============================================
-- STEP 1: Check what columns exist in profiles
-- ============================================
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- ============================================
-- STEP 2: Add missing columns to profiles table
-- ============================================
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'client';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ============================================
-- STEP 3: View current users and their metadata
-- ============================================
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data->>'first_name' as meta_first_name,
  u.raw_user_meta_data->>'last_name' as meta_last_name,
  u.raw_user_meta_data->>'role' as meta_role
FROM auth.users u
ORDER BY u.created_at DESC;

-- ============================================
-- STEP 4: Sync all data from auth.users to profiles
-- ============================================
UPDATE public.profiles p
SET 
  email = u.email,
  first_name = COALESCE(NULLIF(u.raw_user_meta_data->>'first_name', ''), p.first_name),
  last_name = COALESCE(NULLIF(u.raw_user_meta_data->>'last_name', ''), p.last_name),
  full_name = COALESCE(
    NULLIF(TRIM(CONCAT(
      COALESCE(u.raw_user_meta_data->>'first_name', ''), 
      ' ', 
      COALESCE(u.raw_user_meta_data->>'last_name', '')
    )), ''),
    p.full_name
  ),
  phone = COALESCE(NULLIF(u.raw_user_meta_data->>'phone', ''), p.phone),
  role = COALESCE(NULLIF(u.raw_user_meta_data->>'role', ''), p.role, 'client')
FROM auth.users u
WHERE p.id = u.id;

-- ============================================
-- STEP 5: Verify the fix
-- ============================================
SELECT 
  p.id,
  p.email,
  p.first_name,
  p.last_name,
  p.role,
  p.verified
FROM public.profiles p
ORDER BY p.created_at DESC;
