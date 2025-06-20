-- JennaZ Affiliate Platform - Ultra Safe Schema
-- Contains only tables, indexes, and constraints
-- No functions that could cause syntax errors
-- Generated: 2025-06-17T06:38:42.207Z

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- JennaZ Affiliate Platform - Production Schema
-- Generated: 2025-06-17T06:32:00.400Z
--
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
-- Essential extensions (already available in Supabase)
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;
--
-- PostgreSQL database dump
--
-- Dumped from database version 15.8
-- Dumped by pg_dump version 17.5
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
--
--
--
--
--
--
--
--
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
--
-- Name: EXTENSION pg_net; Type: COMMENT; Schema: -; Owner: 
--
--
--
--
--
--
--
--
--
--
--
--
--
CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;
--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--
--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;
--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--
--
-- Name: pgjwt; Type: EXTENSION; Schema: -; Owner: -
--
CREATE EXTENSION IF NOT EXISTS pgjwt WITH SCHEMA extensions;
--
-- Name: EXTENSION pgjwt; Type: COMMENT; Schema: -; Owner: 
--
--
--
--
--
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--
--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--
--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--
--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--
--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--
--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
--
--
--
--
--
--
--
  -- Get the commission plan for this product
  -- If no specific plan found, use default
  -- If still no plan found, exit
  -- Find the purchasing affiliate (if provided)
    -- If affiliate found, get their referral relationships
      -- Calculate commission amounts
      -- Create Level 1 Commission (direct referrer)
      -- Create Level 2 Commission (indirect referrer)
      -- Create Level 3 Commission (grand referrer)
--
--
    -- Set admin status in auth.users metadata
    SET raw_user_meta_data = 
--
--
  -- First try to match by exact product name
  -- Then try to match by product category
  -- Finally, fall back to default
--
--
--
--
  -- Update statistics for all affected referrers
--
--
  -- Calculate team statistics for the given affiliate
  -- Update the affiliate's cached statistics
--
--
--
--
-- Regclass of the table e.g. public.notes
-- I, U, D, T: insert, update ...
-- Is row level security enabled for the table
-- Subscription vars
-- structured info for wal's columns
-- previous identity values for update/delete
-- Primary jsonb output for record
    -- Update `is_selectable` for columns and old_columns
            -- subscriptions is already filtered by entity
    -- The claims role does not have SELECT permission to the primary key of entity
        -- Add "record" key for insert and update
                                -- if unchanged toast, get column name and value from old record
        -- Add "old_record" key for update and delete
        -- Create the prepared statement
                -- Check if RLS allows the role to see the record
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
--
--
    -- Declare a variable to hold the JSONB representation of the row
    -- Check the operation type and handle accordingly
--
--
--
--
--
--
--
--
            -- Default to allowed when no filters present
                        -- cast jsonb to text
--
--
    SET log_min_messages TO 'fatal'
--
--
--
--
    -- Set the topic configuration
    -- Attempt to insert the message
      -- Capture and notify the error
--
--
            -- Filtered column is valid
            -- Type is sanitized and safe for string interpolation
            -- Set maximum number of entries for in filter
                -- raises an exception if value is not coercable to type
        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: affiliate_import_logs; Type: TABLE; Schema: public; Owner: postgres
--
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
--
-- Name: affiliate_system_users; Type: TABLE; Schema: public; Owner: postgres
--
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
--
-- Name: affiliates; Type: TABLE; Schema: public; Owner: postgres
--
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
--
-- Name: clicks; Type: TABLE; Schema: public; Owner: postgres
--
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
--
-- Name: commission_plans; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.commission_plans (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    product_category text NOT NULL,
    product_name text NOT NULL,
    shopify_product_id text,
    level_1_rate numeric(5,2) NOT NULL,
    level_2_rate numeric(5,2) NOT NULL,
    level_3_rate numeric(5,2) NOT NULL,
    is_active boolean DEFAULT true,
    effective_from timestamp with time zone DEFAULT now(),
    effective_until timestamp with time zone,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.commission_plans OWNER TO postgres;
--
-- Name: TABLE commission_plans; Type: COMMENT; Schema: public; Owner: postgres
--
--
-- Name: commissions; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.commissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    transaction_id uuid NOT NULL,
    affiliate_id uuid NOT NULL,
    referrer_id uuid NOT NULL,
    level integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    rate_applied numeric(5,2) NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    payout_date timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    data_source text DEFAULT 'test'::text,
    CONSTRAINT commissions_data_source_check CHECK ((data_source = ANY (ARRAY['test'::text, 'goaffpro'::text]))),
    CONSTRAINT commissions_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'paid'::text, 'cancelled'::text])))
);

ALTER TABLE public.commissions OWNER TO postgres;
--
-- Name: data_import_logs; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.data_import_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    import_type text NOT NULL,
    source text NOT NULL,
    status text NOT NULL,
    records_processed integer DEFAULT 0,
    records_successful integer DEFAULT 0,
    records_failed integer DEFAULT 0,
    error_details jsonb,
    started_at timestamp with time zone DEFAULT now(),
    completed_at timestamp with time zone,
    started_by uuid,
    CONSTRAINT data_import_logs_status_check CHECK ((status = ANY (ARRAY['started'::text, 'completed'::text, 'failed'::text])))
);

ALTER TABLE public.data_import_logs OWNER TO postgres;
--
-- Name: ghl_affiliates; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.ghl_affiliates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ghl_contact_id text NOT NULL,
    email text NOT NULL,
    first_name text,
    last_name text,
    phone text,
    contact_source text,
    tags jsonb,
    custom_fields jsonb,
    date_added timestamp with time zone,
    last_activity timestamp with time zone,
    referred_by_contact_id text,
    referral_code text,
    status text,
    last_synced timestamp with time zone DEFAULT now(),
    sync_status text DEFAULT 'synced'::text,
    raw_data jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT ghl_affiliates_sync_status_check CHECK ((sync_status = ANY (ARRAY['synced'::text, 'error'::text, 'pending'::text])))
);

