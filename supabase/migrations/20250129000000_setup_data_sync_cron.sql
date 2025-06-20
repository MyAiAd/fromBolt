-- Enable pg_cron extension for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

-- Create a function to trigger GoAffPro data sync
CREATE OR REPLACE FUNCTION sync_goaffpro_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This function will be called by cron jobs
  -- It triggers the edge function to import GoAffPro data
  
  -- Log the sync attempt
  INSERT INTO data_sync_logs (
    sync_type,
    source,
    status,
    started_at
  ) VALUES (
    'scheduled',
    'goaffpro',
    'started',
    NOW()
  );
  
  -- Note: The actual API calls will be handled by the edge functions
  -- This is just to track when sync jobs are triggered
  
END;
$$;

-- Create a function to trigger GHL data sync
CREATE OR REPLACE FUNCTION sync_ghl_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This function will be called by cron jobs
  -- It triggers the edge function to import GHL data
  
  -- Log the sync attempt
  INSERT INTO data_sync_logs (
    sync_type,
    source,
    status,
    started_at
  ) VALUES (
    'scheduled',
    'ghl',
    'started',
    NOW()
  );
  
  -- Note: The actual API calls will be handled by the edge functions
  -- This is just to track when sync jobs are triggered
  
END;
$$;

-- Create a table to log sync activities
CREATE TABLE IF NOT EXISTS data_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_type TEXT NOT NULL CHECK (sync_type IN ('manual', 'scheduled', 'webhook')),
  source TEXT NOT NULL CHECK (source IN ('goaffpro', 'ghl', 'mightynetworks', 'shopify')),
  status TEXT NOT NULL CHECK (status IN ('started', 'completed', 'failed')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  records_processed INTEGER DEFAULT 0,
  records_successful INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  error_details JSONB,
  trigger_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for the sync logs table
CREATE INDEX IF NOT EXISTS idx_data_sync_logs_source ON data_sync_logs(source);
CREATE INDEX IF NOT EXISTS idx_data_sync_logs_status ON data_sync_logs(status);
CREATE INDEX IF NOT EXISTS idx_data_sync_logs_started_at ON data_sync_logs(started_at);

-- Schedule GoAffPro data sync every 4 hours
-- Note: This requires proper configuration of API keys in environment
SELECT cron.schedule(
  'sync-goaffpro-data',
  '0 */4 * * *', -- Every 4 hours
  'SELECT sync_goaffpro_data();'
);

-- Schedule GHL data sync every 6 hours
-- Note: This requires proper configuration of API keys in environment
SELECT cron.schedule(
  'sync-ghl-data', 
  '0 */6 * * *', -- Every 6 hours
  'SELECT sync_ghl_data();'
);

-- Daily cleanup of old sync logs (keep last 30 days)
SELECT cron.schedule(
  'cleanup-sync-logs',
  '0 2 * * *', -- Daily at 2 AM
  'DELETE FROM data_sync_logs WHERE created_at < NOW() - INTERVAL ''30 days'';'
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT SELECT ON cron.job TO service_role;
GRANT INSERT, UPDATE, DELETE ON data_sync_logs TO service_role;
GRANT EXECUTE ON FUNCTION sync_goaffpro_data() TO service_role;
GRANT EXECUTE ON FUNCTION sync_ghl_data() TO service_role;

-- Create a view for recent sync activities
CREATE VIEW recent_sync_activities AS
SELECT 
  id,
  sync_type,
  source,
  status,
  started_at,
  completed_at,
  records_processed,
  records_successful,
  records_failed,
  CASE 
    WHEN completed_at IS NOT NULL THEN 
      EXTRACT(EPOCH FROM (completed_at - started_at)) || ' seconds'
    ELSE 
      'In progress'
  END as duration
FROM data_sync_logs
WHERE started_at >= NOW() - INTERVAL '7 days'
ORDER BY started_at DESC;

-- Grant access to the view
GRANT SELECT ON recent_sync_activities TO authenticated, service_role; 