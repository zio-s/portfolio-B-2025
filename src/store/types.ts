// Redux Store Types

// Import and re-export User type and UserRole enum from services
import type { User as ServiceUser } from '../services/types';
import { UserRole } from '../services/types';

export type User = ServiceUser;
export { UserRole };

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Posts Types
export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  authorId: string;
  author?: User;
  tags: string[];
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface PostsState {
  posts: Post[];
  currentPost: Post | null;
  loading: boolean;
  error: string | null;
  filters: {
    status?: 'draft' | 'published' | 'archived';
    search?: string;
    tag?: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

// Users Types
export interface UsersState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

// UI Types
export interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
  modalOpen: boolean;
  modalContent: string | null;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

// Pagination Types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
