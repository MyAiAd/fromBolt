-- Missing Tables Migration for Production
-- Generated from localhost schema
-- Apply this to production to add missing tables

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET row_security = off;

-- Table: affiliates
CREATE TABLE IF NOT EXISTS "public"."affiliates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "referrer_id" "uuid" NOT NULL,
    "affiliate_id" "uuid" NOT NULL,
    "level" integer NOT NULL,
    "commission_rate" numeric(5,2) DEFAULT 10.00 NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "data_source" "text" DEFAULT 'test'::"text",
    CONSTRAINT "affiliates_data_source_check" CHECK (("data_source" = ANY (ARRAY['test'::"text", 'goaffpro'::"text"]))),
    CONSTRAINT "affiliates_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'active'::"text", 'inactive'::"text"])))
);

ALTER TABLE "public"."affiliates" OWNER TO "postgres";

-- Table: users
CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "name" "text",
    "referral_code" "text",
    "profile_image_url" "text",
    "bio" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "is_admin" boolean DEFAULT false,
    "data_source" "text" DEFAULT 'test'::"text",
    CONSTRAINT "users_data_source_check" CHECK (("data_source" = ANY (ARRAY['test'::"text", 'goaffpro'::"text"])))
);

ALTER TABLE "public"."users" OWNER TO "postgres";

-- Table: transactions
CREATE TABLE IF NOT EXISTS "public"."transactions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "transaction_ref" "text" NOT NULL,
    "affiliate_id" "uuid",
    "customer_email" "text" NOT NULL,
    "amount" numeric(10,2) NOT NULL,
    "product_name" "text" NOT NULL,
    "product_id" "text",
    "status" "text" DEFAULT 'completed'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "data_source" "text" DEFAULT 'test'::"text",
    CONSTRAINT "transactions_data_source_check" CHECK (("data_source" = ANY (ARRAY['test'::"text", 'goaffpro'::"text"]))),
    CONSTRAINT "transactions_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'completed'::"text", 'refunded'::"text"])))
);

ALTER TABLE "public"."transactions" OWNER TO "postgres";

-- Table: commissions
CREATE TABLE IF NOT EXISTS "public"."commissions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "transaction_id" "uuid" NOT NULL,
    "affiliate_id" "uuid" NOT NULL,
    "referrer_id" "uuid" NOT NULL,
    "level" integer NOT NULL,
    "amount" numeric(10,2) NOT NULL,
    "rate_applied" numeric(5,2) NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "payout_date" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "data_source" "text" DEFAULT 'test'::"text",
    CONSTRAINT "commissions_data_source_check" CHECK (("data_source" = ANY (ARRAY['test'::"text", 'goaffpro'::"text"]))),
    CONSTRAINT "commissions_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'paid'::"text", 'cancelled'::"text"])))
);

ALTER TABLE "public"."commissions" OWNER TO "postgres";

-- Table: clicks
CREATE TABLE IF NOT EXISTS "public"."clicks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "affiliate_id" "uuid" NOT NULL,
    "referral_code" "text" NOT NULL,
    "ip_address" "text",
    "user_agent" "text",
    "conversion_status" "text" DEFAULT 'clicked'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "data_source" "text" DEFAULT 'test'::"text",
    CONSTRAINT "clicks_conversion_status_check" CHECK (("conversion_status" = ANY (ARRAY['clicked'::"text", 'converted'::"text"]))),
    CONSTRAINT "clicks_data_source_check" CHECK (("data_source" = ANY (ARRAY['test'::"text", 'goaffpro'::"text"])))
);

ALTER TABLE "public"."clicks" OWNER TO "postgres";

-- Table: shopify_orders
CREATE TABLE IF NOT EXISTS "public"."shopify_orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "shopify_order_id" "text" NOT NULL,
    "order_number" "text" NOT NULL,
    "email" "text",
    "total_price" numeric(10,2) NOT NULL,
    "subtotal_price" numeric(10,2),
    "total_tax" numeric(10,2),
    "currency" "text",
    "financial_status" "text",
    "fulfillment_status" "text",
    "customer_id" "text",
    "first_name" "text",
    "last_name" "text",
    "affiliate_id" "uuid",
    "referral_code" "text",
    "utm_source" "text",
    "utm_medium" "text",
    "utm_campaign" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "data_source" "text" DEFAULT 'test'::"text",
    CONSTRAINT "shopify_orders_data_source_check" CHECK (("data_source" = ANY (ARRAY['test'::"text", 'goaffpro'::"text"])))
);

