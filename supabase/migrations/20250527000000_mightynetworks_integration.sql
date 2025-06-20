-- MightyNetworks/Rewardful Integration Tables
-- This migration creates tables to store data from MightyNetworks via Rewardful API

-- MightyNetworks Affiliates Table
CREATE TABLE IF NOT EXISTS mightynetworks_affiliates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rewardful_affiliate_id TEXT UNIQUE NOT NULL,
  mighty_member_id TEXT,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  name TEXT,
  phone TEXT,
  status TEXT,
  signup_date TIMESTAMPTZ,
  referral_code TEXT,
  commission_rate DECIMAL(5,4),
  balance DECIMAL(10,2) DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  total_referrals INTEGER DEFAULT 0,
  total_commissions DECIMAL(10,2) DEFAULT 0,
  payout_email TEXT,
  payment_method TEXT,
  tags JSONB,
  custom_fields JSONB,
  raw_data JSONB,
  data_source TEXT DEFAULT 'mightynetworks',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MightyNetworks Orders/Referrals Table
CREATE TABLE IF NOT EXISTS mightynetworks_referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rewardful_referral_id TEXT UNIQUE NOT NULL,
  rewardful_affiliate_id TEXT,
  affiliate_id UUID REFERENCES mightynetworks_affiliates(id),
  customer_email TEXT,
  customer_name TEXT,
  order_total DECIMAL(10,2),
  commission_amount DECIMAL(10,2),
  commission_rate DECIMAL(5,4),
  status TEXT,
  referral_date TIMESTAMPTZ,
  conversion_date TIMESTAMPTZ,
  commission_status TEXT,
  stripe_charge_id TEXT,
  stripe_customer_id TEXT,
  mighty_plan_name TEXT,
  mighty_space_name TEXT,
  raw_data JSONB,
  data_source TEXT DEFAULT 'mightynetworks',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MightyNetworks Commissions Table
CREATE TABLE IF NOT EXISTS mightynetworks_commissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rewardful_commission_id TEXT UNIQUE NOT NULL,
  rewardful_affiliate_id TEXT,
  rewardful_referral_id TEXT,
  affiliate_id UUID REFERENCES mightynetworks_affiliates(id),
  referral_id UUID REFERENCES mightynetworks_referrals(id),
  commission_amount DECIMAL(10,2),
  commission_rate DECIMAL(5,4),
  commission_type TEXT, -- 'percentage', 'fixed', 'recurring'
  status TEXT, -- 'pending', 'approved', 'paid', 'cancelled'
  date_earned TIMESTAMPTZ,
  date_approved TIMESTAMPTZ,
  date_paid TIMESTAMPTZ,
  payout_id TEXT,
  raw_data JSONB,
  data_source TEXT DEFAULT 'mightynetworks',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MightyNetworks Payouts Table
CREATE TABLE IF NOT EXISTS mightynetworks_payouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rewardful_payout_id TEXT UNIQUE NOT NULL,
  rewardful_affiliate_id TEXT,
  affiliate_id UUID REFERENCES mightynetworks_affiliates(id),
  amount DECIMAL(10,2),
  payment_method TEXT, -- 'paypal', 'stripe', 'wise', 'manual'
  payment_date TIMESTAMPTZ,
  status TEXT, -- 'pending', 'processing', 'completed', 'failed'
  transaction_id TEXT,
  payment_email TEXT,
  notes TEXT,
  commission_ids TEXT[], -- Array of commission IDs included in this payout
  raw_data JSONB,
  data_source TEXT DEFAULT 'mightynetworks',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MightyNetworks Import Logs Table
CREATE TABLE IF NOT EXISTS mightynetworks_import_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  import_type TEXT NOT NULL, -- 'affiliates', 'referrals', 'commissions', 'payouts', 'all'
  source TEXT DEFAULT 'mightynetworks',
  status TEXT NOT NULL, -- 'started', 'completed', 'failed'
  started_by UUID REFERENCES auth.users(id),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  records_processed INTEGER DEFAULT 0,
  records_successful INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  error_details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mightynetworks_affiliates_email ON mightynetworks_affiliates(email);
