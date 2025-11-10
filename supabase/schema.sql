-- ============================================
-- Portfolio CMS Database Schema
-- Phase 8-2: Supabase Database Setup
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. ADMIN USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin users index
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- ============================================
-- 2. PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT DEFAULT '',
  thumbnail TEXT NOT NULL,
  category TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  tech_stack TEXT[] DEFAULT '{}',
  github_url TEXT,
  demo_url TEXT,
  duration TEXT NOT NULL,
  team_size INTEGER NOT NULL,
  role TEXT NOT NULL,
  achievements TEXT[] DEFAULT '{}',
  challenges TEXT[] DEFAULT '{}',
  solutions TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects indexes
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- ============================================
-- 3. COMMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT,
  author_avatar TEXT,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments indexes
CREATE INDEX IF NOT EXISTS idx_comments_project_id ON comments(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- ============================================
-- 4. UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Projects: Public read access
CREATE POLICY "Projects are viewable by everyone"
  ON projects FOR SELECT
  USING (true);

-- Projects: Admin can insert/update/delete
CREATE POLICY "Admins can insert projects"
  ON projects FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update projects"
  ON projects FOR UPDATE
  USING (true);

CREATE POLICY "Admins can delete projects"
  ON projects FOR DELETE
  USING (true);

-- Comments: Public read access
CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT
  USING (true);

-- Comments: Anyone can insert (public comments)
CREATE POLICY "Anyone can insert comments"
  ON comments FOR INSERT
  WITH CHECK (true);

-- Comments: Admin can update/delete
CREATE POLICY "Admins can update comments"
  ON comments FOR UPDATE
  USING (true);

CREATE POLICY "Admins can delete comments"
  ON comments FOR DELETE
  USING (true);

-- Admin users: 인증된 사용자가 자신의 레코드만 조회 가능
CREATE POLICY "Users can read their own admin record"
  ON admin_users FOR SELECT
  USING (auth.email() = email);

-- ============================================
-- 6. HELPER FUNCTIONS
-- ============================================

-- Function to increment project views
CREATE OR REPLACE FUNCTION increment_project_views(project_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE projects
  SET views = views + 1
  WHERE id = project_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment project likes
CREATE OR REPLACE FUNCTION increment_project_likes(project_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE projects
  SET likes = likes + 1
  WHERE id = project_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment comment likes
CREATE OR REPLACE FUNCTION increment_comment_likes(comment_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE comments
  SET likes = likes + 1
  WHERE id = comment_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. STATS VIEW (for admin dashboard)
-- ============================================
CREATE OR REPLACE VIEW admin_stats AS
SELECT
  (SELECT COUNT(*) FROM projects) AS total_projects,
  (SELECT COUNT(*) FROM comments) AS total_comments,
  (SELECT COALESCE(SUM(views), 0) FROM projects) AS total_views,
  (SELECT COALESCE(SUM(likes), 0) FROM projects) AS total_likes;

-- Grant access to stats view
GRANT SELECT ON admin_stats TO authenticated;
GRANT SELECT ON admin_stats TO anon;

-- ============================================
-- SCHEMA CREATION COMPLETE
-- ============================================
-- Next steps:
-- 1. Run this SQL in Supabase SQL Editor
-- 2. Insert test data (see seed.sql)
-- 3. Generate TypeScript types
-- ============================================
