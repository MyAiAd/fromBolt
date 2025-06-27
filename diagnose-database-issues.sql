-- =====================================================
-- DATABASE DIAGNOSTIC SCRIPT
-- Run this to identify current schema and permission issues
-- =====================================================

-- 1. CHECK TABLE EXISTENCE
-- =====================================================
SELECT 
    'TABLE EXISTENCE CHECK' as check_type,
    table_name,
    CASE WHEN table_name IS NOT NULL THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('users', 'data_import_logs', 'goaffpro_affiliates', 'affiliate_system_users')
ORDER BY table_name;

-- 2. CHECK CRITICAL COLUMNS
-- =====================================================
SELECT 
    'COLUMN EXISTENCE CHECK' as check_type,
    t.table_name,
    c.column_name,
    c.data_type,
    CASE WHEN c.column_name IS NOT NULL THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
FROM (
    SELECT 'data_import_logs' as table_name, 'import_config' as column_name
    UNION ALL SELECT 'data_import_logs', 'errors'
    UNION ALL SELECT 'data_import_logs', 'import_source'
    UNION ALL SELECT 'goaffpro_affiliates', 'address'
    UNION ALL SELECT 'users', 'email'
    UNION ALL SELECT 'users', 'id'
    UNION ALL SELECT 'affiliate_system_users', 'email'
) t
LEFT JOIN information_schema.columns c 
    ON c.table_schema = 'public' 
    AND c.table_name = t.table_name 
    AND c.column_name = t.column_name
ORDER BY t.table_name, t.column_name;

-- 3. CHECK RLS STATUS
-- =====================================================
SELECT 
    'RLS STATUS CHECK' as check_type,
    schemaname,
    tablename,
    rowsecurity,
    CASE 
        WHEN rowsecurity THEN '🔒 RLS ENABLED' 
        ELSE '🔓 RLS DISABLED' 
    END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('users', 'data_import_logs', 'goaffpro_affiliates', 'affiliate_system_users')
ORDER BY tablename;

-- 4. CHECK TABLE PERMISSIONS
-- =====================================================
SELECT 
    'PERMISSIONS CHECK' as check_type,
    t.table_name,
    r.role_name,
    COALESCE(string_agg(p.privilege_type, ', '), 'NO PRIVILEGES') as privileges
FROM (
    SELECT 'users' as table_name
    UNION ALL SELECT 'data_import_logs'
    UNION ALL SELECT 'goaffpro_affiliates'
    UNION ALL SELECT 'affiliate_system_users'
) t
CROSS JOIN (
    SELECT 'authenticated' as role_name
    UNION ALL SELECT 'anon'
    UNION ALL SELECT 'service_role'
) r
LEFT JOIN information_schema.table_privileges p
    ON p.table_schema = 'public'
    AND p.table_name = t.table_name
    AND p.grantee = r.role_name
GROUP BY t.table_name, r.role_name
ORDER BY t.table_name, r.role_name;

-- 5. CHECK EXISTING POLICIES
-- =====================================================
SELECT 
    'POLICY CHECK' as check_type,
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public' 
    AND tablename IN ('users', 'data_import_logs', 'goaffpro_affiliates', 'affiliate_system_users')
ORDER BY tablename, policyname;

-- 6. CHECK INDEXES
-- =====================================================
SELECT 
    'INDEX CHECK' as check_type,
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
    AND tablename IN ('users', 'data_import_logs', 'goaffpro_affiliates', 'affiliate_system_users')
ORDER BY tablename, indexname;

-- 7. SUMMARY REPORT
-- =====================================================
DO $$ 
DECLARE
    missing_columns TEXT := '';
    rls_enabled_tables TEXT := '';
    tables_without_permissions TEXT := '';
BEGIN
    -- Check for missing columns
    SELECT string_agg(table_name || '.' || column_name, ', ')
    INTO missing_columns
    FROM (
        SELECT 'data_import_logs' as table_name, 'import_config' as column_name
        UNION ALL SELECT 'data_import_logs', 'errors'
        UNION ALL SELECT 'goaffpro_affiliates', 'address'
    ) expected
    WHERE NOT EXISTS (
        SELECT 1 FROM information_schema.columns c 
        WHERE c.table_schema = 'public' 
            AND c.table_name = expected.table_name 
            AND c.column_name = expected.column_name
    );
    
    -- Check for RLS enabled tables
    SELECT string_agg(tablename, ', ')
    INTO rls_enabled_tables
    FROM pg_tables 
    WHERE schemaname = 'public' 
        AND tablename IN ('users', 'affiliate_system_users')
        AND rowsecurity = true;
    
    RAISE NOTICE '=== DIAGNOSTIC SUMMARY ===';
    RAISE NOTICE 'Missing columns: %', COALESCE(missing_columns, 'None');
    RAISE NOTICE 'Tables with RLS enabled: %', COALESCE(rls_enabled_tables, 'None');
    RAISE NOTICE '=== END DIAGNOSTIC ===';
END $$; 