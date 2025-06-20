-- Migration for JennaZ (Go High Level) Affiliate Integration
-- This migration creates tables to store affiliate data from Go High Level (GHL)
-- Tables created:
-- - `jennaz_affiliates` - Store affiliate data from JennaZ/GHL
-- - `jennaz_orders` - Store order data from JennaZ/GHL  
-- - `jennaz_rewards` - Store reward data from JennaZ/GHL
-- - `jennaz_payments` - Store payment data from JennaZ/GHL
-- - `jennaz_commissions` - Store commission data from JennaZ/GHL

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =============================================
-- JennaZ Affiliates Table
-- =============================================
CREATE TABLE IF NOT EXISTS jennaz_affiliates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  jennaz_id TEXT NOT NULL UNIQUE, -- GHL contact/affiliate ID
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  status TEXT DEFAULT 'pending', -- pending, active, inactive, suspended
  referral_code TEXT,
  commission_rate DECIMAL(5,2) DEFAULT 0.00, -- percentage rate
  balance DECIMAL(12,2) DEFAULT 0.00,
  total_earnings DECIMAL(12,2) DEFAULT 0.00,
  total_orders INTEGER DEFAULT 0,
  signup_date TIMESTAMP WITH TIME ZONE,
  last_login TIMESTAMP WITH TIME ZONE,
  payout_method TEXT, -- paypal, bank_transfer, etc.
  payout_email TEXT,
  notes TEXT,
  tags TEXT[], -- array of tags from GHL
  custom_fields JSONB, -- flexible storage for GHL custom fields
  raw_data JSONB, -- store the full API response
  data_source TEXT NOT NULL DEFAULT 'jennaz', -- jennaz, test
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- JennaZ Orders Table
-- =============================================
CREATE TABLE IF NOT EXISTS jennaz_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  jennaz_order_id TEXT NOT NULL UNIQUE, -- GHL order/opportunity ID
  jennaz_affiliate_id TEXT, -- Reference to GHL affiliate ID
  affiliate_id UUID REFERENCES jennaz_affiliates(id), -- Foreign key to our affiliates table
  contact_id TEXT, -- GHL contact ID for the customer
  opportunity_id TEXT, -- GHL opportunity ID
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  order_value DECIMAL(12,2) DEFAULT 0.00,
  order_total DECIMAL(12,2) DEFAULT 0.00,
  commission_amount DECIMAL(12,2) DEFAULT 0.00,
  commission_rate DECIMAL(5,2) DEFAULT 0.00,
  commission_status TEXT DEFAULT 'pending', -- pending, approved, paid
  order_status TEXT, -- open, won, lost, abandoned
  pipeline_id TEXT, -- GHL pipeline ID
  stage_id TEXT, -- GHL stage ID
  order_date TIMESTAMP WITH TIME ZONE,
  close_date TIMESTAMP WITH TIME ZONE,
  products JSONB, -- array of products/services
  notes TEXT,
  raw_data JSONB, -- store the full GHL opportunity data
  data_source TEXT NOT NULL DEFAULT 'jennaz', -- jennaz, test
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- JennaZ Rewards Table
-- =============================================
CREATE TABLE IF NOT EXISTS jennaz_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  jennaz_reward_id TEXT NOT NULL UNIQUE, -- GHL reward/bonus ID
  jennaz_affiliate_id TEXT, -- Reference to GHL affiliate ID
  affiliate_id UUID REFERENCES jennaz_affiliates(id), -- Foreign key to our affiliates table
  reward_type TEXT, -- bonus, milestone, referral_bonus, etc.
  description TEXT,
  reward_amount DECIMAL(12,2) DEFAULT 0.00,
  reward_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending', -- pending, approved, paid
  trigger_event TEXT, -- what triggered this reward
  notes TEXT,
  raw_data JSONB, -- store any additional GHL data
  data_source TEXT NOT NULL DEFAULT 'jennaz', -- jennaz, test
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- JennaZ Payments Table
-- =============================================
CREATE TABLE IF NOT EXISTS jennaz_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  jennaz_payment_id TEXT NOT NULL UNIQUE, -- GHL payment/payout ID
  jennaz_affiliate_id TEXT, -- Reference to GHL affiliate ID
  affiliate_id UUID REFERENCES jennaz_affiliates(id), -- Foreign key to our affiliates table
  payment_amount DECIMAL(12,2) DEFAULT 0.00,
  payment_method TEXT, -- paypal, bank_transfer, check, etc.
  payment_status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
  payment_date TIMESTAMP WITH TIME ZONE,
  transaction_id TEXT, -- external payment processor transaction ID
  payment_reference TEXT, -- internal reference number
  currency TEXT DEFAULT 'USD',
  exchange_rate DECIMAL(10,4) DEFAULT 1.0000,
  fees DECIMAL(12,2) DEFAULT 0.00,
  net_amount DECIMAL(12,2) DEFAULT 0.00,
  notes TEXT,
  raw_data JSONB, -- store additional payment data
  data_source TEXT NOT NULL DEFAULT 'jennaz', -- jennaz, test
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- JennaZ Commissions Table
-- =============================================
CREATE TABLE IF NOT EXISTS jennaz_commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  jennaz_commission_id TEXT NOT NULL UNIQUE, -- GHL commission ID
  jennaz_affiliate_id TEXT, -- Reference to GHL affiliate ID
  jennaz_order_id TEXT, -- Reference to GHL order ID
  affiliate_id UUID REFERENCES jennaz_affiliates(id), -- Foreign key to our affiliates table
  order_id UUID REFERENCES jennaz_orders(id), -- Foreign key to our orders table
  commission_type TEXT, -- sale, referral, bonus, override
  commission_amount DECIMAL(12,2) DEFAULT 0.00,
  commission_rate DECIMAL(5,2) DEFAULT 0.00,
  commission_level INTEGER DEFAULT 1, -- for multi-level commissions
  commission_status TEXT DEFAULT 'pending', -- pending, approved, paid
  commission_date TIMESTAMP WITH TIME ZONE,
  payment_date TIMESTAMP WITH TIME ZONE,
  base_amount DECIMAL(12,2) DEFAULT 0.00, -- amount the commission is calculated on
  currency TEXT DEFAULT 'USD',
  notes TEXT,
  raw_data JSONB, -- store additional commission data
  data_source TEXT NOT NULL DEFAULT 'jennaz', -- jennaz, test
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Indexes for Performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_jennaz_affiliates_jennaz_id ON jennaz_affiliates(jennaz_id);
CREATE INDEX IF NOT EXISTS idx_jennaz_affiliates_email ON jennaz_affiliates(email);
CREATE INDEX IF NOT EXISTS idx_jennaz_affiliates_data_source ON jennaz_affiliates(data_source);
CREATE INDEX IF NOT EXISTS idx_jennaz_affiliates_status ON jennaz_affiliates(status);

