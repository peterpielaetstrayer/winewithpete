-- Wine With Pete Packages Extension Schema
-- Run this in your Supabase SQL editor to add Phase 1 packages functionality

-- Create recipes table first
CREATE TABLE IF NOT EXISTS recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  cook_time_minutes INTEGER,
  serves_base INTEGER DEFAULT 4,
  ingredients JSONB NOT NULL, -- [{"item": "garlic", "amount": 4, "unit": "cloves"}]
  instructions TEXT[],
  tags TEXT[],
  difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create packages table
CREATE TABLE IF NOT EXISTS packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  package_type TEXT CHECK (package_type IN ('open_fire_menu', 'pairing_guide', 'gathering_kit')),
  serving_sizes INTEGER[] DEFAULT ARRAY[2,4,6,8],
  recipes JSONB NOT NULL,
  shopping_list JSONB,
  wine_pairing JSONB,
  menu_card_url TEXT,
  published BOOLEAN DEFAULT true,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create members table
CREATE TABLE IF NOT EXISTS members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  subscription_tier TEXT DEFAULT 'basic' CHECK (subscription_tier IN ('basic', 'premium', 'founder')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add package_id to products table if not exists
ALTER TABLE products ADD COLUMN IF NOT EXISTS package_id UUID REFERENCES packages(id) ON DELETE SET NULL;

-- Create indexes
CREATE INDEX IF NOT EXISTS packages_slug_idx ON packages(slug);
CREATE INDEX IF NOT EXISTS packages_published_idx ON packages(published);
CREATE INDEX IF NOT EXISTS packages_type_idx ON packages(package_type);
CREATE INDEX IF NOT EXISTS products_package_idx ON products(package_id);
CREATE INDEX IF NOT EXISTS members_user_id_idx ON members(user_id);
CREATE INDEX IF NOT EXISTS recipes_tags_idx ON recipes USING gin(tags);

-- Enable RLS
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for packages
DROP POLICY IF EXISTS "public can read published packages" ON packages;
CREATE POLICY "public can read published packages"
ON packages FOR SELECT USING (published = true);

DROP POLICY IF EXISTS "members can read all packages" ON packages;
CREATE POLICY "members can read all packages"
ON packages FOR SELECT
USING (EXISTS (SELECT 1 FROM members m WHERE m.user_id = auth.uid()));

-- RLS Policies for recipes
DROP POLICY IF EXISTS "anyone can read recipes" ON recipes;
CREATE POLICY "anyone can read recipes"
ON recipes FOR SELECT USING (true);

-- RLS Policies for members
DROP POLICY IF EXISTS "owner read members" ON members;
CREATE POLICY "owner read members"
ON members FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "owner insert members" ON members;
CREATE POLICY "owner insert members"
ON members FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "owner update members" ON members;
CREATE POLICY "owner update members"
ON members FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "owner delete members" ON members;
CREATE POLICY "owner delete members"
ON members FOR DELETE USING (user_id = auth.uid());

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_packages_updated_at ON packages;
CREATE TRIGGER update_packages_updated_at 
BEFORE UPDATE ON packages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_recipes_updated_at ON recipes;
CREATE TRIGGER update_recipes_updated_at 
BEFORE UPDATE ON recipes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_members_updated_at ON members;
CREATE TRIGGER update_members_updated_at 
BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data

-- Sample recipes
INSERT INTO recipes (name, description, serves_base, ingredients, instructions, tags, difficulty) VALUES
('Fire-Grilled Ribeye with Chimichurri', 'A perfectly grilled ribeye steak with fresh herb chimichurri sauce', 4, 
'[
  {"item": "ribeye steaks", "amount": 4, "unit": "pieces"},
  {"item": "fresh parsley", "amount": 1, "unit": "cup", "notes": "chopped"},
  {"item": "fresh oregano", "amount": 2, "unit": "tablespoons"},
  {"item": "garlic", "amount": 4, "unit": "cloves", "notes": "minced"},
  {"item": "red wine vinegar", "amount": 3, "unit": "tablespoons"},
  {"item": "olive oil", "amount": 0.5, "unit": "cup"},
  {"item": "salt", "amount": 1, "unit": "teaspoon"},
  {"item": "black pepper", "amount": 0.5, "unit": "teaspoon"}
]',
'{"Let steaks come to room temperature", "Prepare chimichurri by mixing herbs, garlic, vinegar, oil, salt and pepper", "Season steaks with salt and pepper", "Grill over high heat 4-5 minutes per side for medium-rare", "Rest 5 minutes before serving", "Top with chimichurri"}',
'{"beef", "grilling", "sauce"}', 'medium'),

