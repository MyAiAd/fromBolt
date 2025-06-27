-- Complete Schema Export for Production
-- Copy this entire script from localhost SQL editor and paste into production SQL editor
-- This will create all missing tables to match localhost exactly

-- First, let's see what tables we have and what we're missing
-- Run this query first to see the current state:

/*
SELECT 
  t.table_name,
  CASE 
    WHEN t.table_name IN (
      'affiliate_import_logs', 'affiliate_system_users', 'ai_api_keys', 'ai_config',
      'clicks', 'commission_plans', 'commissions', 'data_sync_logs', 'ghl_affiliates',
      'goaffpro_affiliates', 'goaffpro_commissions', 'goaffpro_orders', 'goaffpro_payments', 
      'goaffpro_rewards', 'jennaz_affiliates', 'jennaz_commissions', 'jennaz_orders',
      'jennaz_payments', 'jennaz_rewards', 'mightynetworks_affiliates', 'mightynetworks_commissions',
      'mightynetworks_import_logs', 'mightynetworks_payouts', 'mightynetworks_referrals',
      'multi_level_commissions', 'payouts', 'referral_relationships', 'shopify_order_items',
      'shopify_orders', 'shopify_products', 'shopify_webhooks', 'sync_settings',
      'team_statistics', 'transactions', 'users', 'affiliates', 'data_import_logs'
    ) THEN 'SHOULD EXIST'
    ELSE 'EXTRA'
  END as status
FROM information_schema.tables t
WHERE t.table_schema = 'public'
ORDER BY t.table_name;
*/

-- Now create all missing tables:

-- Table: affiliates
CREATE TABLE IF NOT EXISTS public.affiliates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    referrer_id uuid NOT NULL,
    affiliate_id uuid NOT NULL,
    level integer NOT NULL,
    commission_rate numeric(5,2) DEFAULT 10.00 NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    data_source text DEFAULT 'test'::text,
    CONSTRAINT affiliates_data_source_check CHECK ((data_source = ANY (ARRAY['test'::text, 'goaffpro'::text]))),
    CONSTRAINT affiliates_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'active'::text, 'inactive'::text])))
);

-- Table: users
CREATE TABLE IF NOT EXISTS public.users (
    id uuid NOT NULL,
    email text NOT NULL,
    name text,
    referral_code text,
    profile_image_url text,
    bio text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    is_admin boolean DEFAULT false,
    data_source text DEFAULT 'test'::text,
    CONSTRAINT users_data_source_check CHECK ((data_source = ANY (ARRAY['test'::text, 'goaffpro'::text])))
);

-- Table: transactions
CREATE TABLE IF NOT EXISTS public.transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    transaction_ref text NOT NULL,
    affiliate_id uuid,
    customer_email text NOT NULL,
    amount numeric(10,2) NOT NULL,
    product_name text NOT NULL,
    product_id text,
    status text DEFAULT 'completed'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    data_source text DEFAULT 'test'::text,
    CONSTRAINT transactions_data_source_check CHECK ((data_source = ANY (ARRAY['test'::text, 'goaffpro'::text]))),
    CONSTRAINT transactions_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'completed'::text, 'refunded'::text])))
);

-- Table: shopify_products
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

-- Table: shopify_webhooks
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

-- Table: sync_settings
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

-- Table: data_import_logs
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

-- Table: goaffpro_commissions
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

-- Table: goaffpro_payments
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

-- Table: goaffpro_rewards
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

-- Table: jennaz_affiliates
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

-- Table: jennaz_commissions
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

-- Table: jennaz_payments
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

-- Table: jennaz_rewards
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

-- Table: mightynetworks_affiliates
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

-- Table: mightynetworks_commissions
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

-- Table: mightynetworks_import_logs
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

-- Table: mightynetworks_payouts
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

-- Table: mightynetworks_referrals
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

-- Add Primary Keys and Constraints
ALTER TABLE ONLY public.affiliates ADD CONSTRAINT affiliates_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.transactions ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.shopify_products ADD CONSTRAINT shopify_products_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.shopify_webhooks ADD CONSTRAINT shopify_webhooks_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.sync_settings ADD CONSTRAINT sync_settings_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.data_import_logs ADD CONSTRAINT data_import_logs_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.goaffpro_commissions ADD CONSTRAINT goaffpro_commissions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.goaffpro_payments ADD CONSTRAINT goaffpro_payments_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.goaffpro_rewards ADD CONSTRAINT goaffpro_rewards_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.jennaz_affiliates ADD CONSTRAINT jennaz_affiliates_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.jennaz_commissions ADD CONSTRAINT jennaz_commissions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.jennaz_payments ADD CONSTRAINT jennaz_payments_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.jennaz_rewards ADD CONSTRAINT jennaz_rewards_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.mightynetworks_affiliates ADD CONSTRAINT mightynetworks_affiliates_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.mightynetworks_commissions ADD CONSTRAINT mightynetworks_commissions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.mightynetworks_import_logs ADD CONSTRAINT mightynetworks_import_logs_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.mightynetworks_payouts ADD CONSTRAINT mightynetworks_payouts_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.mightynetworks_referrals ADD CONSTRAINT mightynetworks_referrals_pkey PRIMARY KEY (id);

