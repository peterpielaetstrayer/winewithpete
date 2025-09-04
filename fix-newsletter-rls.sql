-- Fix newsletter subscription RLS policy
-- Run this in your Supabase SQL editor

-- First, let's check if the policy exists and drop it if needed
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON newsletter_subscribers;

-- Create a more permissive policy for newsletter subscriptions
CREATE POLICY "Allow newsletter subscriptions" ON newsletter_subscribers 
FOR INSERT 
WITH CHECK (true);

-- Also allow updates for the same email (in case of re-subscription)
CREATE POLICY "Allow newsletter updates" ON newsletter_subscribers 
FOR UPDATE 
USING (true);

-- Allow reading for admin purposes (you might want to restrict this later)
CREATE POLICY "Allow reading newsletter subscribers" ON newsletter_subscribers 
FOR SELECT 
USING (true);

-- Test the policy by trying to insert a test record
-- (This will be rolled back automatically)
BEGIN;
INSERT INTO newsletter_subscribers (email, name) 
VALUES ('test@example.com', 'Test User');
ROLLBACK;

-- If the above works without error, the policy is fixed
