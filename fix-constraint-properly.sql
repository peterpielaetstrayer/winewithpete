-- Step 1: First, let's see what the current constraint allows
SELECT conname, consrc 
FROM pg_constraint 
WHERE conrelid = 'members'::regclass 
AND conname LIKE '%subscription_tier%';

-- Step 2: Update all 'basic' records to 'free' first
UPDATE members SET subscription_tier = 'free' WHERE subscription_tier = 'basic';

-- Step 3: Drop the existing constraint
ALTER TABLE members DROP CONSTRAINT IF EXISTS members_subscription_tier_check;

-- Step 4: Add the new constraint that allows 'free', 'premium', 'founder'
ALTER TABLE members ADD CONSTRAINT members_subscription_tier_check 
CHECK (subscription_tier IN ('free', 'premium', 'founder'));

-- Step 5: Verify it worked
SELECT subscription_tier, COUNT(*) FROM members GROUP BY subscription_tier;
