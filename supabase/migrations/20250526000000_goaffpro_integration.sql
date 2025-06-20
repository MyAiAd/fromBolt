/*
  # GoAffPro Integration Tables

  1. New Tables
    - `goaffpro_affiliates` - Store affiliate data from GoAffPro
    - `goaffpro_orders` - Store order data from GoAffPro
    - `goaffpro_rewards` - Store reward data from GoAffPro
    - `goaffpro_payments` - Store payment data from GoAffPro
    - `goaffpro_commissions` - Store commission data from GoAffPro
    - `data_import_logs` - Track import operations
  
  2. Changes
    - Add data_source field to existing tables to flag test vs real data
    - Add indexes for performance
  
  3. Security
    - Enable RLS on new tables
    - Add appropriate policies
*/

-- Add data_source column to existing tables (only if they exist)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
    ALTER TABLE users ADD COLUMN IF NOT EXISTS data_source TEXT DEFAULT 'test' CHECK (data_source IN ('test', 'goaffpro'));
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'affiliates') THEN
    ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS data_source TEXT DEFAULT 'test' CHECK (data_source IN ('test', 'goaffpro'));
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'transactions') THEN
    ALTER TABLE transactions ADD COLUMN IF NOT EXISTS data_source TEXT DEFAULT 'test' CHECK (data_source IN ('test', 'goaffpro'));
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'commissions') THEN
    ALTER TABLE commissions ADD COLUMN IF NOT EXISTS data_source TEXT DEFAULT 'test' CHECK (data_source IN ('test', 'goaffpro'));
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'clicks') THEN
    ALTER TABLE clicks ADD COLUMN IF NOT EXISTS data_source TEXT DEFAULT 'test' CHECK (data_source IN ('test', 'goaffpro'));
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'shopify_orders') THEN
    ALTER TABLE shopify_orders ADD COLUMN IF NOT EXISTS data_source TEXT DEFAULT 'test' CHECK (data_source IN ('test', 'goaffpro'));
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'shopify_products') THEN
    ALTER TABLE shopify_products ADD COLUMN IF NOT EXISTS data_source TEXT DEFAULT 'test' CHECK (data_source IN ('test', 'goaffpro'));
  END IF;
END $$;

