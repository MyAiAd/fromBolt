-- ================================================
-- FIX IMPORT CONSTRAINT ISSUES
-- ================================================
-- This script addresses the constraint violations causing import failures
-- by updating the primary_source constraint to match the new abbreviations

-- First, check current state
SELECT 'Before Update' as status, primary_source, COUNT(*) as count 
FROM affiliate_system_users 
GROUP BY primary_source 
ORDER BY count DESC;

-- Begin transaction
BEGIN;

-- Step 1: Drop the existing constraint
ALTER TABLE affiliate_system_users 
DROP CONSTRAINT IF EXISTS affiliate_system_users_primary_source_check;

-- Step 2: Update existing data to use new abbreviations
UPDATE affiliate_system_users SET primary_source = 'GHL' WHERE primary_source = 'ghl';
UPDATE affiliate_system_users SET primary_source = 'MN' WHERE primary_source = 'mightynetworks';
UPDATE affiliate_system_users SET primary_source = 'SHP' WHERE primary_source = 'goaffpro';
UPDATE affiliate_system_users SET primary_source = 'manual' WHERE primary_source = 'manual';
UPDATE affiliate_system_users SET primary_source = 'shopify' WHERE primary_source = 'shopify';

-- Step 3: Add the new constraint with abbreviated values
ALTER TABLE affiliate_system_users 
ADD CONSTRAINT affiliate_system_users_primary_source_check 
CHECK (primary_source = ANY (ARRAY['GHL'::text, 'MN'::text, 'SHP'::text, 'manual'::text, 'shopify'::text]));

-- Step 4: Update import logs constraint if needed
ALTER TABLE affiliate_import_logs 
DROP CONSTRAINT IF EXISTS affiliate_import_logs_import_source_check;

ALTER TABLE affiliate_import_logs 
ADD CONSTRAINT affiliate_import_logs_import_source_check 
CHECK (import_source = ANY (ARRAY['ghl'::text, 'mightynetworks'::text, 'shopify'::text, 'goaffpro'::text, 'manual'::text]));

-- Step 5: Update monthly_affiliate_earnings if exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'monthly_affiliate_earnings') THEN
    UPDATE monthly_affiliate_earnings SET affiliate_source = 'GHL' WHERE affiliate_source = 'ghl' OR affiliate_source = 'native';
    UPDATE monthly_affiliate_earnings SET affiliate_source = 'MN' WHERE affiliate_source = 'mightynetworks';
    UPDATE monthly_affiliate_earnings SET affiliate_source = 'SHP' WHERE affiliate_source = 'goaffpro';
  END IF;
END $$;

COMMIT;

-- Verify the changes
SELECT 'After Update' as status, primary_source, COUNT(*) as count 
FROM affiliate_system_users 
GROUP BY primary_source 
ORDER BY count DESC;

-- Show constraint info
SELECT 
  conname as constraint_name, 
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conname LIKE '%primary_source%';

-- Summary
SELECT 
  'Import Fix Summary' as status,
  'Constraint updated to use abbreviated source values (GHL, MN, SHP)' as message,
  'This should fix the constraint violation errors during import' as result; 