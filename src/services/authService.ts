/**
 * Authentication Service - Supabase Auth
 *
 * 관리자 전용 로그인 (회원가입 없음)
 * admin_users 테이블로 관리자 확인
 */

import { supabase } from '../lib/supabase';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin';
}

/**
 * 관리자 로그인
 * 1. Supabase Auth로 로그인
 * 2. admin_users 테이블에서 관리자 확인
 */
export const authService = {
  /**
   * 로그인
   */
  async signIn(credentials: LoginCredentials): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      // 1. Supabase Auth 로그인
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (authError) {
        return { user: null, error: authError.message };
      }

      if (!authData.user) {
        return { user: null, error: 'Login failed' };
      }

      // 2. admin_users 테이블에서 관리자 확인 (password_hash 제외)
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('id, email, name, created_at, updated_at')
        .eq('email', credentials.email)
        .single();

      if (adminError || !adminUser) {
        // 관리자가 아니면 로그아웃
        await supabase.auth.signOut();
        return { user: null, error: 'Not authorized. Admin access only.' };
      }

      // 3. AuthUser 객체 생성
      const user: AuthUser = {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: 'admin',
      };

      return { user, error: null };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      return { user: null, error: errorMessage };
    }
  },

  /**
   * 로그아웃
   */
  async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { error: error.message };
      }
      return { error: null };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      return { error: errorMessage };
    }
  },

  /**
   * 현재 세션 가져오기
   *
   * 메모리 기반 세션:
   * - 새로고침 시 세션 없음 (정상 동작)
   * - signOut 호출 제거 (순환 호출 방지)
   */
  async getSession(): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      // 1. Supabase Auth 세션 확인
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        return { user: null, error: sessionError?.message || 'No session' };
      }

      // 2. admin_users 테이블에서 관리자 확인 (password_hash 제외)
      if (!session.user.email) {
        return { user: null, error: 'Invalid session' };
      }

      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('id, email, name, created_at, updated_at')
        .eq('email', session.user.email)
        .single();

      if (adminError || !adminUser) {
        // signOut 호출 제거 - 호출자에서 처리하도록 함 (순환 호출 방지)
        return { user: null, error: 'Not authorized' };
      }

      // 3. AuthUser 객체 생성
      const user: AuthUser = {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: 'admin',
      };

      return { user, error: null };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Session check failed';
      return { user: null, error: errorMessage };
    }
  },

  /**
   * JWT 토큰 가져오기 (API 호출용)
   */
  async getToken(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  },

  /**
   * 프로필 업데이트
   */
  async updateProfile(updates: { name?: string; avatar?: string }): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      // 1. 현재 세션 확인
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { user: null, error: 'Not authenticated' };
      }

      // 2. admin_users 테이블 업데이트
      if (!session.user.email) {
        return { user: null, error: 'Invalid session' };
      }

      const { data: adminUser, error: updateError } = await supabase
        .from('admin_users')
        .update({
          name: updates.name,
          updated_at: new Date().toISOString(),
        })
        .eq('email', session.user.email)
        .select('id, email, name, created_at, updated_at')
        .single();

      if (updateError || !adminUser) {
        return { user: null, error: updateError?.message || 'Update failed' };
      }

      // 3. AuthUser 객체 생성
      const user: AuthUser = {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: 'admin',
      };

      return { user, error: null };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Update failed';
      return { user: null, error: errorMessage };
    }
  },
};
