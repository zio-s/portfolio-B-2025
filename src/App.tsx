/**
 * 메인 애플리케이션 컴포넌트
 *
 * 애플리케이션의 루트 컴포넌트로 다음 기능을 제공합니다:
 * - 라우터 설정 및 관리
 * - Toast 알림 시스템
 * - Modal 시스템
 * - 전역 에러 처리
 * - 초기 인증 상태 확인
 */

import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './router';
import { ToastContainer } from './components/toast';
import { ModalContainer } from './components/modal';
import { ScrollToTop } from './components/common/ScrollToTop';
import { ThemeProvider } from './contexts/ThemeContext';
import { useAppDispatch, getCurrentUser, clearAuth, setCredentials } from './store';
import { supabase } from './lib/supabase';
import { UserRole } from './services/types';

/**
 * 애플리케이션 메인 컴포넌트
 */
function App() {
  const dispatch = useAppDispatch();

  /**
   * Supabase Auth 상태 변경 리스너
   *
   * 메모리 기반 세션:
   * - INITIAL_SESSION: 새로고침 시 세션 없음 (보안 강화)
   * - SIGNED_IN: 로그인 성공 시 Redux에 사용자 정보 저장
   * - SIGNED_OUT: 로그아웃 시 Redux 초기화
   */
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[Auth Event]', event, session?.user?.email);

        if (event === 'SIGNED_IN' && session) {
          // 로그인 성공: admin_users 검증 후 Redux 저장
          try {
            await dispatch(getCurrentUser()).unwrap();
            console.log('[Auth] 로그인 성공, Redux 상태 업데이트');
          } catch {
            // admin_users 검증 실패 시 로그아웃
            dispatch(clearAuth());
            console.log('[Auth] admin_users 검증 실패');
          }
        } else if (event === 'SIGNED_OUT') {
          // 로그아웃: Redux 초기화
          dispatch(clearAuth());
          console.log('[Auth] 로그아웃, Redux 상태 초기화');
        }
        // INITIAL_SESSION: 메모리 기반이므로 세션 없음 (무시)
      }
    );

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 전역 에러 핸들러
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      // 전역 에러 발생 - 필요시 에러 리포팅 서비스에 전송
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // 처리되지 않은 Promise 거부 - 필요시 에러 리포팅 서비스에 전송
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // SEO: Prerender 완료 이벤트 발생 (빌드 시 정적 HTML 생성용)
  useEffect(() => {
    // 페이지 렌더링 완료 후 이벤트 발생
    const timer = setTimeout(() => {
      document.dispatchEvent(new Event('render-complete'));
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        {/* 페이지 전환 시 스크롤 최상단 이동 */}
        <ScrollToTop />

        {/* 메인 라우터 */}
        <AppRouter />

        {/* Toast 알림 컨테이너 */}
        <ToastContainer />

        {/* Modal 컨테이너 */}
        <ModalContainer />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
