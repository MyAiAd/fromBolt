-- ================================================
-- PERFORMANCE LEVEL SYSTEM DATABASE MIGRATION
-- ================================================
-- This migration adds monthly earnings-based performance levels
-- to the affiliate system. Run this in your Supabase SQL Editor.

-- ================================================
-- STEP 1: Add performance level columns to existing tables
-- ================================================

-- Add columns to goaffpro_affiliates table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'goaffpro_affiliates' AND column_name = 'current_performance_level') THEN
        ALTER TABLE goaffpro_affiliates ADD COLUMN current_performance_level VARCHAR(20) DEFAULT 'Aligned';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'goaffpro_affiliates' AND column_name = 'current_month_earnings') THEN
        ALTER TABLE goaffpro_affiliates ADD COLUMN current_month_earnings DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'goaffpro_affiliates' AND column_name = 'last_level_calculation') THEN
        ALTER TABLE goaffpro_affiliates ADD COLUMN last_level_calculation TIMESTAMP DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'goaffpro_affiliates' AND column_name = 'level_calculation_month') THEN
        ALTER TABLE goaffpro_affiliates ADD COLUMN level_calculation_month VARCHAR(7) DEFAULT TO_CHAR(NOW(), 'YYYY-MM');
    END IF;
END $$;

-- Add columns to mightynetworks_affiliates table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mightynetworks_affiliates' AND column_name = 'current_performance_level') THEN
        ALTER TABLE mightynetworks_affiliates ADD COLUMN current_performance_level VARCHAR(20) DEFAULT 'Aligned';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mightynetworks_affiliates' AND column_name = 'current_month_earnings') THEN
        ALTER TABLE mightynetworks_affiliates ADD COLUMN current_month_earnings DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mightynetworks_affiliates' AND column_name = 'last_level_calculation') THEN
        ALTER TABLE mightynetworks_affiliates ADD COLUMN last_level_calculation TIMESTAMP DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mightynetworks_affiliates' AND column_name = 'level_calculation_month') THEN
        ALTER TABLE mightynetworks_affiliates ADD COLUMN level_calculation_month VARCHAR(7) DEFAULT TO_CHAR(NOW(), 'YYYY-MM');
    END IF;
END $$;

-- Add columns to affiliate_system_users table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_system_users' AND column_name = 'current_performance_level') THEN
        ALTER TABLE affiliate_system_users ADD COLUMN current_performance_level VARCHAR(20) DEFAULT 'Aligned';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_system_users' AND column_name = 'current_month_earnings') THEN
        ALTER TABLE affiliate_system_users ADD COLUMN current_month_earnings DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_system_users' AND column_name = 'last_level_calculation') THEN
        ALTER TABLE affiliate_system_users ADD COLUMN last_level_calculation TIMESTAMP DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_system_users' AND column_name = 'level_calculation_month') THEN
        ALTER TABLE affiliate_system_users ADD COLUMN level_calculation_month VARCHAR(7) DEFAULT TO_CHAR(NOW(), 'YYYY-MM');
    END IF;
END $$;

-- ================================================
-- STEP 2: Create monthly earnings tracking table
-- ================================================

CREATE TABLE IF NOT EXISTS monthly_affiliate_earnings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    affiliate_email VARCHAR(255) NOT NULL,
    affiliate_source VARCHAR(50) NOT NULL, -- 'goaffpro', 'mightynetworks', 'ghl', 'native', 'manual', 'shopify'
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    month_key VARCHAR(7) NOT NULL, -- 'YYYY-MM' format
    total_earnings DECIMAL(10,2) DEFAULT 0,
    performance_level VARCHAR(20) NOT NULL,
    calculated_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Composite unique constraint
    UNIQUE(affiliate_email, affiliate_source, year, month)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_monthly_earnings_email ON monthly_affiliate_earnings(affiliate_email);
CREATE INDEX IF NOT EXISTS idx_monthly_earnings_source ON monthly_affiliate_earnings(affiliate_source);
CREATE INDEX IF NOT EXISTS idx_monthly_earnings_month_key ON monthly_affiliate_earnings(month_key);
CREATE INDEX IF NOT EXISTS idx_monthly_earnings_level ON monthly_affiliate_earnings(performance_level);

-- ================================================
-- STEP 3: Create calculation logs table
-- ================================================

CREATE TABLE IF NOT EXISTS monthly_calculation_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    calculation_date TIMESTAMP DEFAULT NOW(),
    month_key VARCHAR(7) NOT NULL,
    processed_count INTEGER DEFAULT 0,
    errors_count INTEGER DEFAULT 0,
    execution_time_ms INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'completed', -- 'completed', 'failed', 'partial'
    error_details TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ================================================
