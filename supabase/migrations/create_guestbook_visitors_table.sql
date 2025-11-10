/**
 * Guestbook Visitors Table Schema
 *
 * 방문자 수 추적 테이블: 날짜별 방문자 수를 기록
 */

-- Drop existing table if exists
DROP TABLE IF EXISTS public.guestbook_visitors CASCADE;

-- Create guestbook_visitors table
CREATE TABLE public.guestbook_visitors (
  -- 날짜 (Primary Key)
  visit_date DATE PRIMARY KEY DEFAULT CURRENT_DATE,

  -- 방문자 수
  visitor_count INTEGER NOT NULL DEFAULT 0 CHECK (visitor_count >= 0),

  -- 메타데이터
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_guestbook_visitors_visit_date ON public.guestbook_visitors(visit_date DESC);

-- Enable Row Level Security
ALTER TABLE public.guestbook_visitors ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Policy 1: Anyone can read visitor counts (public access)
CREATE POLICY "Anyone can read visitor counts"
  ON public.guestbook_visitors
  FOR SELECT
  USING (true);

-- Policy 2: Anyone can insert visitor counts (for increment operation)
CREATE POLICY "Anyone can insert visitor counts"
  ON public.guestbook_visitors
  FOR INSERT
  WITH CHECK (true);

-- Policy 3: Anyone can update visitor counts (for increment operation)
CREATE POLICY "Anyone can update visitor counts"
  ON public.guestbook_visitors
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy 4: Only authenticated users can delete (admin only)
CREATE POLICY "Authenticated users can delete visitor counts"
  ON public.guestbook_visitors
  FOR DELETE
  TO authenticated
  USING (true);

-- Create or replace updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_guestbook_visitors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for updated_at
CREATE TRIGGER update_guestbook_visitors_updated_at
  BEFORE UPDATE ON public.guestbook_visitors
  FOR EACH ROW
  EXECUTE FUNCTION update_guestbook_visitors_updated_at();

-- Insert initial data for today (optional)
INSERT INTO public.guestbook_visitors (visit_date, visitor_count)
VALUES (CURRENT_DATE, 0)
ON CONFLICT (visit_date) DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE public.guestbook_visitors IS '방문록 페이지 일별 방문자 수 추적 테이블';
COMMENT ON COLUMN public.guestbook_visitors.visit_date IS '방문 날짜 (Primary Key)';
COMMENT ON COLUMN public.guestbook_visitors.visitor_count IS '해당 날짜의 방문자 수';
COMMENT ON COLUMN public.guestbook_visitors.created_at IS '레코드 생성 시각';
COMMENT ON COLUMN public.guestbook_visitors.updated_at IS '레코드 수정 시각';