-- Add Unique Constraints
ALTER TABLE ONLY public.users ADD CONSTRAINT users_email_key UNIQUE (email);
ALTER TABLE ONLY public.users ADD CONSTRAINT users_referral_code_key UNIQUE (referral_code);
ALTER TABLE ONLY public.transactions ADD CONSTRAINT transactions_transaction_ref_key UNIQUE (transaction_ref);
ALTER TABLE ONLY public.shopify_products ADD CONSTRAINT shopify_products_shopify_product_id_key UNIQUE (shopify_product_id);
ALTER TABLE ONLY public.sync_settings ADD CONSTRAINT sync_settings_source_key UNIQUE (source);
ALTER TABLE ONLY public.goaffpro_commissions ADD CONSTRAINT goaffpro_commissions_goaffpro_commission_id_key UNIQUE (goaffpro_commission_id);
ALTER TABLE ONLY public.goaffpro_payments ADD CONSTRAINT goaffpro_payments_goaffpro_payment_id_key UNIQUE (goaffpro_payment_id);
ALTER TABLE ONLY public.goaffpro_rewards ADD CONSTRAINT goaffpro_rewards_goaffpro_reward_id_key UNIQUE (goaffpro_reward_id);
ALTER TABLE ONLY public.jennaz_affiliates ADD CONSTRAINT jennaz_affiliates_jennaz_id_key UNIQUE (jennaz_id);
ALTER TABLE ONLY public.jennaz_commissions ADD CONSTRAINT jennaz_commissions_jennaz_commission_id_key UNIQUE (jennaz_commission_id);
ALTER TABLE ONLY public.jennaz_payments ADD CONSTRAINT jennaz_payments_jennaz_payment_id_key UNIQUE (jennaz_payment_id);
ALTER TABLE ONLY public.jennaz_rewards ADD CONSTRAINT jennaz_rewards_jennaz_reward_id_key UNIQUE (jennaz_reward_id);
ALTER TABLE ONLY public.mightynetworks_affiliates ADD CONSTRAINT mightynetworks_affiliates_rewardful_affiliate_id_key UNIQUE (rewardful_affiliate_id);
ALTER TABLE ONLY public.mightynetworks_commissions ADD CONSTRAINT mightynetworks_commissions_rewardful_commission_id_key UNIQUE (rewardful_commission_id);
ALTER TABLE ONLY public.mightynetworks_payouts ADD CONSTRAINT mightynetworks_payouts_rewardful_payout_id_key UNIQUE (rewardful_payout_id);
ALTER TABLE ONLY public.mightynetworks_referrals ADD CONSTRAINT mightynetworks_referrals_rewardful_referral_id_key UNIQUE (rewardful_referral_id);
ALTER TABLE ONLY public.affiliates ADD CONSTRAINT affiliates_referrer_id_affiliate_id_key UNIQUE (referrer_id, affiliate_id);

-- Enable Row Level Security
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopify_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopify_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_import_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goaffpro_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goaffpro_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goaffpro_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jennaz_affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jennaz_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jennaz_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jennaz_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mightynetworks_affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mightynetworks_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mightynetworks_import_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mightynetworks_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mightynetworks_referrals ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for admin access
CREATE POLICY "Admins can manage all data" ON public.affiliates FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM auth.users WHERE auth.uid() = auth.users.id AND auth.users.raw_user_meta_data->>'is_admin' = 'true')
);

CREATE POLICY "Admins can manage all data" ON public.users FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM auth.users WHERE auth.uid() = auth.users.id AND auth.users.raw_user_meta_data->>'is_admin' = 'true')
);

CREATE POLICY "Admins can manage all data" ON public.transactions FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM auth.users WHERE auth.uid() = auth.users.id AND auth.users.raw_user_meta_data->>'is_admin' = 'true')
);

-- Add updated_at triggers for tables that have updated_at columns
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'updated_at') THEN
    CREATE TRIGGER set_users_updated_at
      BEFORE UPDATE ON public.users
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliates' AND column_name = 'updated_at') THEN
    CREATE TRIGGER set_affiliates_updated_at
      BEFORE UPDATE ON public.affiliates
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Final verification query - run this to confirm all tables are created:
/*
SELECT 
  count(*) as total_tables,
  array_agg(table_name ORDER BY table_name) as table_list
FROM information_schema.tables 
WHERE table_schema = 'public';
*/ 