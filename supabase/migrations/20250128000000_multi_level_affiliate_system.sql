/*
  # Multi-Level Affiliate System (MLM) with Go High Level Integration
  
  This migration creates the new affiliate system that will replace GoAffPro
  and supports 3-level commission structure with GHL as primary signup source.
  
  1. Core Tables:
    - `affiliate_system_users` - Master affiliate table (consolidates all sources)
    - `referral_relationships` - Tracks who referred whom (multi-level tree)
    - `commission_plans` - Product commission rates for each level
    - `multi_level_commissions` - Calculated commissions for L1, L2, L3
    - `ghl_affiliates` - Go High Level import data
    - `payouts` - Payout management
    - `team_statistics` - Pre-calculated team stats for performance
  
  2. Features:
    - Multi-source data consolidation (GHL, MightyNetworks, Shopify, GoAffPro)
    - 3-level commission structure with custom rates per product
    - Referral tracking with codes and manual assignment
    - Team management and statistics
    - Admin oversight capabilities
    - Performance optimization with materialized views
*/

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Commission Plans table - Define commission rates for each product and level
CREATE TABLE IF NOT EXISTS commission_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_category TEXT NOT NULL, -- 'coaching_program', 'affiliate_software', 'mastermind', etc.
  product_name TEXT NOT NULL,
  shopify_product_id TEXT,
  level_1_rate DECIMAL(5,2) NOT NULL, -- e.g., 20.00 for 20%
  level_2_rate DECIMAL(5,2) NOT NULL, -- e.g., 5.00 for 5%
  level_3_rate DECIMAL(5,2) NOT NULL, -- e.g., 2.00 for 2%
  is_active BOOLEAN DEFAULT true,
  effective_from TIMESTAMPTZ DEFAULT now(),
  effective_until TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Master Affiliate Users table - Consolidates all affiliate sources
CREATE TABLE IF NOT EXISTS affiliate_system_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  referral_code TEXT UNIQUE,
  
  -- Source tracking
  primary_source TEXT NOT NULL CHECK (primary_source IN ('ghl', 'mightynetworks', 'shopify', 'goaffpro', 'manual')),
  ghl_contact_id TEXT,
  mighty_member_id TEXT,
  goaffpro_affiliate_id TEXT,
  shopify_customer_id TEXT,
  
  -- Status and metrics
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
  signup_date TIMESTAMPTZ,
  last_active TIMESTAMPTZ,
  
  -- Team metrics (cached for performance)
  total_l1_affiliates INTEGER DEFAULT 0,
  total_l2_affiliates INTEGER DEFAULT 0,
  total_l3_affiliates INTEGER DEFAULT 0,
  total_team_size INTEGER DEFAULT 0,
  
  -- Commission totals (cached for performance)
  total_l1_earnings DECIMAL(10,2) DEFAULT 0,
  total_l2_earnings DECIMAL(10,2) DEFAULT 0,
  total_l3_earnings DECIMAL(10,2) DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  pending_earnings DECIMAL(10,2) DEFAULT 0,
  paid_earnings DECIMAL(10,2) DEFAULT 0,
  
  -- Additional fields
  payout_email TEXT,
  payment_method TEXT,
  notes TEXT,
  custom_fields JSONB,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Referral Relationships table - Tracks the multi-level referral tree
