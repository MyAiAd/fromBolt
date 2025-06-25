/*
  # Fix Admin Policies for Clicks and Commissions Tables
  
  1. Problem
    - Admin policies were checking users.is_admin (public.users table)
    - But admin status is stored in auth.users.raw_user_meta_data->>'is_admin'
    - This caused 403 errors for admin users trying to access ALL data
  
  2. Changes
    - Drop existing problematic admin policies
    - Create new policies that check the correct admin flag location
    - Fix both clicks and multi_level_commissions tables
*/

-- Fix clicks table admin policy
DROP POLICY IF EXISTS "Admins can view all clicks" ON clicks;

CREATE POLICY "Admins can view all clicks"
  ON clicks
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

-- Fix multi_level_commissions table admin policy  
DROP POLICY IF EXISTS "Admins can view all commissions" ON multi_level_commissions;

CREATE POLICY "Admins can view all commissions"
  ON multi_level_commissions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  ); 