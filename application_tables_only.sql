-- JennaZ Affiliate Platform - Application Tables Only
-- Core application tables for production deployment
-- Generated: 2025-06-17T06:34:07.470Z

-- Basic settings
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

CREATE TABLE public.affiliate_import_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    import_source text NOT NULL,
    import_type text NOT NULL,
    status text NOT NULL,
    started_by uuid,
    started_at timestamp with time zone DEFAULT now(),
    completed_at timestamp with time zone,
    records_processed integer DEFAULT 0,
    records_successful integer DEFAULT 0,
    records_failed integer DEFAULT 0,
    records_updated integer DEFAULT 0,
    error_details jsonb,
    warnings jsonb,
    import_config jsonb,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT affiliate_import_logs_import_source_check CHECK ((import_source = ANY (ARRAY['ghl'::text, 'mightynetworks'::text, 'shopify'::text, 'goaffpro'::text, 'manual'::text]))),
    CONSTRAINT affiliate_import_logs_import_type_check CHECK ((import_type = ANY (ARRAY['affiliates'::text, 'orders'::text, 'full_sync'::text]))),
    CONSTRAINT affiliate_import_logs_status_check CHECK ((status = ANY (ARRAY['started'::text, 'completed'::text, 'failed'::text, 'partial'::text])))
);

ALTER TABLE public.affiliate_import_logs OWNER TO postgres;
CREATE TABLE public.affiliate_system_users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    first_name text,
    last_name text,
    phone text,
    referral_code text,
    primary_source text NOT NULL,
    ghl_contact_id text,
    mighty_member_id text,
    goaffpro_affiliate_id text,
    shopify_customer_id text,
    status text DEFAULT 'active'::text,
    signup_date timestamp with time zone,
    last_active timestamp with time zone,
    total_l1_affiliates integer DEFAULT 0,
    total_l2_affiliates integer DEFAULT 0,
    total_l3_affiliates integer DEFAULT 0,
    total_team_size integer DEFAULT 0,
    total_l1_earnings numeric(10,2) DEFAULT 0,
    total_l2_earnings numeric(10,2) DEFAULT 0,
    total_l3_earnings numeric(10,2) DEFAULT 0,
    total_earnings numeric(10,2) DEFAULT 0,
    pending_earnings numeric(10,2) DEFAULT 0,
    paid_earnings numeric(10,2) DEFAULT 0,
    payout_email text,
    payment_method text,
    notes text,
    custom_fields jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT affiliate_system_users_primary_source_check CHECK ((primary_source = ANY (ARRAY['ghl'::text, 'mightynetworks'::text, 'shopify'::text, 'goaffpro'::text, 'manual'::text]))),
    CONSTRAINT affiliate_system_users_status_check CHECK ((status = ANY (ARRAY['active'::text, 'inactive'::text, 'suspended'::text, 'pending'::text])))
);

ALTER TABLE public.affiliate_system_users OWNER TO postgres;
CREATE TABLE public.affiliates (
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

ALTER TABLE public.affiliates OWNER TO postgres;
CREATE TABLE public.clicks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    affiliate_id uuid NOT NULL,
    referral_code text NOT NULL,
    ip_address text,
    user_agent text,
    conversion_status text DEFAULT 'clicked'::text,
    created_at timestamp with time zone DEFAULT now(),
    data_source text DEFAULT 'test'::text,
    CONSTRAINT clicks_conversion_status_check CHECK ((conversion_status = ANY (ARRAY['clicked'::text, 'converted'::text]))),
    CONSTRAINT clicks_data_source_check CHECK ((data_source = ANY (ARRAY['test'::text, 'goaffpro'::text])))
);

ALTER TABLE public.clicks OWNER TO postgres;
CREATE TABLE public.goaffpro_affiliates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    goaffpro_id text NOT NULL,
    email text NOT NULL,
    first_name text,
    last_name text,
    phone text,
    address jsonb,
    status text,
    signup_date timestamp with time zone,
    referral_code text,
    commission_rate numeric(5,2),
    balance numeric(10,2) DEFAULT 0,
    total_earnings numeric(10,2) DEFAULT 0,
    total_orders integer DEFAULT 0,
    tags jsonb,
    custom_fields jsonb,
    raw_data jsonb,
    data_source text DEFAULT 'goaffpro'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT goaffpro_affiliates_data_source_check CHECK ((data_source = ANY (ARRAY['test'::text, 'goaffpro'::text])))
);

