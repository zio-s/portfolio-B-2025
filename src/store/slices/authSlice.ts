/**
 * Auth Slice - Supabase Auth Version
 * Phase 9-1: Admin 로그인 전용 (회원가입 없음)
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, ApiError } from '../types';
import type { User } from '../../services/types';
import { UserRole } from '../../services/types';
import { authService } from '../../services/authService';
import type { RootState } from '../store';

// Initial State
const initialState: AuthState = {
  user: null,
  token: null, // Supabase가 자동 관리
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async Thunks

/**
 * Admin 로그인
 * Supabase Auth + admin_users 테이블 검증
 */
export const login = createAsyncThunk<
  { user: User; token: string },
  { email: string; password: string },
  { rejectValue: ApiError }
>('auth/login', async (credentials, { rejectWithValue }) => {
  const { user, error } = await authService.signIn(credentials);

  if (error || !user) {
    return rejectWithValue({
      message: error || 'Login failed',
    });
  }

  // User 타입으로 변환
  const authUser: User = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: UserRole.ADMIN,
    isActive: true,
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // JWT 토큰 가져오기
  const token = await authService.getToken();

  return { user: authUser, token: token || '' };
});

/**
 * 회원가입 (사용 안 함 - Admin 전용)
 * 필요시 Supabase Dashboard에서 직접 생성
 */
export const register = createAsyncThunk<
  { user: User; token: string },
  { email: string; password: string; name: string },
  { rejectValue: ApiError }
>('auth/register', async (_, { rejectWithValue }) => {
  return rejectWithValue({
    message: 'Registration is disabled. Admin access only.',
  });
});

/**
 * 현재 사용자 세션 확인
 * Supabase Auth 세션 + admin_users 검증
 */
export const getCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: ApiError }
>('auth/getCurrentUser', async (_, { rejectWithValue }) => {
  const { user, error } = await authService.getSession();

  if (error || !user) {
    return rejectWithValue({
      message: error || 'No session found',
    });
  }

  // User 타입으로 변환
  const authUser: User = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: UserRole.ADMIN,
    isActive: true,
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return authUser;
});

export const updateProfile = createAsyncThunk<
  User,
  { name?: string; avatar?: string },
  { rejectValue: ApiError }
>('auth/updateProfile', async (updates, { rejectWithValue }) => {
  const { user, error } = await authService.updateProfile(updates);

  if (error || !user) {
    return rejectWithValue({
      message: error || 'Failed to update profile',
    });
  }

  // User 타입으로 변환
  const authUser: User = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: UserRole.ADMIN,
    isActive: true,
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return authUser;
});

/**
 * 로그아웃
 */
export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.signOut();
});

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
        state.isAuthenticated = false;
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Registration failed';
        state.isAuthenticated = false;
      });

    // Get Current User
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        // Supabase Auth: 세션 없으면 조용히 실패 (정상 동작)
        state.error = null; // 에러 메시지 표시 안 함
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update profile';
      });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    });
  },
});

// Actions
export const { clearError, setCredentials, clearAuth } = authSlice.actions;

// Selectors - RootState 타입 사용 (Redux Best Practice)
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

// Memoized selectors for derived data
export const selectUserRole = (state: RootState) => state.auth.user?.role;
export const selectIsAdmin = (state: RootState) => state.auth.user?.role === UserRole.ADMIN;

export default authSlice.reducer;
