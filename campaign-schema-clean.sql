-- Campaign-Aware Affiliate Schema (Clean Version)
-- Apply this AFTER running fix-primary-source-constraint.sql

-- Step 1: Add campaign tracking columns to affiliate_system_users
ALTER TABLE affiliate_system_users 
ADD COLUMN IF NOT EXISTS campaigns TEXT[],
ADD COLUMN IF NOT EXISTS campaign_participations INTEGER DEFAULT 1;

-- Step 2: Create index for campaign queries (for performance)
CREATE INDEX IF NOT EXISTS idx_affiliate_campaigns ON affiliate_system_users USING GIN(campaigns);

-- Step 3: Add the primary_source constraint (should work now after cleanup)
DO $$
BEGIN
  -- Drop existing constraint if it exists (in case of retry)
  ALTER TABLE affiliate_system_users DROP CONSTRAINT IF EXISTS affiliate_system_users_primary_source_check;
  
  -- Add the updated constraint
  ALTER TABLE affiliate_system_users ADD CONSTRAINT affiliate_system_users_primary_source_check 
    CHECK (primary_source IN ('ghl', 'mightynetworks', 'shopify', 'goaffpro', 'manual', 'first_promoter'));
    
  RAISE NOTICE 'Primary source constraint added successfully';
END $$;

-- Step 4: Add campaign-related indexes for performance
CREATE INDEX IF NOT EXISTS idx_affiliate_email ON affiliate_system_users(email);
CREATE INDEX IF NOT EXISTS idx_affiliate_source ON affiliate_system_users(primary_source);
CREATE INDEX IF NOT EXISTS idx_affiliate_status ON affiliate_system_users(status);

-- Step 5: Update existing records to have empty campaigns array if null
UPDATE affiliate_system_users 
SET campaigns = ARRAY[]::TEXT[]
WHERE campaigns IS NULL;

-- Step 6: Verify the schema is ready
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'affiliate_system_users' 
  AND column_name IN ('campaigns', 'campaign_participations', 'primary_source')
ORDER BY column_name;

-- Step 7: Show summary
SELECT 
  'Schema Update Complete' as status,
  COUNT(*) as total_affiliates,
  COUNT(DISTINCT primary_source) as unique_sources
FROM affiliate_system_users; 