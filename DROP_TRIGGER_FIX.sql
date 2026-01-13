-- ALTERNATIVE FIX: Drop and Recreate Trigger Safely
-- This approach doesn't require ALTER TABLE permissions on auth.users

-- Step 1: Drop the existing triggers and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Step 2: Don't create any trigger for now
-- This allows signups to work without the trigger

-- To verify triggers are gone:
SELECT 
  trigger_name,
  event_object_table
FROM information_schema.triggers
WHERE trigger_name IN ('on_auth_user_created', 'on_auth_user_updated')
  AND event_object_schema = 'auth';

-- Expected result: No rows (triggers are deleted)

-- Note: Signups will now work, but profiles won't auto-populate
-- You can manually create profiles or use the admin "Add User" feature
