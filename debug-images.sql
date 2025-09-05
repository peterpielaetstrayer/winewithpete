-- Check what's in your products table
-- Run this in your Supabase SQL editor

SELECT 
  id,
  name,
  image_path,
  product_type,
  is_active
FROM products 
WHERE is_active = true
ORDER BY created_at DESC;

-- Check if the storage bucket exists and is public
-- This will show you the storage configuration
SELECT * FROM storage.buckets WHERE name = 'product-images';

-- Check if there are any files in the bucket
SELECT * FROM storage.objects WHERE bucket_id = 'product-images' LIMIT 10;
