-- ================================================
-- PERFORMANCE LEVEL SYSTEM FIX
-- ================================================
-- This migration fixes the performance level thresholds to match
-- the correct ranges and changes calculation to use monthly commission data

-- ================================================
-- STEP 1: Drop existing function and recreate with correct parameters
-- ================================================

-- Drop the existing function first to allow parameter name change
DROP FUNCTION IF EXISTS calculate_performance_level(DECIMAL);
DROP FUNCTION IF EXISTS calculate_performance_level(NUMERIC);

-- Create the updated performance level calculation function
CREATE OR REPLACE FUNCTION calculate_performance_level(monthly_earnings DECIMAL)
RETURNS VARCHAR(20) AS $$
BEGIN
    -- Updated thresholds based on monthly commission earnings
    IF monthly_earnings >= 1000000 THEN RETURN 'Sovereign';    -- $1M+
    ELSIF monthly_earnings >= 500000 THEN RETURN 'Oracle';     -- $500K-$999K
    ELSIF monthly_earnings >= 100000 THEN RETURN 'Visionary';  -- $100K-$499K
    ELSIF monthly_earnings >= 50000 THEN RETURN 'Luminary';    -- $50K-$99K
    ELSIF monthly_earnings >= 25000 THEN RETURN 'Magnetic';    -- $25K-$49K
    ELSIF monthly_earnings >= 5000 THEN RETURN 'Ascended';     -- $5K-$24K (expanded range)
    ELSIF monthly_earnings >= 1000 THEN RETURN 'Activated';    -- $1K-$4K
    ELSE RETURN 'Aligned';                                      -- $0-$999
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- STEP 2: Create function to calculate monthly commission earnings
-- ================================================

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS get_monthly_commission_earnings(TEXT, TEXT, INTEGER, INTEGER);

CREATE OR REPLACE FUNCTION get_monthly_commission_earnings(
    p_email TEXT,
    p_source TEXT,
    p_year INTEGER DEFAULT EXTRACT(YEAR FROM NOW()),
    p_month INTEGER DEFAULT EXTRACT(MONTH FROM NOW())
)
RETURNS DECIMAL(10,2) AS $$
DECLARE
    monthly_total DECIMAL(10,2) := 0;
    start_date DATE;
    end_date DATE;
BEGIN
    -- Calculate the date range for the specified month
    start_date := DATE(p_year || '-' || LPAD(p_month::TEXT, 2, '0') || '-01');
    end_date := (start_date + INTERVAL '1 month - 1 day')::DATE;
    
    -- Get commission earnings from multi_level_commissions table
    SELECT COALESCE(SUM(commission_amount), 0)
    INTO monthly_total
    FROM multi_level_commissions mlc
    JOIN affiliate_system_users asu ON mlc.earning_affiliate_id = asu.id
    WHERE asu.email = p_email
      AND mlc.order_date >= start_date
      AND mlc.order_date <= end_date
      AND mlc.status IN ('approved', 'paid')
      AND (p_source = 'all' OR asu.primary_source = p_source);
    
    -- If no commission data found, fallback to legacy earnings data
    IF monthly_total = 0 THEN
        CASE p_source
            WHEN 'goaffpro' THEN
                SELECT COALESCE(total_earnings, 0) INTO monthly_total
                FROM goaffpro_affiliates 
                WHERE email = p_email;
            WHEN 'mightynetworks' THEN
                SELECT COALESCE(total_earnings, 0) INTO monthly_total
                FROM mightynetworks_affiliates 
                WHERE email = p_email;
            WHEN 'native' THEN
                SELECT COALESCE(total_earnings, 0) INTO monthly_total
                FROM affiliate_system_users 
                WHERE email = p_email;
            ELSE
                -- For 'all' or unknown sources, get from affiliate_system_users
                SELECT COALESCE(total_earnings, 0) INTO monthly_total
                FROM affiliate_system_users 
                WHERE email = p_email;
        END CASE;
    END IF;
    
    RETURN monthly_total;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- STEP 3: Drop and recreate the monthly recalculation function
-- ================================================

-- Drop existing function
DROP FUNCTION IF EXISTS recalculate_monthly_performance_levels();

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
    current_year INTEGER;
    current_month INTEGER;
    monthly_earnings DECIMAL(10,2);
    affiliate_record RECORD;
