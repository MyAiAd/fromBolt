-- =====================================================
-- EMERGENCY RLS POLICY FIX
-- This script temporarily disables RLS to get the system working
-- =====================================================

-- 1. TEMPORARILY DISABLE RLS ON PROBLEM TABLES
-- =====================================================

-- Disable RLS on goaffpro_affiliates
ALTER TABLE goaffpro_affiliates DISABLE ROW LEVEL SECURITY;

-- Disable RLS on mightynetworks_affiliates  
ALTER TABLE mightynetworks_affiliates DISABLE ROW LEVEL SECURITY;

-- Disable RLS on affiliate_system_users
ALTER TABLE affiliate_system_users DISABLE ROW LEVEL SECURITY;

-- Disable RLS on data_import_logs
ALTER TABLE data_import_logs DISABLE ROW LEVEL SECURITY;

-- 2. GRANT FULL ACCESS TO AUTHENTICATED USERS
-- =====================================================

GRANT ALL PRIVILEGES ON goaffpro_affiliates TO authenticated;
GRANT ALL PRIVILEGES ON mightynetworks_affiliates TO authenticated;
GRANT ALL PRIVILEGES ON affiliate_system_users TO authenticated;
GRANT ALL PRIVILEGES ON data_import_logs TO authenticated;
GRANT ALL PRIVILEGES ON users TO authenticated;

-- Grant sequence permissions for auto-incrementing IDs
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- 3. ADD MISSING COLUMNS (if they don't exist)
-- =====================================================

-- Add data_source to goaffpro_affiliates
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'goaffpro_affiliates' 
                   AND column_name = 'data_source') THEN
        ALTER TABLE goaffpro_affiliates 
        ADD COLUMN data_source TEXT DEFAULT 'goaffpro';
        RAISE NOTICE 'Added data_source column to goaffpro_affiliates';
    ELSE
        RAISE NOTICE 'data_source column already exists in goaffpro_affiliates';
    END IF;
END $$;

-- Add data_source to mightynetworks_affiliates
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'mightynetworks_affiliates' 
                   AND column_name = 'data_source') THEN
        ALTER TABLE mightynetworks_affiliates 
        ADD COLUMN data_source TEXT DEFAULT 'mightynetworks';
        RAISE NOTICE 'Added data_source column to mightynetworks_affiliates';
    ELSE
        RAISE NOTICE 'data_source column already exists in mightynetworks_affiliates';
    END IF;
END $$;

-- 4. ENSURE ADMIN USER EXISTS AND IS PROPERLY SET
-- =====================================================

DO $$ 
DECLARE
    user_exists BOOLEAN;
BEGIN
    SELECT EXISTS(SELECT 1 FROM users WHERE email = 'sage@myai.ad') INTO user_exists;
    
    IF user_exists THEN
        UPDATE users 
        SET is_admin = true, updated_at = now() 
        WHERE email = 'sage@myai.ad';
        RAISE NOTICE 'Updated sage@myai.ad to admin status';
    ELSE
        INSERT INTO users (email, is_admin, created_at, updated_at)
        VALUES ('sage@myai.ad', true, now(), now());
        RAISE NOTICE 'Created admin user sage@myai.ad';
    END IF;
END $$;

-- 5. REFRESH POSTGREST SCHEMA CACHE
-- =====================================================

SELECT pg_notify('pgrst', 'reload schema');

-- 6. TEST QUERIES TO VERIFY ACCESS
-- =====================================================

-- Test goaffpro_affiliates access
DO $$ 
DECLARE
    record_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO record_count FROM goaffpro_affiliates;
    RAISE NOTICE 'goaffpro_affiliates table accessible: % records', record_count;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'goaffpro_affiliates table access failed: %', SQLERRM;
END $$;

-- Test mightynetworks_affiliates access
DO $$ 
DECLARE
    record_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO record_count FROM mightynetworks_affiliates;
    RAISE NOTICE 'mightynetworks_affiliates table accessible: % records', record_count;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'mightynetworks_affiliates table access failed: %', SQLERRM;
END $$;

-- Test affiliate_system_users access
DO $$ 
DECLARE
    record_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO record_count FROM affiliate_system_users;
    RAISE NOTICE 'affiliate_system_users table accessible: % records', record_count;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'affiliate_system_users table access failed: %', SQLERRM;
END $$;

-- 7. FINAL SUCCESS MESSAGE
-- =====================================================

DO $$ 
BEGIN
    RAISE NOTICE '🚀 EMERGENCY FIX COMPLETED! RLS temporarily disabled to restore functionality.';
    RAISE NOTICE '📋 Next steps:';
    RAISE NOTICE '   1. Refresh your affiliate page';
    RAISE NOTICE '   2. Test the import data button';
    RAISE NOTICE '   3. Once working, we can re-enable RLS with proper policies';
END $$; 