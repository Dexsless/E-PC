/*
  # Update monitors table for PC monitor products

  1. Modified Tables
    - `monitors` table redesigned as product catalog
      - Changed to store PC monitor specifications and product information
      - Added columns for resolution, refresh rate, panel type, size
      - Added price and rating for product recommendations
      - Kept existing schema but repurposed for product data

  2. New Columns
    - `resolution` (text) - e.g., "1920x1080", "3840x2160"
    - `refresh_rate` (integer) - e.g., 60, 144, 240
    - `panel_type` (text) - "IPS", "VA", "TN"
    - `screen_size` (numeric) - size in inches
    - `price` (numeric) - product price
    - `rating` (numeric) - user rating 0-5
    - `featured` (boolean) - featured/recommended monitor
    - `image_url` (text) - product image URL

  3. Security
    - Keep RLS policies for public read access
    - Allow authenticated users to manage products

  4. Notes
    - Reusing existing monitors table for product data
    - Sample data includes popular PC monitors with specs
    - Featured monitors for recommendations
*/

-- Add new columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'monitors' AND column_name = 'resolution') THEN
    ALTER TABLE monitors ADD COLUMN resolution TEXT DEFAULT '1920x1080';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'monitors' AND column_name = 'refresh_rate') THEN
    ALTER TABLE monitors ADD COLUMN refresh_rate INTEGER DEFAULT 60;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'monitors' AND column_name = 'panel_type') THEN
    ALTER TABLE monitors ADD COLUMN panel_type TEXT DEFAULT 'IPS';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'monitors' AND column_name = 'screen_size') THEN
    ALTER TABLE monitors ADD COLUMN screen_size NUMERIC(4,1) DEFAULT 24.0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'monitors' AND column_name = 'price') THEN
    ALTER TABLE monitors ADD COLUMN price NUMERIC(10,2) DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'monitors' AND column_name = 'rating') THEN
    ALTER TABLE monitors ADD COLUMN rating NUMERIC(3,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'monitors' AND column_name = 'featured') THEN
    ALTER TABLE monitors ADD COLUMN featured BOOLEAN DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'monitors' AND column_name = 'image_url') THEN
    ALTER TABLE monitors ADD COLUMN image_url TEXT DEFAULT '';
  END IF;
END $$;

-- Clear old data and insert monitor products
DELETE FROM monitors;

INSERT INTO monitors (title, description, status, resolution, refresh_rate, panel_type, screen_size, price, rating, featured, image_url) VALUES
  ('ASUS ROG Swift Pro', 'Professional esports monitor dengan responsif ultra-cepat', 'active', '1440x2560', 240, 'IPS', 27, 799.99, 4.8, true, 'https://images.pexels.com/photos/17798045/pexels-photo-17798045.jpeg'),
  ('BenQ EW2880U', 'Monitor 4K untuk desain dan editing profesional', 'active', '3840x2160', 60, 'IPS', 28, 599.99, 4.7, true, 'https://images.pexels.com/photos/18105/pexels-photo.jpg'),
  ('LG UltraWide 34"', 'Monitor ultra-wide immersive untuk produktivitas maksimal', 'active', '3440x1440', 144, 'VA', 34, 699.99, 4.9, true, 'https://images.pexels.com/photos/17798045/pexels-photo-17798045.jpeg'),
  ('Dell S2722DC', 'Monitor 1440p 165Hz untuk gaming kompetitif', 'active', '2560x1440', 165, 'IPS', 27, 449.99, 4.6, false, 'https://images.pexels.com/photos/18105/pexels-photo.jpg'),
  ('MSI MAG 324UPF', 'Curved gaming monitor dengan Quantum Dot technology', 'active', '3840x2160', 144, 'VA', 32, 899.99, 4.8, true, 'https://images.pexels.com/photos/17798045/pexels-photo-17798045.jpeg'),
  ('AOC 24G2', 'Entry-level 1080p 144Hz untuk gamers pemula', 'active', '1920x1080', 144, 'IPS', 24, 199.99, 4.4, false, 'https://images.pexels.com/photos/18105/pexels-photo.jpg'),
  ('ASUS PA148CTC', 'Monitor portable untuk creative professionals', 'active', '1920x1200', 60, 'IPS', 15.6, 399.99, 4.5, false, 'https://images.pexels.com/photos/17798045/pexels-photo-17798045.jpeg'),
  ('Alienware AW3821DW', 'Ultrawide 1440p untuk immersive gaming', 'active', '3840x1600', 120, 'IPS', 38, 1199.99, 4.9, true, 'https://images.pexels.com/photos/18105/pexels-photo.jpg'),
  ('LG 27UP550', 'Monitor 4K HDR budget-friendly untuk content creation', 'active', '3840x2160', 60, 'IPS', 27, 499.99, 4.5, false, 'https://images.pexels.com/photos/17798045/pexels-photo-17798045.jpeg'),
  ('Corsair XENEON 240Hz', 'IPS 1440p 240Hz flagship gaming monitor', 'active', '2560x1440', 240, 'IPS', 27, 749.99, 4.7, true, 'https://images.pexels.com/photos/18105/pexels-photo.jpg');