-- STEP 4: Create performance level calculation function
-- ================================================

CREATE OR REPLACE FUNCTION calculate_performance_level(earnings DECIMAL)
RETURNS VARCHAR(20) AS $$
BEGIN
    IF earnings >= 1000000 THEN RETURN 'Sovereign';
    ELSIF earnings >= 500000 THEN RETURN 'Oracle';
    ELSIF earnings >= 100000 THEN RETURN 'Visionary';
    ELSIF earnings >= 50000 THEN RETURN 'Luminary';
    ELSIF earnings >= 25000 THEN RETURN 'Magnetic';
    ELSIF earnings >= 5000 THEN RETURN 'Ascended';
    ELSIF earnings >= 1000 THEN RETURN 'Activated';
    ELSE RETURN 'Aligned';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- STEP 5: Create monthly recalculation function
-- ================================================

CREATE OR REPLACE FUNCTION recalculate_monthly_performance_levels()
RETURNS JSON AS $$
DECLARE
    current_month_key VARCHAR(7);
    processed_count INTEGER := 0;
    temp_count INTEGER := 0;
    start_time TIMESTAMP;
    end_time TIMESTAMP;
    execution_time INTEGER;
    error_count INTEGER := 0;
    result_json JSON;
BEGIN
    start_time := NOW();
    current_month_key := TO_CHAR(NOW(), 'YYYY-MM');
    
    -- Process GoAffPro affiliates
    BEGIN
        INSERT INTO monthly_affiliate_earnings (
            affiliate_email, affiliate_source, year, month, month_key, 
            total_earnings, performance_level, calculated_at
        )
        SELECT 
            email,
            'goaffpro',
            EXTRACT(YEAR FROM NOW())::INTEGER,
            EXTRACT(MONTH FROM NOW())::INTEGER,
            current_month_key,
            COALESCE(total_earnings, 0),
            calculate_performance_level(COALESCE(total_earnings, 0)),
            NOW()
        FROM goaffpro_affiliates
        WHERE email IS NOT NULL
        ON CONFLICT (affiliate_email, affiliate_source, year, month) 
        DO UPDATE SET
            total_earnings = EXCLUDED.total_earnings,
            performance_level = EXCLUDED.performance_level,
            calculated_at = NOW(),
            updated_at = NOW();
        
        -- Update the source table
        UPDATE goaffpro_affiliates 
        SET 
            current_performance_level = calculate_performance_level(COALESCE(total_earnings, 0)),
            current_month_earnings = COALESCE(total_earnings, 0),
            last_level_calculation = NOW(),
            level_calculation_month = current_month_key
        WHERE email IS NOT NULL;
        
        GET DIAGNOSTICS temp_count = ROW_COUNT;
        processed_count := temp_count;
    EXCEPTION WHEN OTHERS THEN
        error_count := error_count + 1;
    END;
    
    -- Process MightyNetworks affiliates
    BEGIN
        INSERT INTO monthly_affiliate_earnings (
            affiliate_email, affiliate_source, year, month, month_key, 
            total_earnings, performance_level, calculated_at
        )
        SELECT 
            email,
            'mightynetworks',
            EXTRACT(YEAR FROM NOW())::INTEGER,
            EXTRACT(MONTH FROM NOW())::INTEGER,
            current_month_key,
            COALESCE(total_earnings, 0),
            calculate_performance_level(COALESCE(total_earnings, 0)),
            NOW()
        FROM mightynetworks_affiliates
        WHERE email IS NOT NULL
        ON CONFLICT (affiliate_email, affiliate_source, year, month) 
        DO UPDATE SET
            total_earnings = EXCLUDED.total_earnings,
            performance_level = EXCLUDED.performance_level,
            calculated_at = NOW(),
            updated_at = NOW();
        
        -- Update the source table
        UPDATE mightynetworks_affiliates 
        SET 
            current_performance_level = calculate_performance_level(COALESCE(total_earnings, 0)),
            current_month_earnings = COALESCE(total_earnings, 0),
            last_level_calculation = NOW(),
            level_calculation_month = current_month_key
        WHERE email IS NOT NULL;
        
        GET DIAGNOSTICS temp_count = ROW_COUNT;
        processed_count := processed_count + temp_count;
    EXCEPTION WHEN OTHERS THEN
        error_count := error_count + 1;
    END;
    
    -- Process Affiliate System Users
    BEGIN
        INSERT INTO monthly_affiliate_earnings (
            affiliate_email, affiliate_source, year, month, month_key, 
            total_earnings, performance_level, calculated_at
        )
        SELECT 
            email,
            COALESCE(affiliate_source, 'native'),
            EXTRACT(YEAR FROM NOW())::INTEGER,
            EXTRACT(MONTH FROM NOW())::INTEGER,
            current_month_key,
            COALESCE(total_earnings, 0),
            calculate_performance_level(COALESCE(total_earnings, 0)),
            NOW()
        FROM affiliate_system_users
        WHERE email IS NOT NULL
        ON CONFLICT (affiliate_email, affiliate_source, year, month) 
        DO UPDATE SET
            total_earnings = EXCLUDED.total_earnings,
            performance_level = EXCLUDED.performance_level,
            calculated_at = NOW(),
            updated_at = NOW();
        
        -- Update the source table
        UPDATE affiliate_system_users 
        SET 
            current_performance_level = calculate_performance_level(COALESCE(total_earnings, 0)),
            current_month_earnings = COALESCE(total_earnings, 0),
            last_level_calculation = NOW(),
            level_calculation_month = current_month_key
        WHERE email IS NOT NULL;
        
        GET DIAGNOSTICS temp_count = ROW_COUNT;
        processed_count := processed_count + temp_count;
    EXCEPTION WHEN OTHERS THEN
        error_count := error_count + 1;
    END;
    
    end_time := NOW();
    execution_time := EXTRACT(EPOCH FROM (end_time - start_time)) * 1000;
    
    -- Log the calculation
    INSERT INTO monthly_calculation_logs (
        month_key, processed_count, errors_count, execution_time_ms, 
        status, error_details
    ) VALUES (
        current_month_key, processed_count, error_count, execution_time,
        CASE WHEN error_count = 0 THEN 'completed' ELSE 'partial' END,
        CASE WHEN error_count > 0 THEN 'Some tables had errors during processing' ELSE NULL END
    );
    
    -- Return result as JSON
    result_json := json_build_object(
        'processed_count', processed_count,
        'month_key', current_month_key,
        'execution_time_ms', execution_time,
        'errors_count', error_count,
        'status', CASE WHEN error_count = 0 THEN 'completed' ELSE 'partial' END
    );
    
    RETURN result_json;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- STEP 6: Grant necessary permissions
