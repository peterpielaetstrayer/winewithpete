-- Fix products table to use string IDs instead of UUIDs
-- Run this in your Supabase SQL editor

-- First, let's change the id column to VARCHAR
ALTER TABLE products ALTER COLUMN id TYPE VARCHAR(255);

-- Now we can insert products with string IDs
INSERT INTO products (id, name, description, price, product_type, file_path, is_active) VALUES
('open-fire-collection', 'Open Fire Sunday Collection', '5 carefully crafted recipes designed for cooking over open fire. Includes wine pairings and conversation starters.', 12.99, 'recipe_card', 'recipe-cards/open-fire-collection.pdf', true),
('pre-prep-cards', 'Pre-Prep Recipe Cards', '3 recipes designed to be prepped the night before and cooked at the fire. Perfect for busy schedules.', 8.99, 'recipe_card', 'recipe-cards/pre-prep-cards.pdf', true),
('seasonal-fire-cooking', 'Seasonal Fire Cooking', 'Year-round recipes that celebrate the seasons. From summer beach fires to winter hearth cooking.', 15.99, 'recipe_card', 'recipe-cards/seasonal-fire-cooking.pdf', false),
('art-of-learning-wine', 'The Art of Learning [WINE]', 'A comprehensive guide for adult learners using wine as a medium. Teaches how to learn, taste, and appreciate wine systematically.', 19.99, 'ebook', 'ebooks/art-of-learning-wine.pdf', false),
('fire-setup-guide', 'Fire Setup & Safety Guide', 'Complete guide to building and maintaining safe fires for cooking and gathering. Includes safety tips and equipment recommendations.', 9.99, 'guide', 'guides/fire-setup-safety.pdf', false),
('conversation-starter-cards', 'Conversation Starter Cards', '50 thoughtful questions designed to spark deeper conversations around the fire. Perfect for intimate gatherings.', 14.99, 'guide', 'guides/conversation-starter-cards.pdf', false);

-- Update any existing products to use string IDs if they exist
UPDATE products SET 
  id = 'open-fire-collection',
  name = 'Open Fire Sunday Collection',
  description = '5 carefully crafted recipes designed for cooking over open fire. Includes wine pairings and conversation starters.',
  price = 12.99,
  file_path = 'recipe-cards/open-fire-collection.pdf'
WHERE name LIKE '%Open Fire Sunday%';

UPDATE products SET 
  id = 'pre-prep-cards',
  name = 'Pre-Prep Recipe Cards',
  description = '3 recipes designed to be prepped the night before and cooked at the fire. Perfect for busy schedules.',
  price = 8.99,
  file_path = 'recipe-cards/pre-prep-cards.pdf'
WHERE name LIKE '%Pre-Prep%';
