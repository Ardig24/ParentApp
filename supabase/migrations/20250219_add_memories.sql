-- Create memories table
CREATE TABLE memories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    media_url TEXT,
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own memories"
    ON memories FOR SELECT
    USING (parent_id = auth.uid());

CREATE POLICY "Users can insert their own memories"
    ON memories FOR INSERT
    WITH CHECK (parent_id = auth.uid());

CREATE POLICY "Users can update their own memories"
    ON memories FOR UPDATE
    USING (parent_id = auth.uid());

CREATE POLICY "Users can delete their own memories"
    ON memories FOR DELETE
    USING (parent_id = auth.uid());

-- Create updated_at trigger
CREATE TRIGGER set_memories_updated_at
    BEFORE UPDATE ON memories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