ALTER TABLE public.ghl_affiliates OWNER TO postgres;
--
-- Name: goaffpro_affiliates; Type: TABLE; Schema: public; Owner: postgres
--
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
--
-- Name: goaffpro_commissions; Type: TABLE; Schema: public; Owner: postgres
--
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
--
-- Name: goaffpro_orders; Type: TABLE; Schema: public; Owner: postgres
--
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
--
-- Name: goaffpro_payments; Type: TABLE; Schema: public; Owner: postgres
--
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
--
-- Name: goaffpro_rewards; Type: TABLE; Schema: public; Owner: postgres
--
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
--
-- Name: jennaz_affiliates; Type: TABLE; Schema: public; Owner: postgres
--
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
--
-- Name: TABLE jennaz_affiliates; Type: COMMENT; Schema: public; Owner: postgres
--
--
-- Name: jennaz_commissions; Type: TABLE; Schema: public; Owner: postgres
--
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
--
-- Name: TABLE jennaz_commissions; Type: COMMENT; Schema: public; Owner: postgres
--
--
-- Name: jennaz_orders; Type: TABLE; Schema: public; Owner: postgres
--
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
--
-- Name: TABLE jennaz_orders; Type: COMMENT; Schema: public; Owner: postgres
--
--
-- Name: jennaz_payments; Type: TABLE; Schema: public; Owner: postgres
--
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
--
-- Name: TABLE jennaz_payments; Type: COMMENT; Schema: public; Owner: postgres
--
--
-- Name: jennaz_rewards; Type: TABLE; Schema: public; Owner: postgres
--
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
--
-- Name: TABLE jennaz_rewards; Type: COMMENT; Schema: public; Owner: postgres
--
--
-- Name: mightynetworks_affiliates; Type: TABLE; Schema: public; Owner: postgres
--
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
--
-- Name: TABLE mightynetworks_affiliates; Type: COMMENT; Schema: public; Owner: postgres
--
--
-- Name: mightynetworks_commissions; Type: TABLE; Schema: public; Owner: postgres
--
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
--
-- Name: TABLE mightynetworks_commissions; Type: COMMENT; Schema: public; Owner: postgres
--
--
-- Name: mightynetworks_import_logs; Type: TABLE; Schema: public; Owner: postgres
--
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
--
-- Name: TABLE mightynetworks_import_logs; Type: COMMENT; Schema: public; Owner: postgres
--
--
-- Name: mightynetworks_payouts; Type: TABLE; Schema: public; Owner: postgres
--
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
--
-- Name: TABLE mightynetworks_payouts; Type: COMMENT; Schema: public; Owner: postgres
--
--
-- Name: mightynetworks_referrals; Type: TABLE; Schema: public; Owner: postgres
--
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
--
-- Name: TABLE mightynetworks_referrals; Type: COMMENT; Schema: public; Owner: postgres
--
--
-- Name: multi_level_commissions; Type: TABLE; Schema: public; Owner: postgres
--
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
--
-- Name: payouts; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.payouts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    affiliate_id uuid NOT NULL,
    amount numeric(10,2) NOT NULL,
    commission_ids uuid[] NOT NULL,
    payment_method text,
    payment_email text,
    payment_details jsonb,
    status text DEFAULT 'pending'::text,
    requested_date timestamp with time zone DEFAULT now(),
    processed_date timestamp with time zone,
    completed_date timestamp with time zone,
    transaction_id text,
    payment_gateway_response jsonb,
    processed_by uuid,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT payouts_payment_method_check CHECK ((payment_method = ANY (ARRAY['paypal'::text, 'stripe'::text, 'bank_transfer'::text, 'wise'::text, 'manual'::text]))),
    CONSTRAINT payouts_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'processing'::text, 'completed'::text, 'failed'::text, 'cancelled'::text])))
);

ALTER TABLE public.payouts OWNER TO postgres;
--
-- Name: referral_relationships; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.referral_relationships (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    affiliate_id uuid NOT NULL,
    l1_referrer_id uuid,
    l2_referrer_id uuid,
    l3_referrer_id uuid,
    referral_method text,
    referral_code_used text,
    assigned_by uuid,
    assigned_date timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT referral_relationships_check CHECK ((affiliate_id <> l1_referrer_id)),
    CONSTRAINT referral_relationships_check1 CHECK ((affiliate_id <> l2_referrer_id)),
    CONSTRAINT referral_relationships_check2 CHECK ((affiliate_id <> l3_referrer_id)),
    CONSTRAINT referral_relationships_check3 CHECK (((l1_referrer_id <> l2_referrer_id) OR (l1_referrer_id IS NULL) OR (l2_referrer_id IS NULL))),
    CONSTRAINT referral_relationships_check4 CHECK (((l1_referrer_id <> l3_referrer_id) OR (l1_referrer_id IS NULL) OR (l3_referrer_id IS NULL))),
    CONSTRAINT referral_relationships_check5 CHECK (((l2_referrer_id <> l3_referrer_id) OR (l2_referrer_id IS NULL) OR (l3_referrer_id IS NULL))),
    CONSTRAINT referral_relationships_referral_method_check CHECK ((referral_method = ANY (ARRAY['referral_code'::text, 'manual_assignment'::text, 'import'::text])))
);

ALTER TABLE public.referral_relationships OWNER TO postgres;
--
-- Name: shopify_order_items; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.shopify_order_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    shopify_product_id text NOT NULL,
    variant_id text,
    title text NOT NULL,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL,
    sku text,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.shopify_order_items OWNER TO postgres;
--
-- Name: shopify_orders; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.shopify_orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    shopify_order_id text NOT NULL,
    order_number text NOT NULL,
    email text,
    total_price numeric(10,2) NOT NULL,
    subtotal_price numeric(10,2),
    total_tax numeric(10,2),
    currency text,
    financial_status text,
    fulfillment_status text,
    customer_id text,
    first_name text,
    last_name text,
    affiliate_id uuid,
    referral_code text,
    utm_source text,
    utm_medium text,
    utm_campaign text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    data_source text DEFAULT 'test'::text,
    CONSTRAINT shopify_orders_data_source_check CHECK ((data_source = ANY (ARRAY['test'::text, 'goaffpro'::text])))
);

ALTER TABLE public.shopify_orders OWNER TO postgres;
--
-- Name: shopify_products; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.shopify_products (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    shopify_product_id text NOT NULL,
    title text NOT NULL,
    handle text,
    vendor text,
    product_type text,
    price numeric(10,2),
    compare_at_price numeric(10,2),
    sku text,
    inventory_quantity integer,
    status text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    data_source text DEFAULT 'test'::text,
    CONSTRAINT shopify_products_data_source_check CHECK ((data_source = ANY (ARRAY['test'::text, 'goaffpro'::text])))
);

