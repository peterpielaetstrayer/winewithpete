-- Clean up duplicate products in your database
-- Run this in your Supabase SQL editor

-- First, let's see what products we have
SELECT id, name, price, product_type, is_active, created_at 
FROM products 
ORDER BY name, created_at;

-- Remove duplicates, keeping the most recent one
WITH ranked_products AS (
  SELECT *,
    ROW_NUMBER() OVER (
      PARTITION BY name 
      ORDER BY created_at DESC
    ) as rn
  FROM products
)
DELETE FROM products 
WHERE id IN (
  SELECT id 
  FROM ranked_products 
  WHERE rn > 1
);

-- Verify the cleanup
SELECT id, name, price, product_type, is_active 
FROM products 
ORDER BY name;
