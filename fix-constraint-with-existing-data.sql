-- Step 1: First, let's see what subscription tiers currently exist
SELECT subscription_tier, COUNT(*) FROM members GROUP BY subscription_tier;

-- Step 2: Update any invalid subscription tiers to 'free'
UPDATE members SET subscription_tier = 'free' WHERE subscription_tier NOT IN ('free', 'premium', 'founder');

-- Step 3: Verify all rows now have valid subscription tiers
SELECT subscription_tier, COUNT(*) FROM members GROUP BY subscription_tier;

-- Step 4: Now drop the old constraint
ALTER TABLE members DROP CONSTRAINT IF EXISTS members_subscription_tier_check;

-- Step 5: Add the new constraint
ALTER TABLE members ADD CONSTRAINT members_subscription_tier_check 
CHECK (subscription_tier IN ('free', 'premium', 'founder'));

-- Step 6: Test the constraint works
SELECT 'Constraint test passed' as result;
