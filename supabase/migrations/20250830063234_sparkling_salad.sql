/*
  # Create orders table for product purchases

  1. New Tables
    - `orders`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, references profiles)
      - `product_id` (uuid, references products)
      - `seller_id` (uuid, references profiles)
      - `quantity` (integer)
      - `unit_price` (numeric)
      - `total_price` (numeric)
      - `status` (enum: pending, confirmed, shipped, delivered, cancelled)
      - `delivery_address` (text)
      - `estimated_delivery` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `orders` table
    - Add policies for customers and sellers to access their orders
*/

-- Create enum for order status
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  seller_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric(10,2) NOT NULL CHECK (unit_price >= 0),
  total_price numeric(10,2) NOT NULL CHECK (total_price >= 0),
  status order_status DEFAULT 'pending',
  delivery_address text NOT NULL,
  estimated_delivery date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Customers can read their own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Sellers can read their orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (seller_id = auth.uid());

CREATE POLICY "Customers can create orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Sellers can update their orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (seller_id = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_product_id ON orders(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update product stock when order is placed
CREATE OR REPLACE FUNCTION handle_order_stock_update()
RETURNS trigger AS $$
BEGIN
  -- Decrease stock when order is confirmed
  IF NEW.status = 'confirmed' AND OLD.status = 'pending' THEN
    UPDATE products 
    SET stock = stock - NEW.quantity,
        sold = sold + NEW.quantity
    WHERE id = NEW.product_id;
  END IF;
  
  -- Increase stock if order is cancelled
  IF NEW.status = 'cancelled' AND OLD.status IN ('pending', 'confirmed') THEN
    UPDATE products 
    SET stock = stock + NEW.quantity,
        sold = GREATEST(0, sold - NEW.quantity)
    WHERE id = NEW.product_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for stock updates
CREATE TRIGGER on_order_status_change
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION handle_order_stock_update();