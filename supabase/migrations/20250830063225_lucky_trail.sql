/*
  # Create bookings table for service appointments

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `service_id` (uuid, references services)
      - `customer_id` (uuid, references profiles)
      - `electrician_id` (uuid, references electricians)
      - `booking_type` (enum: in-shop, on-site)
      - `customer_location` (text)
      - `scheduled_date` (timestamp)
      - `status` (enum: pending, confirmed, completed, cancelled)
      - `price` (numeric)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `bookings` table
    - Add policies for customers and electricians to access their bookings
*/

-- Create enums
CREATE TYPE booking_type AS ENUM ('in-shop', 'on-site');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  electrician_id uuid NOT NULL REFERENCES electricians(id) ON DELETE CASCADE,
  booking_type booking_type NOT NULL,
  customer_location text,
  scheduled_date timestamptz NOT NULL,
  status booking_status DEFAULT 'pending',
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Customers can read their own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Electricians can read their bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (electrician_id = auth.uid());

CREATE POLICY "Customers can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Electricians can update their bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (electrician_id = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_electrician_id ON bookings(electrician_id);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_date ON bookings(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Trigger for updated_at
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();