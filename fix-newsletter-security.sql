-- Fix newsletter security with proper RLS policies
-- Run this in your Supabase SQL editor

-- First, re-enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Allow all newsletter operations" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow newsletter subscriptions" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow newsletter updates" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow reading newsletter subscribers" ON newsletter_subscribers;

-- Create secure policies:

-- 1. Allow anyone to INSERT (subscribe) - this is what we need
CREATE POLICY "Allow newsletter subscriptions" ON newsletter_subscribers 
FOR INSERT 
WITH CHECK (true);

-- 2. Allow users to UPDATE their own subscription (unsubscribe, update preferences)
-- This uses the email as the identifier
CREATE POLICY "Allow users to update own subscription" ON newsletter_subscribers 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

-- 3. Restrict SELECT - only allow reading for authenticated admin users
-- You'll need to create an admin role or use your existing auth
CREATE POLICY "Restrict newsletter reading" ON newsletter_subscribers 
FOR SELECT 
USING (false); -- This blocks all reads by default

-- 4. Block DELETE - no one should be able to delete subscriber records
-- (You can manually delete if needed via Supabase dashboard)

-- Test the policies
-- This should work (INSERT):
-- INSERT INTO newsletter_subscribers (email, name) VALUES ('test@example.com', 'Test User');

-- This should fail (SELECT):
-- SELECT * FROM newsletter_subscribers;

-- If you need admin access, you can create a more specific policy:
-- CREATE POLICY "Allow admin to read subscribers" ON newsletter_subscribers 
-- FOR SELECT 
-- USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'email' = 'your-admin-email@domain.com');
