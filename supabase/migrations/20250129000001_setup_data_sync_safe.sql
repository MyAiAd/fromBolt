-- SAFE DATA SYNC SETUP - Non-destructive additions only
-- This migration adds data sync capabilities without affecting existing functionality

-- Create a table to log sync activities (safe addition)
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

-- Create indexes for the sync logs table (safe additions)
CREATE INDEX IF NOT EXISTS idx_data_sync_logs_source ON data_sync_logs(source);
CREATE INDEX IF NOT EXISTS idx_data_sync_logs_status ON data_sync_logs(status);
CREATE INDEX IF NOT EXISTS idx_data_sync_logs_started_at ON data_sync_logs(started_at);

-- Create a view for recent sync activities (safe addition)
CREATE OR REPLACE VIEW recent_sync_activities AS
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

-- Grant access to the sync logs (safe additions)
GRANT SELECT, INSERT, UPDATE ON data_sync_logs TO authenticated, service_role;
GRANT SELECT ON recent_sync_activities TO authenticated, service_role;

-- Optional: Add a settings table for sync configuration (completely safe)
CREATE TABLE IF NOT EXISTS sync_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL UNIQUE CHECK (source IN ('goaffpro', 'ghl', 'mightynetworks', 'shopify')),
  enabled BOOLEAN DEFAULT false,
  sync_interval_hours INTEGER DEFAULT 4,
  last_manual_sync TIMESTAMPTZ,
  api_key_configured BOOLEAN DEFAULT false,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default sync settings (safe - will not overwrite existing)
INSERT INTO sync_settings (source, enabled, sync_interval_hours, api_key_configured) 
VALUES 
  ('goaffpro', false, 4, false),
  ('ghl', false, 6, false),
  ('mightynetworks', false, 8, false),
  ('shopify', false, 6, false)
ON CONFLICT (source) DO NOTHING;

-- Grant permissions for sync settings
GRANT SELECT, UPDATE ON sync_settings TO authenticated, service_role;

-- Add helpful comments
COMMENT ON TABLE data_sync_logs IS 'Tracks all data synchronization activities from external platforms';
COMMENT ON TABLE sync_settings IS 'Configuration settings for automated data synchronization';
COMMENT ON VIEW recent_sync_activities IS 'Shows recent sync activities with calculated durations';

-- Create trigger for updated_at on sync_settings
CREATE OR REPLACE FUNCTION update_sync_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_settings_updated_at_trigger
  BEFORE UPDATE ON sync_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_sync_settings_updated_at(); 