ALTER TABLE "public"."shopify_orders" OWNER TO "postgres";

-- Table: shopify_order_items
CREATE TABLE IF NOT EXISTS "public"."shopify_order_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "order_id" "uuid" NOT NULL,
    "shopify_product_id" "text" NOT NULL,
    "variant_id" "text",
    "title" "text" NOT NULL,
    "quantity" integer NOT NULL,
    "price" numeric(10,2) NOT NULL,
    "sku" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."shopify_order_items" OWNER TO "postgres";

-- Table: goaffpro_affiliates
CREATE TABLE IF NOT EXISTS "public"."goaffpro_affiliates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "goaffpro_id" "text" NOT NULL,
    "email" "text" NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "date_created" timestamp with time zone,
    "status" "text",
    "referral_code" "text",
    "referral_link" "text",
    "commission_rate" numeric(5,2),
    "total_orders" integer DEFAULT 0,
    "total_sales" numeric(10,2) DEFAULT 0.00,
    "total_commissions" numeric(10,2) DEFAULT 0.00,
    "last_order_date" timestamp with time zone,
    "last_synced" timestamp with time zone DEFAULT "now"(),
    "raw_data" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."goaffpro_affiliates" OWNER TO "postgres";

-- Table: goaffpro_orders
CREATE TABLE IF NOT EXISTS "public"."goaffpro_orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "goaffpro_order_id" "text" NOT NULL,
    "affiliate_id" "uuid",
    "goaffpro_affiliate_id" "text",
    "order_number" "text",
    "customer_email" "text",
    "order_date" timestamp with time zone,
    "order_amount" numeric(10,2),
    "commission_amount" numeric(10,2),
    "commission_status" "text",
    "commission_date" timestamp with time zone,
    "raw_data" "jsonb",
    "last_synced" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."goaffpro_orders" OWNER TO "postgres";

-- Table: data_sync_logs
CREATE TABLE IF NOT EXISTS "public"."data_sync_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "source" "text" NOT NULL,
    "sync_type" "text" NOT NULL,
    "status" "text" NOT NULL,
    "started_at" timestamp with time zone DEFAULT "now"(),
    "completed_at" timestamp with time zone,
    "records_processed" integer DEFAULT 0,
    "records_successful" integer DEFAULT 0,
    "records_failed" integer DEFAULT 0,
    "error_details" "jsonb",
    "summary" "jsonb",
    "started_by" "uuid",
    "config" "jsonb",
    CONSTRAINT "data_sync_logs_source_check" CHECK (("source" = ANY (ARRAY['goaffpro'::"text", 'mightynetworks'::"text", 'jennaz'::"text", 'shopify'::"text"]))),
    CONSTRAINT "data_sync_logs_status_check" CHECK (("status" = ANY (ARRAY['started'::"text", 'completed'::"text", 'failed'::"text", 'partial'::"text"]))),
    CONSTRAINT "data_sync_logs_sync_type_check" CHECK (("sync_type" = ANY (ARRAY['affiliates'::"text", 'orders'::"text", 'commissions'::"text", 'full'::"text"])))
);

ALTER TABLE "public"."data_sync_logs" OWNER TO "postgres";

-- Table: jennaz_orders
CREATE TABLE IF NOT EXISTS "public"."jennaz_orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "jennaz_order_id" "text" NOT NULL,
    "affiliate_id" "uuid",
    "jennaz_affiliate_id" "text",
    "customer_email" "text",
    "customer_name" "text",
    "order_date" timestamp with time zone,
    "order_amount" numeric(10,2),
    "commission_amount" numeric(10,2),
    "commission_percentage" numeric(5,2),
    "commission_status" "text",
    "commission_date" timestamp with time zone,
    "product_name" "text",
    "product_id" "text",
    "order_status" "text",
    "payment_status" "text",
    "contact_id" "text",
    "pipeline_id" "text",
    "pipeline_stage" "text",
    "raw_data" "jsonb",
    "last_synced" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."jennaz_orders" OWNER TO "postgres";

-- Enable Row Level Security for missing tables
ALTER TABLE IF EXISTS affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS shopify_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS shopify_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS goaffpro_affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS goaffpro_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS data_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS jennaz_orders ENABLE ROW LEVEL SECURITY;
