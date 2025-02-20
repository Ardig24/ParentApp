-- Create events table
CREATE TABLE events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    date TIMESTAMPTZ NOT NULL,
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('health', 'milestone', 'activity', 'other')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own events"
    ON events FOR SELECT
    USING (parent_id = auth.uid());

CREATE POLICY "Users can insert their own events"
    ON events FOR INSERT
    WITH CHECK (parent_id = auth.uid());

CREATE POLICY "Users can update their own events"
    ON events FOR UPDATE
    USING (parent_id = auth.uid());

CREATE POLICY "Users can delete their own events"
    ON events FOR DELETE
    USING (parent_id = auth.uid());

-- Create updated_at trigger
CREATE TRIGGER set_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