CREATE INDEX IF NOT EXISTS idx_jennaz_orders_jennaz_id ON jennaz_orders(jennaz_order_id);
CREATE INDEX IF NOT EXISTS idx_jennaz_orders_affiliate_id ON jennaz_orders(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_jennaz_orders_data_source ON jennaz_orders(data_source);
CREATE INDEX IF NOT EXISTS idx_jennaz_orders_status ON jennaz_orders(order_status);

CREATE INDEX IF NOT EXISTS idx_jennaz_rewards_affiliate_id ON jennaz_rewards(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_jennaz_rewards_data_source ON jennaz_rewards(data_source);

CREATE INDEX IF NOT EXISTS idx_jennaz_payments_affiliate_id ON jennaz_payments(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_jennaz_payments_data_source ON jennaz_payments(data_source);

CREATE INDEX IF NOT EXISTS idx_jennaz_commissions_affiliate_id ON jennaz_commissions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_jennaz_commissions_order_id ON jennaz_commissions(order_id);
CREATE INDEX IF NOT EXISTS idx_jennaz_commissions_data_source ON jennaz_commissions(data_source);

-- =============================================
-- Row Level Security (RLS)
-- =============================================
ALTER TABLE jennaz_affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE jennaz_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE jennaz_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE jennaz_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE jennaz_commissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Authenticated Users
CREATE POLICY "Allow authenticated users to read jennaz_affiliates"
ON jennaz_affiliates
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to read jennaz_orders"
ON jennaz_orders
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to read jennaz_rewards"
ON jennaz_rewards
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to read jennaz_payments"
ON jennaz_payments
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to read jennaz_commissions"
ON jennaz_commissions
FOR SELECT
TO authenticated
USING (true);

-- RLS Policies for Service Role (for imports and admin operations)
CREATE POLICY "Allow service role full access to jennaz_affiliates"
ON jennaz_affiliates
FOR ALL
TO service_role
USING (true);

CREATE POLICY "Allow service role full access to jennaz_orders"
ON jennaz_orders
FOR ALL
TO service_role
USING (true);

CREATE POLICY "Allow service role full access to jennaz_rewards"
ON jennaz_rewards
FOR ALL
TO service_role
USING (true);

CREATE POLICY "Allow service role full access to jennaz_payments"
ON jennaz_payments
FOR ALL
TO service_role
USING (true);

CREATE POLICY "Allow service role full access to jennaz_commissions"
ON jennaz_commissions
FOR ALL
TO service_role
USING (true);

-- =============================================
-- Triggers for Updated At
-- =============================================
CREATE TRIGGER set_jennaz_affiliates_updated_at
BEFORE UPDATE ON jennaz_affiliates
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER set_jennaz_orders_updated_at
BEFORE UPDATE ON jennaz_orders
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER set_jennaz_rewards_updated_at
BEFORE UPDATE ON jennaz_rewards
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER set_jennaz_payments_updated_at
BEFORE UPDATE ON jennaz_payments
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER set_jennaz_commissions_updated_at
BEFORE UPDATE ON jennaz_commissions
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- =============================================
-- Comments for Documentation
-- =============================================
COMMENT ON TABLE jennaz_affiliates IS 'Stores affiliate data from JennaZ (Go High Level) platform';
COMMENT ON TABLE jennaz_orders IS 'Stores order/opportunity data from JennaZ (Go High Level) platform';
COMMENT ON TABLE jennaz_rewards IS 'Stores reward/bonus data from JennaZ (Go High Level) platform';
COMMENT ON TABLE jennaz_payments IS 'Stores payment/payout data from JennaZ (Go High Level) platform';
COMMENT ON TABLE jennaz_commissions IS 'Stores commission data from JennaZ (Go High Level) platform';

-- =============================================
-- Sample Data (Optional - for testing)
-- =============================================
-- Uncomment the following to insert sample data

/*
INSERT INTO jennaz_affiliates (jennaz_id, email, first_name, last_name, status, referral_code, commission_rate, data_source) VALUES
('ghl_001', 'test@jennaz.co', 'Test', 'Affiliate', 'active', 'JENNAZ001', 10.00, 'test'),
('ghl_002', 'demo@jennaz.co', 'Demo', 'Partner', 'active', 'JENNAZ002', 15.00, 'test');

INSERT INTO jennaz_orders (jennaz_order_id, jennaz_affiliate_id, customer_name, customer_email, order_value, commission_amount, order_status, data_source) VALUES
('ord_001', 'ghl_001', 'John Doe', 'john@example.com', 100.00, 10.00, 'won', 'test'),
('ord_002', 'ghl_002', 'Jane Smith', 'jane@example.com', 200.00, 30.00, 'won', 'test');
*/ 