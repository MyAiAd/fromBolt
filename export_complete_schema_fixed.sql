-- Complete Schema Export for Production (SAFE VERSION)
-- Copy this entire script from localhost SQL editor and paste into production SQL editor
-- This will create all missing tables and handle existing ones safely

-- Add Primary Keys and Constraints ONLY if they don't exist
DO $$
BEGIN
    -- Add primary key for affiliates if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'affiliates' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE ONLY public.affiliates ADD CONSTRAINT affiliates_pkey PRIMARY KEY (id);
    END IF;
    
    -- Add primary key for users if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'users' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE ONLY public.users ADD CONSTRAINT users_pkey PRIMARY KEY (id);
    END IF;
    
    -- Add primary key for transactions if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'transactions' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE ONLY public.transactions ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);
    END IF;
END $$;

-- Create missing tables that don't exist yet
CREATE TABLE IF NOT EXISTS public.shopify_products (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    shopify_product_id text NOT NULL,
    title text NOT NULL,
    handle text,
    product_type text,
    vendor text,
    status text,
    price numeric(10,2),
    compare_at_price numeric(10,2),
    sku text,
    inventory_quantity integer,
    tags jsonb,
    images jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.shopify_webhooks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    webhook_id text,
    topic text NOT NULL,
    shop_domain text,
    payload jsonb NOT NULL,
    verified boolean DEFAULT false,
    processed boolean DEFAULT false,
    processing_error text,
    created_at timestamp with time zone DEFAULT now(),
    processed_at timestamp with time zone
);

CREATE TABLE IF NOT EXISTS public.sync_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    source text NOT NULL,
    enabled boolean DEFAULT true,
    auto_sync_interval integer DEFAULT 3600,
    last_sync_at timestamp with time zone,
    last_sync_status text,
    last_sync_error text,
    config jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT sync_settings_source_check CHECK ((source = ANY (ARRAY['goaffpro'::text, 'mightynetworks'::text, 'shopify'::text, 'jennaz'::text])))
);

