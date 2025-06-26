-- ================================================
-- UPDATE SOURCE FIELD ABBREVIATIONS
-- ================================================
-- This script updates source field values to use abbreviations:
-- - GoAFF Pro → SHP
-- - Mighty Networks → MN  
-- - GHL → GHL (stays the same)

-- Check current values in affiliate_system_users
SELECT primary_source, COUNT(*) as count 
FROM affiliate_system_users 
GROUP BY primary_source ORDER BY count DESC;

-- Update primary_source field values
BEGIN;

-- Drop the constraint temporarily
ALTER TABLE affiliate_system_users DROP CONSTRAINT IF EXISTS affiliate_system_users_primary_source_check;

-- Update the values
UPDATE affiliate_system_users SET primary_source = 'SHP' WHERE primary_source = 'goaffpro';
UPDATE affiliate_system_users SET primary_source = 'MN' WHERE primary_source = 'mightynetworks';
UPDATE affiliate_system_users SET primary_source = 'GHL' WHERE primary_source = 'ghl';
UPDATE affiliate_system_users SET primary_source = 'GHL' WHERE primary_source = 'native';

-- Re-add the constraint with new values
ALTER TABLE affiliate_system_users 
ADD CONSTRAINT affiliate_system_users_primary_source_check 
CHECK (primary_source = ANY (ARRAY['GHL'::text, 'MN'::text, 'SHP'::text, 'manual'::text, 'shopify'::text]));

COMMIT;

-- Update monthly_affiliate_earnings table if it exists
UPDATE monthly_affiliate_earnings SET affiliate_source = 'SHP' WHERE affiliate_source = 'goaffpro';
UPDATE monthly_affiliate_earnings SET affiliate_source = 'MN' WHERE affiliate_source = 'mightynetworks';
UPDATE monthly_affiliate_earnings SET affiliate_source = 'GHL' WHERE affiliate_source = 'ghl' OR affiliate_source = 'native';

-- Verification queries
SELECT 'affiliate_system_users' as table_name, primary_source as source_value, COUNT(*) as count 
FROM affiliate_system_users GROUP BY primary_source ORDER BY count DESC;

SELECT 'monthly_affiliate_earnings' as table_name, affiliate_source as source_value, COUNT(*) as count 
FROM monthly_affiliate_earnings GROUP BY affiliate_source ORDER BY count DESC;
