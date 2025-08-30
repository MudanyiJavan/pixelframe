/*
  # Create reviews table for products and electricians

  1. New Tables
    - `reviews`
      - `id` (uuid, primary key)
      - `reviewer_id` (uuid, references profiles)
      - `reviewee_id` (uuid, references profiles) - for electricians
      - `product_id` (uuid, references products) - for products
      - `order_id` (uuid, references orders) - for product reviews
      - `booking_id` (uuid, references bookings) - for service reviews
      - `rating` (integer, 1-5)
      - `comment` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `reviews` table
    - Add policies for public read access
    - Add policies for customers to create reviews for their orders/bookings
*/

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewee_id uuid REFERENCES profiles(id) ON DELETE CASCADE, -- For electrician reviews
  product_id uuid REFERENCES products(id) ON DELETE CASCADE, -- For product reviews
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE, -- Links to order for product reviews
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE, -- Links to booking for service reviews
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  
  -- Ensure review is either for product or electrician, not both
  CONSTRAINT review_target_check CHECK (
    (reviewee_id IS NOT NULL AND product_id IS NULL) OR
    (reviewee_id IS NULL AND product_id IS NOT NULL)
  )
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read reviews"
  ON reviews
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Customers can create reviews for their orders"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    reviewer_id = auth.uid() 
    AND (
      (order_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM orders 
        WHERE id = order_id 
        AND customer_id = auth.uid() 
        AND status = 'delivered'
      ))
      OR
      (booking_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM bookings 
        WHERE id = booking_id 
        AND customer_id = auth.uid() 
        AND status = 'completed'
      ))
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- Function to update electrician rating
CREATE OR REPLACE FUNCTION update_electrician_rating()
RETURNS trigger AS $$
BEGIN
  -- Update electrician rating and review count
  IF NEW.reviewee_id IS NOT NULL THEN
    UPDATE electricians 
    SET 
      rating = (
        SELECT ROUND(AVG(rating)::numeric, 2) 
        FROM reviews 
        WHERE reviewee_id = NEW.reviewee_id
      ),
      review_count = (
        SELECT COUNT(*) 
        FROM reviews 
        WHERE reviewee_id = NEW.reviewee_id
      )
    WHERE id = NEW.reviewee_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for rating updates
CREATE TRIGGER on_review_created
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_electrician_rating();