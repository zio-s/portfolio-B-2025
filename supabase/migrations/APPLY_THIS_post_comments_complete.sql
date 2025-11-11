-- ============================================
-- POST COMMENTS 시스템 전체 마이그레이션
-- ============================================
-- Supabase 대시보드 SQL Editor에서 이 파일을 복사하여 실행하세요
--
-- 1. https://supabase.com/dashboard/project/YOUR_PROJECT/sql/new
-- 2. 이 SQL 전체를 복사하여 붙여넣기
-- 3. "Run" 버튼 클릭
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- STEP 1: Create post_comments table
-- ============================================

CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_parent_id ON post_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_status ON post_comments(status);
CREATE INDEX IF NOT EXISTS idx_post_comments_created_at ON post_comments(created_at DESC);

-- ============================================
-- STEP 2: Create updated_at trigger
-- ============================================

CREATE OR REPLACE FUNCTION update_post_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS post_comments_updated_at ON post_comments;

CREATE TRIGGER post_comments_updated_at
  BEFORE UPDATE ON post_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_post_comments_updated_at();

-- ============================================
-- STEP 3: Enable Row Level Security
-- ============================================

ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can read approved post comments" ON post_comments;
DROP POLICY IF EXISTS "Anyone can insert post comments" ON post_comments;
DROP POLICY IF EXISTS "Admin can update post comments" ON post_comments;
DROP POLICY IF EXISTS "Admin can delete post comments" ON post_comments;

-- Create RLS Policies
CREATE POLICY "Anyone can read all post comments"
  ON post_comments
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert post comments"
  ON post_comments
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin can update post comments"
  ON post_comments
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admin can delete post comments"
  ON post_comments
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
    )
  );

-- ============================================
-- STEP 4: Update post_stats view
-- ============================================

-- Drop existing view
DROP VIEW IF EXISTS post_stats;

-- Recreate view with post_comments join
CREATE VIEW post_stats AS
SELECT
  p.id,
  p.title,
  p.content,
  p.excerpt,
  p.slug,
  p.status,
  p.author_id,
  p.tags,
  p.published_at,
  p.created_at,
  p.updated_at,
  COALESCE(COUNT(DISTINCT pl.id), 0)::INTEGER AS likes_count,
  COALESCE(COUNT(DISTINCT pv.id), 0)::INTEGER AS views_count,
  COALESCE(COUNT(DISTINCT CASE WHEN pc.status = 'approved' THEN pc.id END), 0)::INTEGER AS comments_count
FROM posts p
LEFT JOIN post_likes pl ON p.id = pl.post_id
LEFT JOIN post_views pv ON p.id = pv.post_id
LEFT JOIN post_comments pc ON p.id = pc.post_id
GROUP BY
  p.id,
  p.title,
  p.content,
  p.excerpt,
  p.slug,
  p.status,
  p.author_id,
  p.tags,
  p.published_at,
  p.created_at,
  p.updated_at;

-- ============================================
-- MIGRATION COMPLETE!
-- ============================================
-- 이제 애플리케이션을 새로고침하면 댓글 기능이 작동합니다.
-- ============================================
