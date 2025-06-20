/*
  # Fix user policies and recursion issues

  1. Changes
    - Drop all existing policies
    - Create new simplified policies with correct auth.uid() function
    - Update first user function
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can read their own data" ON users;
DROP POLICY IF EXISTS "Referrers can view their affiliates' basic info" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable update for users and admins" ON users;
DROP POLICY IF EXISTS "users_select_policy" ON users;
DROP POLICY IF EXISTS "users_insert_policy" ON users;
DROP POLICY IF EXISTS "users_update_policy" ON users;

-- Create simplified policies
CREATE POLICY "users_select_policy"
  ON users FOR SELECT
  TO authenticated
  USING ((id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM users admin_user
  WHERE ((admin_user.id = auth.uid()) AND (admin_user.is_admin = true)))));

CREATE POLICY "users_insert_policy"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_policy"
  ON users FOR UPDATE
  TO authenticated
  USING ((id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM users admin_user
  WHERE ((admin_user.id = auth.uid()) AND (admin_user.is_admin = true)))))
  WITH CHECK ((id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM users admin_user
  WHERE ((admin_user.id = auth.uid()) AND (admin_user.is_admin = true)))));

-- Update first user function
CREATE OR REPLACE FUNCTION check_first_user()
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