/**
 * 게시글 목록 페이지
 *
 * localStorage 기반 Redux store에서 실제 게시글 목록을 가져와 표시합니다.
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES, routeHelpers } from '../router/routes';
import {
  useAppDispatch,
  useAppSelector,
  fetchPosts,
  selectPosts,
  selectPostsLoading,
  selectPostsError,
  deletePost,
} from '../store';

const PostsPage = () => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectPosts);
  const loading = useAppSelector(selectPostsLoading);
  const error = useAppSelector(selectPostsError);

  // 컴포넌트 마운트 시 게시글 목록 조회
  useEffect(() => {
    dispatch(fetchPosts({}));
  }, [dispatch]);

  // 게시글 삭제 핸들러
  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`"${title}" 게시글을 삭제하시겠습니까?`)) {
      try {
        await dispatch(deletePost(id)).unwrap();
        alert('게시글이 삭제되었습니다');
        // 목록 새로고침
        dispatch(fetchPosts({}));
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
      month: '2-digit',
      day: '2-digit',
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

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>게시글 목록</h1>
          <p style={{ color: '#666', margin: 0 }}>
            전체 {posts.length}개의 게시글
          </p>
        </div>
        <Link
          to={ROUTES.POSTS_CREATE}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#2ecc71',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          ✏️ 새 게시글 작성
        </Link>
      </div>

      {/* 로딩 상태 */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          게시글을 불러오는 중...
        </div>
      )}

      {/* 에러 상태 */}
      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '4px',
          color: '#c33',
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* 게시글 목록 */}
      {!loading && !error && posts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>게시글이 없습니다</p>
          <Link
            to={ROUTES.POSTS_CREATE}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3498db',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
            }}
          >
            첫 번째 게시글 작성하기
          </Link>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {posts.map((post) => (
          <div
            key={post.id}
            style={{
              padding: '1.5rem',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <h3 style={{ margin: 0, flex: 1 }}>
                <Link
                  to={routeHelpers.postDetail(post.id)}
                  style={{ color: '#333', textDecoration: 'none' }}
                >
                  {post.title}
                </Link>
              </h3>
              <span
                style={{
                  padding: '0.25rem 0.75rem',
                  backgroundColor: getStatusColor(post.status),
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                }}
              >
                {getStatusText(post.status)}
              </span>
            </div>

            <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '0.5rem', lineHeight: '1.5' }}>
              {post.excerpt}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#f0f0f0',
                    color: '#666',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ color: '#999', fontSize: '0.85rem', margin: 0 }}>
                {post.status === 'published' && post.publishedAt
                  ? `발행일: ${formatDate(post.publishedAt)}`
                  : `작성일: ${formatDate(post.createdAt)}`}
              </p>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link
                  to={routeHelpers.postDetail(post.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#3498db',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                  }}
                >
                  상세보기
                </Link>
                <Link
                  to={routeHelpers.postEdit(post.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#f39c12',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                  }}
                >
                  수정
                </Link>
                <button
                  onClick={() => handleDelete(post.id, post.title)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                  }}
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostsPage;
