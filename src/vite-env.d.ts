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

/**
 * SVG를 React 컴포넌트로 import하기 위한 타입 선언
 *
 * 사용 예:
 * import Logo from '@/assets/icons/logo.svg?react';
 * <Logo />
 */
declare module '*.svg?react' {
  import { FC, SVGProps } from 'react';
  const content: FC<SVGProps<SVGSVGElement>>;
  export default content;
}

/**
 * SVG를 URL로 import하기 위한 타입 선언
 *
 * 사용 예:
 * import logoUrl from '@/assets/icons/logo.svg';
 * <img src={logoUrl} />
 */
declare module '*.svg' {
  const content: string;
  export default content;
}

/**
 * 이미지 파일 타입 선언
 */
declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}
