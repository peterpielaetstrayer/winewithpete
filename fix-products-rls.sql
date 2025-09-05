-- Check current RLS policies on products table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'products';

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read access to products" ON products;
DROP POLICY IF EXISTS "Allow all operations on products" ON products;

-- Create a simple policy to allow public read access to active products
CREATE POLICY "Allow public read access to products" ON products 
FOR SELECT 
USING (is_active = true);

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'products';
