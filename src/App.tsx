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
import { ThemeProvider } from './contexts/ThemeContext';
import { useAppDispatch, getCurrentUser, clearAuth, setCredentials } from './store';
import { supabase } from './lib/supabase';
import { UserRole } from './services/types';

/**
 * 애플리케이션 메인 컴포넌트
 */
function App() {
  const dispatch = useAppDispatch();

  // 초기 인증 상태 확인 + Supabase Auth Listener
  useEffect(() => {
    let isProcessingAuth = false;
    let lastProcessedEmail = '';

    // Supabase Auth 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // INITIAL_SESSION과 SIGNED_IN은 같은 세션이므로 하나만 처리
        if ((event === 'INITIAL_SESSION' || event === 'SIGNED_IN') && session) {
          // 이미 처리 중이거나, 같은 이메일로 처리했으면 스킵
          if (isProcessingAuth || lastProcessedEmail === session.user.email) {
            return;
          }

          isProcessingAuth = true;
          lastProcessedEmail = session.user.email ?? '';

          try {
            // session.user로 직접 로그인 처리
            dispatch(setCredentials({
              user: {
                id: session.user.id,
                email: session.user.email || 'admin@admin.com',
                name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Admin',
                role: UserRole.ADMIN,
                isActive: true,
                isEmailVerified: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              token: session.access_token,
            }));
          } catch (err) {
            // Error in auth state change - silently handled
          } finally {
            // 3초 후 플래그 해제 (다른 세션 허용)
            setTimeout(() => {
              isProcessingAuth = false;
            }, 3000);
          }
        } else if (event === 'SIGNED_OUT') {
          // 중복 처리 방지
          if (isProcessingAuth) {
            return;
          }

          isProcessingAuth = true;

          // Redux 상태만 초기화 (Supabase signOut 다시 호출하지 않음)
          dispatch(clearAuth());
          lastProcessedEmail = '';

          // 플래그 해제
          setTimeout(() => {
            isProcessingAuth = false;
          }, 1000);
        }
      }
    );

    // Cleanup: 컴포넌트 언마운트 시 구독 해제
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

  return (
    <ThemeProvider>
      <BrowserRouter>
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
