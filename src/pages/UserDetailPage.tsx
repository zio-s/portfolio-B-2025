/**
 * 사용자 상세 페이지 (관리자 전용)
 *
 * 개별 사용자의 상세 정보를 보여주는 관리자 페이지입니다.
 */

import { Link, useParams } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { selectUser } from '../store/slices/authSlice';
import { ROUTES } from '../router/routes';
import { AdminLayout } from '../components/layout/AdminLayout';

const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const currentUser = useAppSelector(selectUser);

  // 관리자 권한 확인
  if (currentUser?.role !== 'admin') {
    return (
      <AdminLayout>
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <h1>접근 권한 없음</h1>
          <p>이 페이지는 관리자만 접근할 수 있습니다.</p>
        </div>
      </AdminLayout>
    );
  }

  // 실제로는 Redux store에서 사용자 데이터를 가져옵니다
  const mockUser = {
    id: parseInt(id || '1'),
    name: `사용자 #${id}`,
    email: `user${id}@example.com`,
    role: 'user',
    createdAt: '2024-01-01',
    lastLoginAt: '2024-01-10',
    postsCount: 5,
    status: 'active',
  };

  return (
    <AdminLayout>
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link
          to={ROUTES.USERS}
          style={{
            color: '#3498db',
            textDecoration: 'none',
            fontSize: '0.9rem',
          }}
        >
          ← 사용자 목록으로 돌아가기
        </Link>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <h1 style={{ marginTop: 0, marginBottom: '2rem' }}>사용자 상세 정보</h1>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', color: '#666', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              사용자 ID
            </label>
            <div style={{ fontSize: '1.1rem' }}>{mockUser.id}</div>
          </div>

          <div>
            <label style={{ display: 'block', color: '#666', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              이름
            </label>
            <div style={{ fontSize: '1.1rem' }}>{mockUser.name}</div>
          </div>

          <div>
            <label style={{ display: 'block', color: '#666', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              이메일
            </label>
            <div style={{ fontSize: '1.1rem' }}>{mockUser.email}</div>
          </div>

          <div>
            <label style={{ display: 'block', color: '#666', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              역할
            </label>
            <span style={{
              padding: '0.5rem 1rem',
              backgroundColor: mockUser.role === 'admin' ? '#e74c3c' : '#3498db',
              color: 'white',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
            }}>
              {mockUser.role === 'admin' ? '관리자' : '사용자'}
            </span>
          </div>

          <div>
            <label style={{ display: 'block', color: '#666', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              계정 상태
            </label>
            <span style={{
              padding: '0.5rem 1rem',
              backgroundColor: mockUser.status === 'active' ? '#2ecc71' : '#95a5a6',
              color: 'white',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
            }}>
              {mockUser.status === 'active' ? '활성' : '비활성'}
            </span>
          </div>

          <div>
            <label style={{ display: 'block', color: '#666', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              가입일
            </label>
            <div style={{ fontSize: '1.1rem' }}>{mockUser.createdAt}</div>
          </div>

          <div>
            <label style={{ display: 'block', color: '#666', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              마지막 로그인
            </label>
            <div style={{ fontSize: '1.1rem' }}>{mockUser.lastLoginAt}</div>
          </div>

          <div>
            <label style={{ display: 'block', color: '#666', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              작성한 게시글 수
            </label>
            <div style={{ fontSize: '1.1rem' }}>{mockUser.postsCount}개</div>
          </div>
        </div>

        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #dee2e6' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>관리 작업</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f39c12',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              권한 변경
            </button>
            <button
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#95a5a6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              계정 정지
            </button>
            <button
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              계정 삭제
            </button>
          </div>
        </div>
      </div>
      </div>
    </AdminLayout>
  );
};

export default UserDetailPage;
