# Portfolio B 2025

변세민의 개인 포트폴리오 웹사이트 - React와 Supabase 기반의 인터랙티브 포트폴리오

## 프로젝트 소개

프론트엔드 개발자 변세민의 포트폴리오를 소개하는 웹사이트입니다. 프로젝트 소개, 기술 스택, 방명록 기능을 포함하며, 관리자 페이지를 통해 콘텐츠를 관리할 수 있습니다.

**Live Demo**: [https://semincode.com](https://semincode.com)

## 주요 기능

### 사용자 기능
- **프로젝트 포트폴리오**: 진행한 프로젝트들을 카드 형태로 소개
- **프로젝트 상세**: 프로젝트별 상세 정보, 기술 스택, 주요 기능, 챌린지 등
- **방명록**: 방문자들이 메시지를 남길 수 있는 공간
- **댓글 시스템**: 프로젝트에 댓글 작성 기능
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 디바이스 지원
- **다크 모드**: 라이트/다크 테마 전환
- **SEO 최적화**: 각 페이지별 동적 메타 태그 (Open Graph, Twitter Cards)

### 관리자 기능
- **프로젝트 관리**: 프로젝트 CRUD (생성, 읽기, 수정, 삭제)
- **방명록 관리**: 방명록 메시지 관리
- **댓글 관리**: 댓글 승인/삭제
- **대시보드**: 통계 및 최근 활동 현황

## 기술 스택

### Frontend
- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구 및 개발 서버
- **Redux Toolkit** - 전역 상태 관리
- **React Router v7** - 클라이언트 사이드 라우팅

### Styling & Animation
- **Tailwind CSS v4** - 유틸리티 우선 CSS 프레임워크
- **GSAP** - 고성능 애니메이션
- **Framer Motion** - React 애니메이션 라이브러리
- **Embla Carousel** - 터치 지원 캐러셀
- **Swiper** - 모던 슬라이더

### UI Components
- **Radix UI** - 접근성 우선 헤드리스 컴포넌트
- **Lucide React** - 아이콘 라이브러리
- **Devicons React** - 기술 스택 아이콘

### Backend & Data
- **Supabase** - Backend as a Service (PostgreSQL, Auth, Storage)
- **Axios** - HTTP 클라이언트

### Rich Text & Content
- **TipTap** - WYSIWYG 에디터
- **React Markdown** - 마크다운 렌더링
- **React Helmet Async** - SEO 메타 태그 관리

### Development Tools
- **ESLint** - 코드 품질 관리
- **Prettier** - 코드 포맷팅
- **TypeScript ESLint** - TypeScript 린팅

## 시작하기

### 필수 요구사항

- **Node.js** 18.x 이상
- **npm** 또는 **yarn**
- **Supabase 계정** (무료)

### 설치 및 실행

1. **저장소 클론**
```bash
git clone https://github.com/zio-s/portfolio-B-2025.git
cd portfolio-B-2025
```

2. **의존성 설치**
```bash
npm install
# 또는
yarn install
```

3. **환경 변수 설정**
```bash
# .env.example 파일을 .env.local로 복사
cp .env.example .env.local

# .env.local 파일을 열어 Supabase 정보 입력
```

**.env.local 예시:**
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Supabase 데이터베이스 설정**
```bash
# supabase/schema.sql 파일을 Supabase SQL Editor에서 실행
# 또는 스크립트 실행
chmod +x scripts/setup-database.sh
./scripts/setup-database.sh
```

5. **개발 서버 실행**
```bash
npm run dev
# 또는
yarn dev
```

브라우저에서 `http://localhost:5173` 접속

### 프로덕션 빌드

```bash
npm run build
# 또는
yarn build
```

빌드된 파일은 `dist/` 폴더에 생성됩니다.

### 빌드 미리보기

```bash
npm run preview
# 또는
yarn preview
```

## 프로젝트 구조

```
portfolio-B-2025/
├── public/                     # 정적 파일
│   ├── robots.txt             # SEO 로봇 설정
│   └── sitemap.xml            # 사이트맵
├── src/
│   ├── components/            # 재사용 가능한 컴포넌트
│   │   ├── admin/            # 관리자 전용 컴포넌트
│   │   ├── animations/       # 애니메이션 래퍼
│   │   ├── common/           # 공통 UI 컴포넌트
│   │   ├── layout/           # 레이아웃 컴포넌트
│   │   ├── modal/            # 모달 시스템
│   │   ├── portfolio/        # 포트폴리오 관련 컴포넌트
│   │   ├── toast/            # 토스트 알림
│   │   └── ui/               # 기본 UI 컴포넌트
│   ├── contexts/             # React Context
│   │   └── ThemeContext.tsx  # 테마 관리
│   ├── data/                 # 정적 데이터
│   │   └── skills.ts         # 기술 스택 데이터
│   ├── features/             # 도메인별 기능
│   │   ├── admin/           # 관리자 기능
│   │   ├── comments/        # 댓글 시스템
│   │   ├── guestbook/       # 방명록
│   │   └── portfolio/       # 포트폴리오
│   ├── hooks/                # 커스텀 훅
│   ├── lib/                  # 라이브러리 설정
│   │   ├── supabase.ts      # Supabase 클라이언트
│   │   └── database.types.ts # DB 타입
│   ├── pages/                # 페이지 컴포넌트
│   │   ├── admin/           # 관리자 페이지
│   │   ├── HomePage.tsx     # 메인 페이지
│   │   ├── ProjectsPage.tsx # 프로젝트 목록
│   │   ├── ProjectDetailPage.tsx # 프로젝트 상세
│   │   └── GuestbookPage.tsx # 방명록
│   ├── router/               # 라우팅 설정
│   ├── services/             # API 서비스
│   ├── store/                # Redux 스토어
│   │   └── slices/          # Redux 슬라이스
│   ├── styles/               # 전역 스타일
│   ├── utils/                # 유틸리티 함수
│   └── main.tsx              # 앱 진입점
├── supabase/                  # Supabase 설정
│   ├── migrations/           # 마이그레이션
│   ├── schema.sql           # DB 스키마
│   └── seed.sql             # 시드 데이터
├── migration/                 # 데이터 마이그레이션
│   ├── projects-data.json   # 프로젝트 데이터
│   └── import-projects.ts   # 임포트 스크립트
└── claudedocs/               # 프로젝트 문서
```

## 주요 페이지

### 공개 페이지
- `/` - 홈페이지 (소개, 주요 프로젝트)
- `/projects` - 전체 프로젝트 목록
- `/projects/:id` - 프로젝트 상세 페이지
- `/guestbook` - 방명록

### 관리자 페이지
- `/admin/login` - 관리자 로그인
- `/admin/dashboard` - 대시보드
- `/admin/projects` - 프로젝트 관리
- `/admin/guestbook` - 방명록 관리
- `/admin/comments` - 댓글 관리

## 주요 기능 설명

### SEO 최적화

각 페이지별로 동적 메타 태그를 생성하여 검색 엔진 최적화:

```tsx
<SEO
  title="프로젝트 | 변세민 포트폴리오"
  description="React, TypeScript로 개발한 프로젝트들을 소개합니다."
  url="https://semincode.com/projects"
/>
```

### 애니메이션 시스템

GSAP과 Framer Motion을 활용한 부드러운 애니메이션:

```tsx
<FadeIn>
  <ProjectCard project={project} />
</FadeIn>

<ScaleIn delay={0.2}>
  <SkillBadge skill={skill} />
</ScaleIn>
```

### 상태 관리

Redux Toolkit을 사용한 전역 상태 관리:

```typescript
// Redux 스토어 구조
{
  auth: { user, isAuthenticated },
  ui: { theme, sidebar, toast, modal },
  recentMenu: { items }
}
```

### Supabase 통합

Supabase를 활용한 백엔드 기능:

```typescript
// 프로젝트 데이터 가져오기
const { data: projects } = await supabase
  .from('projects')
  .select('*')
  .eq('showOnMain', true)
  .order('year', { ascending: false });
```

## 환경 변수

필수 환경 변수:

```env
# Supabase 설정
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# (선택) AWS S3 설정 (미디어 파일용)
VITE_AWS_REGION=ap-northeast-2
VITE_AWS_BUCKET=portfolio-media
VITE_CLOUDFRONT_URL=your_cloudfront_url
```

## 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# 린트 검사
npm run lint

# 린트 자동 수정
npm run lint:fix

# 타입 체크
npm run type-check

# 코드 포맷팅
npm run format

# Supabase 타입 생성
npm run db:types

# 프로젝트 데이터 마이그레이션
npm run migrate

# 캐시 정리
npm run clean
```

## 배포

### Vercel 배포 (권장)

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

**환경 변수 설정**: Vercel 대시보드 → Settings → Environment Variables에서 설정

### 기타 플랫폼

Netlify, Cloudflare Pages 등 다른 플랫폼에서도 배포 가능합니다.

빌드 설정:
- Build Command: `npm run build`
- Output Directory: `dist`
- Node Version: 18+

## 관리자 로그인

관리자 계정은 Supabase Authentication을 통해 관리됩니다.

**기본 접근 방법**:
1. Supabase 대시보드 → Authentication → Users에서 사용자 생성
2. `/admin/login` 페이지에서 로그인
3. 관리자 페이지 접근

자세한 내용은 `claudedocs/ADMIN_LOGIN_GUIDE.md` 참조

## 문제 해결

### 빌드 오류

```bash
# 캐시 정리 후 재빌드
npm run clean
npm install
npm run build
```

### Supabase 연결 오류

- `.env.local` 파일에 올바른 Supabase URL과 Key가 입력되었는지 확인
- Supabase 프로젝트가 활성화되어 있는지 확인
- 네트워크 연결 상태 확인

### 타입 오류

```bash
# Supabase 타입 재생성
npm run db:types

# 타입 체크
npm run type-check
```

## 기여

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 라이선스

MIT License

## 연락처

**변세민 (Semin Byun)**
- Website: [https://semincode.com](https://semincode.com)
- GitHub: [@zio-s](https://github.com/zio-s)

## 감사의 말

- [React](https://react.dev/)
- [Supabase](https://supabase.com/)
- [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [GSAP](https://gsap.com/)
- [Radix UI](https://www.radix-ui.com/)
