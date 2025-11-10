/**
 * Vite 환경 변수 타입 정의
 *
 * Vite에서 제공하는 타입과 프로젝트 전용 환경 변수 타입을 정의합니다.
 */

/// <reference types="vite/client" />

/**
 * 환경 변수 인터페이스
 *
 * import.meta.env로 접근 가능한 환경 변수들의 타입을 정의합니다.
 */
interface ImportMetaEnv {
  /** API 서버 기본 URL */
  readonly VITE_API_BASE_URL: string;

  /** API 요청 타임아웃 (밀리초) */
  readonly VITE_API_TIMEOUT?: string;

  /** 애플리케이션 환경 (development, production, test) */
  readonly VITE_APP_ENV?: string;

  /** 디버그 모드 활성화 여부 */
  readonly VITE_DEBUG_MODE?: string;

  /** 애플리케이션 버전 */
  readonly VITE_APP_VERSION?: string;

  /** Supabase 프로젝트 URL (Phase 8) */
  readonly VITE_SUPABASE_URL: string;

  /** Supabase Anon/Public Key (Phase 8) */
  readonly VITE_SUPABASE_ANON_KEY: string;
}

/**
 * ImportMeta 인터페이스 확장
 */
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
