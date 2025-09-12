-- Create sample packages with different difficulty levels

-- Beginner package (free access)
INSERT INTO packages (slug, name, description, package_type, difficulty_level, serving_sizes, free_serving_sizes, recipes, published, tags) VALUES 
('simple-skewers', 'Simple Skewers', 'Easy skewer recipes perfect for beginners. Learn the basics of open-fire cooking with these approachable recipes.', 'open_fire_menu', 'beginner', ARRAY[2,4,6,8], ARRAY[2,4], 
 '[{"recipe_id": "skewer-1", "serves_factor": 1.0}]'::jsonb, true, ARRAY['beginner', 'skewers', 'easy']);

-- Another beginner package
INSERT INTO packages (slug, name, description, package_type, difficulty_level, serving_sizes, free_serving_sizes, recipes, published, tags) VALUES 
('grilled-vegetables', 'Grilled Vegetables', 'Master the art of grilling vegetables with these simple, flavorful recipes.', 'open_fire_menu', 'beginner', ARRAY[2,4,6,8], ARRAY[2,4], 
 '[{"recipe_id": "veggies-1", "serves_factor": 1.0}]'::jsonb, true, ARRAY['beginner', 'vegetables', 'healthy']);

-- Intermediate package (premium access)
INSERT INTO packages (slug, name, description, package_type, difficulty_level, serving_sizes, free_serving_sizes, recipes, published, tags) VALUES 
('smoked-meats', 'Smoked Meats Masterclass', 'Learn advanced smoking techniques for perfect brisket, ribs, and pulled pork.', 'open_fire_menu', 'intermediate', ARRAY[2,4,6,8], ARRAY[2], 
 '[{"recipe_id": "smoked-1", "serves_factor": 1.0}]'::jsonb, true, ARRAY['intermediate', 'smoking', 'meat']);

-- Advanced package (premium access)
INSERT INTO packages (slug, name, description, package_type, difficulty_level, serving_sizes, free_serving_sizes, recipes, published, tags) VALUES 
('advanced-grilling', 'Advanced Grilling Techniques', 'Master-level grilling with complex techniques, temperature control, and presentation.', 'open_fire_menu', 'advanced', ARRAY[2,4,6,8], ARRAY[2], 
 '[{"recipe_id": "advanced-1", "serves_factor": 1.0}]'::jsonb, true, ARRAY['advanced', 'technique', 'master']);

-- Wine pairing package (premium)
INSERT INTO packages (slug, name, description, package_type, difficulty_level, serving_sizes, free_serving_sizes, recipes, published, tags) VALUES 
('wine-pairing-guide', 'Wine Pairing Guide', 'Complete guide to pairing wines with grilled foods and open-fire cooking.', 'pairing_guide', 'intermediate', ARRAY[2,4,6,8], ARRAY[2], 
 '[{"recipe_id": "pairing-1", "serves_factor": 1.0}]'::jsonb, true, ARRAY['wine', 'pairing', 'intermediate']);
