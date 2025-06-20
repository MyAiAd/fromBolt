-- Development-friendly RLS policies for affiliate_system_users
-- These allow imports while maintaining some security

-- Drop all current policies
DROP POLICY IF EXISTS "Allow authenticated read access" ON affiliate_system_users;
DROP POLICY IF EXISTS "Allow authenticated insert access" ON affiliate_system_users;
DROP POLICY IF EXISTS "Allow authenticated update access" ON affiliate_system_users;
DROP POLICY IF EXISTS "Allow authenticated delete access" ON affiliate_system_users;

-- FOR DEVELOPMENT: More permissive policies that allow authenticated operations
-- In production, you should make these more restrictive

-- Policy 1: Allow reads for authenticated users (and anon for development)
CREATE POLICY "Development read access"
  ON affiliate_system_users
  FOR SELECT
  USING (true);  -- Allow all reads

-- Policy 2: Allow inserts for authenticated users (for imports)
CREATE POLICY "Development insert access"
  ON affiliate_system_users
  FOR INSERT
  WITH CHECK (
    -- Allow if user is authenticated OR if this is coming from anon key (for development)
    auth.role() = 'authenticated' OR auth.role() = 'anon'
  );

-- Policy 3: Allow updates for authenticated users
CREATE POLICY "Development update access"
  ON affiliate_system_users
  FOR UPDATE
  USING (
    auth.role() = 'authenticated' OR auth.role() = 'anon'
  )
  WITH CHECK (
    auth.role() = 'authenticated' OR auth.role() = 'anon'
  );

-- Policy 4: Allow deletes for authenticated users
CREATE POLICY "Development delete access"
  ON affiliate_system_users
  FOR DELETE
  USING (
    auth.role() = 'authenticated' OR auth.role() = 'anon'
  );

-- Grant permissions to both authenticated and anon roles for development
GRANT ALL ON affiliate_system_users TO authenticated;
GRANT ALL ON affiliate_system_users TO anon; 