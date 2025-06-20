-- Temporarily allow anonymous read access to GoAffPro tables for development
-- This allows the frontend to display data without requiring authentication

-- Add anonymous read policy for goaffpro_affiliates
CREATE POLICY "Anonymous users can read GoAffPro affiliates"
  ON goaffpro_affiliates
  FOR SELECT
  TO anon
  USING (true);

-- Add anonymous read policy for goaffpro_orders  
CREATE POLICY "Anonymous users can read GoAffPro orders"
  ON goaffpro_orders
  FOR SELECT
  TO anon
  USING (true);

-- Add anonymous read policy for goaffpro_rewards
CREATE POLICY "Anonymous users can read GoAffPro rewards"
  ON goaffpro_rewards
  FOR SELECT
  TO anon
  USING (true);

-- Add anonymous read policy for goaffpro_payments
CREATE POLICY "Anonymous users can read GoAffPro payments"
  ON goaffpro_payments
  FOR SELECT
  TO anon
  USING (true);

-- Add anonymous read policy for goaffpro_commissions
CREATE POLICY "Anonymous users can read GoAffPro commissions"
  ON goaffpro_commissions
  FOR SELECT
  TO anon
  USING (true);

-- Add anonymous read policy for data_import_logs
CREATE POLICY "Anonymous users can read import logs"
  ON data_import_logs
  FOR SELECT
  TO anon
  USING (true);

-- Fix infinite recursion in affiliate_system_users RLS policies
-- The issue is that policies are querying the same table they're protecting
-- This causes infinite recursion when Supabase tries to evaluate the policy

-- First, drop ALL existing policies that might be causing issues
DROP POLICY IF EXISTS "Users can view their own affiliate data" ON affiliate_system_users;
DROP POLICY IF EXISTS "Users can view their team members" ON affiliate_system_users;
DROP POLICY IF EXISTS "Users can manage their own affiliate data" ON affiliate_system_users;
DROP POLICY IF EXISTS "Users can insert affiliate records" ON affiliate_system_users;
DROP POLICY IF EXISTS "Admins can manage all affiliate users" ON affiliate_system_users;
DROP POLICY IF EXISTS "Allow authenticated read access" ON affiliate_system_users;
DROP POLICY IF EXISTS "Allow authenticated insert access" ON affiliate_system_users;
DROP POLICY IF EXISTS "Allow authenticated update access" ON affiliate_system_users;
DROP POLICY IF EXISTS "Allow authenticated delete access" ON affiliate_system_users;

-- Create simple, non-recursive policies for development and import functionality
-- These policies avoid self-referencing queries that cause infinite recursion

-- Policy 1: Allow authenticated users to read all affiliate data
-- This is needed for the aggregation service to work
CREATE POLICY "Allow authenticated users to read affiliate data"
  ON affiliate_system_users
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy 2: Allow authenticated users to insert affiliate records
-- This is needed for GHL imports and other data imports
CREATE POLICY "Allow authenticated users to insert affiliate records"
  ON affiliate_system_users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy 3: Allow authenticated users to update affiliate records
-- This is needed for sync operations and data updates
CREATE POLICY "Allow authenticated users to update affiliate records"
  ON affiliate_system_users
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy 4: Allow authenticated users to delete affiliate records
-- This should be more restrictive in production
CREATE POLICY "Allow authenticated users to delete affiliate records"
  ON affiliate_system_users
  FOR DELETE
  TO authenticated
  USING (true);

-- Grant necessary permissions to authenticated role
GRANT ALL ON affiliate_system_users TO authenticated;

-- Note: These are permissive policies designed to fix the recursion issue
-- In a production environment, you may want to add more restrictive conditions
-- but without self-referencing queries that cause infinite recursion

-- The key is to avoid patterns like:
-- USING (id IN (SELECT id FROM affiliate_system_users WHERE ...))
-- which cause the policy to query the same table it's protecting 