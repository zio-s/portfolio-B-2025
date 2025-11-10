/**
 * Guestbook Table Schema
 *
 * 방문록 테이블: 사용자들이 응원 메시지를 남기고 관리자가 답글을 달 수 있는 테이블
 */

-- Drop existing table if exists
DROP TABLE IF EXISTS public.guestbook CASCADE;

-- Create guestbook table
CREATE TABLE public.guestbook (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Author information (non-authenticated users can post)
  author_name VARCHAR(100) NOT NULL,
  author_email VARCHAR(255),
  author_avatar_url TEXT,

  -- Message content
  content TEXT NOT NULL CHECK (char_length(content) >= 1 AND char_length(content) <= 1000),

  -- Admin reply
  admin_reply TEXT,
  admin_replied_at TIMESTAMPTZ,
  admin_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Status
  is_approved BOOLEAN DEFAULT true, -- Auto-approve by default, can be moderated
  is_pinned BOOLEAN DEFAULT false, -- Admin can pin special messages

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- IP for spam prevention (optional)
  author_ip INET
);

-- Indexes for better query performance
CREATE INDEX idx_guestbook_created_at ON public.guestbook(created_at DESC);
CREATE INDEX idx_guestbook_is_approved ON public.guestbook(is_approved);
CREATE INDEX idx_guestbook_is_pinned ON public.guestbook(is_pinned);
CREATE INDEX idx_guestbook_author_email ON public.guestbook(author_email);

-- Enable Row Level Security
ALTER TABLE public.guestbook ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Policy 1: Anyone can read approved guestbook entries
CREATE POLICY "Anyone can read approved guestbook entries"
  ON public.guestbook
  FOR SELECT
  USING (is_approved = true);

-- Policy 2: Anyone can create guestbook entries (with rate limiting in application)
CREATE POLICY "Anyone can create guestbook entries"
  ON public.guestbook
  FOR INSERT
  WITH CHECK (true);

-- Policy 3: Authenticated users can read all entries (for admin page)
CREATE POLICY "Authenticated users can read all guestbook entries"
  ON public.guestbook
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy 4: Authenticated users can update entries (for admin reply)
CREATE POLICY "Authenticated users can update guestbook entries"
  ON public.guestbook
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy 5: Authenticated users can delete entries (for admin moderation)
CREATE POLICY "Authenticated users can delete guestbook entries"
  ON public.guestbook
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for updated_at
CREATE TRIGGER update_guestbook_updated_at
  BEFORE UPDATE ON public.guestbook
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to get guestbook entries with pagination
CREATE OR REPLACE FUNCTION get_guestbook_entries(
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0,
  p_approved_only BOOLEAN DEFAULT true
)
RETURNS TABLE (
  id UUID,
  author_name VARCHAR(100),
  author_email VARCHAR(255),
  author_avatar_url TEXT,
  content TEXT,
  admin_reply TEXT,
  admin_replied_at TIMESTAMPTZ,
  is_approved BOOLEAN,
  is_pinned BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    g.id,
    g.author_name,
    g.author_email,
    g.author_avatar_url,
    g.content,
    g.admin_reply,
    g.admin_replied_at,
    g.is_approved,
    g.is_pinned,
    g.created_at,
    g.updated_at
  FROM public.guestbook g
  WHERE (NOT p_approved_only OR g.is_approved = true)
  ORDER BY g.is_pinned DESC, g.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample data for testing
INSERT INTO public.guestbook (author_name, author_email, content, is_pinned)
VALUES
  ('김철수', 'chulsoo@example.com', '멋진 포트폴리오네요! 앞으로도 좋은 프로젝트 기대하겠습니다 🎉', true),
  ('이영희', 'younghee@example.com', '디자인이 정말 깔끔하고 보기 좋아요. 많은 영감을 얻었습니다!', false),
  ('박민수', null, '훌륭한 작업물들이에요. 계속 화이팅하세요! 💪', false),
  ('정수연', 'sooyeon@example.com', '프론트엔드 개발자로서 배울 점이 많네요. 감사합니다!', false);

-- Update first entry with admin reply
UPDATE public.guestbook
SET
  admin_reply = '감사합니다! 앞으로도 더 좋은 프로젝트로 찾아뵙겠습니다 😊',
  admin_replied_at = now()
WHERE author_name = '김철수';

COMMENT ON TABLE public.guestbook IS '방문록 테이블 - 사용자들이 응원 메시지를 남기고 관리자가 답글을 달 수 있음';
COMMENT ON COLUMN public.guestbook.is_approved IS '승인 여부 (기본: 자동 승인, 스팸 필터링용)';
COMMENT ON COLUMN public.guestbook.is_pinned IS '고정 여부 (관리자가 특별한 메시지를 상단에 고정 가능)';
COMMENT ON COLUMN public.guestbook.admin_reply IS '관리자 답글 내용';