CREATE TABLE IF NOT EXISTS public.data_import_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    import_type text NOT NULL,
    source text NOT NULL,
    status text NOT NULL,
    started_at timestamp with time zone DEFAULT now(),
    completed_at timestamp with time zone,
    records_processed integer DEFAULT 0,
    records_successful integer DEFAULT 0,
    records_failed integer DEFAULT 0,
    error_details jsonb,
    summary jsonb,
    triggered_by uuid,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.goaffpro_commissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    goaffpro_commission_id text NOT NULL,
    affiliate_id uuid,
    goaffpro_affiliate_id text,
    order_id text,
    commission_amount numeric(10,2),
    commission_rate numeric(5,2),
    status text,
    commission_date timestamp with time zone,
    payout_date timestamp with time zone,
    raw_data jsonb,
    last_synced timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.goaffpro_payments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    goaffpro_payment_id text NOT NULL,
    affiliate_id uuid,
    goaffpro_affiliate_id text,
    amount numeric(10,2),
    payment_method text,
    payment_date timestamp with time zone,
    status text,
    reference_number text,
    raw_data jsonb,
    last_synced timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.goaffpro_rewards (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    goaffpro_reward_id text NOT NULL,
    affiliate_id uuid,
    goaffpro_affiliate_id text,
    reward_type text,
    reward_amount numeric(10,2),
    reward_date timestamp with time zone,
    status text,
    description text,
    raw_data jsonb,
    last_synced timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.jennaz_affiliates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    jennaz_id text NOT NULL,
    contact_id text,
    email text NOT NULL,
    first_name text,
    last_name text,
    phone text,
    status text,
    date_added timestamp with time zone,
    referral_code text,
    commission_rate numeric(5,2),
    total_orders integer DEFAULT 0,
    total_sales numeric(12,2) DEFAULT 0.00,
    total_commissions numeric(12,2) DEFAULT 0.00,
    tags jsonb,
    custom_fields jsonb,
    raw_data jsonb,
    data_source text DEFAULT 'jennaz'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.jennaz_commissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    jennaz_commission_id text NOT NULL,
    affiliate_id uuid,
    jennaz_affiliate_id text,
    order_id text,
    commission_amount numeric(12,2),
    commission_rate numeric(5,2),
    status text,
    commission_date timestamp with time zone,
    payout_date timestamp with time zone,
    raw_data jsonb,
    last_synced timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.jennaz_payments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    jennaz_payment_id text NOT NULL,
    affiliate_id uuid,
    jennaz_affiliate_id text,
    amount numeric(12,2),
    payment_method text,
    payment_date timestamp with time zone,
    status text,
    reference_number text,
    raw_data jsonb,
    last_synced timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.jennaz_rewards (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    jennaz_reward_id text NOT NULL,
    affiliate_id uuid,
    jennaz_affiliate_id text,
    reward_type text,
    reward_amount numeric(12,2),
    reward_date timestamp with time zone,
    status text,
    description text,
    raw_data jsonb,
    last_synced timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.mightynetworks_affiliates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    rewardful_affiliate_id text NOT NULL,
    email text NOT NULL,
    first_name text,
    last_name text,
    status text,
    signup_date timestamp with time zone,
    referral_code text,
    referral_link text,
    commission_rate numeric(5,2),
    balance numeric(10,2) DEFAULT 0,
    total_earnings numeric(10,2) DEFAULT 0,
    total_conversions integer DEFAULT 0,
    raw_data jsonb,
    last_synced timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.mightynetworks_commissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    rewardful_commission_id text NOT NULL,
    affiliate_id uuid,
    rewardful_affiliate_id text,
    conversion_id text,
    commission_amount numeric(10,2),
    commission_rate numeric(5,2),
    status text,
    commission_date timestamp with time zone,
    payout_date timestamp with time zone,
    raw_data jsonb,
    last_synced timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.mightynetworks_import_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    import_type text NOT NULL,
    status text NOT NULL,
    started_at timestamp with time zone DEFAULT now(),
    completed_at timestamp with time zone,
    records_processed integer DEFAULT 0,
    records_successful integer DEFAULT 0,
    records_failed integer DEFAULT 0,
    error_details jsonb,
    summary jsonb,
    triggered_by uuid,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.mightynetworks_payouts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    rewardful_payout_id text NOT NULL,
    affiliate_id uuid,
    rewardful_affiliate_id text,
    amount numeric(10,2),
    payment_method text,
    payment_date timestamp with time zone,
    status text,
    reference_number text,
    raw_data jsonb,
    last_synced timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.mightynetworks_referrals (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    rewardful_referral_id text NOT NULL,
    affiliate_id uuid,
    rewardful_affiliate_id text,
    customer_email text,
    conversion_amount numeric(10,2),
    conversion_date timestamp with time zone,
    status text,
    product_name text,
    raw_data jsonb,
    last_synced timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Add Primary Keys and Unique Constraints for new tables ONLY
DO $$
BEGIN
    -- Shopify Products
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'shopify_products' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE ONLY public.shopify_products ADD CONSTRAINT shopify_products_pkey PRIMARY KEY (id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'shopify_products' AND constraint_name = 'shopify_products_shopify_product_id_key') THEN
        ALTER TABLE ONLY public.shopify_products ADD CONSTRAINT shopify_products_shopify_product_id_key UNIQUE (shopify_product_id);
    END IF;

    -- Shopify Webhooks
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'shopify_webhooks' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE ONLY public.shopify_webhooks ADD CONSTRAINT shopify_webhooks_pkey PRIMARY KEY (id);
    END IF;

    -- Sync Settings
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'sync_settings' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE ONLY public.sync_settings ADD CONSTRAINT sync_settings_pkey PRIMARY KEY (id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'sync_settings' AND constraint_name = 'sync_settings_source_key') THEN
        ALTER TABLE ONLY public.sync_settings ADD CONSTRAINT sync_settings_source_key UNIQUE (source);
    END IF;

    -- Data Import Logs
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'data_import_logs' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE ONLY public.data_import_logs ADD CONSTRAINT data_import_logs_pkey PRIMARY KEY (id);
    END IF;

    -- GoAffPro tables
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'goaffpro_commissions' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE ONLY public.goaffpro_commissions ADD CONSTRAINT goaffpro_commissions_pkey PRIMARY KEY (id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'goaffpro_commissions' AND constraint_name = 'goaffpro_commissions_goaffpro_commission_id_key') THEN
        ALTER TABLE ONLY public.goaffpro_commissions ADD CONSTRAINT goaffpro_commissions_goaffpro_commission_id_key UNIQUE (goaffpro_commission_id);
    END IF;

    -- Continue with other tables...
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'goaffpro_payments' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE ONLY public.goaffpro_payments ADD CONSTRAINT goaffpro_payments_pkey PRIMARY KEY (id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'goaffpro_rewards' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE ONLY public.goaffpro_rewards ADD CONSTRAINT goaffpro_rewards_pkey PRIMARY KEY (id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'jennaz_affiliates' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE ONLY public.jennaz_affiliates ADD CONSTRAINT jennaz_affiliates_pkey PRIMARY KEY (id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'jennaz_commissions' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE ONLY public.jennaz_commissions ADD CONSTRAINT jennaz_commissions_pkey PRIMARY KEY (id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'jennaz_payments' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE ONLY public.jennaz_payments ADD CONSTRAINT jennaz_payments_pkey PRIMARY KEY (id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'jennaz_rewards' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE ONLY public.jennaz_rewards ADD CONSTRAINT jennaz_rewards_pkey PRIMARY KEY (id);
    END IF;

    -- MightyNetworks tables
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'mightynetworks_affiliates' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE ONLY public.mightynetworks_affiliates ADD CONSTRAINT mightynetworks_affiliates_pkey PRIMARY KEY (id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'mightynetworks_commissions' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE ONLY public.mightynetworks_commissions ADD CONSTRAINT mightynetworks_commissions_pkey PRIMARY KEY (id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'mightynetworks_import_logs' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE ONLY public.mightynetworks_import_logs ADD CONSTRAINT mightynetworks_import_logs_pkey PRIMARY KEY (id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'mightynetworks_payouts' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE ONLY public.mightynetworks_payouts ADD CONSTRAINT mightynetworks_payouts_pkey PRIMARY KEY (id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'mightynetworks_referrals' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE ONLY public.mightynetworks_referrals ADD CONSTRAINT mightynetworks_referrals_pkey PRIMARY KEY (id);
    END IF;
END $$;

-- Enable Row Level Security for new tables
DO $$
BEGIN
    -- Only enable RLS if not already enabled
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid 
                   WHERE n.nspname = 'public' AND c.relname = 'shopify_products' AND c.relrowsecurity) THEN
        ALTER TABLE public.shopify_products ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid 
                   WHERE n.nspname = 'public' AND c.relname = 'shopify_webhooks' AND c.relrowsecurity) THEN
        ALTER TABLE public.shopify_webhooks ENABLE ROW LEVEL SECURITY;
    END IF;

    -- Continue for other tables...
END $$;

-- Final verification query - run this to confirm all tables are created:
SELECT 
  count(*) as total_tables,
  array_agg(table_name ORDER BY table_name) as table_list
FROM information_schema.tables 
WHERE table_schema = 'public'; 