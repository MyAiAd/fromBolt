-- =====================================================
-- ADDITIONAL SCHEMA FIX - Resolve New Import Issues
-- This fixes the balance column and check constraint issues
-- =====================================================

-- 1. FIX GOAFFPRO_AFFILIATES TABLE - Missing balance column
-- =====================================================

-- Add missing balance column to goaffpro_affiliates
DO $$ 
BEGIN
    -- Check if balance column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public'
                   AND table_name = 'goaffpro_affiliates' 
                   AND column_name = 'balance') THEN
        ALTER TABLE public.goaffpro_affiliates ADD COLUMN balance NUMERIC(10,2) DEFAULT 0.00;
        RAISE NOTICE 'Added balance column to goaffpro_affiliates';
    ELSE
        RAISE NOTICE 'balance column already exists in goaffpro_affiliates';
    END IF;
END $$;

-- Add other potentially missing columns to goaffpro_affiliates
DO $$ 
BEGIN
    -- Add total_earnings column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public'
                   AND table_name = 'goaffpro_affiliates' 
                   AND column_name = 'total_earnings') THEN
        ALTER TABLE public.goaffpro_affiliates ADD COLUMN total_earnings NUMERIC(10,2) DEFAULT 0.00;
        RAISE NOTICE 'Added total_earnings column to goaffpro_affiliates';
    END IF;
    
    -- Add total_orders column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public'
                   AND table_name = 'goaffpro_affiliates' 
                   AND column_name = 'total_orders') THEN
        ALTER TABLE public.goaffpro_affiliates ADD COLUMN total_orders INTEGER DEFAULT 0;
        RAISE NOTICE 'Added total_orders column to goaffpro_affiliates';
    END IF;
    
    -- Add commission_rate column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public'
                   AND table_name = 'goaffpro_affiliates' 
                   AND column_name = 'commission_rate') THEN
        ALTER TABLE public.goaffpro_affiliates ADD COLUMN commission_rate NUMERIC(5,2) DEFAULT 0.00;
        RAISE NOTICE 'Added commission_rate column to goaffpro_affiliates';
    END IF;
END $$;

-- 2. FIX AFFILIATE_SYSTEM_USERS CHECK CONSTRAINT VIOLATION
-- =====================================================

-- First, let's see what the current check constraint is
DO $$ 
DECLARE
    constraint_def TEXT;
BEGIN
    -- Get the constraint definition
    SELECT pg_get_constraintdef(oid) INTO constraint_def
    FROM pg_constraint 
    WHERE conname = 'affiliate_system_users_primary_source_check' 
    AND conrelid = 'public.affiliate_system_users'::regclass;
    
    RAISE NOTICE 'Current primary_source_check constraint: %', COALESCE(constraint_def, 'NOT FOUND');
END $$;

-- Drop the problematic check constraint and recreate it with more permissive values
DO $$ 
BEGIN
    -- Drop the existing constraint if it exists
    IF EXISTS (SELECT 1 FROM pg_constraint 
               WHERE conname = 'affiliate_system_users_primary_source_check' 
               AND conrelid = 'public.affiliate_system_users'::regclass) THEN
        ALTER TABLE public.affiliate_system_users DROP CONSTRAINT affiliate_system_users_primary_source_check;
        RAISE NOTICE 'Dropped existing primary_source_check constraint';
    END IF;
    
    -- Add a more permissive constraint that allows 'ghl' as a primary source
    ALTER TABLE public.affiliate_system_users 
    ADD CONSTRAINT affiliate_system_users_primary_source_check 
    CHECK (primary_source = ANY (ARRAY['ghl'::text, 'goaffpro'::text, 'mightynetworks'::text, 'jennaz'::text, 'manual'::text]));
    
    RAISE NOTICE 'Added new primary_source_check constraint with ghl support';
END $$;

-- 3. ADD MISSING COLUMNS TO AFFILIATE_SYSTEM_USERS IF NEEDED
-- =====================================================