ALTER TABLE public.goaffpro_affiliates OWNER TO postgres;
CREATE TABLE public.goaffpro_commissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    goaffpro_commission_id text NOT NULL,
    goaffpro_affiliate_id text,
    goaffpro_order_id text,
    affiliate_id uuid,
    order_id uuid,
    commission_amount numeric(10,2),
    commission_rate numeric(5,2),
    status text,
    date_earned timestamp with time zone,
    date_paid timestamp with time zone,
    raw_data jsonb,
    data_source text DEFAULT 'goaffpro'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT goaffpro_commissions_data_source_check CHECK ((data_source = ANY (ARRAY['test'::text, 'goaffpro'::text])))
);

ALTER TABLE public.goaffpro_commissions OWNER TO postgres;
CREATE TABLE public.goaffpro_orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    goaffpro_order_id text NOT NULL,
    goaffpro_affiliate_id text,
    affiliate_id uuid,
    order_number text,
    customer_email text,
    customer_name text,
    order_total numeric(10,2),
    commission_amount numeric(10,2),
    commission_rate numeric(5,2),
    status text,
    order_date timestamp with time zone,
    commission_status text,
    products jsonb,
    raw_data jsonb,
    data_source text DEFAULT 'goaffpro'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT goaffpro_orders_data_source_check CHECK ((data_source = ANY (ARRAY['test'::text, 'goaffpro'::text])))
);

ALTER TABLE public.goaffpro_orders OWNER TO postgres;
CREATE TABLE public.goaffpro_payments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    goaffpro_payment_id text NOT NULL,
    goaffpro_affiliate_id text,
    affiliate_id uuid,
    amount numeric(10,2),
    payment_method text,
    payment_date timestamp with time zone,
    status text,
    transaction_id text,
    notes text,
    raw_data jsonb,
    data_source text DEFAULT 'goaffpro'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT goaffpro_payments_data_source_check CHECK ((data_source = ANY (ARRAY['test'::text, 'goaffpro'::text])))
);

ALTER TABLE public.goaffpro_payments OWNER TO postgres;
CREATE TABLE public.goaffpro_rewards (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    goaffpro_reward_id text NOT NULL,
    goaffpro_affiliate_id text,
    affiliate_id uuid,
    reward_type text,
    amount numeric(10,2),
    description text,
    status text,
    date_awarded timestamp with time zone,
    raw_data jsonb,
    data_source text DEFAULT 'goaffpro'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT goaffpro_rewards_data_source_check CHECK ((data_source = ANY (ARRAY['test'::text, 'goaffpro'::text])))
);

