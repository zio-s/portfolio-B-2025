/**
 * 게시글 수정 페이지
 *
 * 기존 게시글을 수정하는 페이지입니다.
 */

import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { routeHelpers } from '../router/routes';

const PostEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // 컴포넌트 마운트 시 게시글 데이터 로드
  useEffect(() => {
    // 실제로는 Redux store에서 게시글 데이터를 가져옵니다
    const mockPost = {
      title: `게시글 제목 #${id}`,
      content: '기존 게시글 내용입니다.',
    };
    setTitle(mockPost.title);
    setContent(mockPost.content);
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 실제로는 Redux action을 dispatch합니다
      // 임시로 딜레이 추가
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 게시글 상세 페이지로 이동
      navigate(routeHelpers.postDetail(id!));
    } catch (error) {
      console.error('Failed to update post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>게시글 수정</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>게시글 ID: {id}</p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            제목
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
            placeholder="게시글 제목을 입력하세요"
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="content" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            disabled={loading}
            placeholder="게시글 내용을 입력하세요"
            rows={15}
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: loading ? '#95a5a6' : '#f39c12',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? '저장 중...' : '수정 완료'}
          </button>

          <button
            type="button"
            onClick={() => navigate(routeHelpers.postDetail(id!))}
            disabled={loading}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostEditPage;
