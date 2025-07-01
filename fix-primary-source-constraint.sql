-- Fix Primary Source Constraint Issue
-- Step 1: Check what primary_source values currently exist

SELECT 
  primary_source,
  COUNT(*) as count
FROM affiliate_system_users
GROUP BY primary_source
ORDER BY count DESC;

-- Step 2: Check for NULL or empty values
SELECT 
  CASE 
    WHEN primary_source IS NULL THEN 'NULL'
    WHEN primary_source = '' THEN 'EMPTY_STRING'
    ELSE primary_source
  END as source_type,
  COUNT(*) as count
FROM affiliate_system_users
GROUP BY 
  CASE 
    WHEN primary_source IS NULL THEN 'NULL'
    WHEN primary_source = '' THEN 'EMPTY_STRING'
    ELSE primary_source
  END
ORDER BY count DESC;

-- Step 3: Show invalid source values (not in our allowed list)
SELECT DISTINCT primary_source
FROM affiliate_system_users
WHERE primary_source NOT IN ('ghl', 'mightynetworks', 'shopify', 'goaffpro', 'manual', 'first_promoter')
   OR primary_source IS NULL;

-- Step 4: Fix the invalid values
-- Replace common variations with correct values
UPDATE affiliate_system_users 
SET primary_source = CASE
  -- Fix common variations
  WHEN primary_source = 'go_high_level' THEN 'ghl'
  WHEN primary_source = 'gohighlevel' THEN 'ghl'
  WHEN primary_source = 'GHL' THEN 'ghl'
  WHEN primary_source = 'GoHighLevel' THEN 'ghl'
  
  -- Fix MightyNetworks variations
  WHEN primary_source = 'mighty_networks' THEN 'mightynetworks'
  WHEN primary_source = 'MightyNetworks' THEN 'mightynetworks'
  WHEN primary_source = 'mighty networks' THEN 'mightynetworks'
  
  -- Fix GoAffPro variations
  WHEN primary_source = 'go_aff_pro' THEN 'goaffpro'
  WHEN primary_source = 'GoAffPro' THEN 'goaffpro'
  WHEN primary_source = 'go-aff-pro' THEN 'goaffpro'
  
  -- Fix First Promoter variations
  WHEN primary_source = 'first_promoter_com' THEN 'first_promoter'
  WHEN primary_source = 'FirstPromoter' THEN 'first_promoter'
  WHEN primary_source = 'first-promoter' THEN 'first_promoter'
  
  -- Fix null or empty values
  WHEN primary_source IS NULL THEN 'manual'
  WHEN primary_source = '' THEN 'manual'
  
  -- Default unknown sources to manual
  ELSE 'manual'
END
WHERE primary_source NOT IN ('ghl', 'mightynetworks', 'shopify', 'goaffpro', 'manual', 'first_promoter')
   OR primary_source IS NULL
   OR primary_source = '';

-- Step 5: Verify the fix worked
SELECT 
  primary_source,
  COUNT(*) as count
FROM affiliate_system_users
GROUP BY primary_source
ORDER BY count DESC;

-- Step 6: Check if any invalid values still exist
SELECT COUNT(*) as invalid_count
FROM affiliate_system_users
WHERE primary_source NOT IN ('ghl', 'mightynetworks', 'shopify', 'goaffpro', 'manual', 'first_promoter')
   OR primary_source IS NULL; 