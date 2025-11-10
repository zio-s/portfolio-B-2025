/**
 * 메인 애플리케이션 라우터
 *
 * React Router를 사용하여 전체 애플리케이션의 라우팅을 관리합니다.
 * - 공개 라우트: 로그인/회원가입 등 인증 불필요
 * - 보호된 라우트: 인증 필요한 모든 페이지
 * - 404 페이지: 잘못된 경로 접근 처리
 */

import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
import { ROUTES } from './routes';

/**
 * 페이지 컴포넌트 동적 import (코드 분할)
 * 각 페이지는 필요할 때만 로드되어 초기 번들 크기를 줄입니다.
 */

// 공개 페이지
const HomePage = lazy(() => import('../pages/HomePage'));
const ProjectsPage = lazy(() => import('../pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('../pages/ProjectDetailPage'));
const GuestbookPage = lazy(() => import('../pages/GuestbookPage'));

// 보호된 페이지
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const PostsPage = lazy(() => import('../pages/PostsPage'));
const PostCreatePage = lazy(() => import('../pages/PostCreatePage'));
const PostDetailPage = lazy(() => import('../pages/PostDetailPage'));
const PostEditPage = lazy(() => import('../pages/PostEditPage'));
const UsersPage = lazy(() => import('../pages/UsersPage'));
const UserDetailPage = lazy(() => import('../pages/UserDetailPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));

// Admin 페이지
const AdminLoginPage = lazy(() => import('../pages/admin/AdminLoginPage'));
const AdminProjectsPage = lazy(() => import('../pages/admin/AdminProjectsPage'));
const AdminCommentsPage = lazy(() => import('../pages/admin/AdminCommentsPage'));
const AdminGuestbookPage = lazy(() => import('../pages/admin/AdminGuestbookPage'));

// 에러 페이지
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const ForbiddenPage = lazy(() => import('../pages/ForbiddenPage'));


/**
 * 로딩 폴백 컴포넌트
 * 페이지 로딩 중에 표시되는 스피너
 */
const PageLoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontSize: '1.2rem',
    color: '#666',
  }}>
    <div>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 1rem',
      }} />
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      페이지 로딩 중...
    </div>
  </div>
);

/**
 * 메인 애플리케이션 라우터 컴포넌트
 *
 * 애플리케이션의 모든 라우트를 정의하고 관리합니다.
 * Suspense를 사용하여 페이지 로딩 상태를 처리합니다.
 */
export const AppRouter = () => {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <Routes>
          {/* 공개 라우트 - 홈 페이지 */}
          <Route path={ROUTES.HOME} element={<HomePage />} />

          {/* 포트폴리오 프로젝트 라우트 - 공개 */}
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />

          {/* 방문록 라우트 - 공개 */}
          <Route path="/guestbook" element={<GuestbookPage />} />

          {/* 보호된 라우트 - 로그인 필요 */}
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* 게시글 관련 라우트 */}
          <Route
            path={ROUTES.POSTS}
            element={
              <ProtectedRoute>
                <PostsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.POSTS_CREATE}
            element={
              <ProtectedRoute>
                <PostCreatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.POSTS_DETAIL}
            element={
              <ProtectedRoute>
                <PostDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.POSTS_EDIT}
            element={
              <ProtectedRoute>
                <PostEditPage />
              </ProtectedRoute>
            }
          />

          {/* 사용자 관련 라우트 (관리자 전용) */}
          <Route
            path={ROUTES.USERS}
            element={
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.USERS_DETAIL}
            element={
              <ProtectedRoute>
                <UserDetailPage />
              </ProtectedRoute>
            }
          />

          {/* 프로필 페이지 */}
          <Route
            path={ROUTES.PROFILE}
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Admin 라우트 - 관리자 전용 */}
          {/* Admin 로그인 페이지 - 인증 불필요 */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin 기본 경로 -> projects로 리다이렉트 */}
          <Route path="/admin" element={<Navigate to="/admin/projects" replace />} />

          <Route
            path="/admin/projects"
            element={
              <AdminRoute>
                <AdminProjectsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/comments"
            element={
              <AdminRoute>
                <AdminCommentsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/guestbook"
            element={
              <AdminRoute>
                <AdminGuestbookPage />
              </AdminRoute>
            }
          />

          {/* 에러 페이지 */}
          <Route path="/403" element={<ForbiddenPage />} />
          <Route path="/404" element={<NotFoundPage />} />

          {/* 정의되지 않은 모든 경로는 404로 리다이렉트 */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
  );
};

export default AppRouter;
