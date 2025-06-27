-- Check the actual structure of ai_api_keys table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'ai_api_keys' 
  AND table_schema = 'public'
ORDER BY ordinal_position; 