CREATE TABLE IF NOT EXISTS referral_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- The person being referred
  affiliate_id UUID NOT NULL REFERENCES affiliate_system_users(id) ON DELETE CASCADE,
  
  -- Their direct referrer (Level 1)
  l1_referrer_id UUID REFERENCES affiliate_system_users(id) ON DELETE SET NULL,
  
  -- Their indirect referrer (Level 2) - referrer's referrer
  l2_referrer_id UUID REFERENCES affiliate_system_users(id) ON DELETE SET NULL,
  
  -- Their grand referrer (Level 3) - referrer's referrer's referrer
  l3_referrer_id UUID REFERENCES affiliate_system_users(id) ON DELETE SET NULL,
  
  -- Tracking
  referral_method TEXT CHECK (referral_method IN ('referral_code', 'manual_assignment', 'import')),
  referral_code_used TEXT,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_date TIMESTAMPTZ DEFAULT now(),
  
  -- Prevent duplicate relationships
  UNIQUE(affiliate_id),
  
  -- Prevent self-referrals at any level
  CHECK (affiliate_id != l1_referrer_id),
  CHECK (affiliate_id != l2_referrer_id),
  CHECK (affiliate_id != l3_referrer_id),
  CHECK (l1_referrer_id != l2_referrer_id OR l1_referrer_id IS NULL OR l2_referrer_id IS NULL),
  CHECK (l1_referrer_id != l3_referrer_id OR l1_referrer_id IS NULL OR l3_referrer_id IS NULL),
  CHECK (l2_referrer_id != l3_referrer_id OR l2_referrer_id IS NULL OR l3_referrer_id IS NULL),
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Multi-Level Commissions table - Tracks all commission calculations
CREATE TABLE IF NOT EXISTS multi_level_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Order information
  order_source TEXT NOT NULL CHECK (order_source IN ('shopify', 'mightynetworks', 'goaffpro', 'manual')),
  order_id TEXT NOT NULL, -- External order ID
  internal_order_id UUID, -- Reference to our order tables if applicable
  
  -- Customer details
  customer_email TEXT,
  customer_name TEXT,
  order_total DECIMAL(10,2) NOT NULL,
  order_date TIMESTAMPTZ NOT NULL,
  
  -- Product information
  product_category TEXT,
  product_name TEXT,
  product_id TEXT,
  
  -- Commission details
  purchasing_affiliate_id UUID REFERENCES affiliate_system_users(id), -- Who made the sale
  commission_level INTEGER NOT NULL CHECK (commission_level IN (1, 2, 3)),
  earning_affiliate_id UUID NOT NULL REFERENCES affiliate_system_users(id), -- Who earns the commission
  
  commission_rate DECIMAL(5,2) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  
  -- Status tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled', 'disputed')),
  approved_date TIMESTAMPTZ,
  paid_date TIMESTAMPTZ,
  payout_id UUID, -- Reference to payouts table
  
  -- Admin fields
  approved_by UUID REFERENCES auth.users(id),
  notes TEXT,
  
  -- Prevent duplicate commissions
  UNIQUE(order_source, order_id, commission_level, earning_affiliate_id),
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Go High Level Affiliates table - Import data from GHL
CREATE TABLE IF NOT EXISTS ghl_affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ghl_contact_id TEXT UNIQUE NOT NULL,
  
  -- Contact information
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  
  -- GHL specific fields
  contact_source TEXT,
  tags JSONB,
  custom_fields JSONB,
  date_added TIMESTAMPTZ,
  last_activity TIMESTAMPTZ,
  
  -- Referral information
  referred_by_contact_id TEXT,
  referral_code TEXT,
  
  -- Status
  status TEXT,
  
  -- Sync tracking
  last_synced TIMESTAMPTZ DEFAULT now(),
  sync_status TEXT DEFAULT 'synced' CHECK (sync_status IN ('synced', 'error', 'pending')),
  raw_data JSONB,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Team Statistics table - Pre-calculated team metrics for performance
