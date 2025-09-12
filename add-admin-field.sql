-- Add is_admin field to members table
ALTER TABLE members ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Update existing members to not be admin by default
UPDATE members SET is_admin = FALSE WHERE is_admin IS NULL;

-- Create an admin user (replace with your actual admin email)
-- You'll need to get the user_id from auth.users first
-- INSERT INTO members (user_id, email, name, subscription_tier, is_admin) 
-- VALUES ('your-admin-user-id', 'admin@winewithpete.me', 'Admin User', 'premium', TRUE);

-- Add RLS policy for admin access
DROP POLICY IF EXISTS "admin can read all members" ON members;
CREATE POLICY "admin can read all members" ON members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM members m 
      WHERE m.user_id = auth.uid() 
      AND m.is_admin = TRUE
    )
  );

-- Add RLS policy for admin to update members
DROP POLICY IF EXISTS "admin can update members" ON members;
CREATE POLICY "admin can update members" ON members
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM members m 
      WHERE m.user_id = auth.uid() 
      AND m.is_admin = TRUE
    )
  );