ALTER TABLE public.shopify_products OWNER TO postgres;
--
-- Name: shopify_webhooks; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.shopify_webhooks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    topic text NOT NULL,
    shop_domain text NOT NULL,
    webhook_id text,
    payload jsonb,
    processed boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.shopify_webhooks OWNER TO postgres;
--
-- Name: team_statistics; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.team_statistics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    affiliate_id uuid NOT NULL,
    l1_direct_count integer DEFAULT 0,
    l2_indirect_count integer DEFAULT 0,
    l3_total_count integer DEFAULT 0,
    total_team_size integer DEFAULT 0,
    l1_sales_volume numeric(12,2) DEFAULT 0,
    l2_sales_volume numeric(12,2) DEFAULT 0,
    l3_sales_volume numeric(12,2) DEFAULT 0,
    total_team_volume numeric(12,2) DEFAULT 0,
    l1_commissions_earned numeric(10,2) DEFAULT 0,
    l2_commissions_earned numeric(10,2) DEFAULT 0,
    l3_commissions_earned numeric(10,2) DEFAULT 0,
    total_commissions numeric(10,2) DEFAULT 0,
    period_start timestamp with time zone NOT NULL,
    period_end timestamp with time zone NOT NULL,
    calculation_date timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.team_statistics OWNER TO postgres;
