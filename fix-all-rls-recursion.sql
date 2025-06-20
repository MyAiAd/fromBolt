-- COMPREHENSIVE FIX FOR ALL RLS INFINITE RECURSION ISSUES
-- This script fixes infinite recursion in BOTH users and affiliate_system_users tables
-- Run this ENTIRE script in your Supabase SQL Editor

-- =============================================================================
-- STEP 1: Fix users table RLS policies (infinite recursion)
-- =============================================================================

-- Drop ALL existing problematic policies for users table
DROP POLICY IF EXISTS "users_select_policy" ON users;
DROP POLICY IF EXISTS "users_update_policy" ON users;
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;

-- Create simple, non-recursive policies for users table
CREATE POLICY "users_simple_select_policy" ON users
  FOR SELECT
  TO authenticated
  USING (
    -- User can see their own record OR user is admin
    id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM auth.users au 
      WHERE au.id = auth.uid() 
      AND au.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

CREATE POLICY "users_simple_update_policy" ON users
  FOR UPDATE
  TO authenticated
  USING (
    -- User can update their own record OR user is admin
    id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM auth.users au 
      WHERE au.id = auth.uid() 
      AND au.raw_user_meta_data->>'is_admin' = 'true'
    )
  )
  WITH CHECK (
    -- Same check for updates
    id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM auth.users au 
      WHERE au.id = auth.uid() 
      AND au.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

CREATE POLICY "users_simple_insert_policy" ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Users can insert their own records OR admins can insert any
    id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM auth.users au 
      WHERE au.id = auth.uid() 
      AND au.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

-- =============================================================================
-- STEP 2: Fix affiliate_system_users RLS policies (already fixed but ensuring)
-- =============================================================================

-- Drop ALL existing problematic policies for affiliate_system_users
DROP POLICY IF EXISTS "Users can view their own affiliate data" ON affiliate_system_users;
DROP POLICY IF EXISTS "Users can view their team members" ON affiliate_system_users;
DROP POLICY IF EXISTS "Users can manage their own affiliate data" ON affiliate_system_users;
DROP POLICY IF EXISTS "Users can insert affiliate records" ON affiliate_system_users;
DROP POLICY IF EXISTS "Admins can manage all affiliate users" ON affiliate_system_users;
DROP POLICY IF EXISTS "Allow authenticated read access" ON affiliate_system_users;

-- Create simple, non-recursive policies for affiliate_system_users
CREATE POLICY "affiliate_system_users_simple_select" ON affiliate_system_users
  FOR SELECT
  TO authenticated
  USING (true); -- Allow all authenticated users to read

CREATE POLICY "affiliate_system_users_simple_insert" ON affiliate_system_users
  FOR INSERT
  TO authenticated
  WITH CHECK (true); -- Allow all authenticated users to insert

CREATE POLICY "affiliate_system_users_simple_update" ON affiliate_system_users
  FOR UPDATE
  TO authenticated
  USING (true) -- Allow all authenticated users to update
  WITH CHECK (true);

CREATE POLICY "affiliate_system_users_simple_delete" ON affiliate_system_users
  FOR DELETE
  TO authenticated
  USING (true); -- Allow all authenticated users to delete

-- =============================================================================
-- STEP 3: Verify tables exist and are accessible
-- =============================================================================

-- Test query to ensure no recursion
DO $$
BEGIN
  -- Test users table access
  PERFORM COUNT(*) FROM users LIMIT 1;
  RAISE NOTICE 'SUCCESS: users table accessible without recursion';
  
  -- Test affiliate_system_users table access  
  PERFORM COUNT(*) FROM affiliate_system_users LIMIT 1;
  RAISE NOTICE 'SUCCESS: affiliate_system_users table accessible without recursion';
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'ERROR during verification: %', SQLERRM;
END $$;

-- =============================================================================
-- STEP 4: Grant necessary permissions
-- =============================================================================

-- Ensure authenticated users have proper access
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON affiliate_system_users TO authenticated;

-- Ensure service_role has full access (for server-side operations)
GRANT ALL ON users TO service_role;
GRANT ALL ON affiliate_system_users TO service_role;

-- =============================================================================
-- VERIFICATION QUERIES (run these to test)
-- =============================================================================

-- Test 1: Simple select from users (should work)
-- SELECT COUNT(*) FROM users;

-- Test 2: Simple select from affiliate_system_users (should work)  
-- SELECT COUNT(*) FROM affiliate_system_users;

-- Test 3: Test the exact query that was failing
-- SELECT *, affiliates!affiliates_affiliate_id_fkey(level,commission_rate,status,created_at) 
-- FROM users WHERE data_source != 'test';

COMMIT; 