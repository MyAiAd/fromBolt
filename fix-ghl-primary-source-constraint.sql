-- Fix primary_source constraint to allow 'ghl' value
-- This resolves the error: "violates check constraint 'affiliate_system_users_primary_source_check'"

-- First, let's see the current constraint
SELECT conname, consrc 
FROM pg_constraint 
WHERE conrelid = 'public.affiliate_system_users'::regclass 
AND conname LIKE '%primary_source%';

-- Drop the existing constraint
ALTER TABLE public.affiliate_system_users 
DROP CONSTRAINT IF EXISTS affiliate_system_users_primary_source_check;

-- Add the updated constraint that includes 'ghl'
ALTER TABLE public.affiliate_system_users 
ADD CONSTRAINT affiliate_system_users_primary_source_check 
CHECK (primary_source IN ('goaffpro', 'mightynetworks', 'native', 'ghl', 'first_promoter', 'SHP', 'MN', 'GHL', 'FP'));

-- Verify the constraint was added
SELECT conname, consrc 
FROM pg_constraint 
WHERE conrelid = 'public.affiliate_system_users'::regclass 
AND conname LIKE '%primary_source%';

-- Also check current data to see what values exist
SELECT primary_source, COUNT(*) 
FROM public.affiliate_system_users 
WHERE primary_source IS NOT NULL 
GROUP BY primary_source 
ORDER BY COUNT(*) DESC; 