BEGIN
    start_time := NOW();
    current_month_key := TO_CHAR(NOW(), 'YYYY-MM');
    current_year := EXTRACT(YEAR FROM NOW());
    current_month := EXTRACT(MONTH FROM NOW());
    
    -- Process GoAffPro affiliates
    BEGIN
        FOR affiliate_record IN 
            SELECT email FROM goaffpro_affiliates WHERE email IS NOT NULL
        LOOP
            -- Calculate monthly commission earnings
            monthly_earnings := get_monthly_commission_earnings(
                affiliate_record.email, 
                'goaffpro', 
                current_year, 
                current_month
            );
            
            -- Update the affiliate record
            UPDATE goaffpro_affiliates 
            SET 
                current_performance_level = calculate_performance_level(monthly_earnings),
                current_month_earnings = monthly_earnings,
                last_level_calculation = NOW(),
                level_calculation_month = current_month_key
            WHERE email = affiliate_record.email;
            
            -- Log to monthly earnings table
            INSERT INTO monthly_affiliate_earnings (
                affiliate_email, affiliate_source, year, month, month_key, 
                total_earnings, performance_level, calculated_at
            ) VALUES (
                affiliate_record.email,
                'goaffpro',
                current_year,
                current_month,
                current_month_key,
                monthly_earnings,
                calculate_performance_level(monthly_earnings),
                NOW()
            ) ON CONFLICT (affiliate_email, affiliate_source, year, month) 
            DO UPDATE SET
                total_earnings = EXCLUDED.total_earnings,
                performance_level = EXCLUDED.performance_level,
                calculated_at = NOW(),
                updated_at = NOW();
                
            processed_count := processed_count + 1;
        END LOOP;
    EXCEPTION WHEN OTHERS THEN
        error_count := error_count + 1;
    END;
    
    -- Process MightyNetworks affiliates
    BEGIN
        FOR affiliate_record IN 
            SELECT email FROM mightynetworks_affiliates WHERE email IS NOT NULL
        LOOP
            -- Calculate monthly commission earnings
            monthly_earnings := get_monthly_commission_earnings(
                affiliate_record.email, 
                'mightynetworks', 
                current_year, 
                current_month
            );
            
            -- Update the affiliate record
            UPDATE mightynetworks_affiliates 
            SET 
                current_performance_level = calculate_performance_level(monthly_earnings),
                current_month_earnings = monthly_earnings,
                last_level_calculation = NOW(),
                level_calculation_month = current_month_key
            WHERE email = affiliate_record.email;
            
            -- Log to monthly earnings table
            INSERT INTO monthly_affiliate_earnings (
                affiliate_email, affiliate_source, year, month, month_key, 
                total_earnings, performance_level, calculated_at
            ) VALUES (
                affiliate_record.email,
                'mightynetworks',
                current_year,
                current_month,
                current_month_key,
                monthly_earnings,
                calculate_performance_level(monthly_earnings),
                NOW()
            ) ON CONFLICT (affiliate_email, affiliate_source, year, month) 
            DO UPDATE SET
                total_earnings = EXCLUDED.total_earnings,
                performance_level = EXCLUDED.performance_level,
                calculated_at = NOW(),
                updated_at = NOW();
                
            processed_count := processed_count + 1;
        END LOOP;
    EXCEPTION WHEN OTHERS THEN
        error_count := error_count + 1;
    END;
    
    -- Process Affiliate System Users
    BEGIN
        FOR affiliate_record IN 
            SELECT email, primary_source FROM affiliate_system_users WHERE email IS NOT NULL
        LOOP
            -- Calculate monthly commission earnings
            monthly_earnings := get_monthly_commission_earnings(
                affiliate_record.email, 
                affiliate_record.primary_source, 
                current_year, 
                current_month
            );
            
            -- Update the affiliate record
            UPDATE affiliate_system_users 
            SET 
                current_performance_level = calculate_performance_level(monthly_earnings),
                current_month_earnings = monthly_earnings,
                last_level_calculation = NOW(),
                level_calculation_month = current_month_key
            WHERE email = affiliate_record.email;
            
            -- Log to monthly earnings table
            INSERT INTO monthly_affiliate_earnings (
                affiliate_email, affiliate_source, year, month, month_key, 
                total_earnings, performance_level, calculated_at
            ) VALUES (
                affiliate_record.email,
                COALESCE(affiliate_record.primary_source, 'native'),
                current_year,
                current_month,
                current_month_key,
                monthly_earnings,
                calculate_performance_level(monthly_earnings),
                NOW()
            ) ON CONFLICT (affiliate_email, affiliate_source, year, month) 
            DO UPDATE SET
                total_earnings = EXCLUDED.total_earnings,
                performance_level = EXCLUDED.performance_level,
                calculated_at = NOW(),
                updated_at = NOW();
                
            processed_count := processed_count + 1;
        END LOOP;
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
        'status', CASE WHEN error_count = 0 THEN 'completed' ELSE 'partial' END,
        'message', 'Performance levels updated based on monthly commission earnings'
    );
    
    RETURN result_json;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- STEP 4: Grant permissions
-- ================================================

GRANT EXECUTE ON FUNCTION calculate_performance_level(DECIMAL) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_monthly_commission_earnings(TEXT, TEXT, INTEGER, INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION recalculate_monthly_performance_levels() TO anon, authenticated;

-- ================================================
-- STEP 5: Run immediate recalculation with new thresholds
-- ================================================

-- Execute the updated calculation to apply new performance levels immediately
SELECT recalculate_monthly_performance_levels();

-- ================================================
-- STEP 6: Verification queries
-- ================================================

-- Check the distribution of performance levels after update
SELECT 
    'goaffpro' as source,
    current_performance_level,
    COUNT(*) as count,
    AVG(current_month_earnings) as avg_monthly_earnings
FROM goaffpro_affiliates 
WHERE current_performance_level IS NOT NULL
GROUP BY current_performance_level

UNION ALL

SELECT 
    'mightynetworks' as source,
    current_performance_level,
    COUNT(*) as count,
    AVG(current_month_earnings) as avg_monthly_earnings
FROM mightynetworks_affiliates 
WHERE current_performance_level IS NOT NULL
GROUP BY current_performance_level

UNION ALL

SELECT 
    'affiliate_system_users' as source,
    current_performance_level,
    COUNT(*) as count,
    AVG(current_month_earnings) as avg_monthly_earnings
FROM affiliate_system_users 
WHERE current_performance_level IS NOT NULL
GROUP BY current_performance_level
ORDER BY source, current_performance_level; 