-- Add difficulty level and tier restrictions to packages
ALTER TABLE packages ADD COLUMN IF NOT EXISTS difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner';

-- Add serving size restrictions for free users
ALTER TABLE packages ADD COLUMN IF NOT EXISTS free_serving_sizes INT[] DEFAULT ARRAY[2,4];

-- Update existing packages with difficulty levels
UPDATE packages SET difficulty_level = 'beginner' WHERE difficulty_level IS NULL;

-- Create some sample packages with different difficulty levels
-- (You can run these individually to test)

-- Beginner package (free access)
INSERT INTO packages (slug, name, description, package_type, difficulty_level, serving_sizes, free_serving_sizes, recipes, published) VALUES 
('simple-skewers', 'Simple Skewers', 'Easy skewer recipes perfect for beginners', 'open_fire_menu', 'beginner', ARRAY[2,4,6,8], ARRAY[2,4], 
 '[{"recipe_id": "skewer-1", "serves_factor": 1.0}]'::jsonb, true);

-- Intermediate package (paid access)
INSERT INTO packages (slug, name, description, package_type, difficulty_level, serving_sizes, free_serving_sizes, recipes, published) VALUES 
('advanced-grilling', 'Advanced Grilling Techniques', 'Master-level grilling with complex techniques', 'open_fire_menu', 'advanced', ARRAY[2,4,6,8], ARRAY[2], 
 '[{"recipe_id": "advanced-1", "serves_factor": 1.0}]'::jsonb, true);

-- Update members table to have proper subscription tiers
UPDATE members SET subscription_tier = 'free' WHERE subscription_tier = 'basic';
