-- JennaZ Affiliate Platform - Safe Migration Schema
-- Uses IF NOT EXISTS to avoid conflicts with existing tables
-- Safe to run multiple times
-- Generated: 2025-06-17T07:01:43.574Z

-- Basic client settings only
SET client_encoding = 'UTF8';

-- JennaZ Affiliate Platform - Super Clean Production Schema
-- Contains ONLY table definitions, indexes, and constraints
-- No server configuration, no functions, no extensions
-- Generated: 2025-06-17T06:41:37.203Z

-- Basic client settings only
SET client_encoding = 'UTF8';

-- Name: _realtime; Type: SCHEMA; Schema: -; Owner: postgres
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
-- Name: pg_net; Type: EXTENSION; Schema: -; Owner: -
-- Name: EXTENSION pg_net; Type: COMMENT; Schema: -; Owner: 
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
-- Name: supabase_functions; Type: SCHEMA; Schema: -; Owner: supabase_admin
-- Name: supabase_migrations; Type: SCHEMA; Schema: -; Owner: postgres
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: 
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
-- Name: pgjwt; Type: EXTENSION; Schema: -; Owner: -
-- Name: EXTENSION pgjwt; Type: COMMENT; Schema: -; Owner: 
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
-- Name: calculate_multi_level_commissions(text, text, text, text, numeric, timestamp with time zone, text, text, text, text); Type: FUNCTION; Schema: public; Owner: postgres
-- Name: check_first_user(); Type: FUNCTION; Schema: public; Owner: postgres
-- Name: get_commission_plan_for_product(text, text); Type: FUNCTION; Schema: public; Owner: postgres
-- Name: trigger_commission_team_statistics(); Type: FUNCTION; Schema: public; Owner: postgres
-- Name: trigger_update_team_statistics(); Type: FUNCTION; Schema: public; Owner: postgres
-- Name: update_team_statistics(uuid); Type: FUNCTION; Schema: public; Owner: postgres
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
-- Name: add_prefixes(text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
-- Name: delete_prefix(text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
-- Name: delete_prefix_hierarchy_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
-- Name: get_level(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
-- Name: get_prefix(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
-- Name: get_prefixes(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
-- Name: objects_insert_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
-- Name: objects_update_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
-- Name: prefixes_insert_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
-- Name: search_legacy_v1(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
-- Name: search_v1_optimised(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
-- Name: search_v2(text, text, integer, integer, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
-- Name: http_request(); Type: FUNCTION; Schema: supabase_functions; Owner: supabase_functions_admin
-- Name: extensions; Type: TABLE; Schema: _realtime; Owner: supabase_admin
-- Name: schema_migrations; Type: TABLE; Schema: _realtime; Owner: supabase_admin
-- Name: tenants; Type: TABLE; Schema: _realtime; Owner: supabase_admin
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
-- Name: affiliate_import_logs; Type: TABLE; Schema: public; Owner: postgres
CREATE TABLE IF NOT EXISTS public.affiliate_import_logs (
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

-- Name: affiliate_system_users; Type: TABLE; Schema: public; Owner: postgres
CREATE TABLE IF NOT EXISTS public.affiliate_system_users (
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

-- Name: affiliates; Type: TABLE; Schema: public; Owner: postgres
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

-- Name: clicks; Type: TABLE; Schema: public; Owner: postgres
CREATE TABLE IF NOT EXISTS public.clicks (
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

-- Name: commission_plans; Type: TABLE; Schema: public; Owner: postgres
CREATE TABLE IF NOT EXISTS public.commission_plans (
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

-- Name: TABLE commission_plans; Type: COMMENT; Schema: public; Owner: postgres
-- Name: commissions; Type: TABLE; Schema: public; Owner: postgres
CREATE TABLE IF NOT EXISTS public.commissions (
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

-- Name: data_import_logs; Type: TABLE; Schema: public; Owner: postgres
CREATE TABLE IF NOT EXISTS public.data_import_logs (
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

-- Name: ghl_affiliates; Type: TABLE; Schema: public; Owner: postgres
CREATE TABLE IF NOT EXISTS public.ghl_affiliates (
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

-- Name: goaffpro_affiliates; Type: TABLE; Schema: public; Owner: postgres
CREATE TABLE IF NOT EXISTS public.goaffpro_affiliates (
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

-- Name: goaffpro_commissions; Type: TABLE; Schema: public; Owner: postgres
CREATE TABLE IF NOT EXISTS public.goaffpro_commissions (
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

-- Name: goaffpro_orders; Type: TABLE; Schema: public; Owner: postgres
CREATE TABLE IF NOT EXISTS public.goaffpro_orders (
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

-- Name: goaffpro_payments; Type: TABLE; Schema: public; Owner: postgres
CREATE TABLE IF NOT EXISTS public.goaffpro_payments (
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

-- Name: goaffpro_rewards; Type: TABLE; Schema: public; Owner: postgres
CREATE TABLE IF NOT EXISTS public.goaffpro_rewards (
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

-- Name: jennaz_affiliates; Type: TABLE; Schema: public; Owner: postgres
CREATE TABLE IF NOT EXISTS public.jennaz_affiliates (
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

-- Name: TABLE jennaz_affiliates; Type: COMMENT; Schema: public; Owner: postgres
-- Name: jennaz_commissions; Type: TABLE; Schema: public; Owner: postgres
CREATE TABLE IF NOT EXISTS public.jennaz_commissions (
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

-- Name: TABLE jennaz_commissions; Type: COMMENT; Schema: public; Owner: postgres
-- Name: jennaz_orders; Type: TABLE; Schema: public; Owner: postgres
CREATE TABLE IF NOT EXISTS public.jennaz_orders (
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

-- Name: TABLE jennaz_orders; Type: COMMENT; Schema: public; Owner: postgres
-- Name: jennaz_payments; Type: TABLE; Schema: public; Owner: postgres
CREATE TABLE IF NOT EXISTS public.jennaz_payments (
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

-- Name: TABLE jennaz_payments; Type: COMMENT; Schema: public; Owner: postgres
-- Name: jennaz_rewards; Type: TABLE; Schema: public; Owner: postgres
CREATE TABLE IF NOT EXISTS public.jennaz_rewards (
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

-- Name: TABLE jennaz_rewards; Type: COMMENT; Schema: public; Owner: postgres
-- Name: mightynetworks_affiliates; Type: TABLE; Schema: public; Owner: postgres
CREATE TABLE IF NOT EXISTS public.mightynetworks_affiliates (
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

-- Name: TABLE mightynetworks_affiliates; Type: COMMENT; Schema: public; Owner: postgres
-- Name: mightynetworks_commissions; Type: TABLE; Schema: public; Owner: postgres
CREATE TABLE IF NOT EXISTS public.mightynetworks_commissions (
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

-- Name: TABLE mightynetworks_commissions; Type: COMMENT; Schema: public; Owner: postgres
-- Name: mightynetworks_import_logs; Type: TABLE; Schema: public; Owner: postgres
CREATE TABLE IF NOT EXISTS public.mightynetworks_import_logs (
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

-- Name: TABLE mightynetworks_import_logs; Type: COMMENT; Schema: public; Owner: postgres
-- Name: mightynetworks_payouts; Type: TABLE; Schema: public; Owner: postgres
CREATE TABLE IF NOT EXISTS public.mightynetworks_payouts (
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

-- Name: TABLE mightynetworks_payouts; Type: COMMENT; Schema: public; Owner: postgres
-- Name: mightynetworks_referrals; Type: TABLE; Schema: public; Owner: postgres
CREATE TABLE IF NOT EXISTS public.mightynetworks_referrals (
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

-- Name: TABLE mightynetworks_referrals; Type: COMMENT; Schema: public; Owner: postgres
-- Name: multi_level_commissions; Type: TABLE; Schema: public; Owner: postgres
CREATE TABLE IF NOT EXISTS public.multi_level_commissions (
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

-- Name: payouts; Type: TABLE; Schema: public; Owner: postgres
CREATE TABLE IF NOT EXISTS public.payouts (
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

-- Name: referral_relationships; Type: TABLE; Schema: public; Owner: postgres
CREATE TABLE IF NOT EXISTS public.referral_relationships (
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

-- Name: shopify_order_items; Type: TABLE; Schema: public; Owner: postgres
CREATE TABLE IF NOT EXISTS public.shopify_order_items (
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

-- Name: shopify_orders; Type: TABLE; Schema: public; Owner: postgres
CREATE TABLE IF NOT EXISTS public.shopify_orders (
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

-- Name: shopify_products; Type: TABLE; Schema: public; Owner: postgres
CREATE TABLE IF NOT EXISTS public.shopify_products (
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

-- Name: shopify_webhooks; Type: TABLE; Schema: public; Owner: postgres
CREATE TABLE IF NOT EXISTS public.shopify_webhooks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    topic text NOT NULL,
    shop_domain text NOT NULL,
    webhook_id text,
    payload jsonb,
    processed boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

-- Name: team_statistics; Type: TABLE; Schema: public; Owner: postgres
CREATE TABLE IF NOT EXISTS public.team_statistics (
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

-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
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

-- Name: users; Type: TABLE; Schema: public; Owner: postgres
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

-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
-- Name: messages_2025_06_10; Type: TABLE; Schema: realtime; Owner: supabase_admin
-- Name: messages_2025_06_11; Type: TABLE; Schema: realtime; Owner: supabase_admin
-- Name: messages_2025_06_12; Type: TABLE; Schema: realtime; Owner: supabase_admin
-- Name: messages_2025_06_13; Type: TABLE; Schema: realtime; Owner: supabase_admin
-- Name: messages_2025_06_14; Type: TABLE; Schema: realtime; Owner: supabase_admin
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
-- Name: prefixes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
-- Name: hooks; Type: TABLE; Schema: supabase_functions; Owner: supabase_functions_admin
-- Name: TABLE hooks; Type: COMMENT; Schema: supabase_functions; Owner: supabase_functions_admin
-- Name: hooks_id_seq; Type: SEQUENCE; Schema: supabase_functions; Owner: supabase_functions_admin
-- Name: hooks_id_seq; Type: SEQUENCE OWNED BY; Schema: supabase_functions; Owner: supabase_functions_admin
-- Name: migrations; Type: TABLE; Schema: supabase_functions; Owner: supabase_functions_admin
-- Name: schema_migrations; Type: TABLE; Schema: supabase_migrations; Owner: postgres
-- Name: seed_files; Type: TABLE; Schema: supabase_migrations; Owner: postgres
-- Name: messages_2025_06_10; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
-- Name: messages_2025_06_11; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
-- Name: messages_2025_06_12; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
-- Name: messages_2025_06_13; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
-- Name: messages_2025_06_14; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
-- Name: hooks id; Type: DEFAULT; Schema: supabase_functions; Owner: supabase_functions_admin
-- Name: extensions extensions_pkey; Type: CONSTRAINT; Schema: _realtime; Owner: supabase_admin
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: _realtime; Owner: supabase_admin
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: _realtime; Owner: supabase_admin
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
-- Name: affiliate_import_logs affiliate_import_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: affiliate_system_users affiliate_system_users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: affiliate_system_users affiliate_system_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: affiliate_system_users affiliate_system_users_referral_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: affiliates affiliates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: affiliates affiliates_referrer_id_affiliate_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: clicks clicks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: commission_plans commission_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: commissions commissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: data_import_logs data_import_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: ghl_affiliates ghl_affiliates_ghl_contact_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: ghl_affiliates ghl_affiliates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: goaffpro_affiliates goaffpro_affiliates_goaffpro_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: goaffpro_affiliates goaffpro_affiliates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: goaffpro_commissions goaffpro_commissions_goaffpro_commission_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: goaffpro_commissions goaffpro_commissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: goaffpro_orders goaffpro_orders_goaffpro_order_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: goaffpro_orders goaffpro_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: goaffpro_payments goaffpro_payments_goaffpro_payment_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: goaffpro_payments goaffpro_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: goaffpro_rewards goaffpro_rewards_goaffpro_reward_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: goaffpro_rewards goaffpro_rewards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: jennaz_affiliates jennaz_affiliates_jennaz_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: jennaz_affiliates jennaz_affiliates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: jennaz_commissions jennaz_commissions_jennaz_commission_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: jennaz_commissions jennaz_commissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: jennaz_orders jennaz_orders_jennaz_order_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: jennaz_orders jennaz_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: jennaz_payments jennaz_payments_jennaz_payment_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: jennaz_payments jennaz_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: jennaz_rewards jennaz_rewards_jennaz_reward_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: jennaz_rewards jennaz_rewards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: mightynetworks_affiliates mightynetworks_affiliates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: mightynetworks_affiliates mightynetworks_affiliates_rewardful_affiliate_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: mightynetworks_commissions mightynetworks_commissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: mightynetworks_commissions mightynetworks_commissions_rewardful_commission_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: mightynetworks_import_logs mightynetworks_import_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: mightynetworks_payouts mightynetworks_payouts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: mightynetworks_payouts mightynetworks_payouts_rewardful_payout_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: mightynetworks_referrals mightynetworks_referrals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: mightynetworks_referrals mightynetworks_referrals_rewardful_referral_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: multi_level_commissions multi_level_commissions_order_source_order_id_commission_le_key; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: multi_level_commissions multi_level_commissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: payouts payouts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: referral_relationships referral_relationships_affiliate_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: referral_relationships referral_relationships_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: shopify_order_items shopify_order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: shopify_orders shopify_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: shopify_orders shopify_orders_shopify_order_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: shopify_products shopify_products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: shopify_products shopify_products_shopify_product_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: shopify_webhooks shopify_webhooks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: team_statistics team_statistics_affiliate_id_period_start_period_end_key; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: team_statistics team_statistics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: transactions transactions_transaction_ref_key; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: users users_referral_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
-- Name: messages_2025_06_10 messages_2025_06_10_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
-- Name: messages_2025_06_11 messages_2025_06_11_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
-- Name: messages_2025_06_12 messages_2025_06_12_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
-- Name: messages_2025_06_13 messages_2025_06_13_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
-- Name: messages_2025_06_14 messages_2025_06_14_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
-- Name: prefixes prefixes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
-- Name: hooks hooks_pkey; Type: CONSTRAINT; Schema: supabase_functions; Owner: supabase_functions_admin
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: supabase_functions; Owner: supabase_functions_admin
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
-- Name: seed_files seed_files_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
-- Name: extensions_tenant_external_id_index; Type: INDEX; Schema: _realtime; Owner: supabase_admin
-- Name: extensions_tenant_external_id_type_index; Type: INDEX; Schema: _realtime; Owner: supabase_admin
-- Name: tenants_external_id_index; Type: INDEX; Schema: _realtime; Owner: supabase_admin
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
-- Name: idx_affiliate_system_users_email; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_affiliate_system_users_email ON public.affiliate_system_users USING btree (email);
-- Name: idx_affiliate_system_users_ghl_contact_id; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_affiliate_system_users_ghl_contact_id ON public.affiliate_system_users USING btree (ghl_contact_id);
-- Name: idx_affiliate_system_users_primary_source; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_affiliate_system_users_primary_source ON public.affiliate_system_users USING btree (primary_source);
-- Name: idx_affiliate_system_users_referral_code; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_affiliate_system_users_referral_code ON public.affiliate_system_users USING btree (referral_code);
-- Name: idx_data_import_logs_import_type; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_data_import_logs_import_type ON public.data_import_logs USING btree (import_type);
-- Name: idx_data_import_logs_status; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_data_import_logs_status ON public.data_import_logs USING btree (status);
-- Name: idx_ghl_affiliates_contact_id; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_ghl_affiliates_contact_id ON public.ghl_affiliates USING btree (ghl_contact_id);
-- Name: idx_ghl_affiliates_email; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_ghl_affiliates_email ON public.ghl_affiliates USING btree (email);
-- Name: idx_ghl_affiliates_referred_by; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_ghl_affiliates_referred_by ON public.ghl_affiliates USING btree (referred_by_contact_id);
-- Name: idx_goaffpro_affiliates_data_source; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_goaffpro_affiliates_data_source ON public.goaffpro_affiliates USING btree (data_source);
-- Name: idx_goaffpro_affiliates_email; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_goaffpro_affiliates_email ON public.goaffpro_affiliates USING btree (email);
-- Name: idx_goaffpro_affiliates_goaffpro_id; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_goaffpro_affiliates_goaffpro_id ON public.goaffpro_affiliates USING btree (goaffpro_id);
-- Name: idx_goaffpro_commissions_affiliate_id; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_goaffpro_commissions_affiliate_id ON public.goaffpro_commissions USING btree (affiliate_id);
-- Name: idx_goaffpro_commissions_data_source; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_goaffpro_commissions_data_source ON public.goaffpro_commissions USING btree (data_source);
-- Name: idx_goaffpro_commissions_order_id; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_goaffpro_commissions_order_id ON public.goaffpro_commissions USING btree (order_id);
-- Name: idx_goaffpro_orders_affiliate_id; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_goaffpro_orders_affiliate_id ON public.goaffpro_orders USING btree (affiliate_id);
-- Name: idx_goaffpro_orders_data_source; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_goaffpro_orders_data_source ON public.goaffpro_orders USING btree (data_source);
-- Name: idx_goaffpro_orders_goaffpro_id; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_goaffpro_orders_goaffpro_id ON public.goaffpro_orders USING btree (goaffpro_order_id);
-- Name: idx_goaffpro_payments_affiliate_id; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_goaffpro_payments_affiliate_id ON public.goaffpro_payments USING btree (affiliate_id);
-- Name: idx_goaffpro_payments_data_source; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_goaffpro_payments_data_source ON public.goaffpro_payments USING btree (data_source);
-- Name: idx_goaffpro_rewards_affiliate_id; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_goaffpro_rewards_affiliate_id ON public.goaffpro_rewards USING btree (affiliate_id);
-- Name: idx_goaffpro_rewards_data_source; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_goaffpro_rewards_data_source ON public.goaffpro_rewards USING btree (data_source);
-- Name: idx_jennaz_affiliates_data_source; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_jennaz_affiliates_data_source ON public.jennaz_affiliates USING btree (data_source);
-- Name: idx_jennaz_affiliates_email; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_jennaz_affiliates_email ON public.jennaz_affiliates USING btree (email);
-- Name: idx_jennaz_affiliates_jennaz_id; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_jennaz_affiliates_jennaz_id ON public.jennaz_affiliates USING btree (jennaz_id);
-- Name: idx_jennaz_affiliates_status; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_jennaz_affiliates_status ON public.jennaz_affiliates USING btree (status);
-- Name: idx_jennaz_commissions_affiliate_id; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_jennaz_commissions_affiliate_id ON public.jennaz_commissions USING btree (affiliate_id);
-- Name: idx_jennaz_commissions_data_source; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_jennaz_commissions_data_source ON public.jennaz_commissions USING btree (data_source);
-- Name: idx_jennaz_commissions_order_id; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_jennaz_commissions_order_id ON public.jennaz_commissions USING btree (order_id);
-- Name: idx_jennaz_orders_affiliate_id; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_jennaz_orders_affiliate_id ON public.jennaz_orders USING btree (affiliate_id);
-- Name: idx_jennaz_orders_data_source; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_jennaz_orders_data_source ON public.jennaz_orders USING btree (data_source);
-- Name: idx_jennaz_orders_jennaz_id; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_jennaz_orders_jennaz_id ON public.jennaz_orders USING btree (jennaz_order_id);
-- Name: idx_jennaz_orders_status; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_jennaz_orders_status ON public.jennaz_orders USING btree (order_status);
-- Name: idx_jennaz_payments_affiliate_id; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_jennaz_payments_affiliate_id ON public.jennaz_payments USING btree (affiliate_id);
-- Name: idx_jennaz_payments_data_source; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_jennaz_payments_data_source ON public.jennaz_payments USING btree (data_source);
-- Name: idx_jennaz_rewards_affiliate_id; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_jennaz_rewards_affiliate_id ON public.jennaz_rewards USING btree (affiliate_id);
-- Name: idx_jennaz_rewards_data_source; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_jennaz_rewards_data_source ON public.jennaz_rewards USING btree (data_source);
-- Name: idx_mightynetworks_affiliates_data_source; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_mightynetworks_affiliates_data_source ON public.mightynetworks_affiliates USING btree (data_source);
-- Name: idx_mightynetworks_affiliates_email; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_mightynetworks_affiliates_email ON public.mightynetworks_affiliates USING btree (email);
-- Name: idx_mightynetworks_affiliates_rewardful_id; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_mightynetworks_affiliates_rewardful_id ON public.mightynetworks_affiliates USING btree (rewardful_affiliate_id);
-- Name: idx_mightynetworks_affiliates_status; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_mightynetworks_affiliates_status ON public.mightynetworks_affiliates USING btree (status);
-- Name: idx_mightynetworks_commissions_affiliate_id; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_mightynetworks_commissions_affiliate_id ON public.mightynetworks_commissions USING btree (affiliate_id);
-- Name: idx_mightynetworks_commissions_date_earned; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_mightynetworks_commissions_date_earned ON public.mightynetworks_commissions USING btree (date_earned);
-- Name: idx_mightynetworks_commissions_status; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_mightynetworks_commissions_status ON public.mightynetworks_commissions USING btree (status);
-- Name: idx_mightynetworks_import_logs_started_at; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_mightynetworks_import_logs_started_at ON public.mightynetworks_import_logs USING btree (started_at);
-- Name: idx_mightynetworks_import_logs_status; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_mightynetworks_import_logs_status ON public.mightynetworks_import_logs USING btree (status);
-- Name: idx_mightynetworks_import_logs_type; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_mightynetworks_import_logs_type ON public.mightynetworks_import_logs USING btree (import_type);
-- Name: idx_mightynetworks_payouts_affiliate_id; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_mightynetworks_payouts_affiliate_id ON public.mightynetworks_payouts USING btree (affiliate_id);
-- Name: idx_mightynetworks_payouts_date; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_mightynetworks_payouts_date ON public.mightynetworks_payouts USING btree (payment_date);
-- Name: idx_mightynetworks_payouts_status; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_mightynetworks_payouts_status ON public.mightynetworks_payouts USING btree (status);
-- Name: idx_mightynetworks_referrals_affiliate_id; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_mightynetworks_referrals_affiliate_id ON public.mightynetworks_referrals USING btree (affiliate_id);
-- Name: idx_mightynetworks_referrals_date; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_mightynetworks_referrals_date ON public.mightynetworks_referrals USING btree (referral_date);
-- Name: idx_mightynetworks_referrals_rewardful_id; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_mightynetworks_referrals_rewardful_id ON public.mightynetworks_referrals USING btree (rewardful_referral_id);
-- Name: idx_mightynetworks_referrals_status; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_mightynetworks_referrals_status ON public.mightynetworks_referrals USING btree (status);
-- Name: idx_multi_level_commissions_earning_affiliate; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_multi_level_commissions_earning_affiliate ON public.multi_level_commissions USING btree (earning_affiliate_id);
-- Name: idx_multi_level_commissions_order_date; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_multi_level_commissions_order_date ON public.multi_level_commissions USING btree (order_date);
-- Name: idx_multi_level_commissions_order_source_id; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_multi_level_commissions_order_source_id ON public.multi_level_commissions USING btree (order_source, order_id);
-- Name: idx_multi_level_commissions_status; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_multi_level_commissions_status ON public.multi_level_commissions USING btree (status);
-- Name: idx_payouts_affiliate_id; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_payouts_affiliate_id ON public.payouts USING btree (affiliate_id);
-- Name: idx_payouts_status; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_payouts_status ON public.payouts USING btree (status);
-- Name: idx_referral_relationships_affiliate_id; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_referral_relationships_affiliate_id ON public.referral_relationships USING btree (affiliate_id);
-- Name: idx_referral_relationships_l1_referrer; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_referral_relationships_l1_referrer ON public.referral_relationships USING btree (l1_referrer_id);
-- Name: idx_referral_relationships_l2_referrer; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_referral_relationships_l2_referrer ON public.referral_relationships USING btree (l2_referrer_id);
-- Name: idx_referral_relationships_l3_referrer; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_referral_relationships_l3_referrer ON public.referral_relationships USING btree (l3_referrer_id);
-- Name: idx_shopify_order_items_order_id; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_shopify_order_items_order_id ON public.shopify_order_items USING btree (order_id);
-- Name: idx_shopify_orders_affiliate_id; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_shopify_orders_affiliate_id ON public.shopify_orders USING btree (affiliate_id);
-- Name: idx_shopify_orders_created_at; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_shopify_orders_created_at ON public.shopify_orders USING btree (created_at);
-- Name: idx_shopify_products_shopify_id; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_shopify_products_shopify_id ON public.shopify_products USING btree (shopify_product_id);
-- Name: idx_team_statistics_affiliate_id; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_team_statistics_affiliate_id ON public.team_statistics USING btree (affiliate_id);
-- Name: idx_team_statistics_period; Type: INDEX; Schema: public; Owner: postgres
CREATE INDEX IF NOT EXISTS idx_team_statistics_period ON public.team_statistics USING btree (period_start, period_end);
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
-- Name: idx_name_bucket_level_unique; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
-- Name: idx_objects_lower_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
-- Name: idx_prefixes_lower_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
-- Name: objects_bucket_id_level_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
-- Name: supabase_functions_hooks_h_table_id_h_name_idx; Type: INDEX; Schema: supabase_functions; Owner: supabase_functions_admin
-- Name: supabase_functions_hooks_request_id_idx; Type: INDEX; Schema: supabase_functions; Owner: supabase_functions_admin
-- Name: messages_2025_06_10_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
-- Name: messages_2025_06_11_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
-- Name: messages_2025_06_12_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
-- Name: messages_2025_06_13_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
-- Name: messages_2025_06_14_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
-- Name: affiliate_system_users set_affiliate_system_users_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
-- Name: affiliates set_affiliates_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
-- Name: commission_plans set_commission_plans_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
-- Name: commissions set_commissions_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
-- Name: users set_first_user_as_admin; Type: TRIGGER; Schema: public; Owner: postgres
-- Name: ghl_affiliates set_ghl_affiliates_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
-- Name: goaffpro_affiliates set_goaffpro_affiliates_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
-- Name: goaffpro_commissions set_goaffpro_commissions_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
-- Name: goaffpro_orders set_goaffpro_orders_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
-- Name: goaffpro_payments set_goaffpro_payments_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
-- Name: goaffpro_rewards set_goaffpro_rewards_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
-- Name: jennaz_affiliates set_jennaz_affiliates_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
-- Name: jennaz_commissions set_jennaz_commissions_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
-- Name: jennaz_orders set_jennaz_orders_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
-- Name: jennaz_payments set_jennaz_payments_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
-- Name: jennaz_rewards set_jennaz_rewards_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
-- Name: multi_level_commissions set_multi_level_commissions_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
-- Name: payouts set_payouts_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
-- Name: referral_relationships set_referral_relationships_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
-- Name: shopify_orders set_shopify_orders_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
-- Name: shopify_products set_shopify_products_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
-- Name: users set_users_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
-- Name: multi_level_commissions trigger_commissions_team_stats; Type: TRIGGER; Schema: public; Owner: postgres
-- Name: referral_relationships trigger_referral_relationships_team_stats; Type: TRIGGER; Schema: public; Owner: postgres
-- Name: mightynetworks_affiliates update_mightynetworks_affiliates_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
-- Name: mightynetworks_commissions update_mightynetworks_commissions_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
-- Name: mightynetworks_payouts update_mightynetworks_payouts_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
-- Name: mightynetworks_referrals update_mightynetworks_referrals_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
-- Name: objects objects_delete_delete_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
-- Name: objects objects_insert_create_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
-- Name: objects objects_update_create_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
-- Name: prefixes prefixes_create_hierarchy; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
-- Name: prefixes prefixes_delete_hierarchy; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
-- Name: extensions extensions_tenant_external_id_fkey; Type: FK CONSTRAINT; Schema: _realtime; Owner: supabase_admin
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
-- Name: affiliate_import_logs affiliate_import_logs_started_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: affiliates affiliates_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: affiliates affiliates_referrer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: clicks clicks_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: commissions commissions_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: commissions commissions_referrer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: commissions commissions_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: data_import_logs data_import_logs_started_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: goaffpro_commissions goaffpro_commissions_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: goaffpro_commissions goaffpro_commissions_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: goaffpro_orders goaffpro_orders_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: goaffpro_payments goaffpro_payments_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: goaffpro_rewards goaffpro_rewards_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: jennaz_commissions jennaz_commissions_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: jennaz_commissions jennaz_commissions_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: jennaz_orders jennaz_orders_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: jennaz_payments jennaz_payments_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: jennaz_rewards jennaz_rewards_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: mightynetworks_commissions mightynetworks_commissions_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: mightynetworks_commissions mightynetworks_commissions_referral_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: mightynetworks_import_logs mightynetworks_import_logs_started_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: mightynetworks_payouts mightynetworks_payouts_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: mightynetworks_referrals mightynetworks_referrals_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: multi_level_commissions multi_level_commissions_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: multi_level_commissions multi_level_commissions_earning_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: multi_level_commissions multi_level_commissions_purchasing_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: payouts payouts_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: payouts payouts_processed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: referral_relationships referral_relationships_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: referral_relationships referral_relationships_assigned_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: referral_relationships referral_relationships_l1_referrer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: referral_relationships referral_relationships_l2_referrer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: referral_relationships referral_relationships_l3_referrer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: shopify_order_items shopify_order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: shopify_orders shopify_orders_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: team_statistics team_statistics_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: transactions transactions_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: users users_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
-- Name: prefixes prefixes_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
-- Name: ghl_affiliates Admins can manage GHL affiliates; Type: POLICY; Schema: public; Owner: postgres
-- Name: goaffpro_affiliates Admins can manage GoAffPro affiliates; Type: POLICY; Schema: public; Owner: postgres
-- Name: goaffpro_commissions Admins can manage GoAffPro commissions; Type: POLICY; Schema: public; Owner: postgres
-- Name: goaffpro_orders Admins can manage GoAffPro orders; Type: POLICY; Schema: public; Owner: postgres
-- Name: goaffpro_payments Admins can manage GoAffPro payments; Type: POLICY; Schema: public; Owner: postgres
-- Name: goaffpro_rewards Admins can manage GoAffPro rewards; Type: POLICY; Schema: public; Owner: postgres
-- Name: shopify_products Admins can manage Shopify products; Type: POLICY; Schema: public; Owner: postgres
-- Name: multi_level_commissions Admins can manage all commissions; Type: POLICY; Schema: public; Owner: postgres
-- Name: commission_plans Admins can manage commission plans; Type: POLICY; Schema: public; Owner: postgres
-- Name: data_import_logs Admins can manage import logs; Type: POLICY; Schema: public; Owner: postgres
-- Name: payouts Admins can manage payouts; Type: POLICY; Schema: public; Owner: postgres
-- Name: referral_relationships Admins can manage referral relationships; Type: POLICY; Schema: public; Owner: postgres
-- Name: team_statistics Admins can manage team statistics; Type: POLICY; Schema: public; Owner: postgres
-- Name: affiliates Admins can view all affiliates; Type: POLICY; Schema: public; Owner: postgres
-- Name: clicks Admins can view all clicks; Type: POLICY; Schema: public; Owner: postgres
-- Name: commissions Admins can view all commissions; Type: POLICY; Schema: public; Owner: postgres
-- Name: transactions Admins can view all transactions; Type: POLICY; Schema: public; Owner: postgres
-- Name: affiliate_import_logs Admins can view import logs; Type: POLICY; Schema: public; Owner: postgres
-- Name: mightynetworks_affiliates Allow all operations for authenticated users; Type: POLICY; Schema: public; Owner: postgres
-- Name: mightynetworks_commissions Allow all operations for authenticated users; Type: POLICY; Schema: public; Owner: postgres
-- Name: mightynetworks_import_logs Allow all operations for authenticated users; Type: POLICY; Schema: public; Owner: postgres
-- Name: mightynetworks_payouts Allow all operations for authenticated users; Type: POLICY; Schema: public; Owner: postgres
-- Name: mightynetworks_referrals Allow all operations for authenticated users; Type: POLICY; Schema: public; Owner: postgres
-- Name: affiliate_system_users Allow authenticated delete access; Type: POLICY; Schema: public; Owner: postgres
-- Name: affiliate_system_users Allow authenticated insert access; Type: POLICY; Schema: public; Owner: postgres
-- Name: affiliate_system_users Allow authenticated read access; Type: POLICY; Schema: public; Owner: postgres
-- Name: affiliate_system_users Allow authenticated update access; Type: POLICY; Schema: public; Owner: postgres
-- Name: jennaz_affiliates Allow authenticated users to read jennaz_affiliates; Type: POLICY; Schema: public; Owner: postgres
-- Name: jennaz_commissions Allow authenticated users to read jennaz_commissions; Type: POLICY; Schema: public; Owner: postgres
-- Name: jennaz_orders Allow authenticated users to read jennaz_orders; Type: POLICY; Schema: public; Owner: postgres
-- Name: jennaz_payments Allow authenticated users to read jennaz_payments; Type: POLICY; Schema: public; Owner: postgres
-- Name: jennaz_rewards Allow authenticated users to read jennaz_rewards; Type: POLICY; Schema: public; Owner: postgres
-- Name: jennaz_affiliates Allow service role full access to jennaz_affiliates; Type: POLICY; Schema: public; Owner: postgres
-- Name: jennaz_commissions Allow service role full access to jennaz_commissions; Type: POLICY; Schema: public; Owner: postgres
-- Name: jennaz_orders Allow service role full access to jennaz_orders; Type: POLICY; Schema: public; Owner: postgres
-- Name: jennaz_payments Allow service role full access to jennaz_payments; Type: POLICY; Schema: public; Owner: postgres
-- Name: jennaz_rewards Allow service role full access to jennaz_rewards; Type: POLICY; Schema: public; Owner: postgres
-- Name: goaffpro_affiliates Authenticated users can read GoAffPro affiliates; Type: POLICY; Schema: public; Owner: postgres
-- Name: goaffpro_orders Authenticated users can read GoAffPro orders; Type: POLICY; Schema: public; Owner: postgres
-- Name: goaffpro_payments Authenticated users can read GoAffPro payments; Type: POLICY; Schema: public; Owner: postgres
-- Name: goaffpro_rewards Authenticated users can read GoAffPro rewards; Type: POLICY; Schema: public; Owner: postgres
-- Name: commission_plans Authenticated users can read commission plans; Type: POLICY; Schema: public; Owner: postgres
-- Name: data_import_logs Authenticated users can read import logs; Type: POLICY; Schema: public; Owner: postgres
-- Name: clicks Referrers can see clicks from their affiliates; Type: POLICY; Schema: public; Owner: postgres
-- Name: transactions Referrers can see transactions from their affiliates; Type: POLICY; Schema: public; Owner: postgres
-- Name: affiliates Users can create their own affiliates; Type: POLICY; Schema: public; Owner: postgres
-- Name: clicks Users can see clicks on their own referral code; Type: POLICY; Schema: public; Owner: postgres
-- Name: commissions Users can see their own commissions; Type: POLICY; Schema: public; Owner: postgres
-- Name: transactions Users can see transactions where they are the affiliate; Type: POLICY; Schema: public; Owner: postgres
-- Name: affiliates Users can view their affiliate relationships; Type: POLICY; Schema: public; Owner: postgres
-- Name: shopify_orders Users can view their attributed orders; Type: POLICY; Schema: public; Owner: postgres
-- Name: multi_level_commissions Users can view their commissions; Type: POLICY; Schema: public; Owner: postgres
-- Name: shopify_order_items Users can view their order items; Type: POLICY; Schema: public; Owner: postgres
-- Name: payouts Users can view their payouts; Type: POLICY; Schema: public; Owner: postgres
-- Name: referral_relationships Users can view their referral relationships; Type: POLICY; Schema: public; Owner: postgres
-- Name: team_statistics Users can view their team statistics; Type: POLICY; Schema: public; Owner: postgres
-- Name: affiliate_import_logs; Type: ROW SECURITY; Schema: public; Owner: postgres
-- Name: affiliate_system_users; Type: ROW SECURITY; Schema: public; Owner: postgres
-- Name: affiliates; Type: ROW SECURITY; Schema: public; Owner: postgres
-- Name: clicks; Type: ROW SECURITY; Schema: public; Owner: postgres
-- Name: commission_plans; Type: ROW SECURITY; Schema: public; Owner: postgres
-- Name: commissions; Type: ROW SECURITY; Schema: public; Owner: postgres
-- Name: data_import_logs; Type: ROW SECURITY; Schema: public; Owner: postgres
-- Name: ghl_affiliates; Type: ROW SECURITY; Schema: public; Owner: postgres
-- Name: goaffpro_affiliates; Type: ROW SECURITY; Schema: public; Owner: postgres
-- Name: goaffpro_commissions; Type: ROW SECURITY; Schema: public; Owner: postgres
-- Name: goaffpro_orders; Type: ROW SECURITY; Schema: public; Owner: postgres
-- Name: goaffpro_payments; Type: ROW SECURITY; Schema: public; Owner: postgres
-- Name: goaffpro_rewards; Type: ROW SECURITY; Schema: public; Owner: postgres
-- Name: jennaz_affiliates; Type: ROW SECURITY; Schema: public; Owner: postgres
-- Name: jennaz_commissions; Type: ROW SECURITY; Schema: public; Owner: postgres
-- Name: jennaz_orders; Type: ROW SECURITY; Schema: public; Owner: postgres
-- Name: jennaz_payments; Type: ROW SECURITY; Schema: public; Owner: postgres
-- Name: jennaz_rewards; Type: ROW SECURITY; Schema: public; Owner: postgres
-- Name: mightynetworks_affiliates; Type: ROW SECURITY; Schema: public; Owner: postgres
-- Name: mightynetworks_commissions; Type: ROW SECURITY; Schema: public; Owner: postgres
-- Name: mightynetworks_import_logs; Type: ROW SECURITY; Schema: public; Owner: postgres
-- Name: mightynetworks_payouts; Type: ROW SECURITY; Schema: public; Owner: postgres
-- Name: mightynetworks_referrals; Type: ROW SECURITY; Schema: public; Owner: postgres
-- Name: multi_level_commissions; Type: ROW SECURITY; Schema: public; Owner: postgres
-- Name: payouts; Type: ROW SECURITY; Schema: public; Owner: postgres
-- Name: referral_relationships; Type: ROW SECURITY; Schema: public; Owner: postgres
-- Name: shopify_order_items; Type: ROW SECURITY; Schema: public; Owner: postgres
-- Name: shopify_orders; Type: ROW SECURITY; Schema: public; Owner: postgres
-- Name: shopify_products; Type: ROW SECURITY; Schema: public; Owner: postgres
-- Name: shopify_webhooks; Type: ROW SECURITY; Schema: public; Owner: postgres
-- Name: team_statistics; Type: ROW SECURITY; Schema: public; Owner: postgres
-- Name: transactions; Type: ROW SECURITY; Schema: public; Owner: postgres
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: postgres
-- Name: users users_insert_policy; Type: POLICY; Schema: public; Owner: postgres
-- Name: users users_select_policy; Type: POLICY; Schema: public; Owner: postgres
-- Name: users users_update_policy; Type: POLICY; Schema: public; Owner: postgres
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
-- Name: prefixes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
-- Name: SCHEMA net; Type: ACL; Schema: -; Owner: supabase_admin
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
-- Name: SCHEMA supabase_functions; Type: ACL; Schema: -; Owner: supabase_admin
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
-- Name: FUNCTION algorithm_sign(signables text, secret text, algorithm text); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION sign(payload json, secret text, algorithm text); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION try_cast_double(inp text); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION url_decode(data text); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION url_encode(data bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION verify(token text, secret text, algorithm text); Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
-- Name: FUNCTION http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer); Type: ACL; Schema: net; Owner: supabase_admin
-- Name: FUNCTION http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer); Type: ACL; Schema: net; Owner: supabase_admin
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
-- Name: FUNCTION calculate_multi_level_commissions(p_order_source text, p_order_id text, p_customer_email text, p_customer_name text, p_order_total numeric, p_order_date timestamp with time zone, p_product_category text, p_product_name text, p_product_id text, p_purchasing_affiliate_email text); Type: ACL; Schema: public; Owner: postgres
-- Name: FUNCTION check_first_user(); Type: ACL; Schema: public; Owner: postgres
-- Name: FUNCTION get_commission_plan_for_product(p_product_name text, p_product_category text); Type: ACL; Schema: public; Owner: postgres
-- Name: FUNCTION trigger_commission_team_statistics(); Type: ACL; Schema: public; Owner: postgres
-- Name: FUNCTION trigger_update_team_statistics(); Type: ACL; Schema: public; Owner: postgres
-- Name: FUNCTION update_team_statistics(p_affiliate_id uuid); Type: ACL; Schema: public; Owner: postgres
-- Name: FUNCTION update_updated_at_column(); Type: ACL; Schema: public; Owner: postgres
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
-- Name: FUNCTION http_request(); Type: ACL; Schema: supabase_functions; Owner: supabase_functions_admin
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: supabase_admin
-- Name: TABLE affiliate_import_logs; Type: ACL; Schema: public; Owner: postgres
-- Name: TABLE affiliate_system_users; Type: ACL; Schema: public; Owner: postgres
-- Name: TABLE affiliates; Type: ACL; Schema: public; Owner: postgres
-- Name: TABLE clicks; Type: ACL; Schema: public; Owner: postgres
-- Name: TABLE commission_plans; Type: ACL; Schema: public; Owner: postgres
-- Name: TABLE commissions; Type: ACL; Schema: public; Owner: postgres
-- Name: TABLE data_import_logs; Type: ACL; Schema: public; Owner: postgres
-- Name: TABLE ghl_affiliates; Type: ACL; Schema: public; Owner: postgres
-- Name: TABLE goaffpro_affiliates; Type: ACL; Schema: public; Owner: postgres
-- Name: TABLE goaffpro_commissions; Type: ACL; Schema: public; Owner: postgres
-- Name: TABLE goaffpro_orders; Type: ACL; Schema: public; Owner: postgres
-- Name: TABLE goaffpro_payments; Type: ACL; Schema: public; Owner: postgres
-- Name: TABLE goaffpro_rewards; Type: ACL; Schema: public; Owner: postgres
-- Name: TABLE jennaz_affiliates; Type: ACL; Schema: public; Owner: postgres
-- Name: TABLE jennaz_commissions; Type: ACL; Schema: public; Owner: postgres
-- Name: TABLE jennaz_orders; Type: ACL; Schema: public; Owner: postgres
-- Name: TABLE jennaz_payments; Type: ACL; Schema: public; Owner: postgres
-- Name: TABLE jennaz_rewards; Type: ACL; Schema: public; Owner: postgres
-- Name: TABLE mightynetworks_affiliates; Type: ACL; Schema: public; Owner: postgres
-- Name: TABLE mightynetworks_commissions; Type: ACL; Schema: public; Owner: postgres
-- Name: TABLE mightynetworks_import_logs; Type: ACL; Schema: public; Owner: postgres
-- Name: TABLE mightynetworks_payouts; Type: ACL; Schema: public; Owner: postgres
-- Name: TABLE mightynetworks_referrals; Type: ACL; Schema: public; Owner: postgres
-- Name: TABLE multi_level_commissions; Type: ACL; Schema: public; Owner: postgres
-- Name: TABLE payouts; Type: ACL; Schema: public; Owner: postgres
-- Name: TABLE referral_relationships; Type: ACL; Schema: public; Owner: postgres
-- Name: TABLE shopify_order_items; Type: ACL; Schema: public; Owner: postgres
-- Name: TABLE shopify_orders; Type: ACL; Schema: public; Owner: postgres
-- Name: TABLE shopify_products; Type: ACL; Schema: public; Owner: postgres
-- Name: TABLE shopify_webhooks; Type: ACL; Schema: public; Owner: postgres
-- Name: TABLE team_statistics; Type: ACL; Schema: public; Owner: postgres
-- Name: TABLE transactions; Type: ACL; Schema: public; Owner: postgres
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
-- Name: TABLE messages_2025_06_10; Type: ACL; Schema: realtime; Owner: supabase_admin
-- Name: TABLE messages_2025_06_11; Type: ACL; Schema: realtime; Owner: supabase_admin
-- Name: TABLE messages_2025_06_12; Type: ACL; Schema: realtime; Owner: supabase_admin
-- Name: TABLE messages_2025_06_13; Type: ACL; Schema: realtime; Owner: supabase_admin
-- Name: TABLE messages_2025_06_14; Type: ACL; Schema: realtime; Owner: supabase_admin
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
-- Name: TABLE prefixes; Type: ACL; Schema: storage; Owner: supabase_storage_admin
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
-- Name: TABLE hooks; Type: ACL; Schema: supabase_functions; Owner: supabase_functions_admin
-- Name: SEQUENCE hooks_id_seq; Type: ACL; Schema: supabase_functions; Owner: supabase_functions_admin
-- Name: TABLE migrations; Type: ACL; Schema: supabase_functions; Owner: supabase_functions_admin
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: supabase_functions; Owner: supabase_admin
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: supabase_functions; Owner: supabase_admin
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: supabase_functions; Owner: supabase_admin
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin