-- Step 1: Add is_admin field to members table
ALTER TABLE members ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Step 2: Update existing members to not be admin by default
UPDATE members SET is_admin = FALSE WHERE is_admin IS NULL;

-- Step 3: Drop existing policies (if they exist)
DROP POLICY IF EXISTS "admin can read all members" ON members;
DROP POLICY IF EXISTS "admin can update members" ON members;

-- Step 4: Create admin read policy
CREATE POLICY "admin can read all members" ON members
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM members m 
    WHERE m.user_id = auth.uid() 
    AND m.is_admin = TRUE
  )
);

-- Step 5: Create admin update policy
CREATE POLICY "admin can update members" ON members
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM members m 
    WHERE m.user_id = auth.uid() 
    AND m.is_admin = TRUE
  )
);
