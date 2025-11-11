/**
 * 프로필 페이지
 *
 * 로그인한 사용자 자신의 프로필 정보를 확인하고 수정하는 페이지입니다.
 */

import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectUser, updateProfile, logout } from '../store/slices/authSlice';
import { ROUTES } from '../router/routes';

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(updateProfile({ name })).unwrap();
      setIsEditing(false);
    } catch {
      // Error handled silently
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      await dispatch(logout());
      navigate(ROUTES.HOME);
    }
  };

  if (!user) {
    return (
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1>프로필 정보를 불러올 수 없습니다.</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>내 프로필</h1>

      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '1.5rem',
      }}>
        {!isEditing ? (
          // 프로필 보기 모드
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: '#666', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                이름
              </label>
              <div style={{ fontSize: '1.1rem' }}>{user.name}</div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: '#666', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                이메일
              </label>
              <div style={{ fontSize: '1.1rem' }}>{user.email}</div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: '#666', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                역할
              </label>
              <span style={{
                padding: '0.5rem 1rem',
                backgroundColor: user.role === 'admin' ? '#e74c3c' : '#3498db',
                color: 'white',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 'bold',
              }}>
                {user.role === 'admin' ? '관리자' : '사용자'}
              </span>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              프로필 수정
            </button>
          </div>
        ) : (
          // 프로필 수정 모드
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                이름
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
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
              <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: loading ? '#95a5a6' : '#2ecc71',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? '저장 중...' : '저장'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setName(user.name || '');
                  setEmail(user.email || '');
                }}
                disabled={loading}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#95a5a6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                취소
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 위험한 작업 섹션 */}
      <div style={{
        backgroundColor: '#fff5f5',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '1px solid #feb2b2',
      }}>
        <h3 style={{ marginTop: 0, color: '#c53030' }}>위험 영역</h3>
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          아래 작업은 신중하게 수행해야 합니다.
        </p>
        <button
          onClick={handleLogout}
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
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