DO $$ 
BEGIN
    -- Add primary_source column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public'
                   AND table_name = 'affiliate_system_users' 
                   AND column_name = 'primary_source') THEN
        ALTER TABLE public.affiliate_system_users ADD COLUMN primary_source TEXT DEFAULT 'manual';
        RAISE NOTICE 'Added primary_source column to affiliate_system_users';
    END IF;
    
    -- Add ghl_contact_id column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public'
                   AND table_name = 'affiliate_system_users' 
                   AND column_name = 'ghl_contact_id') THEN
        ALTER TABLE public.affiliate_system_users ADD COLUMN ghl_contact_id TEXT;
        RAISE NOTICE 'Added ghl_contact_id column to affiliate_system_users';
    END IF;
    
    -- Add status column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public'
                   AND table_name = 'affiliate_system_users' 
                   AND column_name = 'status') THEN
        ALTER TABLE public.affiliate_system_users ADD COLUMN status TEXT DEFAULT 'active';
        RAISE NOTICE 'Added status column to affiliate_system_users';
    END IF;
    
    -- Add signup_date column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public'
                   AND table_name = 'affiliate_system_users' 
                   AND column_name = 'signup_date') THEN
        ALTER TABLE public.affiliate_system_users ADD COLUMN signup_date TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Added signup_date column to affiliate_system_users';
    END IF;
    
    -- Add last_active column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public'
                   AND table_name = 'affiliate_system_users' 
                   AND column_name = 'last_active') THEN
        ALTER TABLE public.affiliate_system_users ADD COLUMN last_active TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Added last_active column to affiliate_system_users';
    END IF;
    
    -- Add custom_fields column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public'
                   AND table_name = 'affiliate_system_users' 
                   AND column_name = 'custom_fields') THEN
        ALTER TABLE public.affiliate_system_users ADD COLUMN custom_fields JSONB;
        RAISE NOTICE 'Added custom_fields column to affiliate_system_users';
    END IF;
END $$;

-- 4. REFRESH SCHEMA CACHE AGAIN
-- =====================================================

-- Force schema cache refresh by updating table comments
COMMENT ON TABLE public.goaffpro_affiliates IS 'GoAffPro affiliates table - updated with balance column';
COMMENT ON TABLE public.affiliate_system_users IS 'Affiliate system users - updated with constraint fix';

-- Update table statistics to help with cache refresh
ANALYZE public.goaffpro_affiliates;
ANALYZE public.affiliate_system_users;

-- 5. CREATE UNIQUE CONSTRAINTS FOR PROPER UPSERTS
-- =====================================================

-- Create unique constraint on goaffpro_affiliates for proper upserts
DO $$ 
BEGIN
    -- Check if unique constraint exists
    IF NOT EXISTS (SELECT 1 FROM pg_constraint 
                   WHERE conname = 'goaffpro_affiliates_goaffpro_id_key' 
                   AND conrelid = 'public.goaffpro_affiliates'::regclass) THEN
        ALTER TABLE public.goaffpro_affiliates 
        ADD CONSTRAINT goaffpro_affiliates_goaffpro_id_key UNIQUE (goaffpro_id);
        RAISE NOTICE 'Added unique constraint on goaffpro_affiliates.goaffpro_id';
    END IF;
END $$;

-- Create unique constraint on affiliate_system_users for proper upserts
DO $$ 
BEGIN
    -- Check if unique constraint exists
    IF NOT EXISTS (SELECT 1 FROM pg_constraint 
                   WHERE conname = 'affiliate_system_users_email_key' 
                   AND conrelid = 'public.affiliate_system_users'::regclass) THEN
        ALTER TABLE public.affiliate_system_users 
        ADD CONSTRAINT affiliate_system_users_email_key UNIQUE (email);
        RAISE NOTICE 'Added unique constraint on affiliate_system_users.email';
    END IF;
END $$;

-- 6. SUMMARY REPORT
-- =====================================================

DO $$ 
BEGIN
    RAISE NOTICE '=== ADDITIONAL SCHEMA FIX SUMMARY ===';
    RAISE NOTICE 'Fixed issues:';
    RAISE NOTICE '- goaffpro_affiliates: Added balance, total_earnings, total_orders, commission_rate columns';
    RAISE NOTICE '- affiliate_system_users: Fixed primary_source_check constraint to allow ghl';
    RAISE NOTICE '- affiliate_system_users: Added missing columns for GHL integration';
    RAISE NOTICE '- Added unique constraints for proper upserts';
    RAISE NOTICE '- Refreshed schema cache';
    RAISE NOTICE '=== END ADDITIONAL FIX ===';
END $$;

-- Show updated column information
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name IN ('goaffpro_affiliates', 'affiliate_system_users')
    AND column_name IN ('balance', 'total_earnings', 'total_orders', 'commission_rate', 'primary_source', 'ghl_contact_id', 'status', 'signup_date', 'last_active', 'custom_fields')
ORDER BY table_name, column_name; 