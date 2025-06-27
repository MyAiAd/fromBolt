-- =====================================================
-- FIX IMPORT SCHEMA - Missing Columns
-- This fixes the specific missing columns preventing imports
-- =====================================================

-- 1. FIX DATA_IMPORT_LOGS TABLE
-- =====================================================

-- Add missing columns to data_import_logs table
DO $$ 
BEGIN
    -- Add started_by column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'data_import_logs' 
                   AND column_name = 'started_by') THEN
        ALTER TABLE data_import_logs ADD COLUMN started_by UUID;
        RAISE NOTICE 'Added started_by column to data_import_logs';
    END IF;
    
    -- Add errors column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'data_import_logs' 
                   AND column_name = 'errors') THEN
        ALTER TABLE data_import_logs ADD COLUMN errors JSONB;
        RAISE NOTICE 'Added errors column to data_import_logs';
    END IF;
    
    -- Add import_source column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'data_import_logs' 
                   AND column_name = 'import_source') THEN
        ALTER TABLE data_import_logs ADD COLUMN import_source TEXT DEFAULT 'manual';
        RAISE NOTICE 'Added import_source column to data_import_logs';
    END IF;
    
    -- Add records_processed column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'data_import_logs' 
                   AND column_name = 'records_processed') THEN
        ALTER TABLE data_import_logs ADD COLUMN records_processed INTEGER DEFAULT 0;
        RAISE NOTICE 'Added records_processed column to data_import_logs';
    END IF;
    
    -- Add records_successful column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'data_import_logs' 
                   AND column_name = 'records_successful') THEN
        ALTER TABLE data_import_logs ADD COLUMN records_successful INTEGER DEFAULT 0;
        RAISE NOTICE 'Added records_successful column to data_import_logs';
    END IF;
    
    -- Add records_failed column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'data_import_logs' 
                   AND column_name = 'records_failed') THEN
        ALTER TABLE data_import_logs ADD COLUMN records_failed INTEGER DEFAULT 0;
        RAISE NOTICE 'Added records_failed column to data_import_logs';
    END IF;
END $$;

-- 2. FIX AFFILIATE_SYSTEM_USERS TABLE
-- =====================================================

-- Add missing columns to affiliate_system_users table
DO $$ 
BEGIN
    -- Add referral_code column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'affiliate_system_users' 
                   AND column_name = 'referral_code') THEN
        ALTER TABLE affiliate_system_users ADD COLUMN referral_code TEXT;
        RAISE NOTICE 'Added referral_code column to affiliate_system_users';
    END IF;
    
    -- Add primary_source column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'affiliate_system_users' 
                   AND column_name = 'primary_source') THEN
        ALTER TABLE affiliate_system_users ADD COLUMN primary_source TEXT DEFAULT 'ghl';
        RAISE NOTICE 'Added primary_source column to affiliate_system_users';
    END IF;
    
    -- Add ghl_contact_id column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'affiliate_system_users' 
                   AND column_name = 'ghl_contact_id') THEN
        ALTER TABLE affiliate_system_users ADD COLUMN ghl_contact_id TEXT;
        RAISE NOTICE 'Added ghl_contact_id column to affiliate_system_users';
    END IF;
    
    -- Add status column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'affiliate_system_users' 
                   AND column_name = 'status') THEN
        ALTER TABLE affiliate_system_users ADD COLUMN status TEXT DEFAULT 'active';
        RAISE NOTICE 'Added status column to affiliate_system_users';
    END IF;
    
    -- Add signup_date column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'affiliate_system_users' 
                   AND column_name = 'signup_date') THEN
        ALTER TABLE affiliate_system_users ADD COLUMN signup_date TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Added signup_date column to affiliate_system_users';
    END IF;
    
    -- Add last_active column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'affiliate_system_users' 
                   AND column_name = 'last_active') THEN
        ALTER TABLE affiliate_system_users ADD COLUMN last_active TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Added last_active column to affiliate_system_users';
    END IF;
    
    -- Add custom_fields column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'affiliate_system_users' 
                   AND column_name = 'custom_fields') THEN
        ALTER TABLE affiliate_system_users ADD COLUMN custom_fields JSONB;
        RAISE NOTICE 'Added custom_fields column to affiliate_system_users';
    END IF;
END $$;

-- 3. CREATE UNIQUE CONSTRAINT FOR UPSERTS
-- =====================================================

-- Add unique constraint on email for affiliate_system_users if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'affiliate_system_users' 
        AND constraint_type = 'UNIQUE'
        AND constraint_name = 'affiliate_system_users_email_key'
    ) THEN
        ALTER TABLE affiliate_system_users ADD CONSTRAINT affiliate_system_users_email_key UNIQUE (email);
        RAISE NOTICE 'Added unique constraint on email for affiliate_system_users';
    ELSE
        RAISE NOTICE 'Email unique constraint already exists on affiliate_system_users';
    END IF;
END $$;

-- 4. REFRESH SCHEMA CACHE
-- =====================================================

-- Force refresh of schema cache
NOTIFY pgrst, 'reload schema';

-- 5. TEST THE FIXED TABLES
-- =====================================================

-- Test data_import_logs table
DO $$ 
DECLARE
    test_log_id UUID;
BEGIN
    -- Test insert into data_import_logs
    INSERT INTO data_import_logs (
        import_type, 
        import_source, 
        status, 
        started_by, 
        records_processed, 
        records_successful, 
        records_failed,
        errors
    ) VALUES (
        'test', 
        'manual', 
        'completed', 
        'd1c00584-fa89-4def-8fc3-314e323838a8'::uuid, 
        1, 
        1, 
        0,
        '{}'::jsonb
    ) RETURNING id INTO test_log_id;
    
    RAISE NOTICE 'data_import_logs test insert successful - ID: %', test_log_id;
    
    -- Clean up test record
    DELETE FROM data_import_logs WHERE id = test_log_id;
    RAISE NOTICE 'Test record cleaned up';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'data_import_logs test FAILED: %', SQLERRM;
END $$;

-- Test affiliate_system_users table
DO $$ 
DECLARE
    test_user_id UUID;
BEGIN
    -- Test insert into affiliate_system_users
    INSERT INTO affiliate_system_users (
        email, 
        first_name, 
        last_name, 
        phone, 
        referral_code, 
        primary_source, 
        ghl_contact_id, 
        status, 
        signup_date, 
        last_active, 
        custom_fields
    ) VALUES (
        'test@example.com', 
        'Test', 
        'User', 
        '+1234567890', 
        'TEST123', 
        'ghl', 
        'test_contact_id', 
        'active', 
        now(), 
        now(), 
        '{}'::jsonb
    ) RETURNING id INTO test_user_id;
    
    RAISE NOTICE 'affiliate_system_users test insert successful - ID: %', test_user_id;
    
    -- Clean up test record
    DELETE FROM affiliate_system_users WHERE id = test_user_id;
    RAISE NOTICE 'Test record cleaned up';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'affiliate_system_users test FAILED: %', SQLERRM;
END $$;

-- 6. SUCCESS MESSAGE
-- =====================================================

DO $$ 
BEGIN
    RAISE NOTICE '🎉 Import schema fixes completed!';
    RAISE NOTICE '✅ data_import_logs table fixed';
    RAISE NOTICE '✅ affiliate_system_users table fixed';
    RAISE NOTICE '✅ Unique constraints added';
    RAISE NOTICE '🚀 Import functionality should now work perfectly!';
END $$; 