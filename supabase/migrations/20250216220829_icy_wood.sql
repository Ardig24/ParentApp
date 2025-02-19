/*
  # Initial Schema for Parenting Journal

  1. New Tables
    - `profiles`
      - User profiles with authentication details
    - `children`
      - Child profiles with basic information
    - `memories`
      - Journal entries, photos, and videos
    - `milestones`
      - Predefined and custom milestones
    - `health_records`
      - Health-related entries and measurements
    - `medications`
      - Medication tracking
    - `stories`
      - AI-generated stories
    - `time_capsules`
      - Future messages and memories
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create children table
CREATE TABLE children (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  birth_date date NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create memories table
CREATE TABLE memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('text', 'photo', 'video', 'voice')),
  title text NOT NULL,
  content text,
  media_url text,
  mood text,
  tags text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create milestones table
CREATE TABLE milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  date date NOT NULL,
  category text NOT NULL,
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create health_records table
CREATE TABLE health_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('checkup', 'vaccination', 'measurement', 'symptom')),
  date date NOT NULL,
  title text NOT NULL,
  notes text,
  height numeric,
  weight numeric,
  temperature numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create medications table
CREATE TABLE medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  dosage text NOT NULL,
  frequency text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create stories table
CREATE TABLE stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  theme text NOT NULL,
  characters text[],
  illustrations text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create time_capsules table
CREATE TABLE time_capsules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('text', 'photo', 'video', 'voice')),
  title text NOT NULL,
  content text,
  media_url text,
  unlock_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_capsules ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can view own children"
  ON children FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Users can manage own children"
  ON children FOR ALL
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Users can view child memories"
  ON memories FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = memories.child_id
      AND children.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage child memories"
  ON memories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = memories.child_id
      AND children.profile_id = auth.uid()
    )
  );

-- Similar policies for other tables
CREATE POLICY "Users can view child milestones"
  ON milestones FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = milestones.child_id
      AND children.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage child milestones"
  ON milestones FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = milestones.child_id
      AND children.profile_id = auth.uid()
    )
  );

-- Add more policies for health_records, medications, stories, and time_capsules