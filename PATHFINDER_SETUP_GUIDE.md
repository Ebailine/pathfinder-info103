# PathFinder Setup & Deployment Guide

Complete guide for deploying PathFinder to production.

---

## 🎯 Overview

PathFinder transforms SIVIO from a job application tracker into a warm introduction networking platform. This guide covers all setup steps needed for production deployment.

**Deployment Status:**
- ✅ All code implemented and committed
- ✅ TypeScript compilation passing
- ✅ Production builds successful
- ⏳ Environment configuration needed
- ⏳ Database migrations needed
- ⏳ LinkedIn OAuth app configuration needed

---

## 📋 Prerequisites

1. **Accounts & Access:**
   - ✅ Vercel account connected to GitHub repo
   - ✅ Supabase project active
   - ✅ Clerk account for authentication
   - ⏳ LinkedIn Developer account (for OAuth app)
   - ⏳ Anthropic API key (for Claude)

2. **Current Environment:**
   - Next.js 15.5.6
   - Node.js 18+ or 20+
   - Supabase PostgreSQL
   - Clerk authentication (TEST mode)

---

## 🔧 Step 1: Database Migrations

Run these migrations in your Supabase SQL editor (in order):

### Migration 1: LinkedIn OAuth Support
```sql
-- File: supabase/migrations/20250123_pathfinder_linkedin_oauth.sql
-- This adds LinkedIn OAuth fields to users table

ALTER TABLE users
ADD COLUMN IF NOT EXISTS linkedin_access_token TEXT,
ADD COLUMN IF NOT EXISTS linkedin_refresh_token TEXT,
ADD COLUMN IF NOT EXISTS linkedin_token_expires_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS linkedin_connected_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS linkedin_last_synced_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS pathfinder_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS target_roles TEXT[];

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_linkedin_connected
  ON users(linkedin_connected_at)
  WHERE linkedin_connected_at IS NOT NULL;
```

### Migration 2: LinkedIn Connections Table
```sql
-- File: supabase/migrations/20250123_linkedin_connections_table.sql
-- This creates the table for storing imported LinkedIn connections

CREATE TABLE IF NOT EXISTS linkedin_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  linkedin_id TEXT NOT NULL,

  -- Personal info
  full_name TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  headline TEXT,
  profile_photo_url TEXT,

  -- Current position
  current_company TEXT,
  current_role TEXT,

  -- Education
  school TEXT,
  major TEXT,
  graduation_year INTEGER,
  degree TEXT,

  -- Location
  city TEXT,
  state TEXT,

  -- Connection metadata
  mutual_connections INTEGER DEFAULT 0,
  intro_likelihood_score INTEGER DEFAULT 0,

  -- Calculated flags
  same_school BOOLEAN DEFAULT FALSE,
  same_major BOOLEAN DEFAULT FALSE,
  recent_graduate BOOLEAN DEFAULT FALSE,

  -- Raw data
  raw_data JSONB,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Constraints
  UNIQUE(user_id, linkedin_id)
);

-- Indexes for performance
CREATE INDEX idx_linkedin_connections_user
  ON linkedin_connections(user_id);

CREATE INDEX idx_linkedin_connections_score
  ON linkedin_connections(user_id, intro_likelihood_score DESC);

CREATE INDEX idx_linkedin_connections_school
  ON linkedin_connections(user_id, same_school)
  WHERE same_school = true;

CREATE INDEX idx_linkedin_connections_company
  ON linkedin_connections(user_id, current_company)
  WHERE current_company IS NOT NULL;

-- Full-text search index
CREATE INDEX idx_linkedin_connections_search
  ON linkedin_connections USING gin(to_tsvector('english',
    COALESCE(full_name, '') || ' ' ||
    COALESCE(current_company, '') || ' ' ||
    COALESCE(school, '')
  ));

-- Row Level Security (RLS)
ALTER TABLE linkedin_connections ENABLE ROW LEVEL SECURITY;

-- Users can only access their own connections
CREATE POLICY "Users can view own connections"
  ON linkedin_connections FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own connections"
  ON linkedin_connections FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own connections"
  ON linkedin_connections FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own connections"
  ON linkedin_connections FOR DELETE
  USING (user_id = auth.uid());

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_linkedin_connections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER linkedin_connections_updated_at
  BEFORE UPDATE ON linkedin_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_linkedin_connections_updated_at();
```

**Verification:**
```sql
-- Check tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('users', 'linkedin_connections');

-- Check new user columns exist
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'users'
  AND column_name LIKE 'linkedin%';
```

---

