-- Create featured_essays table for managing curated essay links
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS featured_essays (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url VARCHAR(500) NOT NULL UNIQUE,
  title VARCHAR(255),
  excerpt TEXT,
  image_url VARCHAR(500),
  published_date DATE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_featured_essays_active ON featured_essays(is_active);
CREATE INDEX IF NOT EXISTS idx_featured_essays_display_order ON featured_essays(display_order);
CREATE INDEX IF NOT EXISTS idx_featured_essays_active_order ON featured_essays(is_active, display_order);

-- Add updated_at trigger
CREATE TRIGGER update_featured_essays_updated_at 
  BEFORE UPDATE ON featured_essays 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE featured_essays ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (read-only for everyone)
CREATE POLICY "Featured essays are viewable by everyone" 
  ON featured_essays 
  FOR SELECT 
  USING (is_active = true);

-- Note: Admin will need to use service role key for INSERT/UPDATE/DELETE
-- Or you can create admin-specific policies if you have admin auth set up

