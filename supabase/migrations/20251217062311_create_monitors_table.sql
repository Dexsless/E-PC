/*
  # Create monitors table

  1. New Tables
    - `monitors`
      - `id` (integer, primary key, auto-increment)
      - `title` (text) - Name of the monitoring component
      - `description` (text) - Description of what's being monitored
      - `status` (text) - Status: 'active', 'warning', or 'critical'
      - `last_updated` (timestamptz) - Last update timestamp
      - `uptime_percentage` (numeric) - Uptime percentage for display
      - `response_time` (integer) - Response time in milliseconds
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last modification timestamp

  2. Security
    - Enable RLS on `monitors` table
    - Add policy for public read access (monitoring dashboard)
    - Add policy for authenticated users to manage monitors

  3. Notes
    - Default values ensure consistent data
    - Uptime percentage ranges from 0-100
    - Response time measured in milliseconds
*/

CREATE TABLE IF NOT EXISTS monitors (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'warning', 'critical')),
  last_updated TIMESTAMPTZ DEFAULT now(),
  uptime_percentage NUMERIC(5,2) DEFAULT 100.00 CHECK (uptime_percentage >= 0 AND uptime_percentage <= 100),
  response_time INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE monitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view monitors"
  ON monitors FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert monitors"
  ON monitors FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update monitors"
  ON monitors FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete monitors"
  ON monitors FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample monitoring data
INSERT INTO monitors (title, description, status, uptime_percentage, response_time) VALUES
  ('Web Server', 'Main application server monitoring', 'active', 99.98, 45),
  ('Database Server', 'PostgreSQL database performance', 'active', 99.95, 12),
  ('API Gateway', 'REST API endpoint monitoring', 'warning', 98.50, 156),
  ('CDN Network', 'Content delivery network status', 'active', 100.00, 8),
  ('Email Service', 'SMTP email delivery system', 'critical', 85.30, 3200),
  ('Cache Server', 'Redis cache performance', 'active', 99.99, 3),
  ('File Storage', 'S3 compatible storage monitoring', 'active', 99.92, 67),
  ('Background Jobs', 'Queue worker performance', 'warning', 96.40, 890);
