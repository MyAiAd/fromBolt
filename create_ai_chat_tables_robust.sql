-- Ultra-Robust AI Chat System Setup (Handles Incomplete Previous Attempts)
-- This script can handle any state and complete the setup properly

-- Helper function to check if column exists
CREATE OR REPLACE FUNCTION column_exists(table_name text, column_name text) 
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = $1 
        AND column_name = $2
    );
END;
$$ LANGUAGE plpgsql;

-- Helper function to check if table exists
CREATE OR REPLACE FUNCTION table_exists(table_name text) 
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
    );
END;
$$ LANGUAGE plpgsql;

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
        NULL;
    WHEN undefined_object THEN
        NULL;
END $$;

-- 1. Create or complete ai_api_keys table
DO $$
BEGIN
    IF NOT table_exists('ai_api_keys') THEN
        -- Create the complete table
        CREATE TABLE ai_api_keys (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            provider VARCHAR(50) NOT NULL CHECK (provider IN ('openai', 'openrouter', 'anthropic')),
            api_key_encrypted TEXT NOT NULL,
            api_key_name VARCHAR(100) DEFAULT NULL,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );
    ELSE
        -- Table exists, check and add missing columns
        IF NOT column_exists('ai_api_keys', 'provider') THEN
            ALTER TABLE ai_api_keys ADD COLUMN provider VARCHAR(50);
            ALTER TABLE ai_api_keys ADD CONSTRAINT ai_api_keys_provider_check 
                CHECK (provider IN ('openai', 'openrouter', 'anthropic'));
        END IF;
        
        IF NOT column_exists('ai_api_keys', 'api_key_encrypted') THEN
            ALTER TABLE ai_api_keys ADD COLUMN api_key_encrypted TEXT;
        END IF;
        
        IF NOT column_exists('ai_api_keys', 'api_key_name') THEN
            ALTER TABLE ai_api_keys ADD COLUMN api_key_name VARCHAR(100) DEFAULT NULL;
        END IF;
        
        IF NOT column_exists('ai_api_keys', 'is_active') THEN
            ALTER TABLE ai_api_keys ADD COLUMN is_active BOOLEAN DEFAULT true;
        END IF;
        
        IF NOT column_exists('ai_api_keys', 'created_at') THEN
            ALTER TABLE ai_api_keys ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
        END IF;
        
        IF NOT column_exists('ai_api_keys', 'updated_at') THEN
            ALTER TABLE ai_api_keys ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
        END IF;
    END IF;
END $$;

-- Add unique constraint for ai_api_keys if it doesn't exist and columns exist
DO $$
BEGIN
    IF column_exists('ai_api_keys', 'provider') AND 
       column_exists('ai_api_keys', 'user_id') AND 
       column_exists('ai_api_keys', 'api_key_name') THEN
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint 
            WHERE conname = 'ai_api_keys_user_provider_name_key'
        ) THEN
            ALTER TABLE ai_api_keys ADD CONSTRAINT ai_api_keys_user_provider_name_key 
            UNIQUE(user_id, provider, api_key_name);
        END IF;
    END IF;
END $$;

-- 2. Create or complete rag_documents table
DO $$
BEGIN
    IF NOT table_exists('rag_documents') THEN
        CREATE TABLE rag_documents (
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
    ELSE
        -- Add missing columns if needed
        IF NOT column_exists('rag_documents', 'file_type') THEN
            ALTER TABLE rag_documents ADD COLUMN file_type VARCHAR(50) DEFAULT 'text';
        END IF;
        
        IF NOT column_exists('rag_documents', 'file_size') THEN
            ALTER TABLE rag_documents ADD COLUMN file_size INTEGER DEFAULT NULL;
        END IF;
        
        IF NOT column_exists('rag_documents', 'tags') THEN
            ALTER TABLE rag_documents ADD COLUMN tags TEXT[] DEFAULT '{}';
        END IF;
        
        IF NOT column_exists('rag_documents', 'is_active') THEN
            ALTER TABLE rag_documents ADD COLUMN is_active BOOLEAN DEFAULT true;
        END IF;
    END IF;
END $$;

-- 3. Create or complete chat_conversations table
DO $$
BEGIN
    IF NOT table_exists('chat_conversations') THEN
        CREATE TABLE chat_conversations (
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
    ELSE
        -- Add missing columns if needed
        IF NOT column_exists('chat_conversations', 'ai_provider') THEN
            ALTER TABLE chat_conversations ADD COLUMN ai_provider VARCHAR(50);
            ALTER TABLE chat_conversations ADD CONSTRAINT chat_conversations_ai_provider_check 
                CHECK (ai_provider IN ('openai', 'openrouter', 'anthropic'));
        END IF;
        
        IF NOT column_exists('chat_conversations', 'model_name') THEN
            ALTER TABLE chat_conversations ADD COLUMN model_name VARCHAR(100) DEFAULT NULL;
        END IF;
        
        IF NOT column_exists('chat_conversations', 'system_prompt') THEN
            ALTER TABLE chat_conversations ADD COLUMN system_prompt TEXT DEFAULT NULL;
        END IF;
        
        IF NOT column_exists('chat_conversations', 'is_archived') THEN
            ALTER TABLE chat_conversations ADD COLUMN is_archived BOOLEAN DEFAULT false;
        END IF;
    END IF;
END $$;

-- 4. Create or complete chat_messages table
DO $$
BEGIN
    IF NOT table_exists('chat_messages') THEN
        CREATE TABLE chat_messages (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
            role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
            content TEXT NOT NULL,
            rag_documents_used UUID[] DEFAULT '{}',
            token_count INTEGER DEFAULT NULL,
            cost_estimate DECIMAL(10,6) DEFAULT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );
    ELSE
        -- Add missing columns if needed
        IF NOT column_exists('chat_messages', 'rag_documents_used') THEN
            ALTER TABLE chat_messages ADD COLUMN rag_documents_used UUID[] DEFAULT '{}';
        END IF;
        
        IF NOT column_exists('chat_messages', 'token_count') THEN
            ALTER TABLE chat_messages ADD COLUMN token_count INTEGER DEFAULT NULL;
        END IF;
        
        IF NOT column_exists('chat_messages', 'cost_estimate') THEN
            ALTER TABLE chat_messages ADD COLUMN cost_estimate DECIMAL(10,6) DEFAULT NULL;
        END IF;
    END IF;
END $$;

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

-- Clean up helper functions
DROP FUNCTION column_exists(text, text);
DROP FUNCTION table_exists(text);

-- 9. Success message
DO $$
BEGIN
    RAISE NOTICE '✅ AI Chat System setup completed successfully!';
    RAISE NOTICE '📝 Tables: ai_api_keys, rag_documents, chat_conversations, chat_messages';
    RAISE NOTICE '🔒 RLS policies applied for security';
    RAISE NOTICE '⚡ Indexes created for performance';
    RAISE NOTICE '🔧 All missing columns have been added';
    RAISE NOTICE '🎉 System is ready for use!';
END $$; 