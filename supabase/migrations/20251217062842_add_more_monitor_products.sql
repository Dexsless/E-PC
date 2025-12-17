/*
  # Add more monitor products

  1. New Data
    - Insert 10 additional PC monitor products
    - Include various categories: gaming, professional, budget, ultrawide
    - Mix of featured and non-featured monitors
    - Realistic specifications and pricing

  2. Monitor Types
    - 4K professional monitors for content creators
    - High refresh rate gaming monitors
    - Budget-friendly 1080p options
    - Ultrawide productivity monitors
    - Curved gaming monitors
*/

INSERT INTO monitors (title, description, status, resolution, refresh_rate, panel_type, screen_size, price, rating, featured, image_url) VALUES
  ('ASUS ProArt PA279CV', 'Professional 4K monitor dengan color accuracy sempurna untuk fotografer', 'active', '3840x2160', 60, 'IPS', 27, 549.99, 4.8, true, 'https://images.pexels.com/photos/17798045/pexels-photo-17798045.jpeg'),
  ('MSI G249F', 'Budget gaming monitor 1080p 280Hz untuk competitive gaming', 'active', '1920x1080', 280, 'IPS', 24, 249.99, 4.3, false, 'https://images.pexels.com/photos/18105/pexels-photo.jpg'),
  ('LG 32UP550', 'Large format 4K monitor untuk professional workflows', 'active', '3840x2160', 60, 'IPS', 32, 699.99, 4.6, false, 'https://images.pexels.com/photos/17798045/pexels-photo-17798045.jpeg'),
  ('Dell S4721DGF', 'Curved 1440p gaming monitor dengan quantum dot tech', 'active', '2560x1440', 165, 'VA', 47, 599.99, 4.7, true, 'https://images.pexels.com/photos/18105/pexels-photo.jpg'),
  ('BenQ SW240', 'Entry-level color accurate monitor untuk designers', 'active', '1920x1200', 60, 'IPS', 24, 299.99, 4.4, false, 'https://images.pexels.com/photos/17798045/pexels-photo-17798045.jpeg'),
  ('ASUS ROG Strix XG16', 'Portable gaming monitor 1080p 240Hz USB-C', 'active', '1920x1080', 240, 'IPS', 15.6, 349.99, 4.5, false, 'https://images.pexels.com/photos/18105/pexels-photo.jpg'),
  ('LG 27GP850', 'Gaming monitor 1440p 180Hz dengan G-Sync', 'active', '2560x1440', 180, 'IPS', 27, 399.99, 4.6, false, 'https://images.pexels.com/photos/17798045/pexels-photo-17798045.jpeg'),
  ('PG279QM', 'Premium esports monitor 1440p 240Hz untuk pro gamers', 'active', '2560x1440', 240, 'IPS', 27, 649.99, 4.9, true, 'https://images.pexels.com/photos/18105/pexels-photo.jpg'),
  ('Samsung M7', 'Smart monitor dengan built-in apps untuk home office', 'active', '3840x2160', 60, 'VA', 32, 549.99, 4.4, false, 'https://images.pexels.com/photos/17798045/pexels-photo-17798045.jpeg'),
  ('ASUS VP229', 'Ultra-budget 1080p 75Hz monitor untuk entry-level users', 'active', '1920x1080', 75, 'IPS', 22, 129.99, 4.2, false, 'https://images.pexels.com/photos/18105/pexels-photo.jpg'),
  ('LG OLED32', '32" OLED monitor dengan perfect blacks untuk creators', 'active', '3840x2160', 120, 'OLED', 32, 1299.99, 4.9, true, 'https://images.pexels.com/photos/17798045/pexels-photo-17798045.jpeg'),
  ('Dell S2721DGF', 'Solid 1440p gaming monitor dengan fast response time', 'active', '2560x1440', 165, 'IPS', 27, 379.99, 4.5, false, 'https://images.pexels.com/photos/18105/pexels-photo.jpg');
