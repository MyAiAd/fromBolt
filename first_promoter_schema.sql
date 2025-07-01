-- First Promoter Integration Schema
-- This adds support for importing affiliate data from First Promoter

-- First Promoter Affiliates table - Import data from First Promoter
CREATE TABLE IF NOT EXISTS first_promoter_affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_promoter_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  website TEXT,
  company_name TEXT,
  address TEXT,
  country TEXT,
  paypal_email TEXT,
  
  -- First Promoter specific fields
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended', 'approved')),
  referral_id TEXT, -- Their ref_id
  auth_token TEXT,
  
  -- Balance information
  earnings_balance DECIMAL(10,2) DEFAULT 0,
  current_balance DECIMAL(10,2) DEFAULT 0,
  paid_balance DECIMAL(10,2) DEFAULT 0,
  
  -- Dates
  signup_date TIMESTAMPTZ,
  last_activity TIMESTAMPTZ,
  
  -- Referral hierarchy
  parent_promoter_id TEXT, -- First Promoter parent ID
  
  -- Administrative
  note TEXT,
  raw_data JSONB, -- Store full First Promoter response
  
  -- Sync tracking
  last_synced TIMESTAMPTZ DEFAULT now(),
  sync_status TEXT DEFAULT 'synced' CHECK (sync_status IN ('synced', 'error', 'pending')),
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_first_promoter_affiliates_email ON first_promoter_affiliates(email);
CREATE INDEX IF NOT EXISTS idx_first_promoter_affiliates_referral_id ON first_promoter_affiliates(referral_id);
CREATE INDEX IF NOT EXISTS idx_first_promoter_affiliates_status ON first_promoter_affiliates(status);
CREATE INDEX IF NOT EXISTS idx_first_promoter_affiliates_parent ON first_promoter_affiliates(parent_promoter_id);

-- First Promoter Commissions table
CREATE TABLE IF NOT EXISTS first_promoter_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_promoter_commission_id TEXT NOT NULL UNIQUE,
  promoter_id TEXT NOT NULL, -- First Promoter promoter ID
  affiliate_id UUID REFERENCES affiliate_system_users(id), -- Our internal affiliate ID
  
  -- Commission details
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  
  -- Order information
  order_id TEXT,
  order_total DECIMAL(10,2),
  customer_email TEXT,
  
  -- Dates
  earned_date TIMESTAMPTZ,
  approved_date TIMESTAMPTZ,
  paid_date TIMESTAMPTZ,
  
  -- Raw data
  raw_data JSONB,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for First Promoter commissions
CREATE INDEX IF NOT EXISTS idx_first_promoter_commissions_promoter ON first_promoter_commissions(promoter_id);
CREATE INDEX IF NOT EXISTS idx_first_promoter_commissions_affiliate ON first_promoter_commissions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_first_promoter_commissions_status ON first_promoter_commissions(status);
CREATE INDEX IF NOT EXISTS idx_first_promoter_commissions_earned_date ON first_promoter_commissions(earned_date);

-- Add First Promoter fields to main affiliate_system_users table
ALTER TABLE affiliate_system_users 
ADD COLUMN IF NOT EXISTS first_promoter_id TEXT,
ADD COLUMN IF NOT EXISTS first_promoter_referral_id TEXT;

-- Index for the new fields
CREATE INDEX IF NOT EXISTS idx_affiliate_system_users_first_promoter_id ON affiliate_system_users(first_promoter_id);

-- Update the primary_source check constraint to include First Promoter
DO $$ 
BEGIN
    -- First, check if the constraint exists
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'affiliate_system_users_primary_source_check' 
        AND table_name = 'affiliate_system_users'
    ) THEN
        -- Drop the existing constraint
        ALTER TABLE affiliate_system_users DROP CONSTRAINT affiliate_system_users_primary_source_check;
    END IF;
    
    -- Add the updated constraint
    ALTER TABLE affiliate_system_users ADD CONSTRAINT affiliate_system_users_primary_source_check 
    CHECK (primary_source IN ('ghl', 'mightynetworks', 'shopify', 'goaffpro', 'manual', 'first_promoter'));
END $$;

-- Row Level Security policies for First Promoter tables
ALTER TABLE first_promoter_affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE first_promoter_commissions ENABLE ROW LEVEL SECURITY;

-- Policies for first_promoter_affiliates
CREATE POLICY "Users can view all first promoter affiliates" ON first_promoter_affiliates
FOR SELECT USING (true);

CREATE POLICY "Service role can manage first promoter affiliates" ON first_promoter_affiliates
FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Authenticated users can view first promoter affiliates" ON first_promoter_affiliates
FOR SELECT TO authenticated USING (true);

-- Policies for first_promoter_commissions  
CREATE POLICY "Users can view all first promoter commissions" ON first_promoter_commissions
FOR SELECT USING (true);

CREATE POLICY "Service role can manage first promoter commissions" ON first_promoter_commissions
FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Authenticated users can view first promoter commissions" ON first_promoter_commissions
FOR SELECT TO authenticated USING (true);

-- Updated timestamp triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_first_promoter_affiliates_updated_at BEFORE UPDATE ON first_promoter_affiliates
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_first_promoter_commissions_updated_at BEFORE UPDATE ON first_promoter_commissions  
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 