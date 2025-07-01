-- Comprehensive fix for primary_source constraint issue (PostgreSQL 12+ compatible)
-- Step 1: Check what values currently exist
SELECT primary_source, COUNT(*) as count
FROM public.affiliate_system_users 
WHERE primary_source IS NOT NULL 
GROUP BY primary_source 
ORDER BY COUNT(*) DESC;

-- Step 2: Check what the current constraint allows (modern PostgreSQL)
SELECT conname, pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'public.affiliate_system_users'::regclass 
AND conname LIKE '%primary_source%';

-- Step 3: Fix any invalid existing data by mapping to valid values
-- Update common invalid values to valid ones
UPDATE public.affiliate_system_users 
SET primary_source = CASE 
    WHEN primary_source = 'ghl' THEN 'GHL'
    WHEN primary_source = 'goaffpro' THEN 'SHP' 
    WHEN primary_source = 'mightynetworks' THEN 'MN'
    WHEN primary_source = 'first_promoter' THEN 'FP'
    WHEN primary_source = 'native' THEN 'GHL'
    ELSE primary_source
END
WHERE primary_source IN ('ghl', 'goaffpro', 'mightynetworks', 'first_promoter', 'native');

-- Step 4: Handle any other unknown values by setting them to a default
UPDATE public.affiliate_system_users 
SET primary_source = 'GHL'
WHERE primary_source IS NOT NULL 
AND primary_source NOT IN ('SHP', 'MN', 'GHL', 'FP');

-- Step 5: Verify all data is now valid
SELECT primary_source, COUNT(*) as count
FROM public.affiliate_system_users 
WHERE primary_source IS NOT NULL 
GROUP BY primary_source 
ORDER BY COUNT(*) DESC;

-- Step 6: Now drop and recreate the constraint with proper values
ALTER TABLE public.affiliate_system_users 
DROP CONSTRAINT IF EXISTS affiliate_system_users_primary_source_check;

-- Step 7: Add the updated constraint (simplified to just the codes we actually use)
ALTER TABLE public.affiliate_system_users 
ADD CONSTRAINT affiliate_system_users_primary_source_check 
CHECK (primary_source IN ('SHP', 'MN', 'GHL', 'FP'));

-- Step 8: Final verification
SELECT conname, pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'public.affiliate_system_users'::regclass 
AND conname LIKE '%primary_source%';

-- Step 9: Show final data distribution
SELECT primary_source, COUNT(*) as count
FROM public.affiliate_system_users 
WHERE primary_source IS NOT NULL 
GROUP BY primary_source 
ORDER BY COUNT(*) DESC; 