--
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.transactions (
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

ALTER TABLE public.transactions OWNER TO postgres;
--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.users (
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

ALTER TABLE public.users OWNER TO postgres;
--
--
--
--
-- Name: messages_2025_06_11; Type: TABLE; Schema: realtime; Owner: supabase_admin
--
--
-- Name: messages_2025_06_12; Type: TABLE; Schema: realtime; Owner: supabase_admin
--
--
-- Name: messages_2025_06_13; Type: TABLE; Schema: realtime; Owner: supabase_admin
--
--
-- Name: messages_2025_06_14; Type: TABLE; Schema: realtime; Owner: supabase_admin
--
--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--
--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--
--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
-- Name: seed_files; Type: TABLE; Schema: supabase_migrations; Owner: postgres
--
--
-- Name: messages_2025_06_10; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--
--
-- Name: messages_2025_06_11; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--
--
-- Name: messages_2025_06_12; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--
--
-- Name: messages_2025_06_13; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--
--
-- Name: messages_2025_06_14; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--
--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--
--
--
--
--
--
--
--
--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: affiliate_import_logs affiliate_import_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: affiliate_system_users affiliate_system_users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: affiliate_system_users affiliate_system_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: affiliate_system_users affiliate_system_users_referral_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: affiliates affiliates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: affiliates affiliates_referrer_id_affiliate_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: clicks clicks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: commission_plans commission_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: commissions commissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: data_import_logs data_import_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: ghl_affiliates ghl_affiliates_ghl_contact_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: ghl_affiliates ghl_affiliates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: goaffpro_affiliates goaffpro_affiliates_goaffpro_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: goaffpro_affiliates goaffpro_affiliates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: goaffpro_commissions goaffpro_commissions_goaffpro_commission_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: goaffpro_commissions goaffpro_commissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: goaffpro_orders goaffpro_orders_goaffpro_order_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: goaffpro_orders goaffpro_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: goaffpro_payments goaffpro_payments_goaffpro_payment_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: goaffpro_payments goaffpro_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: goaffpro_rewards goaffpro_rewards_goaffpro_reward_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: goaffpro_rewards goaffpro_rewards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: jennaz_affiliates jennaz_affiliates_jennaz_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: jennaz_affiliates jennaz_affiliates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: jennaz_commissions jennaz_commissions_jennaz_commission_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: jennaz_commissions jennaz_commissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: jennaz_orders jennaz_orders_jennaz_order_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: jennaz_orders jennaz_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: jennaz_payments jennaz_payments_jennaz_payment_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: jennaz_payments jennaz_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: jennaz_rewards jennaz_rewards_jennaz_reward_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: jennaz_rewards jennaz_rewards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: mightynetworks_affiliates mightynetworks_affiliates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: mightynetworks_affiliates mightynetworks_affiliates_rewardful_affiliate_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: mightynetworks_commissions mightynetworks_commissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: mightynetworks_commissions mightynetworks_commissions_rewardful_commission_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: mightynetworks_import_logs mightynetworks_import_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: mightynetworks_payouts mightynetworks_payouts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: mightynetworks_payouts mightynetworks_payouts_rewardful_payout_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: mightynetworks_referrals mightynetworks_referrals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: mightynetworks_referrals mightynetworks_referrals_rewardful_referral_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: multi_level_commissions multi_level_commissions_order_source_order_id_commission_le_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: multi_level_commissions multi_level_commissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: payouts payouts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: referral_relationships referral_relationships_affiliate_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: referral_relationships referral_relationships_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: shopify_order_items shopify_order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: shopify_orders shopify_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: shopify_orders shopify_orders_shopify_order_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: shopify_products shopify_products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: shopify_products shopify_products_shopify_product_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: shopify_webhooks shopify_webhooks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: team_statistics team_statistics_affiliate_id_period_start_period_end_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: team_statistics team_statistics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: transactions transactions_transaction_ref_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: users users_referral_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--
--
--
--
-- Name: messages_2025_06_10 messages_2025_06_10_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--
--
-- Name: messages_2025_06_11 messages_2025_06_11_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--
--
-- Name: messages_2025_06_12 messages_2025_06_12_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--
--
-- Name: messages_2025_06_13 messages_2025_06_13_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--
--
-- Name: messages_2025_06_14 messages_2025_06_14_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--
--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--
--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--
--
-- Name: seed_files seed_files_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--
--
--
CREATE INDEX extensions_tenant_external_id_index ON _realtime.extensions USING btree (tenant_external_id);
--
--
--
--
CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);
--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);
--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);
--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);
--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);
--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);
--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);
--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);
--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);
--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);
--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);
--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);
--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);
--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);
--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);
--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);
--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);
--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);
--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);
--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);
--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);
--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);
--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);
--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);
--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);
--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);
--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);
--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);
--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);
--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));
--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);
--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));
--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);
--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);
--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);
--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));
--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);
--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--
CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);
--
-- Name: idx_affiliate_system_users_email; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_affiliate_system_users_email ON public.affiliate_system_users USING btree (email);
--
-- Name: idx_affiliate_system_users_ghl_contact_id; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_affiliate_system_users_ghl_contact_id ON public.affiliate_system_users USING btree (ghl_contact_id);
--
-- Name: idx_affiliate_system_users_primary_source; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_affiliate_system_users_primary_source ON public.affiliate_system_users USING btree (primary_source);
--
-- Name: idx_affiliate_system_users_referral_code; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_affiliate_system_users_referral_code ON public.affiliate_system_users USING btree (referral_code);
--
-- Name: idx_data_import_logs_import_type; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_data_import_logs_import_type ON public.data_import_logs USING btree (import_type);
--
-- Name: idx_data_import_logs_status; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_data_import_logs_status ON public.data_import_logs USING btree (status);
--
-- Name: idx_ghl_affiliates_contact_id; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_ghl_affiliates_contact_id ON public.ghl_affiliates USING btree (ghl_contact_id);
--
-- Name: idx_ghl_affiliates_email; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_ghl_affiliates_email ON public.ghl_affiliates USING btree (email);
--
-- Name: idx_ghl_affiliates_referred_by; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_ghl_affiliates_referred_by ON public.ghl_affiliates USING btree (referred_by_contact_id);
--
-- Name: idx_goaffpro_affiliates_data_source; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_goaffpro_affiliates_data_source ON public.goaffpro_affiliates USING btree (data_source);
--
-- Name: idx_goaffpro_affiliates_email; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_goaffpro_affiliates_email ON public.goaffpro_affiliates USING btree (email);
--
-- Name: idx_goaffpro_affiliates_goaffpro_id; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_goaffpro_affiliates_goaffpro_id ON public.goaffpro_affiliates USING btree (goaffpro_id);
--
-- Name: idx_goaffpro_commissions_affiliate_id; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_goaffpro_commissions_affiliate_id ON public.goaffpro_commissions USING btree (affiliate_id);
--
-- Name: idx_goaffpro_commissions_data_source; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_goaffpro_commissions_data_source ON public.goaffpro_commissions USING btree (data_source);
--
-- Name: idx_goaffpro_commissions_order_id; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_goaffpro_commissions_order_id ON public.goaffpro_commissions USING btree (order_id);
--
-- Name: idx_goaffpro_orders_affiliate_id; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_goaffpro_orders_affiliate_id ON public.goaffpro_orders USING btree (affiliate_id);
--
-- Name: idx_goaffpro_orders_data_source; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_goaffpro_orders_data_source ON public.goaffpro_orders USING btree (data_source);
--
-- Name: idx_goaffpro_orders_goaffpro_id; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_goaffpro_orders_goaffpro_id ON public.goaffpro_orders USING btree (goaffpro_order_id);
--
-- Name: idx_goaffpro_payments_affiliate_id; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_goaffpro_payments_affiliate_id ON public.goaffpro_payments USING btree (affiliate_id);
--
-- Name: idx_goaffpro_payments_data_source; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_goaffpro_payments_data_source ON public.goaffpro_payments USING btree (data_source);
--
-- Name: idx_goaffpro_rewards_affiliate_id; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_goaffpro_rewards_affiliate_id ON public.goaffpro_rewards USING btree (affiliate_id);
--
-- Name: idx_goaffpro_rewards_data_source; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_goaffpro_rewards_data_source ON public.goaffpro_rewards USING btree (data_source);
--
-- Name: idx_jennaz_affiliates_data_source; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_jennaz_affiliates_data_source ON public.jennaz_affiliates USING btree (data_source);
--
-- Name: idx_jennaz_affiliates_email; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_jennaz_affiliates_email ON public.jennaz_affiliates USING btree (email);
--
-- Name: idx_jennaz_affiliates_jennaz_id; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_jennaz_affiliates_jennaz_id ON public.jennaz_affiliates USING btree (jennaz_id);
--
-- Name: idx_jennaz_affiliates_status; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_jennaz_affiliates_status ON public.jennaz_affiliates USING btree (status);
--
-- Name: idx_jennaz_commissions_affiliate_id; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_jennaz_commissions_affiliate_id ON public.jennaz_commissions USING btree (affiliate_id);
--
-- Name: idx_jennaz_commissions_data_source; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_jennaz_commissions_data_source ON public.jennaz_commissions USING btree (data_source);
--
-- Name: idx_jennaz_commissions_order_id; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_jennaz_commissions_order_id ON public.jennaz_commissions USING btree (order_id);
--
-- Name: idx_jennaz_orders_affiliate_id; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_jennaz_orders_affiliate_id ON public.jennaz_orders USING btree (affiliate_id);
--
-- Name: idx_jennaz_orders_data_source; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_jennaz_orders_data_source ON public.jennaz_orders USING btree (data_source);
--
-- Name: idx_jennaz_orders_jennaz_id; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_jennaz_orders_jennaz_id ON public.jennaz_orders USING btree (jennaz_order_id);
--
-- Name: idx_jennaz_orders_status; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_jennaz_orders_status ON public.jennaz_orders USING btree (order_status);
--
-- Name: idx_jennaz_payments_affiliate_id; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_jennaz_payments_affiliate_id ON public.jennaz_payments USING btree (affiliate_id);
--
-- Name: idx_jennaz_payments_data_source; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_jennaz_payments_data_source ON public.jennaz_payments USING btree (data_source);
--
-- Name: idx_jennaz_rewards_affiliate_id; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_jennaz_rewards_affiliate_id ON public.jennaz_rewards USING btree (affiliate_id);
--
-- Name: idx_jennaz_rewards_data_source; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_jennaz_rewards_data_source ON public.jennaz_rewards USING btree (data_source);
--
-- Name: idx_mightynetworks_affiliates_data_source; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_mightynetworks_affiliates_data_source ON public.mightynetworks_affiliates USING btree (data_source);
--
-- Name: idx_mightynetworks_affiliates_email; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_mightynetworks_affiliates_email ON public.mightynetworks_affiliates USING btree (email);
--
-- Name: idx_mightynetworks_affiliates_rewardful_id; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_mightynetworks_affiliates_rewardful_id ON public.mightynetworks_affiliates USING btree (rewardful_affiliate_id);
--
-- Name: idx_mightynetworks_affiliates_status; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_mightynetworks_affiliates_status ON public.mightynetworks_affiliates USING btree (status);
--
-- Name: idx_mightynetworks_commissions_affiliate_id; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_mightynetworks_commissions_affiliate_id ON public.mightynetworks_commissions USING btree (affiliate_id);
--
-- Name: idx_mightynetworks_commissions_date_earned; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_mightynetworks_commissions_date_earned ON public.mightynetworks_commissions USING btree (date_earned);
--
-- Name: idx_mightynetworks_commissions_status; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_mightynetworks_commissions_status ON public.mightynetworks_commissions USING btree (status);
--
-- Name: idx_mightynetworks_import_logs_started_at; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_mightynetworks_import_logs_started_at ON public.mightynetworks_import_logs USING btree (started_at);
--
-- Name: idx_mightynetworks_import_logs_status; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_mightynetworks_import_logs_status ON public.mightynetworks_import_logs USING btree (status);
--
-- Name: idx_mightynetworks_import_logs_type; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_mightynetworks_import_logs_type ON public.mightynetworks_import_logs USING btree (import_type);
--
-- Name: idx_mightynetworks_payouts_affiliate_id; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_mightynetworks_payouts_affiliate_id ON public.mightynetworks_payouts USING btree (affiliate_id);
--
-- Name: idx_mightynetworks_payouts_date; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_mightynetworks_payouts_date ON public.mightynetworks_payouts USING btree (payment_date);
--
-- Name: idx_mightynetworks_payouts_status; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_mightynetworks_payouts_status ON public.mightynetworks_payouts USING btree (status);
--
-- Name: idx_mightynetworks_referrals_affiliate_id; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_mightynetworks_referrals_affiliate_id ON public.mightynetworks_referrals USING btree (affiliate_id);
--
-- Name: idx_mightynetworks_referrals_date; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_mightynetworks_referrals_date ON public.mightynetworks_referrals USING btree (referral_date);
--
-- Name: idx_mightynetworks_referrals_rewardful_id; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_mightynetworks_referrals_rewardful_id ON public.mightynetworks_referrals USING btree (rewardful_referral_id);
--
-- Name: idx_mightynetworks_referrals_status; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_mightynetworks_referrals_status ON public.mightynetworks_referrals USING btree (status);
--
-- Name: idx_multi_level_commissions_earning_affiliate; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_multi_level_commissions_earning_affiliate ON public.multi_level_commissions USING btree (earning_affiliate_id);
--
-- Name: idx_multi_level_commissions_order_date; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_multi_level_commissions_order_date ON public.multi_level_commissions USING btree (order_date);
--
-- Name: idx_multi_level_commissions_order_source_id; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_multi_level_commissions_order_source_id ON public.multi_level_commissions USING btree (order_source, order_id);
--
-- Name: idx_multi_level_commissions_status; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_multi_level_commissions_status ON public.multi_level_commissions USING btree (status);
--
-- Name: idx_payouts_affiliate_id; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_payouts_affiliate_id ON public.payouts USING btree (affiliate_id);
--
-- Name: idx_payouts_status; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_payouts_status ON public.payouts USING btree (status);
--
-- Name: idx_referral_relationships_affiliate_id; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_referral_relationships_affiliate_id ON public.referral_relationships USING btree (affiliate_id);
--
-- Name: idx_referral_relationships_l1_referrer; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_referral_relationships_l1_referrer ON public.referral_relationships USING btree (l1_referrer_id);
--
-- Name: idx_referral_relationships_l2_referrer; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_referral_relationships_l2_referrer ON public.referral_relationships USING btree (l2_referrer_id);
--
-- Name: idx_referral_relationships_l3_referrer; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_referral_relationships_l3_referrer ON public.referral_relationships USING btree (l3_referrer_id);
--
-- Name: idx_shopify_order_items_order_id; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_shopify_order_items_order_id ON public.shopify_order_items USING btree (order_id);
--
-- Name: idx_shopify_orders_affiliate_id; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_shopify_orders_affiliate_id ON public.shopify_orders USING btree (affiliate_id);
--
-- Name: idx_shopify_orders_created_at; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_shopify_orders_created_at ON public.shopify_orders USING btree (created_at);
--
-- Name: idx_shopify_products_shopify_id; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_shopify_products_shopify_id ON public.shopify_products USING btree (shopify_product_id);
--
-- Name: idx_team_statistics_affiliate_id; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_team_statistics_affiliate_id ON public.team_statistics USING btree (affiliate_id);
--
-- Name: idx_team_statistics_period; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_team_statistics_period ON public.team_statistics USING btree (period_start, period_end);
--
--
CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);
--
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--
CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);
--
--
--
--
CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);
--
--
--
CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");
--
--
CREATE INDEX idx_objects_lower_name ON storage.objects USING btree ((path_tokens[level]), lower(name) text_pattern_ops, bucket_id, level);
--
--
CREATE INDEX idx_prefixes_lower_name ON storage.prefixes USING btree (bucket_id, level, ((string_to_array(name, '/'::text))[level]), lower(name) text_pattern_ops);
--
--
CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);
--
--
--
CREATE INDEX supabase_functions_hooks_h_table_id_h_name_idx ON supabase_functions.hooks USING btree (hook_table_id, hook_name);
--
--
CREATE INDEX supabase_functions_hooks_request_id_idx ON supabase_functions.hooks USING btree (request_id);
--
--
--
--
--
--
--
--
--
--
--
-- Name: affiliate_system_users set_affiliate_system_users_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--
--
-- Name: affiliates set_affiliates_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--
--
-- Name: commission_plans set_commission_plans_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--
--
-- Name: commissions set_commissions_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--
--
-- Name: users set_first_user_as_admin; Type: TRIGGER; Schema: public; Owner: postgres
--
--
-- Name: ghl_affiliates set_ghl_affiliates_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--
--
-- Name: goaffpro_affiliates set_goaffpro_affiliates_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--
--
-- Name: goaffpro_commissions set_goaffpro_commissions_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--
--
-- Name: goaffpro_orders set_goaffpro_orders_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--
--
-- Name: goaffpro_payments set_goaffpro_payments_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--
--
-- Name: goaffpro_rewards set_goaffpro_rewards_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--
--
-- Name: jennaz_affiliates set_jennaz_affiliates_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--
--
-- Name: jennaz_commissions set_jennaz_commissions_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--
--
-- Name: jennaz_orders set_jennaz_orders_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--
--
-- Name: jennaz_payments set_jennaz_payments_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--
--
-- Name: jennaz_rewards set_jennaz_rewards_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--
--
-- Name: multi_level_commissions set_multi_level_commissions_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--
--
-- Name: payouts set_payouts_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--
--
-- Name: referral_relationships set_referral_relationships_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--
--
-- Name: shopify_orders set_shopify_orders_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--
--
-- Name: shopify_products set_shopify_products_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--
--
-- Name: users set_users_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--
--
-- Name: multi_level_commissions trigger_commissions_team_stats; Type: TRIGGER; Schema: public; Owner: postgres
--
--
-- Name: referral_relationships trigger_referral_relationships_team_stats; Type: TRIGGER; Schema: public; Owner: postgres
--
--
-- Name: mightynetworks_affiliates update_mightynetworks_affiliates_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--
--
-- Name: mightynetworks_commissions update_mightynetworks_commissions_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--
--
-- Name: mightynetworks_payouts update_mightynetworks_payouts_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--
--
-- Name: mightynetworks_referrals update_mightynetworks_referrals_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--
--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--
--
--
--
--
--
--
--
--
--
--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: affiliate_import_logs affiliate_import_logs_started_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: affiliates affiliates_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
    ADD CONSTRAINT affiliates_affiliate_id_fkey FOREIGN KEY (affiliate_id) REFERENCES public.users(id);
