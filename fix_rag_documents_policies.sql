-- Fix RAG Documents Policies
-- The RAG documents table is giving 403 errors, need proper policies

-- First, check current policies for rag_documents
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'rag_documents';

-- Drop any existing problematic policies
DROP POLICY IF EXISTS "All users can view active RAG documents" ON rag_documents;
DROP POLICY IF EXISTS "Authenticated users can manage RAG documents" ON rag_documents;
DROP POLICY IF EXISTS "Authenticated users can update RAG documents" ON rag_documents;
DROP POLICY IF EXISTS "Authenticated users can delete RAG documents" ON rag_documents;

-- Create simple, working policies for RAG documents
-- Policy 1: All authenticated users can view active documents
CREATE POLICY "Users can view active RAG documents" ON rag_documents
    FOR SELECT USING (is_active = true);

-- Policy 2: All authenticated users can insert documents
CREATE POLICY "Users can insert RAG documents" ON rag_documents
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Policy 3: Users can update documents they uploaded
CREATE POLICY "Users can update their own RAG documents" ON rag_documents
    FOR UPDATE USING (auth.uid() = uploaded_by);

-- Policy 4: Users can delete documents they uploaded  
CREATE POLICY "Users can delete their own RAG documents" ON rag_documents
    FOR DELETE USING (auth.uid() = uploaded_by);

-- Verify the new policies
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'rag_documents'
ORDER BY policyname; 