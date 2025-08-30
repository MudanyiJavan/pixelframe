/*
  # Create products table for electronics marketplace

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `category` (text)
      - `brand` (text)
      - `images` (text array)
      - `seller_id` (uuid, references profiles)
      - `stock` (integer)
      - `sold` (integer, default 0)
      - `specifications` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `products` table
    - Add policies for public read access
    - Add policies for sellers to manage their own products
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL CHECK (price > 0),
  category text NOT NULL,
  brand text NOT NULL,
  images text[] DEFAULT '{}',
  seller_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  sold integer DEFAULT 0 CHECK (sold >= 0),
  specifications jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read products"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Sellers can insert their own products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'seller' 
      AND verified = true
    )
    AND seller_id = auth.uid()
  );

CREATE POLICY "Sellers can update their own products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (seller_id = auth.uid())
  WITH CHECK (seller_id = auth.uid());

CREATE POLICY "Sellers can delete their own products"
  ON products
  FOR DELETE
  TO authenticated
  USING (seller_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();