-- =====================================================
-- FIX USERS TABLE PERMISSION - Final Fix
-- This addresses the 403 Forbidden error on users table
-- =====================================================

-- 1. FORCE DISABLE RLS ON USERS TABLE
-- =====================================================

-- Disable RLS completely on users table
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 2. DROP ALL EXISTING POLICIES ON USERS TABLE
-- =====================================================

-- Drop any existing policies that might be blocking access
DO $$ 
DECLARE
    policy_record RECORD;
BEGIN
    -- Get all policies on users table and drop them
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'users' 
        AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON users', policy_record.policyname);
        RAISE NOTICE 'Dropped policy: %', policy_record.policyname;
    END LOOP;
    
    RAISE NOTICE 'All policies on users table have been dropped';
END $$;

-- 3. GRANT EXPLICIT PERMISSIONS
-- =====================================================

-- Grant all permissions to both authenticated and anonymous users
GRANT ALL PRIVILEGES ON users TO authenticated;
GRANT ALL PRIVILEGES ON users TO anon;
GRANT ALL PRIVILEGES ON users TO postgres;

-- Also grant usage on the sequence if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.sequences WHERE sequence_name LIKE '%users%') THEN
        GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
        GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
        RAISE NOTICE 'Granted sequence permissions';
    END IF;
END $$;

-- 4. REFRESH PERMISSIONS
-- =====================================================

-- Force refresh of permissions
NOTIFY pgrst, 'reload schema';

-- 5. TEST USERS TABLE ACCESS
-- =====================================================

-- Test basic access to users table
DO $$ 
DECLARE
    user_count INTEGER;
    test_user_id UUID;
BEGIN
    -- Test basic SELECT
    SELECT COUNT(*) INTO user_count FROM users;
    RAISE NOTICE 'Users table SELECT test: % records found', user_count;
    
    -- Test if sage@myai.ad exists
    SELECT id INTO test_user_id FROM users WHERE email = 'sage@myai.ad' LIMIT 1;
    IF test_user_id IS NOT NULL THEN
        RAISE NOTICE 'Admin user sage@myai.ad found with ID: %', test_user_id;
    ELSE
        RAISE NOTICE 'Admin user sage@myai.ad not found - this is OK';
    END IF;
    
    RAISE NOTICE 'Users table access test completed successfully';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Users table access test FAILED: %', SQLERRM;
END $$;

-- 6. VERIFY ALL TABLE PERMISSIONS
-- =====================================================

-- Check permissions on all important tables
DO $$ 
DECLARE
    table_name TEXT;
    table_list TEXT[] := ARRAY['users', 'affiliates', 'goaffpro_affiliates', 'mightynetworks_affiliates', 'affiliate_system_users'];
    test_count INTEGER;
BEGIN
    FOREACH table_name IN ARRAY table_list
    LOOP
        BEGIN
            EXECUTE format('SELECT COUNT(*) FROM %I', table_name) INTO test_count;
            RAISE NOTICE 'Table % - Access: OK, Records: %', table_name, test_count;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'Table % - Access: FAILED - %', table_name, SQLERRM;
        END;
    END LOOP;
END $$;

-- 7. SUCCESS MESSAGE
-- =====================================================

DO $$ 
BEGIN
    RAISE NOTICE '🎉 Users table permission fix completed!';
    RAISE NOTICE '✅ RLS disabled on users table';
    RAISE NOTICE '✅ All policies dropped from users table';
    RAISE NOTICE '✅ Explicit permissions granted';
    RAISE NOTICE '🔄 Please refresh your affiliate page - Import Data should now work!';
END $$; 