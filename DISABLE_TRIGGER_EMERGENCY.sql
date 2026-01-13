-- EMERGENCY FIX: Disable Trigger to Allow Signups
-- Run this if signups are still failing and you need immediate fix

-- Option 1: Disable the triggers temporarily
ALTER TABLE auth.users DISABLE TRIGGER on_auth_user_created;
ALTER TABLE auth.users DISABLE TRIGGER on_auth_user_updated;

-- Verify triggers are disabled
SELECT 
  trigger_name,
  event_object_table,
  action_timing,
  tgenabled
FROM information_schema.triggers
WHERE trigger_name IN ('on_auth_user_created', 'on_auth_user_updated');

-- Note: tgenabled values:
-- 'O' = trigger fires in "origin" and "local" modes
-- 'D' = trigger is disabled
-- 'R' = trigger fires in "replica" mode
-- 'A' = trigger fires always

-- To re-enable later (after fixing the issue):
-- ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;
-- ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_updated;