CREATE INDEX IF NOT EXISTS idx_mightynetworks_affiliates_rewardful_id ON mightynetworks_affiliates(rewardful_affiliate_id);
CREATE INDEX IF NOT EXISTS idx_mightynetworks_affiliates_status ON mightynetworks_affiliates(status);
CREATE INDEX IF NOT EXISTS idx_mightynetworks_affiliates_data_source ON mightynetworks_affiliates(data_source);

CREATE INDEX IF NOT EXISTS idx_mightynetworks_referrals_affiliate_id ON mightynetworks_referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_mightynetworks_referrals_rewardful_id ON mightynetworks_referrals(rewardful_referral_id);
CREATE INDEX IF NOT EXISTS idx_mightynetworks_referrals_status ON mightynetworks_referrals(status);
CREATE INDEX IF NOT EXISTS idx_mightynetworks_referrals_date ON mightynetworks_referrals(referral_date);

CREATE INDEX IF NOT EXISTS idx_mightynetworks_commissions_affiliate_id ON mightynetworks_commissions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_mightynetworks_commissions_status ON mightynetworks_commissions(status);
CREATE INDEX IF NOT EXISTS idx_mightynetworks_commissions_date_earned ON mightynetworks_commissions(date_earned);

CREATE INDEX IF NOT EXISTS idx_mightynetworks_payouts_affiliate_id ON mightynetworks_payouts(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_mightynetworks_payouts_status ON mightynetworks_payouts(status);
CREATE INDEX IF NOT EXISTS idx_mightynetworks_payouts_date ON mightynetworks_payouts(payment_date);

CREATE INDEX IF NOT EXISTS idx_mightynetworks_import_logs_type ON mightynetworks_import_logs(import_type);
CREATE INDEX IF NOT EXISTS idx_mightynetworks_import_logs_status ON mightynetworks_import_logs(status);
CREATE INDEX IF NOT EXISTS idx_mightynetworks_import_logs_started_at ON mightynetworks_import_logs(started_at);

-- Add updated_at trigger for all tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_mightynetworks_affiliates_updated_at 
    BEFORE UPDATE ON mightynetworks_affiliates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mightynetworks_referrals_updated_at 
    BEFORE UPDATE ON mightynetworks_referrals 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mightynetworks_commissions_updated_at 
    BEFORE UPDATE ON mightynetworks_commissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mightynetworks_payouts_updated_at 
    BEFORE UPDATE ON mightynetworks_payouts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE mightynetworks_affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE mightynetworks_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE mightynetworks_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mightynetworks_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE mightynetworks_import_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all for authenticated users for now)
CREATE POLICY "Allow all operations for authenticated users" ON mightynetworks_affiliates
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON mightynetworks_referrals
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON mightynetworks_commissions
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON mightynetworks_payouts
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON mightynetworks_import_logs
    FOR ALL USING (auth.role() = 'authenticated');

-- Grant permissions to service role
GRANT ALL ON mightynetworks_affiliates TO service_role;
GRANT ALL ON mightynetworks_referrals TO service_role;
GRANT ALL ON mightynetworks_commissions TO service_role;
GRANT ALL ON mightynetworks_payouts TO service_role;
GRANT ALL ON mightynetworks_import_logs TO service_role;

-- Add comments for documentation
COMMENT ON TABLE mightynetworks_affiliates IS 'Stores affiliate data from MightyNetworks via Rewardful API';
COMMENT ON TABLE mightynetworks_referrals IS 'Stores referral/order data from MightyNetworks via Rewardful API';
COMMENT ON TABLE mightynetworks_commissions IS 'Stores commission data from MightyNetworks via Rewardful API';
COMMENT ON TABLE mightynetworks_payouts IS 'Stores payout data from MightyNetworks via Rewardful API';
COMMENT ON TABLE mightynetworks_import_logs IS 'Tracks import operations for MightyNetworks data'; 