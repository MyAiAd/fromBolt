-- Safe AI Chat System Setup (Idempotent)
-- This script can be run multiple times safely

-- First, drop existing policies if they exist (to avoid conflicts)
DO $$
BEGIN
    -- Drop policies for ai_api_keys
    DROP POLICY IF EXISTS "Users can view their own API keys" ON ai_api_keys;
    DROP POLICY IF EXISTS "Users can insert their own API keys" ON ai_api_keys;
    DROP POLICY IF EXISTS "Users can update their own API keys" ON ai_api_keys;
    DROP POLICY IF EXISTS "Users can delete their own API keys" ON ai_api_keys;
    
    -- Drop policies for rag_documents
    DROP POLICY IF EXISTS "All users can view active RAG documents" ON rag_documents;
    DROP POLICY IF EXISTS "Admins can insert RAG documents" ON rag_documents;
    DROP POLICY IF EXISTS "Admins can update RAG documents" ON rag_documents;
    DROP POLICY IF EXISTS "Admins can delete RAG documents" ON rag_documents;
    
    -- Drop policies for chat_conversations
    DROP POLICY IF EXISTS "Users can view their own conversations" ON chat_conversations;
    DROP POLICY IF EXISTS "Users can insert their own conversations" ON chat_conversations;
    DROP POLICY IF EXISTS "Users can update their own conversations" ON chat_conversations;
    DROP POLICY IF EXISTS "Users can delete their own conversations" ON chat_conversations;
    
    -- Drop policies for chat_messages
    DROP POLICY IF EXISTS "Users can view messages from their own conversations" ON chat_messages;
    DROP POLICY IF EXISTS "Users can insert messages to their own conversations" ON chat_messages;
    DROP POLICY IF EXISTS "Users can update messages in their own conversations" ON chat_messages;
    DROP POLICY IF EXISTS "Users can delete messages from their own conversations" ON chat_messages;
EXCEPTION
    WHEN undefined_table THEN
        -- Tables don't exist yet, that's fine
        NULL;
    WHEN undefined_object THEN
        -- Policies don't exist yet, that's fine
        NULL;
END $$;

-- 1. AI API Keys table for user API key management
CREATE TABLE IF NOT EXISTS ai_api_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL CHECK (provider IN ('openai', 'openrouter', 'anthropic')),
    api_key_encrypted TEXT NOT NULL,
    api_key_name VARCHAR(100) DEFAULT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add unique constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'ai_api_keys_user_provider_name_key'
    ) THEN
        ALTER TABLE ai_api_keys ADD CONSTRAINT ai_api_keys_user_provider_name_key 
        UNIQUE(user_id, provider, api_key_name);
    END IF;
END $$;

-- 2. RAG Documents table for document storage (admin only)
CREATE TABLE IF NOT EXISTS rag_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    file_type VARCHAR(50) DEFAULT 'text',
    file_size INTEGER DEFAULT NULL,
    tags TEXT[] DEFAULT '{}',
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Chat Conversations table
CREATE TABLE IF NOT EXISTS chat_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) DEFAULT 'New Conversation',
    ai_provider VARCHAR(50) NOT NULL CHECK (ai_provider IN ('openai', 'openrouter', 'anthropic')),
    model_name VARCHAR(100) DEFAULT NULL,
    system_prompt TEXT DEFAULT NULL,
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Chat Messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    rag_documents_used UUID[] DEFAULT '{}',
    token_count INTEGER DEFAULT NULL,
    cost_estimate DECIMAL(10,6) DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create indexes for better performance (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_ai_api_keys_user_id ON ai_api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_api_keys_provider ON ai_api_keys(provider);
CREATE INDEX IF NOT EXISTS idx_rag_documents_uploaded_by ON rag_documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_rag_documents_is_active ON rag_documents(is_active);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_id ON chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- 6. Enable Row Level Security (RLS) on all tables
ALTER TABLE ai_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE rag_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS Policies

-- AI API Keys policies - users can only see their own keys
CREATE POLICY "Users can view their own API keys" ON ai_api_keys
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own API keys" ON ai_api_keys
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own API keys" ON ai_api_keys
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own API keys" ON ai_api_keys
    FOR DELETE USING (auth.uid() = user_id);

-- RAG Documents policies - only admins can manage documents, but all users can read active ones
CREATE POLICY "All users can view active RAG documents" ON rag_documents
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can insert RAG documents" ON rag_documents
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data->>'is_admin' = 'true'
        )
    );

CREATE POLICY "Admins can update RAG documents" ON rag_documents
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data->>'is_admin' = 'true'
        )
    );

CREATE POLICY "Admins can delete RAG documents" ON rag_documents
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data->>'is_admin' = 'true'
        )
    );

-- Chat Conversations policies - users can only see their own conversations
CREATE POLICY "Users can view their own conversations" ON chat_conversations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations" ON chat_conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations" ON chat_conversations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations" ON chat_conversations
    FOR DELETE USING (auth.uid() = user_id);

-- Chat Messages policies - users can only see messages from their own conversations
CREATE POLICY "Users can view messages from their own conversations" ON chat_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chat_conversations 
            WHERE id = conversation_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert messages to their own conversations" ON chat_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM chat_conversations 
            WHERE id = conversation_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update messages in their own conversations" ON chat_messages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM chat_conversations 
            WHERE id = conversation_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete messages from their own conversations" ON chat_messages
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM chat_conversations 
            WHERE id = conversation_id 
            AND user_id = auth.uid()
        )
    );

-- 8. Grant necessary permissions
GRANT ALL ON ai_api_keys TO authenticated;
GRANT ALL ON rag_documents TO authenticated;
GRANT ALL ON chat_conversations TO authenticated;
GRANT ALL ON chat_messages TO authenticated;

GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- 9. Success message
DO $$
BEGIN
    RAISE NOTICE '✅ AI Chat System setup completed successfully!';
    RAISE NOTICE '📝 Tables: ai_api_keys, rag_documents, chat_conversations, chat_messages';
    RAISE NOTICE '🔒 RLS policies applied for security';
    RAISE NOTICE '⚡ Indexes created for performance';
    RAISE NOTICE '🎉 System is ready for use!';
END $$; 