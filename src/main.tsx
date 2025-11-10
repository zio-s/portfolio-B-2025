/**
 * 애플리케이션 진입점
 *
 * React 애플리케이션을 초기화하고 필요한 Provider들을 설정합니다.
 * - Redux Store Provider: 전역 상태 관리
 * - React Router: 라우팅 처리
 * - StrictMode: 개발 모드 검증
 * - MSW: 개발 환경에서 Mock API 제공
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { store } from './store';
import App from './App';
import './index.css';
import './styles/app.css';

// DOM 루트 요소 확인
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    '루트 요소를 찾을 수 없습니다. index.html에 <div id="root"></div>가 있는지 확인하세요.'
  );
}

// React 앱 마운트
createRoot(rootElement).render(
  <StrictMode>
    {/* Redux 전역 상태 관리 Provider */}
    <Provider store={store}>
      {/* SEO 메타 태그 관리 Provider */}
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </Provider>
  </StrictMode>
);
