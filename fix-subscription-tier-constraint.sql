-- Fix the subscription tier constraint to allow the new tier values
ALTER TABLE members DROP CONSTRAINT IF EXISTS members_subscription_tier_check;

-- Add the new constraint with the correct tier values
ALTER TABLE members ADD CONSTRAINT members_subscription_tier_check 
CHECK (subscription_tier IN ('free', 'premium', 'founder'));

-- Update any existing 'basic' records to 'free'
UPDATE members SET subscription_tier = 'free' WHERE subscription_tier = 'basic';
