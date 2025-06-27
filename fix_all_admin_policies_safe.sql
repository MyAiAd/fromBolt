-- Safe Fix for All Admin Policies for AI Chat Tables
-- Handles existing policies gracefully

-- Drop all problematic admin policies
DROP POLICY IF EXISTS "Admins can manage all data" ON ai_api_keys;
DROP POLICY IF EXISTS "Admins can insert RAG documents" ON rag_documents;
DROP POLICY IF EXISTS "Admins can update RAG documents" ON rag_documents;
DROP POLICY IF EXISTS "Admins can delete RAG documents" ON rag_documents;

-- For rag_documents: Drop and recreate the view policy to ensure it's correct
DROP POLICY IF EXISTS "All users can view active RAG documents" ON rag_documents;
CREATE POLICY "All users can view active RAG documents" ON rag_documents
    FOR SELECT USING (is_active = true);

-- Add a simple management policy for RAG documents
DROP POLICY IF EXISTS "Authenticated users can manage RAG documents" ON rag_documents;
CREATE POLICY "Authenticated users can manage RAG documents" ON rag_documents
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update RAG documents" ON rag_documents
    FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete RAG documents" ON rag_documents
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- Verify all policies after the fix
SELECT 
    tablename,
    policyname, 
    cmd, 
    qual, 
    with_check 
FROM pg_policies 
WHERE tablename IN ('ai_api_keys', 'rag_documents', 'chat_conversations', 'chat_messages')
ORDER BY tablename, policyname; 