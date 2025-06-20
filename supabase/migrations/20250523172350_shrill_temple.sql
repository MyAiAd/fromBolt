/*
  # Add insert policy for users table

  1. Security Changes
    - Add policy to allow users to insert their own data
*/

CREATE POLICY "Users can insert their own data"
  ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);