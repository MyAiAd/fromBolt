-- Quick check to see if AI chat tables exist
SELECT 
    table_name,
    CASE 
        WHEN table_name IS NOT NULL THEN '✅ Exists'
        ELSE '❌ Missing'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('ai_api_keys', 'rag_documents', 'chat_conversations', 'chat_messages')
ORDER BY table_name;

-- If no results show up, the tables don't exist yet 