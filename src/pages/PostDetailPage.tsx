/**
 * 게시글 상세 페이지
 *
 * 개별 게시글의 상세 내용을 보여주는 페이지입니다.
 * localStorage 기반 Redux store에서 실제 데이터를 가져옵니다.
 */

import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ROUTES, routeHelpers } from '../router/routes';
import {
  useAppDispatch,
  useAppSelector,
  fetchPostById,
  deletePost,
  selectCurrentPost,
  selectPostsLoading,
  selectPostsError,
} from '../store';

const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const post = useAppSelector(selectCurrentPost);
  const loading = useAppSelector(selectPostsLoading);
  const error = useAppSelector(selectPostsError);

  // 게시글 조회
  useEffect(() => {
    if (id) {
      dispatch(fetchPostById(id));
    }
  }, [dispatch, id]);

  // 게시글 삭제
  const handleDelete = async () => {
    if (!id || !post) return;

    if (window.confirm(`"${post.title}" 게시글을 삭제하시겠습니까?`)) {
      try {
        await dispatch(deletePost(id)).unwrap();
        alert('게시글이 삭제되었습니다');
        navigate(ROUTES.POSTS);
      } catch {
        alert('게시글 삭제에 실패했습니다');
      }
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 상태 뱃지 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return '#2ecc71';
      case 'draft':
        return '#95a5a6';
      case 'archived':
        return '#e74c3c';
      default:
        return '#3498db';
    }
  };

  // 상태 텍스트
  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return '발행됨';
      case 'draft':
        return '임시저장';
      case 'archived':
        return '보관됨';
      default:
        return status;
    }
  };

  // 로딩 상태
  if (loading) {
    return (
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>게시글을 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          padding: '1rem',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '4px',
          color: '#c33',
          marginBottom: '1rem',
        }}>
          ⚠️ {error}
        </div>
        <Link
          to={ROUTES.POSTS}
          style={{
            color: '#3498db',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          ← 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  // 게시글이 없는 경우
  if (!post) {
    return (
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ color: '#999', fontSize: '1.1rem', marginBottom: '1rem' }}>
          게시글을 찾을 수 없습니다
        </p>
        <Link
          to={ROUTES.POSTS}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3498db',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
          }}
        >
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      {/* 뒤로가기 버튼 */}
      <div style={{ marginBottom: '2rem' }}>
        <Link
          to={ROUTES.POSTS}
          style={{
            color: '#3498db',
            textDecoration: 'none',
            fontSize: '0.95rem',
            fontWeight: '500',
          }}
        >
          ← 목록으로 돌아가기
        </Link>
      </div>

      {/* 게시글 내용 */}
      <article style={{
        backgroundColor: 'white',
        padding: '2.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        {/* 제목과 상태 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <h1 style={{ margin: 0, flex: 1, fontSize: '2rem' }}>{post.title}</h1>
          <span
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: getStatusColor(post.status),
              color: 'white',
              borderRadius: '16px',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              marginLeft: '1rem',
            }}
          >
            {getStatusText(post.status)}
          </span>
        </div>

        {/* 메타 정보 */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.5rem',
          paddingBottom: '1.5rem',
          marginBottom: '2rem',
          borderBottom: '2px solid #eee',
          fontSize: '0.9rem',
          color: '#666',
        }}>
          <span>
            {post.status === 'published' && post.publishedAt
              ? `📅 발행일: ${formatDate(post.publishedAt)}`
              : `📝 작성일: ${formatDate(post.createdAt)}`}
          </span>
          {post.updatedAt !== post.createdAt && (
            <span>✏️ 수정일: {formatDate(post.updatedAt)}</span>
          )}
        </div>

        {/* 발췌 */}
        {post.excerpt && (
          <div style={{
            padding: '1rem 1.5rem',
            backgroundColor: '#f8f9fa',
            borderLeft: '4px solid #3498db',
            marginBottom: '2rem',
            borderRadius: '4px',
          }}>
            <p style={{ margin: 0, color: '#555', fontStyle: 'italic', lineHeight: '1.6' }}>
              {post.excerpt}
            </p>
          </div>
        )}

        {/* 본문 */}
        <div style={{
          lineHeight: '1.8',
          fontSize: '1.05rem',
          marginBottom: '2rem',
          whiteSpace: 'pre-wrap',
          color: '#333',
        }}>
          {post.content}
        </div>

        {/* 태그 */}
        {post.tags.length > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #eee',
            marginBottom: '1.5rem',
          }}>
            {post.tags.map((tag, index) => (
              <span
                key={index}
                style={{
                  padding: '0.375rem 0.75rem',
                  backgroundColor: '#e8f4f8',
                  color: '#2c3e50',
                  borderRadius: '16px',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 버튼 */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          paddingTop: '1.5rem',
          borderTop: '2px solid #eee',
        }}>
          <Link
            to={routeHelpers.postEdit(post.id)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#f39c12',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            ✏️ 수정
          </Link>

          <button
            onClick={handleDelete}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            🗑️ 삭제
          </button>
        </div>
      </article>
    </div>
  );
};

export default PostDetailPage;
