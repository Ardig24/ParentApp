-- Add new columns to memories table
ALTER TABLE memories
ADD COLUMN type TEXT NOT NULL DEFAULT 'photo' CHECK (type IN ('text', 'photo', 'video', 'voice')),
ADD COLUMN content TEXT,
ADD COLUMN mood TEXT CHECK (mood IN ('happy', 'sad', 'excited', 'calm', 'angry', 'surprised')),
ADD COLUMN tags TEXT[],
ADD COLUMN location TEXT,
ADD COLUMN metadata JSONB;
