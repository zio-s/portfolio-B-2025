/**
 * Supabase Client Configuration
 *
 * 보안 강화: 메모리 기반 세션 저장
 *
 * 일반적인 SPA는 localStorage에 토큰을 저장하지만,
 * 이는 XSS 공격에 취약합니다. 본 프로젝트는 메모리 기반
 * 세션 저장을 구현하여 토큰 노출을 방지합니다.
 *
 * 구현된 보안:
 * - Access Token을 메모리에만 저장 (XSS 방어)
 * - 브라우저 개발자 도구에서 토큰 노출 안 됨
 *
 * 트레이드오프:
 * - 새로고침 시 재로그인 필요 (보안과 UX의 균형)
 * - HttpOnly 쿠키 기반 Refresh Token은 백엔드 서버 필요
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase 환경 변수를 설정하세요.');
}

/**
 * 커스텀 메모리 스토리지
 * localStorage 대신 메모리에 세션을 저장하여 XSS 공격 방어
 */
const memoryStorage: Record<string, string> = {};

const customStorage = {
  getItem: (key: string): string | null => {
    return memoryStorage[key] ?? null;
  },
  setItem: (key: string, value: string): void => {
    memoryStorage[key] = value;
  },
  removeItem: (key: string): void => {
    delete memoryStorage[key];
  },
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorage,       // 메모리 스토리지 사용
    persistSession: false,        // 세션 지속 비활성화
    autoRefreshToken: true,       // 토큰 자동 갱신은 유지 (세션 중에만)
    detectSessionInUrl: false,    // URL에서 세션 감지 비활성화
  },
});
