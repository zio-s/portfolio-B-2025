import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/store': path.resolve(__dirname, './src/store'),
      '@/styles': path.resolve(__dirname, './src/styles'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/types': path.resolve(__dirname, './src/types'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React 관련 라이브러리
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],

          // 애니메이션 라이브러리
          'vendor-animation': ['framer-motion', 'gsap'],

          // 상태 관리
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux'],

          // Supabase
          'vendor-supabase': ['@supabase/supabase-js'],

          // 아이콘 (가장 큰 라이브러리)
          'vendor-icons': ['devicons-react', 'lucide-react'],

          // UI 라이브러리
          'vendor-ui': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-slider',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
          ],

          // 에디터
          'vendor-editor': [
            '@tiptap/react',
            '@tiptap/starter-kit',
            '@tiptap/extension-image',
            '@tiptap/extension-link',
          ],

          // 슬라이더
          'vendor-swiper': ['swiper'],

          // 마크다운
          'vendor-markdown': ['react-markdown', 'remark-gfm', 'rehype-raw'],
        },
      },
    },
    // 청크 크기 경고 임계값 상향 (일시적)
    chunkSizeWarningLimit: 1000,
  },
});