## 🔐 Step 2: LinkedIn OAuth App Setup

### Create LinkedIn OAuth Application

1. **Go to LinkedIn Developers:**
   - Visit: https://www.linkedin.com/developers/apps
   - Click "Create app"

2. **Fill in App Details:**
   - App name: "SIVIO PathFinder"
   - LinkedIn Page: Your company page or create one
   - Privacy policy URL: `https://your-domain.com/privacy`
   - App logo: Upload your logo

3. **Configure OAuth Settings:**
   - Go to "Auth" tab
   - Add redirect URLs:
     ```
     https://your-domain.vercel.app/api/linkedin/callback
     http://localhost:3000/api/linkedin/callback (for testing)
     ```

4. **Request API Access:**
   - Go to "Products" tab
   - Request access to "Sign In with LinkedIn using OpenID Connect"
   - **Note:** You need these scopes:
     - `openid` (default)
     - `profile` (default)
     - `email` (default)
     - `w_member_social` (requires approval - for connection import)

5. **Get Credentials:**
   - Go to "Auth" tab
   - Copy "Client ID" and "Client Secret"
   - Save these for environment variables

### Important Notes:

⚠️ **LinkedIn API Limitations:**
- Basic API access only allows profile data
- `w_member_social` scope (for importing connections) requires LinkedIn approval
- Approval can take 1-3 days
- You may need to explain your use case to LinkedIn

**Alternative if API not approved:**
- Chrome extension fallback (Phase 4 - not yet implemented)
- Manual CSV import (future feature)

---

## 🌍 Step 3: Environment Variables

Add these to your Vercel project settings:

### Required Variables:

```bash
# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your_client_id_here
LINKEDIN_CLIENT_SECRET=your_client_secret_here
LINKEDIN_REDIRECT_URI=https://your-domain.vercel.app/api/linkedin/callback

# Encryption (for storing LinkedIn tokens)
# Generate with: openssl rand -base64 32
ENCRYPTION_KEY=your_32_byte_random_string_here

# Anthropic API (for message generation)
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Existing Variables (already configured)
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
# CLERK_SECRET_KEY=...
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# SUPABASE_SERVICE_ROLE_KEY=...
```

### Generate Encryption Key:

```bash
# On macOS/Linux:
openssl rand -base64 32

# Or in Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Add to Vercel:

1. Go to your Vercel project
2. Settings → Environment Variables
3. Add each variable for "Production", "Preview", and "Development"
4. Redeploy after adding

---

## 🚀 Step 4: Deploy to Production

### Current Deployment Status:

All code has been committed to GitHub:
- ✅ Phase 1: LinkedIn Integration (4 phases)
- ✅ Phase 2: UI Layer (4 phases)
- ✅ Phase 3: Teaching Components
- ✅ All builds passing
- ✅ All TypeScript checks passing

### Deploy Steps:

1. **Verify Environment Variables:**
   ```bash
   # Check Vercel env vars are set
   vercel env ls
   ```

2. **Trigger Deployment:**
   - Vercel auto-deploys from GitHub main branch
   - Or manually: `vercel --prod`

3. **Monitor Deployment:**
   - Watch Vercel dashboard for build logs
   - Check for any environment variable errors
   - Verify all routes build successfully

4. **Post-Deployment Checks:**
   ```bash
   # Visit these URLs to verify:
   https://your-domain.vercel.app/pathfinder/dashboard
   https://your-domain.vercel.app/pathfinder/connect
   https://your-domain.vercel.app/pathfinder/select-company
   ```

---

## ✅ Step 5: Testing the Complete Flow

### End-to-End Test:

1. **Initial Setup:**
   - [ ] Visit `/pathfinder/dashboard`
   - [ ] Should show "Connect LinkedIn" CTA
   - [ ] Click "Connect LinkedIn"

2. **LinkedIn OAuth:**
   - [ ] Redirects to LinkedIn login
   - [ ] Authorize SIVIO PathFinder app
   - [ ] Redirects back to `/pathfinder/onboarding?step=sync`

3. **Connection Sync:**
   - [ ] Shows sync progress UI
   - [ ] Imports LinkedIn connections (takes 2-5 min)
   - [ ] Shows completion message
   - [ ] Redirects to profile completion

4. **Profile Completion:**
   - [ ] Fill in school, major, graduation year
   - [ ] Submit form
   - [ ] Should redirect to dashboard

5. **Find Networking Paths:**
   - [ ] Dashboard shows connection stats
   - [ ] Click "Find Path to New Company"
   - [ ] Enter target company (e.g., "Google")
   - [ ] See ranked list of connections at that company

6. **Draft Message:**
   - [ ] Click "Draft Message" on a connection
   - [ ] AI generates 3 message variations
   - [ ] Edit message text
   - [ ] Copy to clipboard
   - [ ] Success!

### Database Verification:

```sql
-- Check user has LinkedIn connected
SELECT
  id,
  first_name,
  linkedin_connected_at,
  linkedin_last_synced_at
