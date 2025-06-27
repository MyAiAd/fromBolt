-- Fix GoAffPro Orders - Missing status Column

-- Add the missing status column to goaffpro_orders table
DO $$
BEGIN
    -- Check if status column exists in goaffpro_orders
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'goaffpro_orders' 
        AND column_name = 'status'
        AND table_schema = 'public'
    ) THEN
        -- Add the missing status column
        ALTER TABLE public.goaffpro_orders ADD COLUMN status text;
        RAISE NOTICE 'Added missing status column to goaffpro_orders table';
    ELSE
        RAISE NOTICE 'Status column already exists in goaffpro_orders table';
    END IF;
END $$;

-- Let's also add any other core columns that might be missing
DO $$
BEGIN
    -- Check if goaffpro_affiliate_id column exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'goaffpro_orders' 
        AND column_name = 'goaffpro_affiliate_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.goaffpro_orders ADD COLUMN goaffpro_affiliate_id text;
        RAISE NOTICE 'Added missing goaffpro_affiliate_id column to goaffpro_orders table';
    ELSE
        RAISE NOTICE 'Goaffpro_affiliate_id column already exists in goaffpro_orders table';
    END IF;

    -- Check if affiliate_id column exists (foreign key to affiliates)
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'goaffpro_orders' 
        AND column_name = 'affiliate_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.goaffpro_orders ADD COLUMN affiliate_id uuid;
        RAISE NOTICE 'Added missing affiliate_id column to goaffpro_orders table';
    ELSE
        RAISE NOTICE 'Affiliate_id column already exists in goaffpro_orders table';
    END IF;

    -- Check if raw_data column exists (stores original API response)
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'goaffpro_orders' 
        AND column_name = 'raw_data'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.goaffpro_orders ADD COLUMN raw_data jsonb;
        RAISE NOTICE 'Added missing raw_data column to goaffpro_orders table';
    ELSE
        RAISE NOTICE 'Raw_data column already exists in goaffpro_orders table';
    END IF;

    -- Check if created_at column exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'goaffpro_orders' 
        AND column_name = 'created_at'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.goaffpro_orders ADD COLUMN created_at timestamp with time zone DEFAULT now();
        RAISE NOTICE 'Added missing created_at column to goaffpro_orders table';
    ELSE
        RAISE NOTICE 'Created_at column already exists in goaffpro_orders table';
    END IF;

    -- Check if updated_at column exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'goaffpro_orders' 
        AND column_name = 'updated_at'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.goaffpro_orders ADD COLUMN updated_at timestamp with time zone DEFAULT now();
        RAISE NOTICE 'Added missing updated_at column to goaffpro_orders table';
    ELSE
        RAISE NOTICE 'Updated_at column already exists in goaffpro_orders table';
    END IF;
END $$;

-- Refresh the schema cache to ensure the new columns are recognized
SELECT pg_notify('pgrst', 'reload config');

-- Verification: Show the current structure of goaffpro_orders table
SELECT 'goaffpro_orders structure after status fix:' as message;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'goaffpro_orders' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Test if we can now insert a complete order record
INSERT INTO public.goaffpro_orders (
    goaffpro_order_id, 
    goaffpro_affiliate_id,
    order_number,
    customer_name,
    customer_email,
    order_total,
    commission_amount,
    commission_rate,
    status,
    data_source
) VALUES (
    'test_status_column', 
    'test_affiliate_123',
    'TEST-ORDER-002',
    'Test Customer',
    'test@example.com',
    100.00,
    10.00,
    10.00,
    'pending',
    'test'
) ON CONFLICT (goaffpro_order_id) DO UPDATE SET
    status = EXCLUDED.status,
    updated_at = now();

-- Clean up test record
DELETE FROM public.goaffpro_orders WHERE goaffpro_order_id = 'test_status_column';

SELECT 'GoAffPro orders status fix completed successfully!' as message; 