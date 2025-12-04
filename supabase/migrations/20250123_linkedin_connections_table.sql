-- PathFinder: LinkedIn Connections Table
-- Migration: Create table to store user's LinkedIn connections
-- Created: 2025-01-23

-- Create linkedin_connections table
CREATE TABLE IF NOT EXISTS linkedin_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- LinkedIn identity
  linkedin_id TEXT,
  linkedin_url TEXT,

  -- Profile information
  full_name TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  headline TEXT,
  profile_photo_url TEXT,

  -- Current position
  current_company TEXT,
  current_role TEXT,
  current_company_linkedin_id TEXT,

  -- Education
  school TEXT,
  major TEXT,
  graduation_year INTEGER,
  degree TEXT,

  -- Location
  location TEXT,
  city TEXT,
  state TEXT,
  country TEXT,

  -- Relationship metadata
  connection_date DATE,
  mutual_connections INTEGER DEFAULT 0,

  -- Calculated scores (for PathFinder ranking)
  intro_likelihood_score INTEGER DEFAULT 0,
  same_school BOOLEAN DEFAULT FALSE,
  same_major BOOLEAN DEFAULT FALSE,
  recent_graduate BOOLEAN DEFAULT FALSE,

  -- Raw data storage
  raw_data JSONB,

  -- Sync metadata
  last_synced_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Constraints
  UNIQUE(user_id, linkedin_id)
);

-- Indexes for performance
CREATE INDEX idx_linkedin_connections_user_id
  ON linkedin_connections(user_id);

CREATE INDEX idx_linkedin_connections_company
  ON linkedin_connections(user_id, current_company)
  WHERE current_company IS NOT NULL;

CREATE INDEX idx_linkedin_connections_school
  ON linkedin_connections(user_id, school)
  WHERE school IS NOT NULL;

CREATE INDEX idx_linkedin_connections_score
  ON linkedin_connections(user_id, intro_likelihood_score DESC);

CREATE INDEX idx_linkedin_connections_same_school
  ON linkedin_connections(user_id, same_school)
  WHERE same_school = TRUE;

-- Add GIN index for raw_data JSONB queries
CREATE INDEX idx_linkedin_connections_raw_data
  ON linkedin_connections USING GIN (raw_data);

-- Comments for documentation
COMMENT ON TABLE linkedin_connections IS 'Stores LinkedIn connections imported via OAuth for PathFinder networking features';
COMMENT ON COLUMN linkedin_connections.intro_likelihood_score IS 'AI-calculated score (0-200) indicating likelihood connection will help with introduction';
COMMENT ON COLUMN linkedin_connections.raw_data IS 'Complete raw LinkedIn API response for reference and future parsing';

-- Enable Row Level Security (RLS)
ALTER TABLE linkedin_connections ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own connections
CREATE POLICY linkedin_connections_user_policy ON linkedin_connections
  FOR ALL
  USING (user_id = auth.uid()::uuid);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_linkedin_connections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER linkedin_connections_updated_at_trigger
  BEFORE UPDATE ON linkedin_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_linkedin_connections_updated_at();