FROM users
WHERE clerk_user_id = 'user_xxx';

-- Check connections imported
SELECT COUNT(*) as total_connections
FROM linkedin_connections
WHERE user_id = 'user_uuid';

-- Check intro scores calculated
SELECT
  full_name,
  current_company,
  intro_likelihood_score,
  same_school
FROM linkedin_connections
WHERE user_id = 'user_uuid'
ORDER BY intro_likelihood_score DESC
LIMIT 10;
```

---

## 🐛 Troubleshooting

### Common Issues:

**1. LinkedIn OAuth Error: "Redirect URI mismatch"**
- Solution: Verify redirect URI in LinkedIn app matches exactly
- Check: `https://your-domain.vercel.app/api/linkedin/callback`

**2. "Failed to decrypt token" Error**
- Solution: Verify `ENCRYPTION_KEY` is set in Vercel env vars
- Must be same key across all environments

**3. "Failed to generate message" Error**
- Solution: Check `ANTHROPIC_API_KEY` is valid
- Verify API key has credits
- Check Anthropic API status

**4. No connections syncing**
- Solution: LinkedIn API approval may be pending
- Check LinkedIn Developer console for approval status
- Verify `w_member_social` scope is granted

**5. Build fails with TypeScript errors**
- Solution: Run locally first: `npm run build`
- Fix any type errors before deploying
- Ensure all imports are correct

---

## 📊 Monitoring & Analytics

### Key Metrics to Track:

1. **User Onboarding:**
   - LinkedIn connections per user
   - Time to complete onboarding
   - Profile completion rate

2. **Path Discovery:**
   - Companies searched
   - Connections shown per search
   - Messages generated
   - Copy-to-clipboard rate

3. **System Health:**
   - LinkedIn API rate limits
   - Token refresh success rate
   - Message generation latency
   - Database query performance

### Database Queries:

```sql
-- Total users with LinkedIn connected
SELECT COUNT(*)
FROM users
WHERE linkedin_connected_at IS NOT NULL;

-- Average connections per user
SELECT AVG(connection_count)
FROM (
  SELECT user_id, COUNT(*) as connection_count
  FROM linkedin_connections
  GROUP BY user_id
) counts;

-- Top searched companies
SELECT current_company, COUNT(*) as search_count
FROM linkedin_connections
GROUP BY current_company
ORDER BY search_count DESC
LIMIT 10;
```

---

## 🔄 Future Enhancements

**Phase 4 (Not Yet Implemented):**
- [ ] Chrome extension for LinkedIn scraping (fallback if API not approved)
- [ ] Message tracking in CRM
- [ ] Response rate analytics
- [ ] Follow-up reminders
- [ ] Gamification system (levels, achievements)
- [ ] Success stories showcase
- [ ] Second-degree connection search
- [ ] Email integration for outreach

---

## 📞 Support

**If you encounter issues:**

1. Check Vercel deployment logs
2. Check Supabase logs for database errors
3. Verify all environment variables are set
4. Test LinkedIn OAuth flow in incognito mode
5. Check LinkedIn Developer console for API limits

**Resources:**
- LinkedIn API Docs: https://learn.microsoft.com/en-us/linkedin/
- Anthropic API Docs: https://docs.anthropic.com/
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs

---

## ✨ Deployment Checklist

Before going live:

- [ ] Run all database migrations
- [ ] Create LinkedIn OAuth app
- [ ] Request LinkedIn API approval
- [ ] Set all environment variables in Vercel
- [ ] Generate encryption key
- [ ] Get Anthropic API key
- [ ] Deploy to Vercel
- [ ] Test complete user flow
- [ ] Verify connection sync works
- [ ] Verify message generation works
- [ ] Monitor error logs for 24 hours
- [ ] Enable Clerk production mode
- [ ] Update privacy policy for LinkedIn data
- [ ] Add LinkedIn login to marketing site

---

## 🎉 Launch!

Once all checks pass:

1. Announce PathFinder to users
2. Create onboarding tutorial
3. Monitor user feedback
4. Track key metrics
5. Iterate based on data

**PathFinder is ready to help students land internships through warm introductions!**

---

Generated: January 2025
Version: 1.0
