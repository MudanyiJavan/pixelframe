/*
  # Create user profiles and authentication setup

  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users)
      - `name` (text)
      - `phone` (text)
      - `location` (text)
      - `role` (enum: customer, seller, electrician)
      - `verified` (boolean)
      - `avatar_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `profiles` table
    - Add policies for users to manage their own profiles
    - Add policy for public read access to verified electricians and sellers
*/

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('customer', 'seller', 'electrician');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text,
  location text,
  role user_role NOT NULL DEFAULT 'customer',
  verified boolean DEFAULT false,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Public can read verified sellers and electricians"
  ON profiles
  FOR SELECT
  TO anon, authenticated
  USING (verified = true AND role IN ('seller', 'electrician'));

-- Function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (new.id, new.raw_user_meta_data->>'name', (new.raw_user_meta_data->>'role')::user_role);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();