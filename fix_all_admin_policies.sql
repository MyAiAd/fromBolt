-- Fix All Admin Policies for AI Chat Tables
-- The issue: Admin policies try to query auth.users table, 
-- but authenticated users don't have permission to read it

-- Drop all problematic admin policies
DROP POLICY IF EXISTS "Admins can manage all data" ON ai_api_keys;
DROP POLICY IF EXISTS "Admins can insert RAG documents" ON rag_documents;
DROP POLICY IF EXISTS "Admins can update RAG documents" ON rag_documents;
DROP POLICY IF EXISTS "Admins can delete RAG documents" ON rag_documents;

-- For ai_api_keys: Use simple user-based policies only
-- (Each user can only manage their own API keys)

-- For rag_documents: Create simplified policies
-- Option 1: All users can read active documents, only specific users can manage
CREATE POLICY "All users can view active RAG documents" ON rag_documents
    FOR SELECT USING (is_active = true);

-- Option 2: Allow authenticated users to manage documents (simplified)
-- Remove this if you want stricter control
CREATE POLICY "Authenticated users can manage RAG documents" ON rag_documents
    FOR ALL USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- Alternative Option 3: If you need admin-only RAG management,
-- you'll need to set up admin checking differently (e.g., separate admin table)

-- Verify all policies
SELECT 
    tablename,
    policyname, 
    cmd, 
    qual, 
    with_check 
FROM pg_policies 
WHERE tablename IN ('ai_api_keys', 'rag_documents', 'chat_conversations', 'chat_messages')
ORDER BY tablename, policyname; 