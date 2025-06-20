/*
  # Add admin role and first user privileges

  1. Changes
    - Add admin column to users table
    - Update RLS policies to grant admin privileges
    - Add function to automatically set first user as admin
    - Add trigger to handle admin assignment

  2. Security
    - Enable RLS policies for admin access
    - Maintain existing user policies
    - Add admin-specific policies
*/

-- Add admin column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Create function to check if this is the first user
CREATE OR REPLACE FUNCTION public.check_first_user()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM users WHERE is_admin = true
  ) THEN
    NEW.is_admin := true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically set first user as admin
DROP TRIGGER IF EXISTS set_first_user_as_admin ON users;
CREATE TRIGGER set_first_user_as_admin
  BEFORE INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION check_first_user();

-- Update RLS policies for users table
CREATE POLICY "Admins can view all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (is_admin = true);

CREATE POLICY "Admins can update all users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (is_admin = true)
  WITH CHECK (is_admin = true);

-- Update RLS policies for other tables to grant admin access
CREATE POLICY "Admins can view all affiliates"
  ON affiliates
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.is_admin = true
  ));

CREATE POLICY "Admins can view all transactions"
  ON transactions
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.is_admin = true
  ));

CREATE POLICY "Admins can view all commissions"
  ON commissions
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.is_admin = true
  ));

CREATE POLICY "Admins can view all clicks"
  ON clicks
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.is_admin = true
  ));