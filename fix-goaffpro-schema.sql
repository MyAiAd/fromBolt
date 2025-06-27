-- Fix GoAffPro Import Issues - Missing Phone Column and RLS Problems

-- First, let's check if the phone column exists
DO $$
BEGIN
    -- Check if phone column exists in goaffpro_affiliates
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'goaffpro_affiliates' 
        AND column_name = 'phone'
        AND table_schema = 'public'
    ) THEN
        -- Add the missing phone column
        ALTER TABLE public.goaffpro_affiliates ADD COLUMN phone text;
        RAISE NOTICE 'Added missing phone column to goaffpro_affiliates table';
    ELSE
        RAISE NOTICE 'Phone column already exists in goaffpro_affiliates table';
    END IF;
END $$;

-- Check if data_source column exists and add if missing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'goaffpro_affiliates' 
        AND column_name = 'data_source'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.goaffpro_affiliates ADD COLUMN data_source text DEFAULT 'goaffpro'::text;
        ALTER TABLE public.goaffpro_affiliates ADD CONSTRAINT goaffpro_affiliates_data_source_check 
            CHECK ((data_source = ANY (ARRAY['test'::text, 'goaffpro'::text])));
        RAISE NOTICE 'Added missing data_source column to goaffpro_affiliates table';
    ELSE
        RAISE NOTICE 'Data_source column already exists in goaffpro_affiliates table';
    END IF;
END $$;

-- Fix RLS policies for goaffpro_affiliates
DROP POLICY IF EXISTS "Users can view goaffpro_affiliates" ON public.goaffpro_affiliates;
DROP POLICY IF EXISTS "Users can insert goaffpro_affiliates" ON public.goaffpro_affiliates;
DROP POLICY IF EXISTS "Users can update goaffpro_affiliates" ON public.goaffpro_affiliates;

-- Create proper RLS policies for goaffpro_affiliates
CREATE POLICY "Enable all access for authenticated users"
    ON public.goaffpro_affiliates
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Fix RLS policies for goaffpro_orders
DROP POLICY IF EXISTS "Users can view goaffpro_orders" ON public.goaffpro_orders;
DROP POLICY IF EXISTS "Users can insert goaffpro_orders" ON public.goaffpro_orders;
DROP POLICY IF EXISTS "Users can update goaffpro_orders" ON public.goaffpro_orders;

CREATE POLICY "Enable all access for authenticated users"
    ON public.goaffpro_orders
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Fix RLS policies for goaffpro_commissions
DROP POLICY IF EXISTS "Users can view goaffpro_commissions" ON public.goaffpro_commissions;
DROP POLICY IF EXISTS "Users can insert goaffpro_commissions" ON public.goaffpro_commissions;
DROP POLICY IF EXISTS "Users can update goaffpro_commissions" ON public.goaffpro_commissions;

CREATE POLICY "Enable all access for authenticated users"
    ON public.goaffpro_commissions
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Fix RLS policies for goaffpro_rewards
DROP POLICY IF EXISTS "Users can view goaffpro_rewards" ON public.goaffpro_rewards;
DROP POLICY IF EXISTS "Users can insert goaffpro_rewards" ON public.goaffpro_rewards;
DROP POLICY IF EXISTS "Users can update goaffpro_rewards" ON public.goaffpro_rewards;

CREATE POLICY "Enable all access for authenticated users"
    ON public.goaffpro_rewards
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Fix RLS policies for data_import_logs (used by the import service)
DROP POLICY IF EXISTS "Users can view data_import_logs" ON public.data_import_logs;
DROP POLICY IF EXISTS "Users can insert data_import_logs" ON public.data_import_logs;
DROP POLICY IF EXISTS "Users can update data_import_logs" ON public.data_import_logs;

CREATE POLICY "Enable all access for authenticated users"
    ON public.data_import_logs
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Ensure all GoAffPro tables have RLS enabled
ALTER TABLE public.goaffpro_affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goaffpro_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goaffpro_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goaffpro_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_import_logs ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions to authenticated users
GRANT ALL ON public.goaffpro_affiliates TO authenticated;
GRANT ALL ON public.goaffpro_orders TO authenticated;
GRANT ALL ON public.goaffpro_commissions TO authenticated;
GRANT ALL ON public.goaffpro_rewards TO authenticated;
GRANT ALL ON public.data_import_logs TO authenticated;

-- Grant permissions to service_role (used by import service)
GRANT ALL ON public.goaffpro_affiliates TO service_role;
GRANT ALL ON public.goaffpro_orders TO service_role;
GRANT ALL ON public.goaffpro_commissions TO service_role;
GRANT ALL ON public.goaffpro_rewards TO service_role;
GRANT ALL ON public.data_import_logs TO service_role;

-- Refresh the schema cache to ensure the new column is recognized
SELECT pg_notify('pgrst', 'reload config');

-- Verification queries
SELECT 'goaffpro_affiliates structure:' as message;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'goaffpro_affiliates' 
AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'RLS policies for goaffpro_affiliates:' as message;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'goaffpro_affiliates';

-- Test if we can insert a record with phone column
INSERT INTO public.goaffpro_affiliates (
    goaffpro_id, 
    email, 
    first_name, 
    last_name, 
    phone, 
    data_source
) VALUES (
    'test_phone_column', 
    'test@example.com', 
    'Test', 
    'User', 
    '+1-555-0123', 
    'test'
) ON CONFLICT (goaffpro_id) DO UPDATE SET
    phone = EXCLUDED.phone,
    updated_at = now();

-- Clean up test record
DELETE FROM public.goaffpro_affiliates WHERE goaffpro_id = 'test_phone_column';

SELECT 'Schema fix completed successfully!' as message; 