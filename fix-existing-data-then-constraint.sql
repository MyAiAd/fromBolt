-- Fix existing data first, then add constraint
-- Run this in your database console step by step

-- 1. First, let's see what invalid values currently exist
SELECT primary_source, COUNT(*) as count
FROM public.affiliate_system_users 
WHERE primary_source IS NOT NULL 
AND primary_source NOT IN ('SHP', 'MN', 'GHL', 'FP')
GROUP BY primary_source 
ORDER BY count DESC;

-- 2. Check ALL current values to understand the data
SELECT primary_source, COUNT(*) as count
FROM public.affiliate_system_users 
WHERE primary_source IS NOT NULL 
GROUP BY primary_source 
ORDER BY count DESC;

-- 3. Drop the current constraint (so we can modify data)
ALTER TABLE public.affiliate_system_users 
DROP CONSTRAINT IF EXISTS affiliate_system_users_primary_source_check;

-- 4. Fix common invalid values by mapping them to valid ones
UPDATE public.affiliate_system_users 
SET primary_source = CASE 
    WHEN primary_source = 'ghl' THEN 'GHL'
    WHEN primary_source = 'goaffpro' THEN 'SHP' 
    WHEN primary_source = 'mightynetworks' THEN 'MN'
    WHEN primary_source = 'first_promoter' THEN 'FP'
    WHEN primary_source = 'native' THEN 'GHL'
    WHEN primary_source = 'shopify' THEN 'SHP'
    WHEN primary_source = 'mn' THEN 'MN'
    WHEN primary_source = 'fp' THEN 'FP'
    ELSE primary_source
END
WHERE primary_source IN ('ghl', 'goaffpro', 'mightynetworks', 'first_promoter', 'native', 'shopify', 'mn', 'fp');

-- 5. Handle any remaining unknown values by setting them to a default
UPDATE public.affiliate_system_users 
SET primary_source = 'GHL'
WHERE primary_source IS NOT NULL 
AND primary_source NOT IN ('SHP', 'MN', 'GHL', 'FP');

-- 6. Verify all data is now valid (should show only SHP, MN, GHL, FP)
SELECT primary_source, COUNT(*) as count
FROM public.affiliate_system_users 
WHERE primary_source IS NOT NULL 
GROUP BY primary_source 
ORDER BY count DESC;

-- 7. Now add the constraint (this should work now)
ALTER TABLE public.affiliate_system_users 
ADD CONSTRAINT affiliate_system_users_primary_source_check 
CHECK (primary_source IN ('SHP', 'MN', 'GHL', 'FP'));

-- 8. Final verification
SELECT conname, pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'public.affiliate_system_users'::regclass 
AND contype = 'c'
AND conname LIKE '%primary_source%'; 