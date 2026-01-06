-- Add printful_order_id column to orders table
-- Run this in your Supabase SQL editor

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS printful_order_id VARCHAR(255);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_printful_order_id ON orders(printful_order_id);

-- Add comment for documentation
COMMENT ON COLUMN orders.printful_order_id IS 'Printful order ID for physical product fulfillment';

