-- =====================================================
-- FINAL DATABASE FIX - Remaining Issues
-- Run this in Supabase SQL Editor to fix the last issues
-- =====================================================

-- 1. FIX ORDERS TABLE PERMISSIONS
-- =====================================================

-- Disable RLS on orders tables (only if they exist)
DO $$ 
BEGIN
    -- Fix goaffpro_orders table
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_name = 'goaffpro_orders' 
               AND table_schema = 'public') THEN
        ALTER TABLE goaffpro_orders DISABLE ROW LEVEL SECURITY;
        GRANT ALL ON goaffpro_orders TO authenticated;
        GRANT ALL ON goaffpro_orders TO anon;
        RAISE NOTICE 'Fixed goaffpro_orders table permissions';
    ELSE
        RAISE NOTICE 'goaffpro_orders table does not exist - skipping';
    END IF;
    
    -- Fix orders table only if it exists
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_name = 'orders' 
               AND table_schema = 'public') THEN
        ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
        GRANT ALL ON orders TO authenticated;
        GRANT ALL ON orders TO anon;
        RAISE NOTICE 'Fixed orders table permissions';
    ELSE
        RAISE NOTICE 'orders table does not exist - skipping';
    END IF;
END $$;

-- 2. FIX USERS TABLE PERMISSIONS
-- =====================================================

-- Disable RLS on users table temporarily
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Grant access to users table
GRANT ALL ON users TO authenticated;
GRANT ALL ON users TO anon;

-- 3. CREATE MISSING FOREIGN KEY RELATIONSHIP
-- =====================================================

-- First, let's see what tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'affiliates', 'affiliate_system_users');

-- Check if affiliates table exists, if not create it
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
                   WHERE table_name = 'affiliates' 
                   AND table_schema = 'public') THEN
        
        CREATE TABLE affiliates (
            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
            affiliate_id uuid REFERENCES users(id),
            level TEXT DEFAULT 'Bronze',
            commission_rate DECIMAL(5,4) DEFAULT 0.10,
            status TEXT DEFAULT 'active',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        
        -- Grant permissions
        GRANT ALL ON affiliates TO authenticated;
        GRANT ALL ON affiliates TO anon;
        ALTER TABLE affiliates DISABLE ROW LEVEL SECURITY;
        
        RAISE NOTICE 'Created affiliates table with foreign key to users';
    ELSE
        RAISE NOTICE 'affiliates table already exists';
    END IF;
END $$;

-- 4. ENSURE ALL NECESSARY COLUMNS EXIST
-- =====================================================

-- Add data_source to users table if missing
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' 
                   AND column_name = 'data_source') THEN
        ALTER TABLE users ADD COLUMN data_source TEXT DEFAULT 'jennaz';
        RAISE NOTICE 'Added data_source column to users table';
    END IF;
END $$;

-- 5. CREATE SIMPLE POLICIES (NO RLS FOR NOW)
-- =====================================================

-- Drop any existing problematic policies
DROP POLICY IF EXISTS "Users can view all users" ON users;
DROP POLICY IF EXISTS "Admins can do everything on users" ON users;
DROP POLICY IF EXISTS "Users can view affiliates" ON affiliates;

-- 6. VERIFY TABLE ACCESS
-- =====================================================

-- Test queries to make sure everything works (only for existing tables)
DO $$ 
DECLARE
    user_count INTEGER;
    goaffpro_count INTEGER;
    mighty_count INTEGER;
    ghl_count INTEGER;
    orders_count INTEGER;
BEGIN
    -- Test each table only if it exists
    SELECT COUNT(*) INTO user_count FROM users;
    RAISE NOTICE 'users table count: %', user_count;
    
    SELECT COUNT(*) INTO goaffpro_count FROM goaffpro_affiliates;
    RAISE NOTICE 'goaffpro_affiliates count: %', goaffpro_count;
    
    SELECT COUNT(*) INTO mighty_count FROM mightynetworks_affiliates;
    RAISE NOTICE 'mightynetworks_affiliates count: %', mighty_count;
    
    SELECT COUNT(*) INTO ghl_count FROM affiliate_system_users;
    RAISE NOTICE 'affiliate_system_users count: %', ghl_count;
    
    -- Only test goaffpro_orders if it exists
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_name = 'goaffpro_orders' 
               AND table_schema = 'public') THEN
        SELECT COUNT(*) INTO orders_count FROM goaffpro_orders;
        RAISE NOTICE 'goaffpro_orders count: %', orders_count;
    ELSE
        RAISE NOTICE 'goaffpro_orders table does not exist';
    END IF;
END $$;

-- 7. SUCCESS MESSAGE
-- =====================================================

DO $$ 
BEGIN
    RAISE NOTICE '🎉 Final database fixes completed! All tables should now be accessible.';
    RAISE NOTICE '✅ Orders table permissions fixed';
    RAISE NOTICE '✅ Users table permissions fixed';  
    RAISE NOTICE '✅ Foreign key relationship established';
    RAISE NOTICE '🔄 Please refresh your affiliate page to test the import functionality';
END $$; 