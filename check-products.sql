-- Check what image paths are stored in your products table
-- Run this in your Supabase SQL editor

SELECT 
  id,
  name,
  image_path,
  product_type,
  is_active,
  created_at
FROM products 
WHERE is_active = true
ORDER BY created_at DESC;

-- Also check if there are any products with image_path
SELECT 
  COUNT(*) as total_products,
  COUNT(image_path) as products_with_images,
  COUNT(CASE WHEN image_path IS NOT NULL AND image_path != '' THEN 1 END) as non_empty_image_paths
FROM products 
WHERE is_active = true;
