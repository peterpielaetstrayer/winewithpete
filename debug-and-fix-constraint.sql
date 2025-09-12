-- Step 1: Check what constraints exist on the members table
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'members'::regclass 
AND conname LIKE '%subscription_tier%';

-- Step 2: Check current data in members table
SELECT subscription_tier, COUNT(*) FROM members GROUP BY subscription_tier;

-- Step 3: Try to drop ALL constraints related to subscription_tier
ALTER TABLE members DROP CONSTRAINT IF EXISTS members_subscription_tier_check;
ALTER TABLE members DROP CONSTRAINT IF EXISTS subscription_tier_check;
ALTER TABLE members DROP CONSTRAINT IF EXISTS check_subscription_tier;

-- Step 4: Add the correct constraint
ALTER TABLE members ADD CONSTRAINT members_subscription_tier_check 
CHECK (subscription_tier IN ('free', 'premium', 'founder'));

-- Step 5: Test by trying to insert a test record (we'll delete it after)
INSERT INTO members (user_id, email, subscription_tier, is_admin) 
VALUES ('test-user-id', 'test@example.com', 'free', false);

-- Step 6: Clean up the test record
DELETE FROM members WHERE email = 'test@example.com';
