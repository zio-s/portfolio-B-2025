/**
 * 대시보드 페이지
 *
 * 로그인한 사용자의 메인 대시보드 화면입니다.
 * 주요 통계와 최근 활동을 보여줍니다.
 * CSS Variables 기반 완전 다크모드 지원
 */

import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { selectUser } from '../store/slices/authSlice';
import { ROUTES } from '../router/routes';
import { useAdminCheck } from '../hooks/useAdminCheck';
import { StatsCard } from '../components/admin/StatsCard';
import { useGetAdminStatsQuery } from '../features/admin/api/adminApi';
import './DashboardPage.css';

const DashboardPage = () => {
  const user = useAppSelector(selectUser);
  const { isAdmin } = useAdminCheck();
  const navigate = useNavigate();

  // Phase 8-3: Supabase API 사용
  const { data: stats, isLoading: loading } = useGetAdminStatsQuery(undefined, {
    skip: !isAdmin,
  });

  return (
    <div className="dashboard-container">
      {/* Header */}
      <h1 className="dashboard-header-title" style={{
        fontSize: 'var(--font-size-3xl)',
        fontWeight: 'var(--font-weight-bold)',
        color: 'var(--text-primary)',
        marginBottom: 'var(--spacing-sm)',
      }}>
        대시보드
      </h1>
      <p className="dashboard-header-subtitle" style={{
        fontSize: 'var(--font-size-lg)',
        color: 'var(--text-secondary)',
        marginBottom: 'var(--spacing-2xl)',
      }}>
        환영합니다, {user?.name || user?.email}님!
      </p>

      {/* Admin Stats Section */}
      {isAdmin && (
        <>
          <h2 className="dashboard-section-title" style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-md)',
            color: 'var(--text-primary)',
          }}>
            📊 통계
          </h2>
          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: 'var(--spacing-3xl)',
              color: 'var(--text-secondary)',
            }}>
              Loading stats...
            </div>
          ) : stats ? (
            <div className="dashboard-stats-grid">
              <StatsCard
                title="Total Projects"
                value={stats.totalProjects}
                icon="📁"
                gradient="var(--color-primary-gradient)"
                link="/admin/projects"
              />
              <StatsCard
                title="Total Comments"
                value={stats.totalComments}
                icon="💬"
                gradient="var(--color-secondary-pink)"
                link="/admin/comments"
              />
              <StatsCard
                title="Total Views"
                value={stats.totalViews}
                icon="👁️"
                gradient="var(--color-secondary-blue)"
              />
              <StatsCard
                title="Total Likes"
                value={stats.totalLikes}
                icon="❤️"
                gradient="var(--color-secondary-orange)"
              />
            </div>
          ) : null}

          {/* Quick Actions Section */}
          <h2 className="dashboard-section-title" style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-md)',
            color: 'var(--text-primary)',
          }}>
            ⚡ Quick Actions
          </h2>
          <div className="dashboard-actions-grid">
            <button
              onClick={() => navigate('/admin/projects')}
              style={{
                padding: 'var(--spacing-lg)',
                border: 'none',
                borderRadius: 'var(--radius-xl)',
                background: 'var(--color-primary-gradient)',
                color: 'white',
                fontSize: 'var(--font-size-base)',
                fontWeight: 'var(--font-weight-semibold)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--transition-normal)',
                boxShadow: 'var(--shadow-md)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
            >
              <div style={{
                fontSize: 'var(--font-size-2xl)',
                marginBottom: 'var(--spacing-sm)',
              }}>
                📁
              </div>
              <div style={{
                fontSize: 'var(--font-size-base)',
                fontWeight: 'var(--font-weight-semibold)',
              }}>
                프로젝트 관리
              </div>
              <div style={{
                fontSize: 'var(--font-size-sm)',
                opacity: 0.9,
                marginTop: 'var(--spacing-xs)',
              }}>
                프로젝트 생성, 수정, 삭제
              </div>
            </button>

            <button
              onClick={() => navigate('/admin/comments')}
              style={{
                padding: 'var(--spacing-lg)',
                border: 'none',
                borderRadius: 'var(--radius-xl)',
                background: 'var(--color-secondary-pink)',
                color: 'white',
                fontSize: 'var(--font-size-base)',
                fontWeight: 'var(--font-weight-semibold)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--transition-normal)',
                boxShadow: 'var(--shadow-md)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
            >
              <div style={{
                fontSize: 'var(--font-size-2xl)',
                marginBottom: 'var(--spacing-sm)',
              }}>
                💬
              </div>
              <div style={{
                fontSize: 'var(--font-size-base)',
                fontWeight: 'var(--font-weight-semibold)',
              }}>
                댓글 관리
              </div>
              <div style={{
                fontSize: 'var(--font-size-sm)',
                opacity: 0.9,
                marginTop: 'var(--spacing-xs)',
              }}>
                댓글 모더레이션 및 삭제
              </div>
            </button>

            <button
              onClick={() => navigate('/projects')}
              style={{
                padding: 'var(--spacing-lg)',
                border: 'none',
                borderRadius: 'var(--radius-xl)',
                background: 'var(--color-secondary-blue)',
                color: 'white',
                fontSize: 'var(--font-size-base)',
                fontWeight: 'var(--font-weight-semibold)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--transition-normal)',
                boxShadow: 'var(--shadow-md)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
            >
              <div style={{
                fontSize: 'var(--font-size-2xl)',
                marginBottom: 'var(--spacing-sm)',
              }}>
                🌐
              </div>
              <div style={{
                fontSize: 'var(--font-size-base)',
                fontWeight: 'var(--font-weight-semibold)',
              }}>
                공개 페이지 보기
              </div>
              <div style={{
                fontSize: 'var(--font-size-sm)',
                opacity: 0.9,
                marginTop: 'var(--spacing-xs)',
              }}>
                포트폴리오 공개 페이지로 이동
              </div>
            </button>

            <button
              onClick={() => navigate('/admin/supabase-test')}
              style={{
                padding: 'var(--spacing-lg)',
                border: 'none',
                borderRadius: 'var(--radius-xl)',
                background: 'var(--color-secondary-green)',
                color: 'white',
                fontSize: 'var(--font-size-base)',
                fontWeight: 'var(--font-weight-semibold)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--transition-normal)',
                boxShadow: 'var(--shadow-md)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
            >
              <div style={{
                fontSize: 'var(--font-size-2xl)',
                marginBottom: 'var(--spacing-sm)',
              }}>
                🧪
              </div>
              <div style={{
                fontSize: 'var(--font-size-base)',
                fontWeight: 'var(--font-weight-semibold)',
              }}>
                Supabase 연결 테스트
              </div>
              <div style={{
                fontSize: 'var(--font-size-sm)',
                opacity: 0.9,
                marginTop: 'var(--spacing-xs)',
              }}>
                Phase 8-1: 데이터베이스 연결 확인
              </div>
            </button>
          </div>
        </>
      )}

      {/* Regular User Cards */}
      <div className="dashboard-user-cards-grid">
        {/* 게시글 관리 카드 */}
        <Link
          to={ROUTES.POSTS}
          style={{
            padding: 'var(--spacing-2xl)',
            background: 'var(--color-secondary-blue)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            transition: 'all var(--transition-normal)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
        >
          <h2 style={{
            margin: '0 0 var(--spacing-sm) 0',
            fontSize: 'var(--font-size-2xl)',
            fontWeight: 'var(--font-weight-bold)',
          }}>
            게시글
          </h2>
          <p style={{
            margin: 0,
            opacity: 0.9,
            fontSize: 'var(--font-size-base)',
          }}>
            게시글 목록 보기
          </p>
        </Link>

        {/* 게시글 작성 카드 */}
        <Link
          to={ROUTES.POSTS_CREATE}
          style={{
            padding: 'var(--spacing-2xl)',
            background: 'var(--color-secondary-green)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            transition: 'all var(--transition-normal)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
        >
          <h2 style={{
            margin: '0 0 var(--spacing-sm) 0',
            fontSize: 'var(--font-size-2xl)',
            fontWeight: 'var(--font-weight-bold)',
          }}>
            새 게시글
          </h2>
          <p style={{
            margin: 0,
            opacity: 0.9,
            fontSize: 'var(--font-size-base)',
          }}>
            게시글 작성하기
          </p>
        </Link>

        {/* 프로필 카드 */}
        <Link
          to={ROUTES.PROFILE}
          style={{
            padding: 'var(--spacing-2xl)',
            background: 'var(--color-primary-gradient)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            transition: 'all var(--transition-normal)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
        >
          <h2 style={{
            margin: '0 0 var(--spacing-sm) 0',
            fontSize: 'var(--font-size-2xl)',
            fontWeight: 'var(--font-weight-bold)',
          }}>
            프로필
          </h2>
          <p style={{
            margin: 0,
            opacity: 0.9,
            fontSize: 'var(--font-size-base)',
          }}>
            내 정보 관리
          </p>
        </Link>

        {/* 사용자 관리 카드 (관리자 전용) */}
        {user?.role === 'admin' && (
          <Link
            to={ROUTES.USERS}
            style={{
              padding: 'var(--spacing-2xl)',
              background: 'var(--color-secondary-pink)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
              transition: 'all var(--transition-normal)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
          >
            <h2 style={{
              margin: '0 0 var(--spacing-sm) 0',
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 'var(--font-weight-bold)',
            }}>
              사용자
            </h2>
            <p style={{
              margin: 0,
              opacity: 0.9,
              fontSize: 'var(--font-size-base)',
            }}>
              사용자 관리 (관리자)
            </p>
          </Link>
        )}
      </div>

      {/* Recent Activity Section */}
      <div
        style={{
          padding: 'var(--spacing-xl)',
          backgroundColor: 'var(--background-secondary)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <h3 style={{
          marginTop: 0,
          marginBottom: 'var(--spacing-md)',
          fontSize: 'var(--font-size-xl)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--text-primary)',
        }}>
          최근 활동
        </h3>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: 'var(--font-size-base)',
          margin: 0,
        }}>
          최근 활동 내역이 여기에 표시됩니다.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