--
-- Name: affiliates affiliates_referrer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
    ADD CONSTRAINT affiliates_referrer_id_fkey FOREIGN KEY (referrer_id) REFERENCES public.users(id);
--
-- Name: clicks clicks_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
    ADD CONSTRAINT clicks_affiliate_id_fkey FOREIGN KEY (affiliate_id) REFERENCES public.users(id);
--
-- Name: commissions commissions_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
    ADD CONSTRAINT commissions_affiliate_id_fkey FOREIGN KEY (affiliate_id) REFERENCES public.users(id);
--
-- Name: commissions commissions_referrer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
    ADD CONSTRAINT commissions_referrer_id_fkey FOREIGN KEY (referrer_id) REFERENCES public.users(id);
--
-- Name: commissions commissions_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
    ADD CONSTRAINT commissions_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES public.transactions(id);
--
-- Name: data_import_logs data_import_logs_started_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: goaffpro_commissions goaffpro_commissions_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
    ADD CONSTRAINT goaffpro_commissions_affiliate_id_fkey FOREIGN KEY (affiliate_id) REFERENCES public.goaffpro_affiliates(id);
--
-- Name: goaffpro_commissions goaffpro_commissions_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
    ADD CONSTRAINT goaffpro_commissions_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.goaffpro_orders(id);