('Open-Fire Roasted Vegetables', 'Seasonal vegetables roasted over open flame', 6,
'[
  {"item": "bell peppers", "amount": 3, "unit": "pieces", "notes": "mixed colors"},
  {"item": "zucchini", "amount": 2, "unit": "pieces", "notes": "sliced"},
  {"item": "red onion", "amount": 1, "unit": "piece", "notes": "quartered"},
  {"item": "olive oil", "amount": 3, "unit": "tablespoons"},
  {"item": "garlic", "amount": 3, "unit": "cloves", "notes": "minced"},
  {"item": "fresh thyme", "amount": 2, "unit": "tablespoons"},
  {"item": "salt", "amount": 1, "unit": "teaspoon"},
  {"item": "black pepper", "amount": 0.5, "unit": "teaspoon"}
]',
'{"Preheat grill grate over coals", "Cut vegetables into similar sizes", "Toss with oil, garlic, thyme, salt and pepper", "Grill in cast iron pan or foil packet", "Cook 15-20 minutes, stirring occasionally", "Serve hot"}',
'{"vegetables", "grilling", "sides"}', 'easy'),

('Campfire Chocolate Skillet Cookie', 'Warm, gooey chocolate chip cookie baked in cast iron', 8,
'[
  {"item": "butter", "amount": 0.5, "unit": "cup", "notes": "melted"},
  {"item": "brown sugar", "amount": 0.75, "unit": "cup"},
  {"item": "egg", "amount": 1, "unit": "piece"},
  {"item": "vanilla extract", "amount": 1, "unit": "teaspoon"},
  {"item": "flour", "amount": 1, "unit": "cup"},
  {"item": "baking soda", "amount": 0.5, "unit": "teaspoon"},
  {"item": "salt", "amount": 0.5, "unit": "teaspoon"},
  {"item": "chocolate chips", "amount": 1, "unit": "cup"}
]',
'{"Mix melted butter and brown sugar", "Beat in egg and vanilla", "Combine flour, baking soda, salt", "Fold dry ingredients into wet", "Stir in chocolate chips", "Press into greased cast iron skillet", "Bake over coals 15-20 minutes until golden", "Serve warm from skillet"}',
'{"dessert", "chocolate", "cast-iron"}', 'easy');

-- Sample packages (we'll insert with placeholder recipe IDs and update them)
INSERT INTO packages (slug, name, description, package_type, recipes, wine_pairing, tags, published) VALUES
('open-fire-steakhouse', 'Open-Fire Steakhouse Night', 'A complete steakhouse experience around the fire with perfectly grilled ribeye, roasted vegetables, and a decadent skillet cookie.', 'open_fire_menu',
'[
  {"recipe_id": "00000000-0000-0000-0000-000000000001", "serves_factor": 1.0},
  {"recipe_id": "00000000-0000-0000-0000-000000000002", "serves_factor": 1.0},
  {"recipe_id": "00000000-0000-0000-0000-000000000003", "serves_factor": 1.0}
]',
'{"wine": "Cabernet Sauvignon", "reasoning": "The bold tannins complement the rich ribeye while standing up to the smoky char from the grill.", "alternates": ["Malbec", "Syrah"], "temp": "60-65°F", "notes": "Decant 1 hour before serving"}',
'{"steakhouse", "grilling", "date-night"}', true),

('sample-preview', 'Fire & Fellowship Sampler', 'A taste of what our packages offer - one sample recipe to try before joining.', 'open_fire_menu',
'[
  {"recipe_id": "00000000-0000-0000-0000-000000000002", "serves_factor": 1.0}
]',
'{"wine": "Pinot Grigio", "reasoning": "Light and crisp to complement the vegetables without overwhelming.", "alternates": ["Sauvignon Blanc"]}',
'{"vegetables", "beginner", "sample"}', true);

-- Update packages with actual recipe IDs using CTE
WITH recipe_ids AS (
  SELECT 
    (SELECT id FROM recipes WHERE name = 'Fire-Grilled Ribeye with Chimichurri') as ribeye_id,
    (SELECT id FROM recipes WHERE name = 'Open-Fire Roasted Vegetables') as vegetables_id,
    (SELECT id FROM recipes WHERE name = 'Campfire Chocolate Skillet Cookie') as cookie_id
)
UPDATE packages 
SET recipes = jsonb_build_array(
  jsonb_build_object('recipe_id', recipe_ids.ribeye_id, 'serves_factor', 1.0),
  jsonb_build_object('recipe_id', recipe_ids.vegetables_id, 'serves_factor', 1.0),
  jsonb_build_object('recipe_id', recipe_ids.cookie_id, 'serves_factor', 1.0)
)
FROM recipe_ids
WHERE slug = 'open-fire-steakhouse';

UPDATE packages 
SET recipes = jsonb_build_array(
  jsonb_build_object('recipe_id', (SELECT id FROM recipes WHERE name = 'Open-Fire Roasted Vegetables'), 'serves_factor', 1.0)
)
WHERE slug = 'sample-preview';

-- Update products to link to packages
UPDATE products SET package_id = (SELECT id FROM packages WHERE slug = 'open-fire-steakhouse') WHERE name = 'Open Fire Sunday Recipe Collection';
