/*
  # Create initial schema for the affiliate dashboard

  1. New Tables
    - `users` - Store user information
    - `affiliates` - Track affiliate relationships
    - `transactions` - Store transaction data
    - `commissions` - Calculate and store commissions
    - `clicks` - Track link clicks for analytics
  2. Security
    - Enable RLS on all tables
    - Add policies for secure data access
*/

-- Create schema for custom tables
CREATE SCHEMA IF NOT EXISTS public;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  referral_code TEXT UNIQUE,
  profile_image_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Affiliates table - tracks the relationship between users and their referrers
CREATE TABLE IF NOT EXISTS affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES users(id),
  affiliate_id UUID NOT NULL REFERENCES users(id),
  level INT NOT NULL, -- 1 for direct, 2 for second level, etc.
  commission_rate DECIMAL(5,2) NOT NULL DEFAULT 10.00, -- percentage
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(referrer_id, affiliate_id)
);

-- Transactions table - stores sales transactions
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_ref TEXT UNIQUE NOT NULL,
  affiliate_id UUID REFERENCES users(id),
  customer_email TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  product_name TEXT NOT NULL,
  product_id TEXT,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Commissions table - calculated commissions for each transaction
CREATE TABLE IF NOT EXISTS commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES transactions(id),
  affiliate_id UUID NOT NULL REFERENCES users(id),
  referrer_id UUID NOT NULL REFERENCES users(id),
  level INT NOT NULL, -- 1 for direct, 2 for second level, etc.
  amount DECIMAL(10,2) NOT NULL,
  rate_applied DECIMAL(5,2) NOT NULL, -- percentage that was applied
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  payout_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Clicks table - track clicks on affiliate links
CREATE TABLE IF NOT EXISTS clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES users(id),
  referral_code TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  conversion_status TEXT DEFAULT 'clicked' CHECK (conversion_status IN ('clicked', 'converted')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read their own data"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Referrers can view their affiliates' basic info"
  ON users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM affiliates 
      WHERE referrer_id = auth.uid() 
      AND affiliate_id = users.id
    )
  );

CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for affiliates table
CREATE POLICY "Users can view their affiliate relationships"
  ON affiliates
  FOR SELECT
  USING (
    referrer_id = auth.uid() OR affiliate_id = auth.uid()
  );

CREATE POLICY "Users can create their own affiliates"
  ON affiliates
  FOR INSERT
  WITH CHECK (referrer_id = auth.uid());

-- RLS Policies for transactions table
CREATE POLICY "Users can see transactions where they are the affiliate"
  ON transactions
  FOR SELECT
  USING (affiliate_id = auth.uid());

CREATE POLICY "Referrers can see transactions from their affiliates"
  ON transactions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM affiliates 
      WHERE referrer_id = auth.uid() 
      AND affiliate_id = transactions.affiliate_id
    )
  );

-- RLS Policies for commissions table
CREATE POLICY "Users can see their own commissions"
  ON commissions
  FOR SELECT
  USING (affiliate_id = auth.uid() OR referrer_id = auth.uid());

-- RLS Policies for clicks table
CREATE POLICY "Users can see clicks on their own referral code"
  ON clicks
  FOR SELECT
  USING (affiliate_id = auth.uid());

CREATE POLICY "Referrers can see clicks from their affiliates"
  ON clicks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM affiliates 
      WHERE referrer_id = auth.uid() 
      AND affiliate_id = clicks.affiliate_id
    )
  );

-- Create functions to handle automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Set up triggers for updated_at timestamps
CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_affiliates_updated_at
BEFORE UPDATE ON affiliates
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_commissions_updated_at
BEFORE UPDATE ON commissions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();