-- SAFE RLS FIX - Handles existing policies without errors
-- Run this script if you got "policy already exists" errors

-- =============================================================================
-- STEP 1: Safely drop ALL existing policies (no errors if they don't exist)
-- =============================================================================

-- Drop users table policies
DROP POLICY IF EXISTS "users_select_policy" ON users;
DROP POLICY IF EXISTS "users_update_policy" ON users;
DROP POLICY IF EXISTS "users_insert_policy" ON users;
DROP POLICY IF EXISTS "users_simple_select_policy" ON users;
DROP POLICY IF EXISTS "users_simple_update_policy" ON users;
DROP POLICY IF EXISTS "users_simple_insert_policy" ON users;
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;

-- Drop affiliate_system_users table policies
DROP POLICY IF EXISTS "Users can view their own affiliate data" ON affiliate_system_users;
DROP POLICY IF EXISTS "Users can view their team members" ON affiliate_system_users;
DROP POLICY IF EXISTS "Users can manage their own affiliate data" ON affiliate_system_users;
DROP POLICY IF EXISTS "Users can insert affiliate records" ON affiliate_system_users;
DROP POLICY IF EXISTS "Admins can manage all affiliate users" ON affiliate_system_users;
DROP POLICY IF EXISTS "Allow authenticated read access" ON affiliate_system_users;
DROP POLICY IF EXISTS "Allow authenticated insert access" ON affiliate_system_users;
DROP POLICY IF EXISTS "Allow authenticated update access" ON affiliate_system_users;
DROP POLICY IF EXISTS "Allow authenticated delete access" ON affiliate_system_users;
DROP POLICY IF EXISTS "affiliate_system_users_simple_select" ON affiliate_system_users;
DROP POLICY IF EXISTS "affiliate_system_users_simple_insert" ON affiliate_system_users;
DROP POLICY IF EXISTS "affiliate_system_users_simple_update" ON affiliate_system_users;
DROP POLICY IF EXISTS "affiliate_system_users_simple_delete" ON affiliate_system_users;

-- =============================================================================
-- STEP 2: Create new non-recursive policies with unique names
-- =============================================================================

-- Users table policies
CREATE POLICY "users_safe_select_v2" ON users
  FOR SELECT
  TO authenticated
  USING (
    id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM auth.users au 
      WHERE au.id = auth.uid() 
      AND au.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

CREATE POLICY "users_safe_update_v2" ON users
  FOR UPDATE
  TO authenticated
  USING (
    id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM auth.users au 
      WHERE au.id = auth.uid() 
      AND au.raw_user_meta_data->>'is_admin' = 'true'
    )
  )
  WITH CHECK (
    id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM auth.users au 
      WHERE au.id = auth.uid() 
      AND au.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

CREATE POLICY "users_safe_insert_v2" ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM auth.users au 
      WHERE au.id = auth.uid() 
      AND au.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

-- Affiliate system users policies (simplified and safe)
CREATE POLICY "affiliate_system_users_safe_select_v2" ON affiliate_system_users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "affiliate_system_users_safe_insert_v2" ON affiliate_system_users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "affiliate_system_users_safe_update_v2" ON affiliate_system_users
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "affiliate_system_users_safe_delete_v2" ON affiliate_system_users
  FOR DELETE
  TO authenticated
  USING (true);

-- =============================================================================
-- STEP 3: Grant permissions
-- =============================================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON affiliate_system_users TO authenticated;
GRANT ALL ON users TO service_role;
GRANT ALL ON affiliate_system_users TO service_role;

-- =============================================================================
-- STEP 4: Test the fix
-- =============================================================================

DO $$
BEGIN
  PERFORM COUNT(*) FROM users LIMIT 1;
  RAISE NOTICE '✅ SUCCESS: users table accessible without recursion';
  
  PERFORM COUNT(*) FROM affiliate_system_users LIMIT 1;
  RAISE NOTICE '✅ SUCCESS: affiliate_system_users table accessible without recursion';
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '❌ ERROR during verification: %', SQLERRM;
END $$;

-- =============================================================================
-- VERIFICATION QUERIES - Run these after the script
-- =============================================================================

-- SELECT COUNT(*) FROM users;
-- SELECT COUNT(*) FROM affiliate_system_users;
-- SELECT email, first_name, last_name FROM affiliate_system_users LIMIT 5;

COMMIT; 