CREATE TABLE IF NOT EXISTS team_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES affiliate_system_users(id) ON DELETE CASCADE,
  
  -- Team size metrics
  l1_direct_count INTEGER DEFAULT 0,
  l2_indirect_count INTEGER DEFAULT 0,
  l3_total_count INTEGER DEFAULT 0,
  total_team_size INTEGER DEFAULT 0,
  
  -- Sales metrics for their team
  l1_sales_volume DECIMAL(12,2) DEFAULT 0,
  l2_sales_volume DECIMAL(12,2) DEFAULT 0,
  l3_sales_volume DECIMAL(12,2) DEFAULT 0,
  total_team_volume DECIMAL(12,2) DEFAULT 0,
  
  -- Commission metrics
  l1_commissions_earned DECIMAL(10,2) DEFAULT 0,
  l2_commissions_earned DECIMAL(10,2) DEFAULT 0,
  l3_commissions_earned DECIMAL(10,2) DEFAULT 0,
  total_commissions DECIMAL(10,2) DEFAULT 0,
  
  -- Time period for these stats
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  calculation_date TIMESTAMPTZ DEFAULT now(),
  
  -- Prevent duplicate periods per affiliate
  UNIQUE(affiliate_id, period_start, period_end),
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Payouts table - Manage commission payouts
CREATE TABLE IF NOT EXISTS payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES affiliate_system_users(id),
  
  -- Payout details
  amount DECIMAL(10,2) NOT NULL,
  commission_ids UUID[] NOT NULL, -- Array of commission IDs included
  
  -- Payment information
  payment_method TEXT CHECK (payment_method IN ('paypal', 'stripe', 'bank_transfer', 'wise', 'manual')),
  payment_email TEXT,
  payment_details JSONB,
  
  -- Status tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  requested_date TIMESTAMPTZ DEFAULT now(),
  processed_date TIMESTAMPTZ,
  completed_date TIMESTAMPTZ,
  
  -- External tracking
  transaction_id TEXT,
  payment_gateway_response JSONB,
  
  -- Admin fields
  processed_by UUID REFERENCES auth.users(id),
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Import Logs table - Track all import operations
CREATE TABLE IF NOT EXISTS affiliate_import_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  import_source TEXT NOT NULL CHECK (import_source IN ('ghl', 'mightynetworks', 'shopify', 'goaffpro', 'manual')),
  import_type TEXT NOT NULL CHECK (import_type IN ('affiliates', 'orders', 'full_sync')),
  
  -- Status tracking
  status TEXT NOT NULL CHECK (status IN ('started', 'completed', 'failed', 'partial')),
  started_by UUID REFERENCES auth.users(id),
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  
  -- Metrics
  records_processed INTEGER DEFAULT 0,
  records_successful INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  
  -- Error tracking
  error_details JSONB,
  warnings JSONB,
  
  -- Configuration used for import
  import_config JSONB,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_affiliate_system_users_email ON affiliate_system_users(email);
CREATE INDEX IF NOT EXISTS idx_affiliate_system_users_referral_code ON affiliate_system_users(referral_code);
CREATE INDEX IF NOT EXISTS idx_affiliate_system_users_primary_source ON affiliate_system_users(primary_source);
CREATE INDEX IF NOT EXISTS idx_affiliate_system_users_ghl_contact_id ON affiliate_system_users(ghl_contact_id);

CREATE INDEX IF NOT EXISTS idx_referral_relationships_affiliate_id ON referral_relationships(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_referral_relationships_l1_referrer ON referral_relationships(l1_referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_relationships_l2_referrer ON referral_relationships(l2_referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_relationships_l3_referrer ON referral_relationships(l3_referrer_id);

CREATE INDEX IF NOT EXISTS idx_multi_level_commissions_earning_affiliate ON multi_level_commissions(earning_affiliate_id);
CREATE INDEX IF NOT EXISTS idx_multi_level_commissions_order_date ON multi_level_commissions(order_date);
CREATE INDEX IF NOT EXISTS idx_multi_level_commissions_status ON multi_level_commissions(status);
CREATE INDEX IF NOT EXISTS idx_multi_level_commissions_order_source_id ON multi_level_commissions(order_source, order_id);

CREATE INDEX IF NOT EXISTS idx_ghl_affiliates_contact_id ON ghl_affiliates(ghl_contact_id);
CREATE INDEX IF NOT EXISTS idx_ghl_affiliates_email ON ghl_affiliates(email);
CREATE INDEX IF NOT EXISTS idx_ghl_affiliates_referred_by ON ghl_affiliates(referred_by_contact_id);

CREATE INDEX IF NOT EXISTS idx_team_statistics_affiliate_id ON team_statistics(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_team_statistics_period ON team_statistics(period_start, period_end);

CREATE INDEX IF NOT EXISTS idx_payouts_affiliate_id ON payouts(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON payouts(status);

-- Enable Row Level Security
ALTER TABLE commission_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_system_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE multi_level_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ghl_affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_import_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Commission Plans - Admin only for modifications, read for authenticated users
CREATE POLICY "Admins can manage commission plans"
  ON commission_plans
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id
      AND (auth.users.raw_user_meta_data->>'is_admin')::boolean = true
    )
  );

CREATE POLICY "Authenticated users can read commission plans"
  ON commission_plans
  FOR SELECT
  TO authenticated
  USING (true);

-- Affiliate System Users - Users can see their own data and their team
CREATE POLICY "Users can view their own affiliate data"
  ON affiliate_system_users
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT id FROM affiliate_system_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Users can view their team members"
  ON affiliate_system_users
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT affiliate_id FROM referral_relationships 
      WHERE l1_referrer_id IN (
        SELECT id FROM affiliate_system_users 
        WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
      )
      OR l2_referrer_id IN (
        SELECT id FROM affiliate_system_users 
        WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
      )
      OR l3_referrer_id IN (
        SELECT id FROM affiliate_system_users 
        WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
      )
    )
  );

CREATE POLICY "Admins can manage all affiliate users"
  ON affiliate_system_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id
      AND (auth.users.raw_user_meta_data->>'is_admin')::boolean = true
    )
  );

