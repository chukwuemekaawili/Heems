-- ============================================================
-- Fix: Add all missing columns to profiles and carer_details
-- Safe: uses ADD COLUMN IF NOT EXISTS, no data deleted
-- ============================================================

-- ============================================================
-- PROFILES TABLE: add personal detail columns
-- ============================================================
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS last_name text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS postcode text,
  ADD COLUMN IF NOT EXISTS country text DEFAULT 'UK',
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS gender text;

-- Backfill first_name/last_name from full_name where possible
UPDATE public.profiles
SET
  first_name = COALESCE(first_name, split_part(full_name, ' ', 1)),
  last_name  = COALESCE(last_name,  substring(full_name from position(' ' in full_name) + 1))
WHERE full_name IS NOT NULL AND full_name <> ''
  AND (first_name IS NULL OR last_name IS NULL);

-- ============================================================
-- CARER_DETAILS TABLE: add all missing functional columns
-- ============================================================
ALTER TABLE public.carer_details
  ADD COLUMN IF NOT EXISTS specializations    text[]  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS experience_years   text    DEFAULT '1',
  ADD COLUMN IF NOT EXISTS postcode           text,
  ADD COLUMN IF NOT EXISTS availability       text[]  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS languages          text[]  DEFAULT '{English}',
  ADD COLUMN IF NOT EXISTS certifications     text[]  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS travel_radius      integer DEFAULT 10,
  ADD COLUMN IF NOT EXISTS min_booking_duration integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS instant_booking    boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS emergency_availability boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS night_shifts       boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS live_in_care       boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS visiting_care      boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS show_on_search     boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS video_url          text,
  ADD COLUMN IF NOT EXISTS hobbies            text,
  ADD COLUMN IF NOT EXISTS has_transportation boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS onboarded_at       timestamp with time zone,
  ADD COLUMN IF NOT EXISTS preferred_rate     numeric;

-- Rename years_experience -> experience_years migration safety:
-- If years_experience exists and experience_years is null, copy over
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'carer_details'
      AND column_name = 'years_experience'
  ) THEN
    UPDATE public.carer_details
    SET experience_years = years_experience::text
    WHERE experience_years IS NULL AND years_experience IS NOT NULL;
  END IF;
END;
$$;

-- ============================================================
-- Ensure blog_posts table exists (used by Blog.tsx)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  timestamp with time zone DEFAULT now(),
  updated_at  timestamp with time zone DEFAULT now(),
  title       text NOT NULL,
  content     text,
  excerpt     text,
  author      text,
  category    text,
  image_url   text,
  status      text DEFAULT 'Draft',
  tags        text[] DEFAULT '{}'
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'blog_posts' AND policyname = 'Anyone can read published posts'
  ) THEN
    EXECUTE 'CREATE POLICY "Anyone can read published posts" ON public.blog_posts FOR SELECT USING (status = ''Published'')';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'blog_posts' AND policyname = 'Admins can manage blog posts'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "Admins can manage blog posts"
        ON public.blog_posts FOR ALL
        USING (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
          )
        )
    $policy$;
  END IF;
END;
$$;

