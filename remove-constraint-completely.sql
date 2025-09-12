-- Remove the constraint completely - let the application handle validation
ALTER TABLE members DROP CONSTRAINT IF EXISTS members_subscription_tier_check;

-- Verify the constraint is gone
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'members'::regclass 
AND conname LIKE '%subscription_tier%';

-- This should return no rows if the constraint is successfully removed
