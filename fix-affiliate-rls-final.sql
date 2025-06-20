-- Final fix for affiliate_system_users RLS policies
-- Support imports while maintaining security

-- Drop ALL existing policies first
DROP POLICY IF EXISTS "Authenticated users can read affiliate data" ON affiliate_system_users;
DROP POLICY IF EXISTS "Authenticated users can insert affiliate records" ON affiliate_system_users;
DROP POLICY IF EXISTS "Authenticated users can update affiliate records" ON affiliate_system_users;
DROP POLICY IF EXISTS "Authenticated users can delete affiliate records" ON affiliate_system_users;

-- Policy 1: Allow authenticated users to read all affiliate data
CREATE POLICY "Allow authenticated read access"
  ON affiliate_system_users
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy 2: Allow authenticated users to insert affiliate records (for imports)
CREATE POLICY "Allow authenticated insert access"
  ON affiliate_system_users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy 3: Allow authenticated users to update affiliate records (for imports and management)
CREATE POLICY "Allow authenticated update access"
  ON affiliate_system_users
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy 4: Allow authenticated users to delete affiliate records (with caution)
CREATE POLICY "Allow authenticated delete access"
  ON affiliate_system_users
  FOR DELETE
  TO authenticated
  USING (true);

-- Grant necessary permissions to authenticated role for the table itself
GRANT ALL ON affiliate_system_users TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE affiliate_system_users_id_seq TO authenticated; 