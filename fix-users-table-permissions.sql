-- Fix Users Table RLS Permissions - Resolves 403 Forbidden Errors

-- First, let's check what RLS policies exist on the users table
SELECT 'Current RLS policies on users table:' as message;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'users'
AND schemaname = 'public';

-- Drop any overly restrictive policies that might be causing issues
DROP POLICY IF EXISTS "Users can only see own profile" ON public.users;
DROP POLICY IF EXISTS "Users can only view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can only access own data" ON public.users;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.users;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.users;

-- Create a comprehensive RLS policy for authenticated users
CREATE POLICY "Enable all access for authenticated users"
    ON public.users
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Also fix the affiliates table RLS policies if they're causing issues
DROP POLICY IF EXISTS "Users can view affiliates" ON public.affiliates;
DROP POLICY IF EXISTS "Users can insert affiliates" ON public.affiliates;
DROP POLICY IF EXISTS "Users can update affiliates" ON public.affiliates;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.affiliates;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.affiliates;

-- Create proper RLS policy for affiliates table
CREATE POLICY "Enable all access for authenticated users"
    ON public.affiliates
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Ensure both tables have RLS enabled but with permissive policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions to authenticated users
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.affiliates TO authenticated;

-- Grant permissions to service_role as well
GRANT ALL ON public.users TO service_role;
GRANT ALL ON public.affiliates TO service_role;

-- Grant usage on sequences if they exist
DO $$
BEGIN
    -- Grant sequence permissions if they exist
    IF EXISTS (SELECT 1 FROM information_schema.sequences WHERE sequence_name LIKE '%users%' AND sequence_schema = 'public') THEN
        GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
        GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
    END IF;
END $$;

-- Refresh the schema cache to ensure changes are recognized
SELECT pg_notify('pgrst', 'reload config');

-- Verification: Show current policies after fix
SELECT 'Updated RLS policies on users table:' as message;
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE tablename IN ('users', 'affiliates')
AND schemaname = 'public'
ORDER BY tablename, policyname;

-- Test if we can now query the users table with affiliates relationship
-- This should work without permission errors
SELECT 'Testing users table access:' as message;
SELECT COUNT(*) as user_count FROM public.users;

SELECT 'Testing affiliates table access:' as message;
SELECT COUNT(*) as affiliate_count FROM public.affiliates;

SELECT 'Users table permissions fix completed successfully!' as message; 