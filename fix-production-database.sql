-- =====================================================
-- CRITICAL PRODUCTION DATABASE FIXES
-- Run this script in your Supabase SQL Editor
-- =====================================================

-- 1. ADD MISSING COLUMNS
-- =====================================================

-- Add data_source column to goaffpro_affiliates if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'goaffpro_affiliates' 
                   AND column_name = 'data_source') THEN
        ALTER TABLE goaffpro_affiliates 
        ADD COLUMN data_source TEXT DEFAULT 'goaffpro';
        
        -- Update existing records
        UPDATE goaffpro_affiliates 
        SET data_source = 'goaffpro' 
        WHERE data_source IS NULL;
        
        RAISE NOTICE 'Added data_source column to goaffpro_affiliates';
    END IF;
END $$;

-- Add data_source column to mightynetworks_affiliates if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'mightynetworks_affiliates' 
                   AND column_name = 'data_source') THEN
        ALTER TABLE mightynetworks_affiliates 
        ADD COLUMN data_source TEXT DEFAULT 'mightynetworks';
        
        -- Update existing records
        UPDATE mightynetworks_affiliates 
        SET data_source = 'mightynetworks' 
        WHERE data_source IS NULL;
        
        RAISE NOTICE 'Added data_source column to mightynetworks_affiliates';
    END IF;
END $$;

-- 2. FIX RLS POLICY INFINITE RECURSION
-- =====================================================

-- Drop existing problematic policies for affiliate_system_users
DROP POLICY IF EXISTS "Enable read access for all users" ON affiliate_system_users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON affiliate_system_users;
DROP POLICY IF EXISTS "Enable update for users based on email" ON affiliate_system_users;
DROP POLICY IF EXISTS "Users can view their own affiliate data" ON affiliate_system_users;
DROP POLICY IF EXISTS "Admins can view all affiliate data" ON affiliate_system_users;

-- Create simple, non-recursive RLS policies
CREATE POLICY "affiliate_system_users_select_policy" ON affiliate_system_users
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND (
            email = auth.email() OR 
            EXISTS (
                SELECT 1 FROM users 
                WHERE users.id = auth.uid() 
                AND users.is_admin = true
            )
        )
    );

CREATE POLICY "affiliate_system_users_insert_policy" ON affiliate_system_users
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "affiliate_system_users_update_policy" ON affiliate_system_users
    FOR UPDATE USING (
        auth.uid() IS NOT NULL AND (
            email = auth.email() OR 
            EXISTS (
                SELECT 1 FROM users 
                WHERE users.id = auth.uid() 
                AND users.is_admin = true
            )
        )
    );

-- 3. ENSURE ADMIN USER EXISTS
-- =====================================================

-- Make sure sage@myai.ad is an admin
DO $$ 
DECLARE
    user_exists BOOLEAN;
BEGIN
    -- Check if user already exists
    SELECT EXISTS(SELECT 1 FROM users WHERE email = 'sage@myai.ad') INTO user_exists;
    
    IF user_exists THEN
        -- Update existing user to be admin
        UPDATE users 
        SET is_admin = true, updated_at = now() 
        WHERE email = 'sage@myai.ad';
        RAISE NOTICE 'Updated existing user sage@myai.ad to admin';
    ELSE
        -- Insert new admin user
        INSERT INTO users (id, email, is_admin, created_at, updated_at)
        VALUES (
            '00000000-0000-0000-0000-000000000001'::uuid,
            'sage@myai.ad',
            true,
            now(),
            now()
        );
        RAISE NOTICE 'Created new admin user sage@myai.ad';
    END IF;
END $$;

-- 4. FIX TABLE PERMISSIONS
-- =====================================================

-- Grant necessary permissions
GRANT ALL ON goaffpro_affiliates TO authenticated;
GRANT ALL ON mightynetworks_affiliates TO authenticated;
GRANT ALL ON affiliate_system_users TO authenticated;
GRANT ALL ON data_import_logs TO authenticated;
GRANT ALL ON users TO authenticated;

-- Enable RLS on all tables
ALTER TABLE goaffpro_affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE mightynetworks_affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_system_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_import_logs ENABLE ROW LEVEL SECURITY;

-- 5. CREATE SIMPLE RLS POLICIES FOR OTHER TABLES
-- =====================================================

-- GoAffPro affiliates - admins can see all, users can see their own
DROP POLICY IF EXISTS "goaffpro_affiliates_policy" ON goaffpro_affiliates;
CREATE POLICY "goaffpro_affiliates_policy" ON goaffpro_affiliates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.is_admin = true
        )
    );

-- MightyNetworks affiliates - admins can see all
DROP POLICY IF EXISTS "mightynetworks_affiliates_policy" ON mightynetworks_affiliates;
CREATE POLICY "mightynetworks_affiliates_policy" ON mightynetworks_affiliates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.is_admin = true
        )
    );

-- Data import logs - admins can see all
DROP POLICY IF EXISTS "data_import_logs_policy" ON data_import_logs;
CREATE POLICY "data_import_logs_policy" ON data_import_logs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.is_admin = true
        )
    );

-- 6. REFRESH SCHEMA CACHE
-- =====================================================

-- Force refresh of PostgREST schema cache
NOTIFY pgrst, 'reload schema';

-- 7. VERIFICATION QUERIES
-- =====================================================

-- Check if columns exist
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name IN ('goaffpro_affiliates', 'mightynetworks_affiliates')
AND column_name = 'data_source';

-- Check admin user
SELECT id, email, is_admin FROM users WHERE email = 'sage@myai.ad';

-- Check RLS policies
SELECT 
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename IN ('affiliate_system_users', 'goaffpro_affiliates', 'mightynetworks_affiliates', 'data_import_logs')
ORDER BY tablename, policyname;

-- Test basic queries
SELECT COUNT(*) as goaffpro_count FROM goaffpro_affiliates;
SELECT COUNT(*) as mightynetworks_count FROM mightynetworks_affiliates;
SELECT COUNT(*) as affiliate_system_count FROM affiliate_system_users;

-- Database fixes completed! Please test the affiliate page now.
DO $$ 
BEGIN
    RAISE NOTICE 'Database fixes completed! Please test the affiliate page now.';
END $$; 