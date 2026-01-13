-- SAFE VERSION: Fix User Details Trigger
-- This version has better error handling and won't cause signup to fail

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved function with error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert new profile or update existing one
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    full_name,
    phone,
    role,
    avatar_url,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'first_name'), ''), ''),
    COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'last_name'), ''), ''),
    COALESCE(
      NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
      TRIM(COALESCE(NEW.raw_user_meta_data->>'first_name', '') || ' ' || COALESCE(NEW.raw_user_meta_data->>'last_name', ''))
    ),
    COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'phone'), ''), ''),
    COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'role'), ''), 'client'),
    COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'avatar_url'), ''), ''),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) 
  DO UPDATE SET
    email = COALESCE(EXCLUDED.email, profiles.email),
    first_name = CASE 
      WHEN EXCLUDED.first_name != '' THEN EXCLUDED.first_name 
      ELSE profiles.first_name 
    END,
    last_name = CASE 
      WHEN EXCLUDED.last_name != '' THEN EXCLUDED.last_name 
      ELSE profiles.last_name 
    END,
    full_name = CASE 
      WHEN EXCLUDED.full_name != '' THEN EXCLUDED.full_name 
      ELSE profiles.full_name 
    END,
    phone = CASE 
      WHEN EXCLUDED.phone != '' THEN EXCLUDED.phone 
      ELSE profiles.phone 
    END,
    role = CASE 
      WHEN EXCLUDED.role != '' THEN EXCLUDED.role 
      ELSE profiles.role 
    END,
    avatar_url = CASE 
      WHEN EXCLUDED.avatar_url != '' THEN EXCLUDED.avatar_url 
      ELSE profiles.avatar_url 
    END,
    updated_at = NOW();

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the signup
    RAISE WARNING 'Error in handle_new_user trigger: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger for new user signups
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create trigger for user metadata updates
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.raw_user_meta_data IS DISTINCT FROM NEW.raw_user_meta_data)
  EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.profiles TO postgres, anon, authenticated, service_role;

-- Add helpful comment
COMMENT ON FUNCTION public.handle_new_user() IS 
'Safely creates or updates user profile when auth user is created/updated. Includes error handling to prevent signup failures.';

-- Verify the trigger was created
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name IN ('on_auth_user_created', 'on_auth_user_updated');
