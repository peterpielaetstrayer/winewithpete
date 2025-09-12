-- Fix the infinite recursion in members RLS policies
-- Drop the problematic policies
DROP POLICY IF EXISTS "admin can read all members" ON members;
DROP POLICY IF EXISTS "admin can update members" ON members;

-- Create simpler policies that don't cause recursion
-- Allow users to read their own member record
CREATE POLICY "users can read own member record" ON members
FOR SELECT USING (user_id = auth.uid());

-- Allow users to update their own member record
CREATE POLICY "users can update own member record" ON members
FOR UPDATE USING (user_id = auth.uid());

-- Allow users to insert their own member record
CREATE POLICY "users can insert own member record" ON members
FOR INSERT WITH CHECK (user_id = auth.uid());

-- For admin operations, we'll handle them in the API routes instead of RLS
