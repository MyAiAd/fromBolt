-- Fix GoAffPro Orders - Missing customer_name Column

-- Add the missing customer_name column to goaffpro_orders table
DO $$
BEGIN
    -- Check if customer_name column exists in goaffpro_orders
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'goaffpro_orders' 
        AND column_name = 'customer_name'
        AND table_schema = 'public'
    ) THEN
        -- Add the missing customer_name column
        ALTER TABLE public.goaffpro_orders ADD COLUMN customer_name text;
        RAISE NOTICE 'Added missing customer_name column to goaffpro_orders table';
    ELSE
        RAISE NOTICE 'Customer_name column already exists in goaffpro_orders table';
    END IF;
END $$;

-- Let's also check for other potentially missing columns from the expected schema
DO $$
BEGIN
    -- Check if customer_email column exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'goaffpro_orders' 
        AND column_name = 'customer_email'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.goaffpro_orders ADD COLUMN customer_email text;
        RAISE NOTICE 'Added missing customer_email column to goaffpro_orders table';
    ELSE
        RAISE NOTICE 'Customer_email column already exists in goaffpro_orders table';
    END IF;

    -- Check if order_number column exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'goaffpro_orders' 
        AND column_name = 'order_number'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.goaffpro_orders ADD COLUMN order_number text;
        RAISE NOTICE 'Added missing order_number column to goaffpro_orders table';
    ELSE
        RAISE NOTICE 'Order_number column already exists in goaffpro_orders table';
    END IF;

    -- Check if order_total column exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'goaffpro_orders' 
        AND column_name = 'order_total'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.goaffpro_orders ADD COLUMN order_total numeric(10,2);
        RAISE NOTICE 'Added missing order_total column to goaffpro_orders table';
    ELSE
        RAISE NOTICE 'Order_total column already exists in goaffpro_orders table';
    END IF;

    -- Check if commission_amount column exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'goaffpro_orders' 
        AND column_name = 'commission_amount'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.goaffpro_orders ADD COLUMN commission_amount numeric(10,2);
        RAISE NOTICE 'Added missing commission_amount column to goaffpro_orders table';
    ELSE
        RAISE NOTICE 'Commission_amount column already exists in goaffpro_orders table';
    END IF;

    -- Check if order_date column exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'goaffpro_orders' 
        AND column_name = 'order_date'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.goaffpro_orders ADD COLUMN order_date timestamp with time zone;
        RAISE NOTICE 'Added missing order_date column to goaffpro_orders table';
    ELSE
        RAISE NOTICE 'Order_date column already exists in goaffpro_orders table';
    END IF;

    -- Check if commission_status column exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'goaffpro_orders' 
        AND column_name = 'commission_status'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.goaffpro_orders ADD COLUMN commission_status text;
        RAISE NOTICE 'Added missing commission_status column to goaffpro_orders table';
    ELSE
        RAISE NOTICE 'Commission_status column already exists in goaffpro_orders table';
    END IF;

    -- Check if products column exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'goaffpro_orders' 
        AND column_name = 'products'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.goaffpro_orders ADD COLUMN products jsonb;
        RAISE NOTICE 'Added missing products column to goaffpro_orders table';
    ELSE
        RAISE NOTICE 'Products column already exists in goaffpro_orders table';
    END IF;
END $$;

-- Refresh the schema cache to ensure the new columns are recognized
SELECT pg_notify('pgrst', 'reload config');

-- Verification: Show the current structure of goaffpro_orders table
SELECT 'goaffpro_orders structure after customer_name fix:' as message;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'goaffpro_orders' 
AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'GoAffPro orders customer_name fix completed successfully!' as message; 