-- ================================================

-- Grant access to the new tables
GRANT ALL ON monthly_affiliate_earnings TO anon, authenticated;
GRANT ALL ON monthly_calculation_logs TO anon, authenticated;

-- Grant execute permission on functions
GRANT EXECUTE ON FUNCTION calculate_performance_level(DECIMAL) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION recalculate_monthly_performance_levels() TO anon, authenticated;

-- ================================================
-- STEP 7: Initial data population
-- ================================================

-- Run initial calculation to populate current performance levels
SELECT recalculate_monthly_performance_levels();

-- ================================================
-- VERIFICATION QUERIES
-- ================================================

-- Check if columns were added successfully
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name IN ('goaffpro_affiliates', 'mightynetworks_affiliates', 'affiliate_system_users') 
    AND column_name LIKE '%performance%' OR column_name LIKE '%month%'
ORDER BY table_name, column_name;

-- Check function exists
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name IN ('calculate_performance_level', 'recalculate_monthly_performance_levels');

-- Check monthly earnings table
SELECT COUNT(*) as monthly_records FROM monthly_affiliate_earnings;

-- Check calculation logs
SELECT * FROM monthly_calculation_logs ORDER BY created_at DESC LIMIT 5;

-- Sample performance level distribution
SELECT 
    'goaffpro' as source,
    current_performance_level,
    COUNT(*) as count
FROM goaffpro_affiliates 
WHERE current_performance_level IS NOT NULL
GROUP BY current_performance_level
UNION ALL
SELECT 
    'mightynetworks' as source,
    current_performance_level,
    COUNT(*) as count
FROM mightynetworks_affiliates 
WHERE current_performance_level IS NOT NULL
GROUP BY current_performance_level
UNION ALL
SELECT 
    'affiliate_system' as source,
    current_performance_level,
    COUNT(*) as count
FROM affiliate_system_users 
WHERE current_performance_level IS NOT NULL
GROUP BY current_performance_level
ORDER BY source, current_performance_level;

-- ================================================
-- MIGRATION COMPLETE
-- ================================================

-- You can now:
-- 1. Test the function: SELECT recalculate_monthly_performance_levels();
-- 2. Check performance levels in your frontend
-- 3. Set up monthly scheduler with: FORCE_RUN=true node monthly-scheduler.js 