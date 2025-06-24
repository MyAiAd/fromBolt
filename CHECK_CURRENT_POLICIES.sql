-- CHECK CURRENT RLS POLICIES AND CLEAN RESET
-- Run this to see what policies exist and clean them up

-- First, let's see what policies currently exist
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    cmd as command,
    qual as condition
FROM pg_policies 
WHERE tablename IN ('users', 'affiliate_system_users')
ORDER BY tablename, policyname;

-- Clean slate - Drop ALL existing policies on both tables
DROP POLICY IF EXISTS "users_select_policy" ON users;
DROP POLICY IF EXISTS "users_update_policy" ON users;
DROP POLICY IF EXISTS "users_insert_policy" ON users;
DROP POLICY IF EXISTS "users_simple_select_policy" ON users;
DROP POLICY IF EXISTS "users_simple_update_policy" ON users;
DROP POLICY IF EXISTS "users_simple_insert_policy" ON users;
DROP POLICY IF EXISTS "users_safe_select_v2" ON users;
DROP POLICY IF EXISTS "users_safe_update_v2" ON users;
DROP POLICY IF EXISTS "users_safe_insert_v2" ON users;
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;

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
DROP POLICY IF EXISTS "affiliate_system_users_safe_select_v2" ON affiliate_system_users;
DROP POLICY IF EXISTS "affiliate_system_users_safe_insert_v2" ON affiliate_system_users;
DROP POLICY IF EXISTS "affiliate_system_users_safe_update_v2" ON affiliate_system_users;
DROP POLICY IF EXISTS "affiliate_system_users_safe_delete_v2" ON affiliate_system_users;

-- Create new clean policies with unique names
CREATE POLICY "users_final_select_v3" ON users
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

CREATE POLICY "users_final_update_v3" ON users
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

CREATE POLICY "users_final_insert_v3" ON users
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

-- Create simple permissive policies for affiliate_system_users
CREATE POLICY "affiliate_system_users_final_select_v3" ON affiliate_system_users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "affiliate_system_users_final_insert_v3" ON affiliate_system_users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "affiliate_system_users_final_update_v3" ON affiliate_system_users
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "affiliate_system_users_final_delete_v3" ON affiliate_system_users
  FOR DELETE
  TO authenticated
  USING (true);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON affiliate_system_users TO authenticated;
GRANT ALL ON users TO service_role;
GRANT ALL ON affiliate_system_users TO service_role;

-- Test the fix
DO $$
BEGIN
  PERFORM COUNT(*) FROM users LIMIT 1;
  RAISE NOTICE '✅ SUCCESS: users table accessible without recursion';
  
  PERFORM COUNT(*) FROM affiliate_system_users LIMIT 1;
  RAISE NOTICE '✅ SUCCESS: affiliate_system_users table accessible without recursion';
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '❌ ERROR during verification: %', SQLERRM;
END $$;

-- Final check - show what policies exist now
SELECT 
    schemaname, 
    tablename, 
    policyname
FROM pg_policies 
WHERE tablename IN ('users', 'affiliate_system_users')
ORDER BY tablename, policyname;

COMMIT; 