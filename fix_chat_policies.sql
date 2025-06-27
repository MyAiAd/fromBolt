-- Fix Chat Conversations and Messages Policies
-- The chat tables are giving 403 errors, need proper policies

-- First, check current policies for chat tables
SELECT tablename, policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('chat_conversations', 'chat_messages')
ORDER BY tablename, policyname;

-- Fix chat_conversations policies
-- Drop any existing policies first
DROP POLICY IF EXISTS "Users can view their own conversations" ON chat_conversations;
DROP POLICY IF EXISTS "Users can insert their own conversations" ON chat_conversations;
DROP POLICY IF EXISTS "Users can update their own conversations" ON chat_conversations;
DROP POLICY IF EXISTS "Users can delete their own conversations" ON chat_conversations;

-- Create working policies for chat_conversations
CREATE POLICY "Users can view their own conversations" ON chat_conversations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations" ON chat_conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations" ON chat_conversations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations" ON chat_conversations
    FOR DELETE USING (auth.uid() = user_id);

-- Fix chat_messages policies  
-- Drop any existing policies first
DROP POLICY IF EXISTS "Users can view messages from their own conversations" ON chat_messages;
DROP POLICY IF EXISTS "Users can insert messages to their own conversations" ON chat_messages;
DROP POLICY IF EXISTS "Users can update messages in their own conversations" ON chat_messages;
DROP POLICY IF EXISTS "Users can delete messages from their own conversations" ON chat_messages;

-- Create working policies for chat_messages
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

-- Verify all chat policies after the fix
SELECT tablename, policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('chat_conversations', 'chat_messages')
ORDER BY tablename, policyname; 