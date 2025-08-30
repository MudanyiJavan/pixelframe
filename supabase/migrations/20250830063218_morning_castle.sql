/*
  # Create services table for electrical services

  1. New Tables
    - `services`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `category` (text)
      - `electrician_id` (uuid, references electricians)
      - `base_price` (numeric)
      - `onsite_price` (numeric)
      - `duration` (text)
      - `active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `services` table
    - Add policies for public read access to active services
    - Add policies for electricians to manage their own services
*/

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  electrician_id uuid NOT NULL REFERENCES electricians(id) ON DELETE CASCADE,
  base_price numeric(10,2) NOT NULL CHECK (base_price >= 0),
  onsite_price numeric(10,2) NOT NULL CHECK (onsite_price >= 0),
  duration text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read active services"
  ON services
  FOR SELECT
  TO anon, authenticated
  USING (
    active = true 
    AND EXISTS (
      SELECT 1 FROM profiles p
      JOIN electricians e ON p.id = e.id
      WHERE e.id = electrician_id 
      AND p.verified = true
    )
  );

CREATE POLICY "Electricians can manage their own services"
  ON services
  FOR ALL
  TO authenticated
  USING (electrician_id = auth.uid())
  WITH CHECK (electrician_id = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_services_electrician_id ON services(electrician_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(active);

-- Trigger for updated_at
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();