-- Supabase SQL Migration: Add fallback response tracking
-- Run this in your Supabase SQL Editor to add fallback tracking to messages table

-- Step 1: Add is_fallback column to messages table
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS is_fallback BOOLEAN DEFAULT FALSE;

-- Step 2: Create index for better query performance on fallback searches
CREATE INDEX IF NOT EXISTS idx_messages_is_fallback 
ON messages(is_fallback) 
WHERE is_fallback = true;

-- Step 3: Add index for combined searches (communication + fallback)
CREATE INDEX IF NOT EXISTS idx_messages_comm_fallback 
ON messages(communication_id, is_fallback);

-- Verify the changes
-- Run this query to confirm the column was created:
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'messages' AND column_name = 'is_fallback';