-- GoAffPro Affiliates table
CREATE TABLE IF NOT EXISTS goaffpro_affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goaffpro_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  address JSONB,
  status TEXT,
  signup_date TIMESTAMPTZ,
  referral_code TEXT,
  commission_rate DECIMAL(5,2),
  balance DECIMAL(10,2) DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  tags JSONB,
  custom_fields JSONB,
  raw_data JSONB,
  data_source TEXT DEFAULT 'goaffpro' CHECK (data_source IN ('test', 'goaffpro')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- GoAffPro Orders table
CREATE TABLE IF NOT EXISTS goaffpro_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goaffpro_order_id TEXT NOT NULL UNIQUE,
  goaffpro_affiliate_id TEXT,
  affiliate_id UUID REFERENCES goaffpro_affiliates(id),
  order_number TEXT,
  customer_email TEXT,
  customer_name TEXT,
  order_total DECIMAL(10,2),
  commission_amount DECIMAL(10,2),
  commission_rate DECIMAL(5,2),
  status TEXT,
  order_date TIMESTAMPTZ,
  commission_status TEXT,
  products JSONB,
  raw_data JSONB,
  data_source TEXT DEFAULT 'goaffpro' CHECK (data_source IN ('test', 'goaffpro')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- GoAffPro Rewards table
CREATE TABLE IF NOT EXISTS goaffpro_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goaffpro_reward_id TEXT NOT NULL UNIQUE,
  goaffpro_affiliate_id TEXT,
  affiliate_id UUID REFERENCES goaffpro_affiliates(id),
  reward_type TEXT,
  amount DECIMAL(10,2),
  description TEXT,
  status TEXT,
  date_awarded TIMESTAMPTZ,
  raw_data JSONB,
  data_source TEXT DEFAULT 'goaffpro' CHECK (data_source IN ('test', 'goaffpro')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- GoAffPro Payments table
CREATE TABLE IF NOT EXISTS goaffpro_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goaffpro_payment_id TEXT NOT NULL UNIQUE,
  goaffpro_affiliate_id TEXT,
  affiliate_id UUID REFERENCES goaffpro_affiliates(id),
  amount DECIMAL(10,2),
  payment_method TEXT,
  payment_date TIMESTAMPTZ,
  status TEXT,
  transaction_id TEXT,
  notes TEXT,
  raw_data JSONB,
  data_source TEXT DEFAULT 'goaffpro' CHECK (data_source IN ('test', 'goaffpro')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- GoAffPro Commissions table
CREATE TABLE IF NOT EXISTS goaffpro_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goaffpro_commission_id TEXT NOT NULL UNIQUE,
  goaffpro_affiliate_id TEXT,
  goaffpro_order_id TEXT,
  affiliate_id UUID REFERENCES goaffpro_affiliates(id),
  order_id UUID REFERENCES goaffpro_orders(id),
  commission_amount DECIMAL(10,2),
  commission_rate DECIMAL(5,2),
  status TEXT,
  date_earned TIMESTAMPTZ,
  date_paid TIMESTAMPTZ,
  raw_data JSONB,
  data_source TEXT DEFAULT 'goaffpro' CHECK (data_source IN ('test', 'goaffpro')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Data Import Logs table
CREATE TABLE IF NOT EXISTS data_import_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  import_type TEXT NOT NULL,
  source TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('started', 'completed', 'failed')),
  records_processed INTEGER DEFAULT 0,
  records_successful INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  error_details JSONB,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  started_by UUID REFERENCES auth.users(id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_goaffpro_affiliates_goaffpro_id ON goaffpro_affiliates(goaffpro_id);
CREATE INDEX IF NOT EXISTS idx_goaffpro_affiliates_email ON goaffpro_affiliates(email);
CREATE INDEX IF NOT EXISTS idx_goaffpro_affiliates_data_source ON goaffpro_affiliates(data_source);

CREATE INDEX IF NOT EXISTS idx_goaffpro_orders_goaffpro_id ON goaffpro_orders(goaffpro_order_id);
CREATE INDEX IF NOT EXISTS idx_goaffpro_orders_affiliate_id ON goaffpro_orders(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_goaffpro_orders_data_source ON goaffpro_orders(data_source);

CREATE INDEX IF NOT EXISTS idx_goaffpro_rewards_affiliate_id ON goaffpro_rewards(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_goaffpro_rewards_data_source ON goaffpro_rewards(data_source);

CREATE INDEX IF NOT EXISTS idx_goaffpro_payments_affiliate_id ON goaffpro_payments(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_goaffpro_payments_data_source ON goaffpro_payments(data_source);

CREATE INDEX IF NOT EXISTS idx_goaffpro_commissions_affiliate_id ON goaffpro_commissions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_goaffpro_commissions_order_id ON goaffpro_commissions(order_id);
CREATE INDEX IF NOT EXISTS idx_goaffpro_commissions_data_source ON goaffpro_commissions(data_source);

CREATE INDEX IF NOT EXISTS idx_data_import_logs_import_type ON data_import_logs(import_type);
CREATE INDEX IF NOT EXISTS idx_data_import_logs_status ON data_import_logs(status);

-- Enable RLS
ALTER TABLE goaffpro_affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE goaffpro_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE goaffpro_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE goaffpro_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE goaffpro_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_import_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for GoAffPro tables (admin access for now)
CREATE POLICY "Admins can manage GoAffPro affiliates"
  ON goaffpro_affiliates
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

CREATE POLICY "Admins can manage GoAffPro orders"
  ON goaffpro_orders
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

CREATE POLICY "Admins can manage GoAffPro rewards"
  ON goaffpro_rewards
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

CREATE POLICY "Admins can manage GoAffPro payments"
  ON goaffpro_payments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

CREATE POLICY "Admins can manage GoAffPro commissions"
  ON goaffpro_commissions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

CREATE POLICY "Admins can manage import logs"
  ON data_import_logs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

-- Allow all authenticated users to read GoAffPro data for now
CREATE POLICY "Authenticated users can read GoAffPro affiliates"
  ON goaffpro_affiliates
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read GoAffPro orders"
  ON goaffpro_orders
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read GoAffPro rewards"
  ON goaffpro_rewards
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read GoAffPro payments"
  ON goaffpro_payments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read import logs"
  ON data_import_logs
  FOR SELECT
  TO authenticated
  USING (true);

-- Add triggers for updated_at
CREATE TRIGGER set_goaffpro_affiliates_updated_at
  BEFORE UPDATE ON goaffpro_affiliates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_goaffpro_orders_updated_at
  BEFORE UPDATE ON goaffpro_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_goaffpro_rewards_updated_at
  BEFORE UPDATE ON goaffpro_rewards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_goaffpro_payments_updated_at
  BEFORE UPDATE ON goaffpro_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_goaffpro_commissions_updated_at
  BEFORE UPDATE ON goaffpro_commissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 