-- Fix service_name column issue in ai_api_keys table
-- Option 1: Make service_name nullable (safest approach)
ALTER TABLE ai_api_keys 
ALTER COLUMN service_name DROP NOT NULL;

-- Option 2: If service_name should be the same as provider, set a default
-- ALTER TABLE ai_api_keys 
-- ALTER COLUMN service_name SET DEFAULT 'openai';

-- Option 3: If service_name is not needed, drop it entirely
-- ALTER TABLE ai_api_keys DROP COLUMN IF EXISTS service_name;

-- Check the updated structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'ai_api_keys' 
  AND table_schema = 'public'
ORDER BY ordinal_position; 