ALTER TABLE public.goaffpro_rewards OWNER TO postgres;
CREATE TABLE public.jennaz_affiliates (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    jennaz_id text NOT NULL,
    email text NOT NULL,
    first_name text,
    last_name text,
    phone text,
    status text DEFAULT 'pending'::text,
    referral_code text,
    commission_rate numeric(5,2) DEFAULT 0.00,
    balance numeric(12,2) DEFAULT 0.00,
    total_earnings numeric(12,2) DEFAULT 0.00,
    total_orders integer DEFAULT 0,
    signup_date timestamp with time zone,
    last_login timestamp with time zone,
    payout_method text,
    payout_email text,
    notes text,
    tags text[],
    custom_fields jsonb,
    raw_data jsonb,
    data_source text DEFAULT 'jennaz'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.jennaz_affiliates OWNER TO postgres;
CREATE TABLE public.jennaz_commissions (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    jennaz_commission_id text NOT NULL,
    jennaz_affiliate_id text,
    jennaz_order_id text,
    affiliate_id uuid,
    order_id uuid,
    commission_type text,
    commission_amount numeric(12,2) DEFAULT 0.00,
    commission_rate numeric(5,2) DEFAULT 0.00,
    commission_level integer DEFAULT 1,
    commission_status text DEFAULT 'pending'::text,
    commission_date timestamp with time zone,
    payment_date timestamp with time zone,
    base_amount numeric(12,2) DEFAULT 0.00,
    currency text DEFAULT 'USD'::text,
    notes text,
    raw_data jsonb,
    data_source text DEFAULT 'jennaz'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.jennaz_commissions OWNER TO postgres;
CREATE TABLE public.jennaz_orders (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    jennaz_order_id text NOT NULL,
    jennaz_affiliate_id text,
    affiliate_id uuid,
    contact_id text,
    opportunity_id text,
    customer_name text,
    customer_email text,
    customer_phone text,
    order_value numeric(12,2) DEFAULT 0.00,
    order_total numeric(12,2) DEFAULT 0.00,
    commission_amount numeric(12,2) DEFAULT 0.00,
    commission_rate numeric(5,2) DEFAULT 0.00,
    commission_status text DEFAULT 'pending'::text,
    order_status text,
    pipeline_id text,
    stage_id text,
    order_date timestamp with time zone,
    close_date timestamp with time zone,
    products jsonb,
    notes text,
    raw_data jsonb,
    data_source text DEFAULT 'jennaz'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.jennaz_orders OWNER TO postgres;
CREATE TABLE public.jennaz_payments (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    jennaz_payment_id text NOT NULL,
    jennaz_affiliate_id text,
    affiliate_id uuid,
    payment_amount numeric(12,2) DEFAULT 0.00,
    payment_method text,
    payment_status text DEFAULT 'pending'::text,
    payment_date timestamp with time zone,
    transaction_id text,
    payment_reference text,
    currency text DEFAULT 'USD'::text,
    exchange_rate numeric(10,4) DEFAULT 1.0000,
    fees numeric(12,2) DEFAULT 0.00,
    net_amount numeric(12,2) DEFAULT 0.00,
    notes text,
    raw_data jsonb,
    data_source text DEFAULT 'jennaz'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.jennaz_payments OWNER TO postgres;
CREATE TABLE public.jennaz_rewards (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    jennaz_reward_id text NOT NULL,
    jennaz_affiliate_id text,
    affiliate_id uuid,
    reward_type text,
    description text,
    reward_amount numeric(12,2) DEFAULT 0.00,
    reward_date timestamp with time zone,
    status text DEFAULT 'pending'::text,
    trigger_event text,
    notes text,
    raw_data jsonb,
    data_source text DEFAULT 'jennaz'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.jennaz_rewards OWNER TO postgres;
CREATE TABLE public.mightynetworks_affiliates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    rewardful_affiliate_id text NOT NULL,
    mighty_member_id text,
    email text NOT NULL,
    first_name text,
    last_name text,
    name text,
    phone text,
    status text,
    signup_date timestamp with time zone,
    referral_code text,
    commission_rate numeric(5,4),
    balance numeric(10,2) DEFAULT 0,
    total_earnings numeric(10,2) DEFAULT 0,
    total_referrals integer DEFAULT 0,
    total_commissions numeric(10,2) DEFAULT 0,
    payout_email text,
    payment_method text,
    tags jsonb,
    custom_fields jsonb,
    raw_data jsonb,
    data_source text DEFAULT 'mightynetworks'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.mightynetworks_affiliates OWNER TO postgres;
CREATE TABLE public.mightynetworks_commissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    rewardful_commission_id text NOT NULL,
    rewardful_affiliate_id text,
    rewardful_referral_id text,
    affiliate_id uuid,
    referral_id uuid,
    commission_amount numeric(10,2),
    commission_rate numeric(5,4),
    commission_type text,
    status text,
    date_earned timestamp with time zone,
    date_approved timestamp with time zone,
    date_paid timestamp with time zone,
    payout_id text,
    raw_data jsonb,
    data_source text DEFAULT 'mightynetworks'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.mightynetworks_commissions OWNER TO postgres;
CREATE TABLE public.mightynetworks_import_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    import_type text NOT NULL,
    source text DEFAULT 'mightynetworks'::text,
    status text NOT NULL,
    started_by uuid,
    started_at timestamp with time zone DEFAULT now(),
    completed_at timestamp with time zone,
    records_processed integer DEFAULT 0,
    records_successful integer DEFAULT 0,
    records_failed integer DEFAULT 0,
    error_details jsonb,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.mightynetworks_import_logs OWNER TO postgres;
CREATE TABLE public.mightynetworks_payouts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    rewardful_payout_id text NOT NULL,
    rewardful_affiliate_id text,
    affiliate_id uuid,
    amount numeric(10,2),
    payment_method text,
    payment_date timestamp with time zone,
    status text,
    transaction_id text,
    payment_email text,
    notes text,
    commission_ids text[],
    raw_data jsonb,
    data_source text DEFAULT 'mightynetworks'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.mightynetworks_payouts OWNER TO postgres;
CREATE TABLE public.mightynetworks_referrals (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    rewardful_referral_id text NOT NULL,
    rewardful_affiliate_id text,
    affiliate_id uuid,
    customer_email text,
    customer_name text,
    order_total numeric(10,2),
    commission_amount numeric(10,2),
    commission_rate numeric(5,4),
    status text,
    referral_date timestamp with time zone,
    conversion_date timestamp with time zone,
    commission_status text,
    stripe_charge_id text,
    stripe_customer_id text,
    mighty_plan_name text,
    mighty_space_name text,
    raw_data jsonb,
    data_source text DEFAULT 'mightynetworks'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.mightynetworks_referrals OWNER TO postgres;
CREATE TABLE public.multi_level_commissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_source text NOT NULL,
    order_id text NOT NULL,
    internal_order_id uuid,
    customer_email text,
    customer_name text,
    order_total numeric(10,2) NOT NULL,
    order_date timestamp with time zone NOT NULL,
    product_category text,
    product_name text,
    product_id text,
    purchasing_affiliate_id uuid,
    commission_level integer NOT NULL,
    earning_affiliate_id uuid NOT NULL,
    commission_rate numeric(5,2) NOT NULL,
    commission_amount numeric(10,2) NOT NULL,
    status text DEFAULT 'pending'::text,
    approved_date timestamp with time zone,
    paid_date timestamp with time zone,
    payout_id uuid,
    approved_by uuid,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT multi_level_commissions_commission_level_check CHECK ((commission_level = ANY (ARRAY[1, 2, 3]))),
    CONSTRAINT multi_level_commissions_order_source_check CHECK ((order_source = ANY (ARRAY['shopify'::text, 'mightynetworks'::text, 'goaffpro'::text, 'manual'::text]))),
    CONSTRAINT multi_level_commissions_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'paid'::text, 'cancelled'::text, 'disputed'::text])))
);

ALTER TABLE public.multi_level_commissions OWNER TO postgres;
CREATE INDEX idx_affiliate_system_users_email ON public.affiliate_system_users USING btree (email);
CREATE INDEX idx_affiliate_system_users_ghl_contact_id ON public.affiliate_system_users USING btree (ghl_contact_id);
CREATE INDEX idx_affiliate_system_users_primary_source ON public.affiliate_system_users USING btree (primary_source);
CREATE INDEX idx_affiliate_system_users_referral_code ON public.affiliate_system_users USING btree (referral_code);
CREATE INDEX idx_ghl_affiliates_contact_id ON public.ghl_affiliates USING btree (ghl_contact_id);
CREATE INDEX idx_ghl_affiliates_email ON public.ghl_affiliates USING btree (email);
CREATE INDEX idx_ghl_affiliates_referred_by ON public.ghl_affiliates USING btree (referred_by_contact_id);
CREATE INDEX idx_goaffpro_affiliates_data_source ON public.goaffpro_affiliates USING btree (data_source);
CREATE INDEX idx_goaffpro_affiliates_email ON public.goaffpro_affiliates USING btree (email);
CREATE INDEX idx_goaffpro_affiliates_goaffpro_id ON public.goaffpro_affiliates USING btree (goaffpro_id);
CREATE INDEX idx_goaffpro_commissions_affiliate_id ON public.goaffpro_commissions USING btree (affiliate_id);
CREATE INDEX idx_goaffpro_commissions_data_source ON public.goaffpro_commissions USING btree (data_source);
CREATE INDEX idx_goaffpro_commissions_order_id ON public.goaffpro_commissions USING btree (order_id);
CREATE INDEX idx_goaffpro_orders_affiliate_id ON public.goaffpro_orders USING btree (affiliate_id);
CREATE INDEX idx_goaffpro_orders_data_source ON public.goaffpro_orders USING btree (data_source);
CREATE INDEX idx_goaffpro_orders_goaffpro_id ON public.goaffpro_orders USING btree (goaffpro_order_id);
CREATE INDEX idx_goaffpro_payments_affiliate_id ON public.goaffpro_payments USING btree (affiliate_id);
CREATE INDEX idx_goaffpro_payments_data_source ON public.goaffpro_payments USING btree (data_source);
CREATE INDEX idx_goaffpro_rewards_affiliate_id ON public.goaffpro_rewards USING btree (affiliate_id);
CREATE INDEX idx_goaffpro_rewards_data_source ON public.goaffpro_rewards USING btree (data_source);
CREATE INDEX idx_jennaz_affiliates_data_source ON public.jennaz_affiliates USING btree (data_source);
CREATE INDEX idx_jennaz_affiliates_email ON public.jennaz_affiliates USING btree (email);
CREATE INDEX idx_jennaz_affiliates_jennaz_id ON public.jennaz_affiliates USING btree (jennaz_id);
CREATE INDEX idx_jennaz_affiliates_status ON public.jennaz_affiliates USING btree (status);
CREATE INDEX idx_jennaz_commissions_affiliate_id ON public.jennaz_commissions USING btree (affiliate_id);
CREATE INDEX idx_jennaz_commissions_data_source ON public.jennaz_commissions USING btree (data_source);
CREATE INDEX idx_jennaz_commissions_order_id ON public.jennaz_commissions USING btree (order_id);
CREATE INDEX idx_jennaz_orders_affiliate_id ON public.jennaz_orders USING btree (affiliate_id);
CREATE INDEX idx_jennaz_orders_data_source ON public.jennaz_orders USING btree (data_source);
CREATE INDEX idx_jennaz_orders_jennaz_id ON public.jennaz_orders USING btree (jennaz_order_id);
CREATE INDEX idx_jennaz_orders_status ON public.jennaz_orders USING btree (order_status);
CREATE INDEX idx_jennaz_payments_affiliate_id ON public.jennaz_payments USING btree (affiliate_id);
CREATE INDEX idx_jennaz_payments_data_source ON public.jennaz_payments USING btree (data_source);
CREATE INDEX idx_jennaz_rewards_affiliate_id ON public.jennaz_rewards USING btree (affiliate_id);
CREATE INDEX idx_jennaz_rewards_data_source ON public.jennaz_rewards USING btree (data_source);
CREATE INDEX idx_mightynetworks_affiliates_data_source ON public.mightynetworks_affiliates USING btree (data_source);
CREATE INDEX idx_mightynetworks_affiliates_email ON public.mightynetworks_affiliates USING btree (email);
CREATE INDEX idx_mightynetworks_affiliates_rewardful_id ON public.mightynetworks_affiliates USING btree (rewardful_affiliate_id);
CREATE INDEX idx_mightynetworks_affiliates_status ON public.mightynetworks_affiliates USING btree (status);
CREATE INDEX idx_mightynetworks_commissions_affiliate_id ON public.mightynetworks_commissions USING btree (affiliate_id);
CREATE INDEX idx_mightynetworks_commissions_date_earned ON public.mightynetworks_commissions USING btree (date_earned);
CREATE INDEX idx_mightynetworks_commissions_status ON public.mightynetworks_commissions USING btree (status);
CREATE INDEX idx_mightynetworks_import_logs_started_at ON public.mightynetworks_import_logs USING btree (started_at);
CREATE INDEX idx_mightynetworks_import_logs_status ON public.mightynetworks_import_logs USING btree (status);
CREATE INDEX idx_mightynetworks_import_logs_type ON public.mightynetworks_import_logs USING btree (import_type);
CREATE INDEX idx_mightynetworks_payouts_affiliate_id ON public.mightynetworks_payouts USING btree (affiliate_id);
CREATE INDEX idx_mightynetworks_payouts_date ON public.mightynetworks_payouts USING btree (payment_date);
CREATE INDEX idx_mightynetworks_payouts_status ON public.mightynetworks_payouts USING btree (status);
CREATE INDEX idx_mightynetworks_referrals_affiliate_id ON public.mightynetworks_referrals USING btree (affiliate_id);
CREATE INDEX idx_mightynetworks_referrals_date ON public.mightynetworks_referrals USING btree (referral_date);
CREATE INDEX idx_mightynetworks_referrals_rewardful_id ON public.mightynetworks_referrals USING btree (rewardful_referral_id);
CREATE INDEX idx_mightynetworks_referrals_status ON public.mightynetworks_referrals USING btree (status);
CREATE INDEX idx_multi_level_commissions_earning_affiliate ON public.multi_level_commissions USING btree (earning_affiliate_id);
CREATE INDEX idx_multi_level_commissions_order_date ON public.multi_level_commissions USING btree (order_date);
CREATE INDEX idx_multi_level_commissions_order_source_id ON public.multi_level_commissions USING btree (order_source, order_id);
CREATE INDEX idx_multi_level_commissions_status ON public.multi_level_commissions USING btree (status);
CREATE INDEX idx_payouts_affiliate_id ON public.payouts USING btree (affiliate_id);
CREATE INDEX idx_referral_relationships_affiliate_id ON public.referral_relationships USING btree (affiliate_id);
CREATE INDEX idx_shopify_orders_affiliate_id ON public.shopify_orders USING btree (affiliate_id);
CREATE INDEX idx_team_statistics_affiliate_id ON public.team_statistics USING btree (affiliate_id);
ALTER TABLE public.affiliate_import_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_system_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goaffpro_affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goaffpro_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goaffpro_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goaffpro_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goaffpro_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jennaz_affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jennaz_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jennaz_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jennaz_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jennaz_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mightynetworks_affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mightynetworks_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mightynetworks_import_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mightynetworks_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mightynetworks_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.multi_level_commissions ENABLE ROW LEVEL SECURITY;