/**
 * 게시글 작성 페이지
 *
 * 새로운 게시글을 작성하는 페이지입니다.
 * localStorage 기반 Redux store에 실제로 저장됩니다.
 */

import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, routeHelpers } from '../router/routes';
import { useAppDispatch, useAppSelector, createPost, selectPostsLoading } from '../store';

const PostCreatePage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectPostsLoading);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // slug 생성 (제목을 기반으로)
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s가-힣]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50);

      // 태그 배열 생성
      const tagArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // 발췌 자동 생성 (입력 안 했으면)
      const finalExcerpt = excerpt || content.substring(0, 150);

      // 게시글 생성
      const result = await dispatch(
        createPost({
          title,
          content,
          excerpt: finalExcerpt,
          slug,
          status,
          tags: tagArray,
        })
      ).unwrap();

      alert(`게시글이 ${status === 'published' ? '발행' : '임시저장'}되었습니다!`);

      // 생성된 게시글 상세 페이지로 이동
      navigate(routeHelpers.postDetail(result.id));
    } catch {
      alert('게시글 작성에 실패했습니다');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>새 게시글 작성</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        게시글을 작성하고 발행하거나 임시저장할 수 있습니다.
      </p>

      <form onSubmit={handleSubmit}>
        {/* 제목 */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            제목 <span style={{ color: '#e74c3c' }}>*</span>
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
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* 발췌 */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="excerpt" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            발췌 (선택사항)
          </label>
          <input
            id="excerpt"
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            disabled={loading}
            placeholder="게시글 요약 (미입력 시 본문 앞 150자 자동 추출)"
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* 내용 */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="content" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            내용 <span style={{ color: '#e74c3c' }}>*</span>
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            disabled={loading}
            placeholder="게시글 내용을 입력하세요 (Markdown 지원)"
            rows={15}
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontFamily: 'inherit',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* 태그 */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="tags" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            태그
          </label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            disabled={loading}
            placeholder="쉼표로 구분 (예: React, TypeScript, CMS)"
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* 상태 선택 */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            발행 상태 <span style={{ color: '#e74c3c' }}>*</span>
          </label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="radio"
                name="status"
                value="draft"
                checked={status === 'draft'}
                onChange={(e) => setStatus(e.target.value as 'draft')}
                disabled={loading}
                style={{ marginRight: '0.5rem' }}
              />
              <span>임시저장</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="radio"
                name="status"
                value="published"
                checked={status === 'published'}
                onChange={(e) => setStatus(e.target.value as 'published')}
                disabled={loading}
                style={{ marginRight: '0.5rem' }}
              />
              <span>바로 발행</span>
            </label>
          </div>
        </div>

        {/* 버튼 */}
        <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #ddd' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: loading ? '#95a5a6' : status === 'published' ? '#2ecc71' : '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            {loading ? '작성 중...' : status === 'published' ? '✅ 발행하기' : '💾 임시저장'}
          </button>

          <button
            type="button"
            onClick={() => navigate(ROUTES.POSTS)}
            disabled={loading}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: 'white',
              color: '#666',
              border: '1px solid #ddd',
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

export default PostCreatePage;
