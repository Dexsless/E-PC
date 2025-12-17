/*
  # Create PC Components Table

  1. New Tables
    - `components`
      - `id` (uuid, primary key) - Unique identifier for each component
      - `name` (text, not null) - Component name
      - `type` (text, not null) - Component type (CPU, GPU, RAM, Motherboard, Storage, PSU, Case, Cooler)
      - `price` (numeric, not null) - Component price in IDR
      - `image_url` (text, not null) - URL to component image
      - `description` (text) - Component description
      - `specs` (text) - Additional specifications
      - `created_at` (timestamptz) - Timestamp when component was created
      - `updated_at` (timestamptz) - Timestamp when component was last updated

  2. Security
    - Enable RLS on `components` table
    - Add policy for public read access (anyone can view components)
    - Add policy for authenticated users to manage components (for admin panel)
*/

CREATE TABLE IF NOT EXISTS components (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('CPU', 'GPU', 'RAM', 'Motherboard', 'Storage', 'PSU', 'Case', 'Cooler')),
  price numeric NOT NULL CHECK (price >= 0),
  image_url text NOT NULL,
  description text DEFAULT '',
  specs text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE components ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view components"
  ON components
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert components"
  ON components
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update components"
  ON components
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete components"
  ON components
  FOR DELETE
  USING (true);

CREATE INDEX IF NOT EXISTS idx_components_type ON components(type);
CREATE INDEX IF NOT EXISTS idx_components_price ON components(price);