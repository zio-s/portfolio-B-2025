/**
 * 사용자 목록 페이지 (관리자 전용)
 *
 * 모든 사용자 목록을 보여주는 관리자 페이지입니다.
 */

import { Link } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { selectUser } from '../store/slices/authSlice';
import { routeHelpers } from '../router/routes';

const UsersPage = () => {
  const currentUser = useAppSelector(selectUser);

  // 관리자 권한 확인
  if (currentUser?.role !== 'admin') {
    return (
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>접근 권한 없음</h1>
        <p>이 페이지는 관리자만 접근할 수 있습니다.</p>
      </div>
    );
  }

  // 실제로는 Redux store에서 사용자 목록을 가져옵니다
  const mockUsers = [
    { id: 1, name: '사용자 1', email: 'user1@example.com', role: 'user', createdAt: '2024-01-01' },
    { id: 2, name: '사용자 2', email: 'user2@example.com', role: 'user', createdAt: '2024-01-02' },
    { id: 3, name: '관리자', email: 'admin@example.com', role: 'admin', createdAt: '2024-01-03' },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>사용자 관리</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>전체 사용자: {mockUsers.length}명</p>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden',
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
              <th style={{ padding: '1rem', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>이름</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>이메일</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>역할</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>가입일</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>작업</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '1rem' }}>{user.id}</td>
                <td style={{ padding: '1rem' }}>{user.name}</td>
                <td style={{ padding: '1rem' }}>{user.email}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: user.role === 'admin' ? '#e74c3c' : '#3498db',
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                  }}>
                    {user.role === 'admin' ? '관리자' : '사용자'}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>{user.createdAt}</td>
                <td style={{ padding: '1rem' }}>
                  <Link
                    to={routeHelpers.userDetail(user.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#3498db',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                    }}
                  >
                    상세보기
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;
