-- Setup Admin User and RLS Policies for Production
-- Run this in production SQL editor after running the schema script

-- Step 1: Create/Update Admin User
-- First, check if the user already exists in auth.users
DO $$
BEGIN
    -- If user doesn't exist, you'll need to create them through Supabase Dashboard first
    -- This script will just update their admin status
    
    -- Update user to be admin if they exist
    UPDATE auth.users 
    SET raw_user_meta_data = jsonb_set(
        COALESCE(raw_user_meta_data, '{}'::jsonb), 
        '{is_admin}', 
        'true'::jsonb
    )
    WHERE email = 'Sage@MyAi.ad';
    
    -- If no rows were affected, the user doesn't exist yet
    IF NOT FOUND THEN
        RAISE NOTICE 'User Sage@MyAi.ad not found. Please create this user through Supabase Dashboard first, then run this script again.';
    ELSE
        RAISE NOTICE 'User Sage@MyAi.ad has been granted admin privileges.';
    END IF;
END $$;

-- Step 2: Create comprehensive RLS policies for all tables

-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Admins can manage all data" ON public.affiliate_system_users;
DROP POLICY IF EXISTS "Admins can manage all data" ON public.affiliates;
DROP POLICY IF EXISTS "Admins can manage all data" ON public.users;
DROP POLICY IF EXISTS "Admins can manage all data" ON public.transactions;
DROP POLICY IF EXISTS "Admins can manage all data" ON public.commissions;
DROP POLICY IF EXISTS "Admins can manage all data" ON public.clicks;
DROP POLICY IF EXISTS "Admins can manage all data" ON public.commission_plans;
DROP POLICY IF EXISTS "Admins can manage all data" ON public.referral_relationships;
DROP POLICY IF EXISTS "Admins can manage all data" ON public.multi_level_commissions;
DROP POLICY IF EXISTS "Admins can manage all data" ON public.ghl_affiliates;
DROP POLICY IF EXISTS "Admins can manage all data" ON public.goaffpro_affiliates;
DROP POLICY IF EXISTS "Admins can manage all data" ON public.goaffpro_orders;
DROP POLICY IF EXISTS "Admins can manage all data" ON public.goaffpro_commissions;
DROP POLICY IF EXISTS "Admins can manage all data" ON public.goaffpro_payments;
DROP POLICY IF EXISTS "Admins can manage all data" ON public.goaffpro_rewards;
DROP POLICY IF EXISTS "Admins can manage all data" ON public.jennaz_orders;
DROP POLICY IF EXISTS "Admins can manage all data" ON public.jennaz_affiliates;
DROP POLICY IF EXISTS "Admins can manage all data" ON public.jennaz_commissions;
DROP POLICY IF EXISTS "Admins can manage all data" ON public.jennaz_payments;
DROP POLICY IF EXISTS "Admins can manage all data" ON public.jennaz_rewards;
DROP POLICY IF EXISTS "Admins can manage all data" ON public.mightynetworks_affiliates;
DROP POLICY IF EXISTS "Admins can manage all data" ON public.mightynetworks_commissions;
DROP POLICY IF EXISTS "Admins can manage all data" ON public.mightynetworks_payouts;
DROP POLICY IF EXISTS "Admins can manage all data" ON public.mightynetworks_referrals;
DROP POLICY IF EXISTS "Admins can manage all data" ON public.shopify_orders;
DROP POLICY IF EXISTS "Admins can manage all data" ON public.shopify_order_items;
DROP POLICY IF EXISTS "Admins can manage all data" ON public.shopify_products;
DROP POLICY IF EXISTS "Admins can manage all data" ON public.shopify_webhooks;
DROP POLICY IF EXISTS "Admins can manage all data" ON public.data_sync_logs;
DROP POLICY IF EXISTS "Admins can manage all data" ON public.data_import_logs;
DROP POLICY IF EXISTS "Admins can manage all data" ON public.ai_api_keys;
DROP POLICY IF EXISTS "Admins can manage all data" ON public.ai_config;
DROP POLICY IF EXISTS "Admins can manage all data" ON public.sync_settings;
DROP POLICY IF EXISTS "Admins can manage all data" ON public.team_statistics;
DROP POLICY IF EXISTS "Admins can manage all data" ON public.payouts;