-- Referral Relationships - Users can see their own relationships and team
CREATE POLICY "Users can view their referral relationships"
  ON referral_relationships
  FOR SELECT
  TO authenticated
  USING (
    affiliate_id IN (
      SELECT id FROM affiliate_system_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
    OR l1_referrer_id IN (
      SELECT id FROM affiliate_system_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
    OR l2_referrer_id IN (
      SELECT id FROM affiliate_system_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
    OR l3_referrer_id IN (
      SELECT id FROM affiliate_system_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Admins can manage referral relationships"
  ON referral_relationships
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id
      AND (auth.users.raw_user_meta_data->>'is_admin')::boolean = true
    )
  );

-- Multi-Level Commissions - Users can see commissions they earned
CREATE POLICY "Users can view their commissions"
  ON multi_level_commissions
  FOR SELECT
  TO authenticated
  USING (
    earning_affiliate_id IN (
      SELECT id FROM affiliate_system_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Admins can manage all commissions"
  ON multi_level_commissions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id
      AND (auth.users.raw_user_meta_data->>'is_admin')::boolean = true
    )
  );

-- Similar policies for other tables...
CREATE POLICY "Admins can manage GHL affiliates"
  ON ghl_affiliates
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id
      AND (auth.users.raw_user_meta_data->>'is_admin')::boolean = true
    )
  );

CREATE POLICY "Users can view their team statistics"
  ON team_statistics
  FOR SELECT
  TO authenticated
  USING (
    affiliate_id IN (
      SELECT id FROM affiliate_system_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Admins can manage team statistics"
  ON team_statistics
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id
      AND (auth.users.raw_user_meta_data->>'is_admin')::boolean = true
    )
  );

CREATE POLICY "Users can view their payouts"
  ON payouts
  FOR SELECT
  TO authenticated
  USING (
    affiliate_id IN (
      SELECT id FROM affiliate_system_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Admins can manage payouts"
  ON payouts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id
      AND (auth.users.raw_user_meta_data->>'is_admin')::boolean = true
    )
  );

CREATE POLICY "Admins can view import logs"
  ON affiliate_import_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id
      AND (auth.users.raw_user_meta_data->>'is_admin')::boolean = true
    )
  );

-- Add updated_at triggers
CREATE TRIGGER set_commission_plans_updated_at
  BEFORE UPDATE ON commission_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_affiliate_system_users_updated_at
  BEFORE UPDATE ON affiliate_system_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_referral_relationships_updated_at
  BEFORE UPDATE ON referral_relationships
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_multi_level_commissions_updated_at
  BEFORE UPDATE ON multi_level_commissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_ghl_affiliates_updated_at
  BEFORE UPDATE ON ghl_affiliates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_payouts_updated_at
  BEFORE UPDATE ON payouts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 