--
-- Name: goaffpro_orders goaffpro_orders_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
    ADD CONSTRAINT goaffpro_orders_affiliate_id_fkey FOREIGN KEY (affiliate_id) REFERENCES public.goaffpro_affiliates(id);
--
-- Name: goaffpro_payments goaffpro_payments_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
    ADD CONSTRAINT goaffpro_payments_affiliate_id_fkey FOREIGN KEY (affiliate_id) REFERENCES public.goaffpro_affiliates(id);
--
-- Name: goaffpro_rewards goaffpro_rewards_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
    ADD CONSTRAINT goaffpro_rewards_affiliate_id_fkey FOREIGN KEY (affiliate_id) REFERENCES public.goaffpro_affiliates(id);
--
-- Name: jennaz_commissions jennaz_commissions_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
    ADD CONSTRAINT jennaz_commissions_affiliate_id_fkey FOREIGN KEY (affiliate_id) REFERENCES public.jennaz_affiliates(id);
--
-- Name: jennaz_commissions jennaz_commissions_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
    ADD CONSTRAINT jennaz_commissions_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.jennaz_orders(id);
--
-- Name: jennaz_orders jennaz_orders_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
    ADD CONSTRAINT jennaz_orders_affiliate_id_fkey FOREIGN KEY (affiliate_id) REFERENCES public.jennaz_affiliates(id);
--
-- Name: jennaz_payments jennaz_payments_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
    ADD CONSTRAINT jennaz_payments_affiliate_id_fkey FOREIGN KEY (affiliate_id) REFERENCES public.jennaz_affiliates(id);
--
-- Name: jennaz_rewards jennaz_rewards_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
    ADD CONSTRAINT jennaz_rewards_affiliate_id_fkey FOREIGN KEY (affiliate_id) REFERENCES public.jennaz_affiliates(id);
--
-- Name: mightynetworks_commissions mightynetworks_commissions_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
    ADD CONSTRAINT mightynetworks_commissions_affiliate_id_fkey FOREIGN KEY (affiliate_id) REFERENCES public.mightynetworks_affiliates(id);
--
-- Name: mightynetworks_commissions mightynetworks_commissions_referral_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
    ADD CONSTRAINT mightynetworks_commissions_referral_id_fkey FOREIGN KEY (referral_id) REFERENCES public.mightynetworks_referrals(id);
--
-- Name: mightynetworks_import_logs mightynetworks_import_logs_started_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: mightynetworks_payouts mightynetworks_payouts_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
    ADD CONSTRAINT mightynetworks_payouts_affiliate_id_fkey FOREIGN KEY (affiliate_id) REFERENCES public.mightynetworks_affiliates(id);
--
-- Name: mightynetworks_referrals mightynetworks_referrals_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
    ADD CONSTRAINT mightynetworks_referrals_affiliate_id_fkey FOREIGN KEY (affiliate_id) REFERENCES public.mightynetworks_affiliates(id);
--
-- Name: multi_level_commissions multi_level_commissions_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: multi_level_commissions multi_level_commissions_earning_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
    ADD CONSTRAINT multi_level_commissions_earning_affiliate_id_fkey FOREIGN KEY (earning_affiliate_id) REFERENCES public.affiliate_system_users(id);
--
-- Name: multi_level_commissions multi_level_commissions_purchasing_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
    ADD CONSTRAINT multi_level_commissions_purchasing_affiliate_id_fkey FOREIGN KEY (purchasing_affiliate_id) REFERENCES public.affiliate_system_users(id);
--
-- Name: payouts payouts_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
    ADD CONSTRAINT payouts_affiliate_id_fkey FOREIGN KEY (affiliate_id) REFERENCES public.affiliate_system_users(id);
--
-- Name: payouts payouts_processed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: referral_relationships referral_relationships_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
    ADD CONSTRAINT referral_relationships_affiliate_id_fkey FOREIGN KEY (affiliate_id) REFERENCES public.affiliate_system_users(id) ON DELETE CASCADE;