-- Create Admin policies for all tables
-- Core affiliate tables
CREATE POLICY "Admins can manage all data" ON public.affiliate_system_users
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = auth.users.id
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "Admins can manage all data" ON public.affiliates
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = auth.users.id
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "Admins can manage all data" ON public.users
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = auth.users.id
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "Admins can manage all data" ON public.transactions
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = auth.users.id
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "Admins can manage all data" ON public.commissions
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = auth.users.id
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "Admins can manage all data" ON public.clicks
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = auth.users.id
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

-- System tables
CREATE POLICY "Admins can manage all data" ON public.commission_plans
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = auth.users.id
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "Admins can manage all data" ON public.referral_relationships
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = auth.users.id
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "Admins can manage all data" ON public.multi_level_commissions
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = auth.users.id
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

-- Integration tables
CREATE POLICY "Admins can manage all data" ON public.ghl_affiliates
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = auth.users.id
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "Admins can manage all data" ON public.goaffpro_affiliates
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = auth.users.id
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "Admins can manage all data" ON public.goaffpro_orders
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = auth.users.id
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "Admins can manage all data" ON public.goaffpro_commissions
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = auth.users.id
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "Admins can manage all data" ON public.goaffpro_payments
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = auth.users.id
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "Admins can manage all data" ON public.goaffpro_rewards
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = auth.users.id
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

-- Jennaz/GHL tables
CREATE POLICY "Admins can manage all data" ON public.jennaz_orders
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = auth.users.id
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "Admins can manage all data" ON public.jennaz_affiliates
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = auth.users.id
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "Admins can manage all data" ON public.jennaz_commissions
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = auth.users.id
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "Admins can manage all data" ON public.jennaz_payments
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = auth.users.id
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "Admins can manage all data" ON public.jennaz_rewards
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = auth.users.id
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

-- MightyNetworks tables
CREATE POLICY "Admins can manage all data" ON public.mightynetworks_affiliates
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = auth.users.id
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "Admins can manage all data" ON public.mightynetworks_commissions
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = auth.users.id
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "Admins can manage all data" ON public.mightynetworks_payouts
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = auth.users.id
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "Admins can manage all data" ON public.mightynetworks_referrals
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = auth.users.id
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

-- Shopify tables
CREATE POLICY "Admins can manage all data" ON public.shopify_orders
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = auth.users.id
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "Admins can manage all data" ON public.shopify_order_items
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = auth.users.id
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "Admins can manage all data" ON public.shopify_products
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = auth.users.id
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "Admins can manage all data" ON public.shopify_webhooks
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = auth.users.id
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

-- System/sync tables
CREATE POLICY "Admins can manage all data" ON public.data_sync_logs
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = auth.users.id
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "Admins can manage all data" ON public.data_import_logs
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = auth.users.id
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "Admins can manage all data" ON public.sync_settings
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = auth.users.id
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

-- AI tables
CREATE POLICY "Admins can manage all data" ON public.ai_api_keys
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = auth.users.id
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "Admins can manage all data" ON public.ai_config
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = auth.users.id
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

-- Analytics tables
CREATE POLICY "Admins can manage all data" ON public.team_statistics
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = auth.users.id
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "Admins can manage all data" ON public.payouts
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = auth.users.id
    AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
  )
);

-- Step 3: Verify admin user setup
SELECT 
  id,
  email,
  raw_user_meta_data->>'is_admin' as is_admin,
  created_at
FROM auth.users 
WHERE email = 'Sage@MyAi.ad';

-- Step 4: Test admin access (should return data if RLS is working correctly)
SELECT count(*) as commission_plans_count FROM commission_plans;
SELECT count(*) as affiliate_users_count FROM affiliate_system_users; 