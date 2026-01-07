-- Add featured_essay boolean field to featured_essays table
-- Run this in your Supabase SQL editor

ALTER TABLE featured_essays 
ADD COLUMN IF NOT EXISTS featured_essay BOOLEAN DEFAULT false;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_featured_essays_featured ON featured_essays(featured_essay);

-- Add comment for documentation
COMMENT ON COLUMN featured_essays.featured_essay IS 'Marks the essay to show on /start page (e.g., "Sip Everything")';

