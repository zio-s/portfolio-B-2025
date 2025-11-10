/**
 * Main Layout Component
 *
 * Public 페이지용 레이아웃 (통합 Header 사용)
 */

import * as React from 'react';
import { useAppSelector, selectUser } from '@/store';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import type { MenuItem } from '@/components/layout/Header';
import { Briefcase, BookOpen, MessageSquare } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

// Public 페이지 메뉴 아이템
const publicMenuItems: MenuItem[] = [
  {
    id: 'projects',
    label: 'Projects',
    href: '/projects',
    icon: <Briefcase className="w-5 h-5" />,
  },
  {
    id: 'blog',
    label: 'Blog',
    href: '/blog',
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    id: 'guestbook',
    label: 'Guestbook',
    href: '/guestbook',
    icon: <BookOpen className="w-5 h-5" />,
  },
];

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // Redux Selector 패턴 사용 (Best Practice)
  const user = useAppSelector(selectUser);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 통합 Header (Public 모드) */}
      <Header
        mode="public"
        user={user ? {
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          avatar: user.user_metadata?.avatar_url,
        } : undefined}
        logoText="Portfolio"
        publicMenuItems={publicMenuItems}
      />

      {/* Main Content */}
      <main className="flex-1 pt-16">
        {children}
      </main>

      {/* Footer */}
      <Footer />

      {/* Scroll to Top Button */}
      <ScrollToTop threshold={300} />
    </div>
  );
};

export default MainLayout;
