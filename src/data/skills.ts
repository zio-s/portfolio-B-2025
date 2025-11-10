/**
 * 기술 스택 데이터
 *
 * 쉽게 수정 가능한 스킬 관리
 * - name: 기술명
 * - icon: devicons-react 아이콘 이름
 * - color: 아이콘 색상
 * - tooltip: 마우스 호버 시 표시될 설명
 * - category: 카테고리 분류
 */

export interface Skill {
  name: string;
  icon: string;
  color: string;
  tooltip: string;
  category: 'Frontend' | 'Styling' | 'State & API' | 'Animation' | 'Tools';
}

export const skills: Skill[] = [
  // Frontend Frameworks
  {
    name: 'React',
    icon: 'react',
    color: '#61DAFB',
    tooltip: '컴포넌트 기반 UI 라이브러리',
    category: 'Frontend'
  },
  {
    name: 'Next.js',
    icon: 'nextjs',
    color: '#000000',
    tooltip: 'React 기반 풀스택 프레임워크',
    category: 'Frontend'
  },
  {
    name: 'TypeScript',
    icon: 'typescript',
    color: '#3178C6',
    tooltip: '정적 타입 체크 JavaScript',
    category: 'Frontend'
  },
  {
    name: 'Vue.js',
    icon: 'vuejs',
    color: '#4FC08D',
    tooltip: '프로그레시브 JavaScript 프레임워크',
    category: 'Frontend'
  },

  // Styling
  {
    name: 'Tailwind CSS',
    icon: 'tailwindcss',
    color: '#06B6D4',
    tooltip: '유틸리티 우선 CSS 프레임워크',
    category: 'Styling'
  },
  {
    name: 'Sass',
    icon: 'sass',
    color: '#CC6699',
    tooltip: 'CSS 전처리기',
    category: 'Styling'
  },
  {
    name: 'CSS3',
    icon: 'css3',
    color: '#1572B6',
    tooltip: 'CSS-in-JS 및 스타일링',
    category: 'Styling'
  },

  // State Management & API
  {
    name: 'Redux',
    icon: 'redux',
    color: '#764ABC',
    tooltip: '예측 가능한 상태 컨테이너',
    category: 'State & API'
  },
  {
    name: 'React Query',
    icon: 'react',
    color: '#FF4154',
    tooltip: '서버 상태 관리 라이브러리',
    category: 'State & API'
  },
  {
    name: 'Axios',
    icon: 'axios',
    color: '#5A29E4',
    tooltip: 'Promise 기반 HTTP 클라이언트',
    category: 'State & API'
  },

  // Animation
  {
    name: 'GSAP',
    icon: 'javascript',
    color: '#88CE02',
    tooltip: '강력한 웹 애니메이션 라이브러리',
    category: 'Animation'
  },
  {
    name: 'Framer Motion',
    icon: 'framermotion',
    color: '#0055FF',
    tooltip: 'React용 프로덕션 레디 모션 라이브러리',
    category: 'Animation'
  },

  // Tools
  {
    name: 'Git',
    icon: 'git',
    color: '#F05032',
    tooltip: '분산 버전 관리 시스템',
    category: 'Tools'
  },
  {
    name: 'Vite',
    icon: 'vite',
    color: '#646CFF',
    tooltip: '빠른 빌드 도구',
    category: 'Tools'
  },
  {
    name: 'Figma',
    icon: 'figma',
    color: '#F24E1E',
    tooltip: 'UI/UX 디자인 도구',
    category: 'Tools'
  }
];
