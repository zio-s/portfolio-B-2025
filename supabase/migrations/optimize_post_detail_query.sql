-- =====================================================
-- 게시글 상세 조회 최적화 RPC 함수
-- 1번의 호출로 게시글 정보 + 사용자 좋아요 여부 반환
-- =====================================================

CREATE OR REPLACE FUNCTION get_post_with_user_data(
  p_post_id UUID,
  p_user_identifier TEXT
)
RETURNS JSON AS $$
DECLARE
  v_post JSON;
  v_is_liked BOOLEAN;
BEGIN
  -- 게시글 정보 조회 (post_stats 뷰 사용)
  SELECT row_to_json(ps.*)
  INTO v_post
  FROM post_stats ps
  WHERE ps.id = p_post_id;

  -- 게시글이 없으면 NULL 반환
  IF v_post IS NULL THEN
    RETURN NULL;
  END IF;

  -- 사용자 좋아요 여부 확인
  SELECT EXISTS (
    SELECT 1
    FROM post_likes
    WHERE post_id = p_post_id
      AND user_identifier = p_user_identifier
  )
  INTO v_is_liked;

  -- 게시글 정보에 is_liked 필드 추가
  v_post := jsonb_set(
    v_post::jsonb,
    '{is_liked}',
    to_jsonb(v_is_liked)
  );

  RETURN v_post;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 함수 설명 추가
COMMENT ON FUNCTION get_post_with_user_data IS
'게시글 상세 정보와 사용자별 좋아요 여부를 1번의 호출로 반환. 성능 최적화를 위해 post_stats 뷰와 post_likes 테이블을 효율적으로 조인.';
