# Frontend Portfolio CMS

React + TypeScript + Redux Toolkit 기반의 포트폴리오 관리 시스템 프론트엔드 애플리케이션입니다.

## 주요 기능

- 사용자 인증 및 권한 관리
- 포스트 작성, 수정, 삭제
- 사용자 관리 (관리자 전용)
- 반응형 UI/UX
- 다크 모드 지원
- 실시간 알림 시스템
- Modal 및 Toast 컴포넌트

## 기술 스택

### 핵심 라이브러리
- **React 19** - UI 프레임워크
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구
- **Redux Toolkit** - 상태 관리
- **React Router v7** - 라우팅

### 주요 도구
- **Axios** - HTTP 클라이언트
- **ESLint** - 코드 품질 관리

## 시작하기

### 필수 요구사항

- Node.js 18.x 이상
- npm 또는 yarn

### 설치

1. 저장소 클론

```bash
git clone <repository-url>
cd frontend-portfolio-cms
```

2. 의존성 설치

```bash
npm install
```

3. 환경 변수 설정

```bash
# .env.example 파일을 .env로 복사
cp .env.example .env

# .env 파일을 열어 필요한 값 수정
```

필수 환경 변수:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 빌드

프로덕션 빌드:

```bash
npm run build
```

빌드 결과물은 `dist` 폴더에 생성됩니다.

### 프리뷰

빌드된 앱을 로컬에서 테스트:

```bash
npm run preview
```

### 린트

코드 품질 검사:

```bash
npm run lint
```

## 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── modal/          # Modal 시스템
│   └── toast/          # Toast 알림 시스템
├── features/           # 기능별 컴포넌트
├── hooks/              # 커스텀 훅
├── pages/              # 페이지 컴포넌트
├── router/             # 라우팅 설정
├── services/           # API 서비스
├── store/              # Redux 스토어
│   ├── slices/        # Redux 슬라이스
│   ├── store.ts       # 스토어 설정
│   └── hooks.ts       # 타입화된 훅
├── styles/             # 전역 스타일
├── types/              # 타입 정의
├── utils/              # 유틸리티 함수
├── App.tsx             # 루트 컴포넌트
└── main.tsx            # 진입점
```

## 주요 컴포넌트

### 인증
- **LoginPage** - 로그인
- **RegisterPage** - 회원가입
- **ProtectedRoute** - 인증 필요 라우트 보호
- **PublicRoute** - 비인증 사용자 전용 라우트

### 포스트 관리
- **PostList** - 포스트 목록
- **PostDetail** - 포스트 상세
- **PostEditor** - 포스트 작성/수정

### 사용자 관리
- **UserList** - 사용자 목록 (관리자 전용)
- **UserProfile** - 사용자 프로필

### UI 컴포넌트
- **ToastContainer** - 알림 메시지
- **ModalContainer** - 모달 다이얼로그

## Redux 상태 관리

### 슬라이스

1. **authSlice** - 인증 상태
   - 사용자 정보
   - 로그인 상태
   - 토큰 관리

2. **postsSlice** - 포스트 상태
   - 포스트 목록
   - 필터링 및 페이지네이션
   - CRUD 작업

3. **usersSlice** - 사용자 상태
   - 사용자 목록
   - 사용자 관리

4. **uiSlice** - UI 상태
   - 사이드바 상태
   - 테마 (라이트/다크)
   - 알림 목록
   - 모달 상태

### 커스텀 훅

```typescript
import { useAppDispatch, useAppSelector } from './store';

// 컴포넌트에서 사용
const dispatch = useAppDispatch();
const user = useAppSelector(selectUser);
```

## 라우팅

### 공개 라우트
- `/login` - 로그인
- `/register` - 회원가입

### 보호된 라우트 (인증 필요)
- `/` - 대시보드
- `/posts` - 포스트 목록
- `/posts/:id` - 포스트 상세
- `/posts/new` - 포스트 작성
- `/posts/:id/edit` - 포스트 수정
- `/profile` - 프로필

### 관리자 전용 라우트
- `/admin/users` - 사용자 관리

## API 서비스

### AuthService
```typescript
import { authService } from './services';

await authService.login(email, password);
await authService.register(userData);
await authService.getCurrentUser();
```

### PostsService
```typescript
import { postsService } from './services';

await postsService.getPosts(filters);
await postsService.createPost(postData);
await postsService.updatePost(id, postData);
```

### UsersService
```typescript
import { usersService } from './services';

await usersService.getUsers();
await usersService.updateUserRole(id, role);
```

## 스타일링

### CSS 변수
전역 스타일에 정의된 CSS 변수를 사용합니다:

```css
/* 색상 */
var(--color-primary-600)
var(--color-gray-500)

/* 간격 */
var(--spacing-md)
var(--spacing-lg)

/* 폰트 */
var(--font-size-lg)
var(--font-weight-semibold)

/* 테두리 */
var(--border-radius-md)
var(--shadow-md)
```

### 다크 모드
`data-theme="dark"` 속성으로 다크 모드가 자동 적용됩니다.

## 환경 변수

### Vite 환경 변수 접근
```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const isDebug = import.meta.env.VITE_DEBUG_MODE === 'true';
```

## 개발 가이드

### 새로운 페이지 추가

1. `src/pages/` 에 페이지 컴포넌트 생성
2. `src/router/routes.ts` 에 라우트 추가
3. 필요시 `ProtectedRoute` 또는 `PublicRoute` 로 래핑

### 새로운 API 서비스 추가

1. `src/services/` 에 서비스 클래스 생성
2. `apiClient` 를 사용하여 HTTP 요청
3. 타입 정의 추가

### Redux 슬라이스 추가

1. `src/store/slices/` 에 슬라이스 생성
2. `src/store/store.ts` 에 리듀서 추가
3. `src/store/index.ts` 에 export 추가

## 문제 해결

### 포트가 이미 사용 중인 경우
```bash
# 다른 포트로 실행
npm run dev -- --port 3000
```

### 빌드 실패
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

### 타입 에러
```bash
# TypeScript 타입 체크
npm run build
```

## 배포

### Vercel
```bash
npm run build
vercel deploy
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### 일반 웹 서버
1. `npm run build` 실행
2. `dist` 폴더의 내용을 웹 서버에 업로드
3. SPA 라우팅을 위해 모든 요청을 `index.html`로 리다이렉트 설정

#### Nginx 설정 예시
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## 라이선스

MIT

## 기여

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 지원

문제가 발생하거나 질문이 있으시면 Issue를 생성해주세요.
