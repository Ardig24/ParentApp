-- Create health_records table
CREATE TABLE health_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('checkup', 'vaccination', 'measurement', 'symptom')),
    title TEXT NOT NULL,
    notes TEXT,
    height DECIMAL,
    weight DECIMAL,
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create medications table
CREATE TABLE medications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL,
    notes TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;

-- Create policies for health_records
CREATE POLICY "Users can view their own health records"
    ON health_records FOR SELECT
    USING (parent_id = auth.uid());

CREATE POLICY "Users can insert their own health records"
    ON health_records FOR INSERT
    WITH CHECK (parent_id = auth.uid());

CREATE POLICY "Users can update their own health records"
    ON health_records FOR UPDATE
    USING (parent_id = auth.uid());

CREATE POLICY "Users can delete their own health records"
    ON health_records FOR DELETE
    USING (parent_id = auth.uid());

-- Create policies for medications
CREATE POLICY "Users can view their own medications"
    ON medications FOR SELECT
    USING (parent_id = auth.uid());

CREATE POLICY "Users can insert their own medications"
    ON medications FOR INSERT
    WITH CHECK (parent_id = auth.uid());

CREATE POLICY "Users can update their own medications"
    ON medications FOR UPDATE
    USING (parent_id = auth.uid());

CREATE POLICY "Users can delete their own medications"
    ON medications FOR DELETE
    USING (parent_id = auth.uid());

-- Create updated_at triggers
CREATE TRIGGER set_health_records_updated_at
    BEFORE UPDATE ON health_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_medications_updated_at
    BEFORE UPDATE ON medications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
