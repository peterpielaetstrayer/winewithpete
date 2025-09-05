-- Simple working RLS policy for newsletter subscriptions
-- Run this in your Supabase SQL editor

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow newsletter subscriptions" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow users to update own subscription" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Restrict newsletter reading" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow admin to read subscribers" ON newsletter_subscribers;

-- Create a simple policy that allows subscriptions
CREATE POLICY "Allow newsletter subscriptions" ON newsletter_subscribers 
FOR INSERT 
WITH CHECK (true);

-- Allow updates (for unsubscribing)
CREATE POLICY "Allow newsletter updates" ON newsletter_subscribers 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

-- Allow reading (you can restrict this later if needed)
CREATE POLICY "Allow newsletter reading" ON newsletter_subscribers 
FOR SELECT 
USING (true);

-- Test that it works
-- This should succeed:
-- INSERT INTO newsletter_subscribers (email, name) VALUES ('test@example.com', 'Test User');
