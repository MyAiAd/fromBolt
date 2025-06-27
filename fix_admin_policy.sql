-- Fix Admin Policy for AI API Keys
-- The issue: Current admin policy tries to query auth.users table, 
-- but authenticated users don't have permission to read it

-- First, drop the problematic admin policy
DROP POLICY IF EXISTS "Admins can manage all data" ON ai_api_keys;

-- Option 1: Simple fix - just rely on the user policies
-- (Users can only see/manage their own API keys)
-- This is the most secure and straightforward approach

-- Option 2: If you want admin functionality, create a proper admin policy
-- that uses JWT claims instead of querying the users table
/*
CREATE POLICY "Admins can manage all data" ON ai_api_keys
  FOR ALL USING (
    (auth.jwt() ->> 'is_admin')::boolean = true
  )
  WITH CHECK (
    (auth.jwt() ->> 'is_admin')::boolean = true
  );
*/

-- For now, let's go with Option 1 (remove admin policy)
-- This will allow normal user functionality to work

-- Verify the remaining policies
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'ai_api_keys' 
ORDER BY policyname; 