-- Add £15 Minimum Rate Constraint to carer_details table
-- PRD v2.3.2 Compliance

-- Add constraint to enforce minimum hourly rate
ALTER TABLE carer_details
ADD CONSTRAINT hourly_rate_minimum
CHECK (hourly_rate >= 15.00);

-- Verify constraint is added
SELECT 
  conname AS constraint_name,
  contype AS constraint_type,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'carer_details'::regclass
AND conname = 'hourly_rate_minimum';

-- Test the constraint (should fail)
-- UPDATE carer_details SET hourly_rate = 12.00 WHERE id = 'some-id';
-- Expected: ERROR: new row for relation "carer_details" violates check constraint "hourly_rate_minimum"

-- Test the constraint (should succeed)
-- UPDATE carer_details SET hourly_rate = 20.00 WHERE id = 'some-id';
-- Expected: UPDATE 1

-- Notes:
-- - This constraint ensures all carer rates are >= £15/hour
-- - Prevents database-level violations
-- - Complements UI validation
-- - PRD v2.3.2 requirement
