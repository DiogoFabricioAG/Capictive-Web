-- Add audio support to chat messages
ALTER TABLE chat_messages
ADD COLUMN IF NOT EXISTS audio_url TEXT,
ADD COLUMN IF NOT EXISTS response_type TEXT DEFAULT 'text' CHECK (response_type IN ('text', 'audio'));

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_created 
ON chat_messages(conversation_id, created_at DESC);

-- Add comment
COMMENT ON COLUMN chat_messages.audio_url IS 'URL to audio file if response is audio';
COMMENT ON COLUMN chat_messages.response_type IS 'Type of response: text or audio';
