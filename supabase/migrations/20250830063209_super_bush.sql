/*
  # Create electricians table for service providers

  1. New Tables
    - `electricians`
      - `id` (uuid, references profiles)
      - `specialties` (text array)
      - `experience_years` (integer)
      - `rating` (numeric)
      - `review_count` (integer)
      - `certifications` (text array)
      - `service_areas` (text array)
      - `base_rate` (numeric)
      - `onsite_rate` (numeric)
      - `availability` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `electricians` table
    - Add policies for public read access to verified electricians
    - Add policies for electricians to manage their own profiles
*/

CREATE TABLE IF NOT EXISTS electricians (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  specialties text[] DEFAULT '{}',
  experience_years integer NOT NULL DEFAULT 0 CHECK (experience_years >= 0),
  rating numeric(3,2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  review_count integer DEFAULT 0 CHECK (review_count >= 0),
  certifications text[] DEFAULT '{}',
  service_areas text[] DEFAULT '{}',
  base_rate numeric(10,2) NOT NULL DEFAULT 0 CHECK (base_rate >= 0),
  onsite_rate numeric(10,2) NOT NULL DEFAULT 0 CHECK (onsite_rate >= 0),
  availability text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE electricians ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read verified electricians"
  ON electricians
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = electricians.id 
      AND verified = true 
      AND role = 'electrician'
    )
  );

CREATE POLICY "Electricians can update their own profile"
  ON electricians
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Electricians can insert their own profile"
  ON electricians
  FOR INSERT
  TO authenticated
  WITH CHECK (
    id = auth.uid() 
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'electrician'
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_electricians_rating ON electricians(rating DESC);
CREATE INDEX IF NOT EXISTS idx_electricians_service_areas ON electricians USING GIN(service_areas);
CREATE INDEX IF NOT EXISTS idx_electricians_specialties ON electricians USING GIN(specialties);

-- Trigger for updated_at
CREATE TRIGGER update_electricians_updated_at
  BEFORE UPDATE ON electricians
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();