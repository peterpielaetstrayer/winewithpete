-- Wine With Pete Database Schema
-- Run this in your Supabase SQL editor

-- Events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('open_fire_sunday', 'salon_dinner', 'other')),
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(255),
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event RSVPs table
CREATE TABLE event_rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, email)
);

-- Products table (for recipe cards, guides, etc.)
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  product_type VARCHAR(50) NOT NULL CHECK (product_type IN ('recipe_card', 'guide', 'ebook', 'bundle')),
  file_path VARCHAR(500), -- Path to PDF in Supabase storage
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  stripe_payment_intent_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter subscribers (if you want to track this in Supabase too)
CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  preferences JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_active ON events(is_active);
CREATE INDEX idx_rsvps_event_id ON event_rsvps(event_id);
CREATE INDEX idx_rsvps_email ON event_rsvps(email);
CREATE INDEX idx_orders_email ON orders(email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_products_type ON products(product_type);
CREATE INDEX idx_products_active ON products(is_active);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_event_rsvps_updated_at BEFORE UPDATE ON event_rsvps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_newsletter_subscribers_updated_at BEFORE UPDATE ON newsletter_subscribers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO events (title, description, event_type, event_date, location, max_attendees, is_public) VALUES
('Open Fire Sunday - Beach Gathering', 'Join us for a morning of fire, food, and conversation. Bring your own ingredients and we''ll provide the fire and recipe cards.', 'open_fire_sunday', '2024-01-15 10:00:00+00', 'Santa Monica Beach', 20, true),
('Salon Dinner - Philosophy & Wine', 'An intimate evening exploring the deeper questions over good food and wine. Application required.', 'salon_dinner', '2024-01-20 18:00:00+00', 'Private Residence - Venice', 8, false);

INSERT INTO products (name, description, price, product_type, file_path) VALUES
('Open Fire Sunday Recipe Collection', '5 carefully crafted recipes designed for cooking over open fire. Includes wine pairings and conversation starters.', 12.99, 'recipe_card', 'recipe-cards/open-fire-collection.pdf'),
('Pre-Prep Recipe Cards', '3 recipes designed to be prepped the night before and cooked at the fire. Perfect for busy schedules.', 8.99, 'recipe_card', 'recipe-cards/pre-prep-cards.pdf'),
('The Art of Learning [WINE]', 'A comprehensive guide for adult learners using wine as a medium. Teaches how to learn, taste, and appreciate wine systematically.', 19.99, 'ebook', 'ebooks/art-of-learning-wine.pdf');

-- Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Events are viewable by everyone" ON events FOR SELECT USING (is_public = true);
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can create RSVPs" ON event_rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create order items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
