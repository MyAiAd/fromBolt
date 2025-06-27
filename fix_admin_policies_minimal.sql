-- Minimal Fix: Just Remove Problematic Admin Policies
-- This will resolve the "permission denied for table users" error

-- Remove the problematic admin policies that try to query auth.users
DROP POLICY IF EXISTS "Admins can manage all data" ON ai_api_keys;
DROP POLICY IF EXISTS "Admins can insert RAG documents" ON rag_documents;
DROP POLICY IF EXISTS "Admins can update RAG documents" ON rag_documents;
DROP POLICY IF EXISTS "Admins can delete RAG documents" ON rag_documents;

-- The existing user-based policies should be sufficient:
-- - Users can view/insert/update/delete their own API keys
-- - All users can view active RAG documents

SELECT 'Admin policies removed. API key functionality should now work!' as result; 