-- CLEANUP DUPLICATE POLICIES
-- Remove the old "Allow authenticated users..." policies and keep only the v3 versions

-- Drop the old duplicate policies
DROP POLICY IF EXISTS "Allow authenticated users to delete affiliate records" ON affiliate_system_users;
DROP POLICY IF EXISTS "Allow authenticated users to insert affiliate records" ON affiliate_system_users;
DROP POLICY IF EXISTS "Allow authenticated users to read affiliate data" ON affiliate_system_users;
DROP POLICY IF EXISTS "Allow authenticated users to update affiliate records" ON affiliate_system_users;

DROP POLICY IF EXISTS "Allow authenticated users to delete user records" ON users;
DROP POLICY IF EXISTS "Allow authenticated users to insert user records" ON users;
DROP POLICY IF EXISTS "Allow authenticated users to read user data" ON users;
DROP POLICY IF EXISTS "Allow authenticated users to update user records" ON users;

-- Add the missing DELETE policy for users table (I notice it's missing from the v3 set)
CREATE POLICY "users_final_delete_v3" ON users
  FOR DELETE
  TO authenticated
  USING (
    id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM auth.users au 
      WHERE au.id = auth.uid() 
      AND au.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

-- Verify the cleanup worked - should show only the v3 policies now
SELECT 
    schemaname, 
    tablename, 
    policyname
FROM pg_policies 
WHERE tablename IN ('users', 'affiliate_system_users')
ORDER BY tablename, policyname;

-- Test that everything still works
DO $$
BEGIN
  PERFORM COUNT(*) FROM users LIMIT 1;
  RAISE NOTICE '✅ SUCCESS: users table accessible without recursion';
  
  PERFORM COUNT(*) FROM affiliate_system_users LIMIT 1;
  RAISE NOTICE '✅ SUCCESS: affiliate_system_users table accessible without recursion';
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '❌ ERROR during verification: %', SQLERRM;
END $$;

COMMIT; 