--
-- Name: referral_relationships referral_relationships_assigned_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
--
-- Name: referral_relationships referral_relationships_l1_referrer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
    ADD CONSTRAINT referral_relationships_l1_referrer_id_fkey FOREIGN KEY (l1_referrer_id) REFERENCES public.affiliate_system_users(id) ON DELETE SET NULL;
--
-- Name: referral_relationships referral_relationships_l2_referrer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
    ADD CONSTRAINT referral_relationships_l2_referrer_id_fkey FOREIGN KEY (l2_referrer_id) REFERENCES public.affiliate_system_users(id) ON DELETE SET NULL;
--
-- Name: referral_relationships referral_relationships_l3_referrer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
    ADD CONSTRAINT referral_relationships_l3_referrer_id_fkey FOREIGN KEY (l3_referrer_id) REFERENCES public.affiliate_system_users(id) ON DELETE SET NULL;
--
-- Name: shopify_order_items shopify_order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
    ADD CONSTRAINT shopify_order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.shopify_orders(id);
--
-- Name: shopify_orders shopify_orders_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
    ADD CONSTRAINT shopify_orders_affiliate_id_fkey FOREIGN KEY (affiliate_id) REFERENCES public.users(id);
--
-- Name: team_statistics team_statistics_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
    ADD CONSTRAINT team_statistics_affiliate_id_fkey FOREIGN KEY (affiliate_id) REFERENCES public.affiliate_system_users(id) ON DELETE CASCADE;
--
-- Name: transactions transactions_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
    ADD CONSTRAINT transactions_affiliate_id_fkey FOREIGN KEY (affiliate_id) REFERENCES public.users(id);
