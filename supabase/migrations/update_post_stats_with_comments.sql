-- Update post_stats view to include post_comments count

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
