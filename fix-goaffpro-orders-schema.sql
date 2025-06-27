-- Fix GoAffPro Orders - Missing commission_rate Column

-- Add the missing commission_rate column to goaffpro_orders table
DO $$
BEGIN
    -- Check if commission_rate column exists in goaffpro_orders
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'goaffpro_orders' 
        AND column_name = 'commission_rate'
        AND table_schema = 'public'
    ) THEN
        -- Add the missing commission_rate column
        ALTER TABLE public.goaffpro_orders ADD COLUMN commission_rate numeric(5,2);
        RAISE NOTICE 'Added missing commission_rate column to goaffpro_orders table';
    ELSE
        RAISE NOTICE 'Commission_rate column already exists in goaffpro_orders table';
    END IF;
END $$;

-- Also check and add other potentially missing columns that are in the schema
DO $$
BEGIN
    -- Check if data_source column exists in goaffpro_orders
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'goaffpro_orders' 
        AND column_name = 'data_source'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.goaffpro_orders ADD COLUMN data_source text DEFAULT 'goaffpro'::text;
        ALTER TABLE public.goaffpro_orders ADD CONSTRAINT goaffpro_orders_data_source_check 
            CHECK ((data_source = ANY (ARRAY['test'::text, 'goaffpro'::text])));
        RAISE NOTICE 'Added missing data_source column to goaffpro_orders table';
    ELSE
        RAISE NOTICE 'Data_source column already exists in goaffpro_orders table';
    END IF;
END $$;

-- Add missing unique constraint on goaffpro_order_id (required for upsert operations)
DO $$
BEGIN
    -- Check if unique constraint exists on goaffpro_order_id
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name = 'goaffpro_orders'
        AND tc.constraint_type = 'UNIQUE'
        AND kcu.column_name = 'goaffpro_order_id'
        AND tc.table_schema = 'public'
    ) THEN
        -- Add unique constraint on goaffpro_order_id
        ALTER TABLE public.goaffpro_orders ADD CONSTRAINT goaffpro_orders_goaffpro_order_id_unique UNIQUE (goaffpro_order_id);
        RAISE NOTICE 'Added unique constraint on goaffpro_order_id column';
    ELSE
        RAISE NOTICE 'Unique constraint on goaffpro_order_id already exists';
    END IF;
END $$;

-- Add primary key if missing
DO $$
BEGIN
    -- Check if primary key exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE table_name = 'goaffpro_orders'
        AND constraint_type = 'PRIMARY KEY'
        AND table_schema = 'public'
    ) THEN
        -- Add primary key on id column
        ALTER TABLE public.goaffpro_orders ADD CONSTRAINT goaffpro_orders_pkey PRIMARY KEY (id);
        RAISE NOTICE 'Added primary key constraint on id column';
    ELSE
        RAISE NOTICE 'Primary key constraint already exists';
    END IF;
END $$;

-- Refresh the schema cache to ensure the new column is recognized
SELECT pg_notify('pgrst', 'reload config');

-- Verification: Show the current structure of goaffpro_orders table
SELECT 'goaffpro_orders structure after fix:' as message;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'goaffpro_orders' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show constraints
SELECT 'goaffpro_orders constraints:' as message;
SELECT tc.constraint_name, tc.constraint_type, kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'goaffpro_orders' 
AND tc.table_schema = 'public'
ORDER BY tc.constraint_type, tc.constraint_name;

-- Test if we can insert a record with commission_rate column (now with proper unique constraint)
INSERT INTO public.goaffpro_orders (
    goaffpro_order_id, 
    order_number, 
    customer_email, 
    commission_rate, 
    data_source
) VALUES (
    'test_commission_rate_column', 
    'TEST-ORDER-001', 
    'test@example.com', 
    5.00, 
    'test'
) ON CONFLICT (goaffpro_order_id) DO UPDATE SET
    commission_rate = EXCLUDED.commission_rate,
    updated_at = now();

-- Clean up test record
DELETE FROM public.goaffpro_orders WHERE goaffpro_order_id = 'test_commission_rate_column';

SELECT 'GoAffPro orders schema fix completed successfully!' as message; 