--
-- Name: users users_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
--
--
--
--
--
--
--
--
--
--
--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: ghl_affiliates Admins can manage GHL affiliates; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: goaffpro_affiliates Admins can manage GoAffPro affiliates; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: goaffpro_commissions Admins can manage GoAffPro commissions; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: goaffpro_orders Admins can manage GoAffPro orders; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: goaffpro_payments Admins can manage GoAffPro payments; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: goaffpro_rewards Admins can manage GoAffPro rewards; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: shopify_products Admins can manage Shopify products; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: multi_level_commissions Admins can manage all commissions; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: commission_plans Admins can manage commission plans; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: data_import_logs Admins can manage import logs; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: payouts Admins can manage payouts; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: referral_relationships Admins can manage referral relationships; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: team_statistics Admins can manage team statistics; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: affiliates Admins can view all affiliates; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: clicks Admins can view all clicks; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: commissions Admins can view all commissions; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: transactions Admins can view all transactions; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: affiliate_import_logs Admins can view import logs; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: mightynetworks_affiliates Allow all operations for authenticated users; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: mightynetworks_commissions Allow all operations for authenticated users; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: mightynetworks_import_logs Allow all operations for authenticated users; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: mightynetworks_payouts Allow all operations for authenticated users; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: mightynetworks_referrals Allow all operations for authenticated users; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: affiliate_system_users Allow authenticated delete access; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: affiliate_system_users Allow authenticated insert access; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: affiliate_system_users Allow authenticated read access; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: affiliate_system_users Allow authenticated update access; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: jennaz_affiliates Allow authenticated users to read jennaz_affiliates; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: jennaz_commissions Allow authenticated users to read jennaz_commissions; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: jennaz_orders Allow authenticated users to read jennaz_orders; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: jennaz_payments Allow authenticated users to read jennaz_payments; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: jennaz_rewards Allow authenticated users to read jennaz_rewards; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: jennaz_affiliates Allow service role full access to jennaz_affiliates; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: jennaz_commissions Allow service role full access to jennaz_commissions; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: jennaz_orders Allow service role full access to jennaz_orders; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: jennaz_payments Allow service role full access to jennaz_payments; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: jennaz_rewards Allow service role full access to jennaz_rewards; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: goaffpro_affiliates Authenticated users can read GoAffPro affiliates; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: goaffpro_orders Authenticated users can read GoAffPro orders; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: goaffpro_payments Authenticated users can read GoAffPro payments; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: goaffpro_rewards Authenticated users can read GoAffPro rewards; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: commission_plans Authenticated users can read commission plans; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: data_import_logs Authenticated users can read import logs; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: clicks Referrers can see clicks from their affiliates; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: transactions Referrers can see transactions from their affiliates; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: affiliates Users can create their own affiliates; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: clicks Users can see clicks on their own referral code; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: commissions Users can see their own commissions; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: transactions Users can see transactions where they are the affiliate; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: affiliates Users can view their affiliate relationships; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: shopify_orders Users can view their attributed orders; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: multi_level_commissions Users can view their commissions; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: shopify_order_items Users can view their order items; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: payouts Users can view their payouts; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: referral_relationships Users can view their referral relationships; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: team_statistics Users can view their team statistics; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: affiliate_import_logs; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.affiliate_import_logs ENABLE ROW LEVEL SECURITY;
--
-- Name: affiliate_system_users; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.affiliate_system_users ENABLE ROW LEVEL SECURITY;
--
-- Name: affiliates; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
--
-- Name: clicks; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.clicks ENABLE ROW LEVEL SECURITY;
--
-- Name: commission_plans; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.commission_plans ENABLE ROW LEVEL SECURITY;
--
-- Name: commissions; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
--
-- Name: data_import_logs; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.data_import_logs ENABLE ROW LEVEL SECURITY;
--
-- Name: ghl_affiliates; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.ghl_affiliates ENABLE ROW LEVEL SECURITY;
--
-- Name: goaffpro_affiliates; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.goaffpro_affiliates ENABLE ROW LEVEL SECURITY;
--
-- Name: goaffpro_commissions; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.goaffpro_commissions ENABLE ROW LEVEL SECURITY;
--
-- Name: goaffpro_orders; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.goaffpro_orders ENABLE ROW LEVEL SECURITY;
--
-- Name: goaffpro_payments; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.goaffpro_payments ENABLE ROW LEVEL SECURITY;
--
-- Name: goaffpro_rewards; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.goaffpro_rewards ENABLE ROW LEVEL SECURITY;
--
-- Name: jennaz_affiliates; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.jennaz_affiliates ENABLE ROW LEVEL SECURITY;
--
-- Name: jennaz_commissions; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.jennaz_commissions ENABLE ROW LEVEL SECURITY;
--
-- Name: jennaz_orders; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.jennaz_orders ENABLE ROW LEVEL SECURITY;
--
-- Name: jennaz_payments; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.jennaz_payments ENABLE ROW LEVEL SECURITY;
--
-- Name: jennaz_rewards; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.jennaz_rewards ENABLE ROW LEVEL SECURITY;
--
-- Name: mightynetworks_affiliates; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.mightynetworks_affiliates ENABLE ROW LEVEL SECURITY;
--
-- Name: mightynetworks_commissions; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.mightynetworks_commissions ENABLE ROW LEVEL SECURITY;
--
-- Name: mightynetworks_import_logs; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.mightynetworks_import_logs ENABLE ROW LEVEL SECURITY;
--
-- Name: mightynetworks_payouts; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.mightynetworks_payouts ENABLE ROW LEVEL SECURITY;
--
-- Name: mightynetworks_referrals; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.mightynetworks_referrals ENABLE ROW LEVEL SECURITY;
--
-- Name: multi_level_commissions; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.multi_level_commissions ENABLE ROW LEVEL SECURITY;
--
-- Name: payouts; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
--
-- Name: referral_relationships; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.referral_relationships ENABLE ROW LEVEL SECURITY;
--
-- Name: shopify_order_items; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.shopify_order_items ENABLE ROW LEVEL SECURITY;
--
-- Name: shopify_orders; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.shopify_orders ENABLE ROW LEVEL SECURITY;
--
-- Name: shopify_products; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.shopify_products ENABLE ROW LEVEL SECURITY;
--
-- Name: shopify_webhooks; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.shopify_webhooks ENABLE ROW LEVEL SECURITY;
--
-- Name: team_statistics; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.team_statistics ENABLE ROW LEVEL SECURITY;
--
-- Name: transactions; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
--
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
--
-- Name: users users_insert_policy; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: users users_select_policy; Type: POLICY; Schema: public; Owner: postgres
--
--
-- Name: users users_update_policy; Type: POLICY; Schema: public; Owner: postgres
--
--
--
--
--
--
--
--
--
--
--
--
--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--
--
-- Name: SCHEMA net; Type: ACL; Schema: -; Owner: supabase_admin
--
--
--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: supabase_admin
--
--
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: supabase_admin
--
--
-- Name: TABLE affiliate_import_logs; Type: ACL; Schema: public; Owner: postgres
--
--
-- Name: TABLE affiliate_system_users; Type: ACL; Schema: public; Owner: postgres
--
--
-- Name: TABLE affiliates; Type: ACL; Schema: public; Owner: postgres
--
--
-- Name: TABLE clicks; Type: ACL; Schema: public; Owner: postgres
--
--
-- Name: TABLE commission_plans; Type: ACL; Schema: public; Owner: postgres
--
--
-- Name: TABLE commissions; Type: ACL; Schema: public; Owner: postgres
--
--
-- Name: TABLE data_import_logs; Type: ACL; Schema: public; Owner: postgres
--
--
-- Name: TABLE ghl_affiliates; Type: ACL; Schema: public; Owner: postgres
--
--
-- Name: TABLE goaffpro_affiliates; Type: ACL; Schema: public; Owner: postgres
--
--
-- Name: TABLE goaffpro_commissions; Type: ACL; Schema: public; Owner: postgres
--
--
-- Name: TABLE goaffpro_orders; Type: ACL; Schema: public; Owner: postgres
--
--
-- Name: TABLE goaffpro_payments; Type: ACL; Schema: public; Owner: postgres
--
--
-- Name: TABLE goaffpro_rewards; Type: ACL; Schema: public; Owner: postgres
--
--
-- Name: TABLE jennaz_affiliates; Type: ACL; Schema: public; Owner: postgres
--
--
-- Name: TABLE jennaz_commissions; Type: ACL; Schema: public; Owner: postgres
--
--
-- Name: TABLE jennaz_orders; Type: ACL; Schema: public; Owner: postgres
--
--
-- Name: TABLE jennaz_payments; Type: ACL; Schema: public; Owner: postgres
--
--
-- Name: TABLE jennaz_rewards; Type: ACL; Schema: public; Owner: postgres
--
--
-- Name: TABLE mightynetworks_affiliates; Type: ACL; Schema: public; Owner: postgres
--
--
-- Name: TABLE mightynetworks_commissions; Type: ACL; Schema: public; Owner: postgres
--
--
-- Name: TABLE mightynetworks_import_logs; Type: ACL; Schema: public; Owner: postgres
--
--
-- Name: TABLE mightynetworks_payouts; Type: ACL; Schema: public; Owner: postgres
--
--
-- Name: TABLE mightynetworks_referrals; Type: ACL; Schema: public; Owner: postgres
--
--
-- Name: TABLE multi_level_commissions; Type: ACL; Schema: public; Owner: postgres
--
--
-- Name: TABLE payouts; Type: ACL; Schema: public; Owner: postgres
--
--
-- Name: TABLE referral_relationships; Type: ACL; Schema: public; Owner: postgres
--
--
-- Name: TABLE shopify_order_items; Type: ACL; Schema: public; Owner: postgres
--
--
-- Name: TABLE shopify_orders; Type: ACL; Schema: public; Owner: postgres
--
--
-- Name: TABLE shopify_products; Type: ACL; Schema: public; Owner: postgres
--
--
-- Name: TABLE shopify_webhooks; Type: ACL; Schema: public; Owner: postgres
--
--
-- Name: TABLE team_statistics; Type: ACL; Schema: public; Owner: postgres
--
--
-- Name: TABLE transactions; Type: ACL; Schema: public; Owner: postgres
--
--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--
--
--
--
-- Name: TABLE messages_2025_06_10; Type: ACL; Schema: realtime; Owner: supabase_admin
--
--
-- Name: TABLE messages_2025_06_11; Type: ACL; Schema: realtime; Owner: supabase_admin
--
--
-- Name: TABLE messages_2025_06_12; Type: ACL; Schema: realtime; Owner: supabase_admin
--
--
-- Name: TABLE messages_2025_06_13; Type: ACL; Schema: realtime; Owner: supabase_admin
--
--
-- Name: TABLE messages_2025_06_14; Type: ACL; Schema: realtime; Owner: supabase_admin
--
--
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--
--
--
--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--
--
--
--
--
--
--
--
--
--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--
--
--
--
--
--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--
--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--
--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--
--
--
--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--
--
--
--
--
--
--
--
--
--
--
--
--
--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--
--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--
--
-- PostgreSQL database dump complete
--