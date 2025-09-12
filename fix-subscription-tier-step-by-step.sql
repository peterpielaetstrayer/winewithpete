-- Step 1: First, update any existing rows with invalid subscription tiers
UPDATE members SET subscription_tier = 'free' WHERE subscription_tier NOT IN ('free', 'premium', 'founder');

-- Step 2: Check what subscription tiers currently exist
SELECT DISTINCT subscription_tier FROM members;

-- Step 3: Now drop the old constraint
ALTER TABLE members DROP CONSTRAINT IF EXISTS members_subscription_tier_check;

-- Step 4: Add the new constraint with the correct tier values
ALTER TABLE members ADD CONSTRAINT members_subscription_tier_check 
CHECK (subscription_tier IN ('free', 'premium', 'founder'));

-- Step 5: Verify the constraint is working
SELECT subscription_tier, COUNT(*) FROM members GROUP BY subscription_tier;
