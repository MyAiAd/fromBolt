-- Quick fix for primary_source constraint issue
-- Run this in your database console (Supabase, Railway, etc.)

-- 1. First, check what the current constraint actually allows
SELECT conname, pg_get_constraintdef(oid) as current_constraint
FROM pg_constraint 
WHERE conrelid = 'public.affiliate_system_users'::regclass 
AND contype = 'c'
AND conname LIKE '%primary_source%';

-- 2. Check what values currently exist in the table
SELECT primary_source, COUNT(*) as count
FROM public.affiliate_system_users 
WHERE primary_source IS NOT NULL 
GROUP BY primary_source 
ORDER BY count DESC;

-- 3. Drop the existing constraint (this will allow the insert to work)
ALTER TABLE public.affiliate_system_users 
DROP CONSTRAINT IF EXISTS affiliate_system_users_primary_source_check;

-- 4. Add the correct constraint that allows all the values we need
ALTER TABLE public.affiliate_system_users 
ADD CONSTRAINT affiliate_system_users_primary_source_check 
CHECK (primary_source IN ('SHP', 'MN', 'GHL', 'FP'));

-- 5. Verify the new constraint is in place
SELECT conname, pg_get_constraintdef(oid) as new_constraint
FROM pg_constraint 
WHERE conrelid = 'public.affiliate_system_users'::regclass 
AND contype = 'c'
AND conname LIKE '%primary_source%'; 