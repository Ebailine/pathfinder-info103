-- PathFinder: LinkedIn OAuth Integration
-- Migration: Add LinkedIn OAuth fields to users table
-- Created: 2025-01-23

-- Add LinkedIn OAuth fields to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS linkedin_access_token TEXT,
ADD COLUMN IF NOT EXISTS linkedin_refresh_token TEXT,
ADD COLUMN IF NOT EXISTS linkedin_token_expires_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS linkedin_connected_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS linkedin_last_synced_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS pathfinder_enabled BOOLEAN DEFAULT FALSE;

-- Add additional user profile fields for PathFinder
ALTER TABLE users
ADD COLUMN IF NOT EXISTS school TEXT,
ADD COLUMN IF NOT EXISTS major TEXT,
ADD COLUMN IF NOT EXISTS graduation_year INTEGER,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS target_roles TEXT[];

-- Create index for PathFinder users
CREATE INDEX IF NOT EXISTS idx_users_pathfinder_enabled
ON users(pathfinder_enabled)
WHERE pathfinder_enabled = TRUE;

-- Create index for LinkedIn token expiration
CREATE INDEX IF NOT EXISTS idx_users_linkedin_token_expires
ON users(linkedin_token_expires_at)
WHERE linkedin_access_token IS NOT NULL;

-- Add comment
COMMENT ON COLUMN users.linkedin_access_token IS 'Encrypted LinkedIn OAuth access token';
COMMENT ON COLUMN users.linkedin_refresh_token IS 'Encrypted LinkedIn OAuth refresh token';
COMMENT ON COLUMN users.pathfinder_enabled IS 'Flag indicating if user has access to PathFinder features';
