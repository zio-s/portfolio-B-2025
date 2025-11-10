# Admin 로그인 가이드

## 개요
이 애플리케이션은 **Admin 전용 로그인 시스템**입니다.
- **회원가입 기능 없음** - 일반 사용자가 회원가입할 수 없습니다
- **관리자만 로그인 가능** - Supabase에 직접 등록된 admin만 접근 가능
- **이중 검증 시스템** - Supabase Auth + admin_users 테이블 확인

## 인증 플로우

```
1. 로그인 시도 (email + password)
   ↓
2. Supabase Auth 검증
   ↓
3. admin_users 테이블 확인
   ↓
4. 둘 다 통과 시 로그인 성공
   ↓
5. 하나라도 실패 시 로그인 거부
```

## Admin 계정 생성 방법

### 방법 1: Supabase Dashboard (권장)

#### Step 1: Supabase Auth에 사용자 생성
1. Supabase Dashboard 접속
2. Authentication > Users 메뉴로 이동
3. "Add user" 클릭
4. 이메일과 비밀번호 입력
5. "Create user" 클릭

#### Step 2: admin_users 테이블에 추가
1. Supabase Dashboard에서 Table Editor 메뉴로 이동
2. `admin_users` 테이블 선택
3. "Insert row" 클릭
4. 다음 정보 입력:
   - `email`: Auth에서 생성한 이메일과 **동일하게** 입력
   - `name`: 관리자 이름
   - `password_hash`: **비워두기** (Auth에서 관리)
5. "Save" 클릭

**중요**: `admin_users.email`은 Supabase Auth의 이메일과 **반드시 일치**해야 합니다.

### 방법 2: SQL Query

```sql
-- 1. Supabase Auth에 사용자 생성 (Dashboard에서 수동으로 해야 함)
-- 2. admin_users 테이블에 추가
INSERT INTO admin_users (email, name)
VALUES ('admin@example.com', 'Admin User');
```

## 로그인 프로세스 상세

### 1. 사용자가 로그인 시도
- 현재 UI에서는 로그인 페이지가 제거됨
- Admin은 직접 Supabase Dashboard 또는 API를 통해 로그인

### 2. Supabase Auth 검증 (authService.signIn)
```typescript
const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
  email: credentials.email,
  password: credentials.password,
});
```

### 3. admin_users 테이블 확인
```typescript
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
```

### 4. 로그인 성공
```typescript
const user: AuthUser = {
  id: adminUser.id,
  email: adminUser.email,
  name: adminUser.name,
  role: 'admin',
};
```

## UI 변경 사항

### MainLayout
- **로그인 전**: Admin/Logout 버튼 표시 안 함
- **로그인 후**: Admin 버튼과 Logout 버튼만 표시
- **제거된 기능**: 로그인 버튼, 회원가입 버튼

### Router
- **제거된 라우트**: `/login`, `/register`
- **접근 가능 라우트**:
  - 공개: `/`, `/projects`, `/projects/:id`, `/guestbook`
  - Admin 전용: `/admin`, `/admin/projects`, `/admin/comments`, `/admin/guestbook`

## Admin 페이지 접근

1. Supabase Dashboard에서 직접 로그인
2. 브라우저에서 `/admin` 경로로 이동
3. 로그인되어 있으면 Admin 페이지 표시
4. 로그인되어 있지 않으면 로그인 페이지로 리다이렉트 (현재는 제거됨)

## 보안 고려사항

### 이중 검증의 이점
1. **Supabase Auth**: 이메일/비밀번호 검증, 세션 관리
2. **admin_users 테이블**: 관리자 권한 확인
3. **자동 로그아웃**: admin_users에 없으면 즉시 로그아웃

### RLS (Row Level Security)
admin_users 테이블에 RLS 정책 적용 권장:
```sql
-- admin_users 테이블은 인증된 사용자만 읽기 가능
CREATE POLICY "Authenticated users can read admin_users"
ON admin_users FOR SELECT
TO authenticated
USING (true);

-- 삽입/수정/삭제는 service_role만 가능 (Dashboard)
```

## 문제 해결

### "Not authorized. Admin access only" 에러
**원인**: admin_users 테이블에 이메일이 없음
**해결**: admin_users 테이블에 해당 이메일 추가

### 로그인 후 자동 로그아웃
**원인**:
1. admin_users 테이블에 이메일이 없음
2. admin_users.email과 Auth 이메일이 다름
**해결**: admin_users 테이블의 이메일 확인 및 수정

### 세션이 유지되지 않음
**원인**: Supabase Auth 세션 만료
**해결**:
1. Supabase Dashboard에서 세션 설정 확인
2. JWT 만료 시간 조정
3. 리프레시 토큰 설정 확인

## 개발 환경 테스트 계정

개발 환경에서 테스트용 admin 계정을 생성하세요:

```sql
-- admin_users 테이블에 테스트 계정 추가
INSERT INTO admin_users (email, name)
VALUES ('admin@test.com', 'Test Admin');
```

그리고 Supabase Dashboard에서 동일한 이메일로 Auth 사용자를 생성하세요.

## 참고 파일

- `/src/store/slices/authSlice.ts` - Redux auth 로직
- `/src/services/authService.ts` - Supabase Auth 연동
- `/src/router/AdminRoute.tsx` - Admin 라우트 보호
- `/src/components/layout/MainLayout.tsx` - 네비게이션 UI

## 다음 단계

현재 로그인 페이지가 제거되었으므로, admin이 로그인하려면:

1. **옵션 1**: Supabase Dashboard에서 직접 Auth 세션 생성
2. **옵션 2**: 별도의 Admin 전용 로그인 페이지 생성 (권장)
3. **옵션 3**: API 엔드포인트를 통한 프로그래매틱 로그인

**권장 사항**: `/admin/login` 경로에 간단한 로그인 폼 추가를 고려하세요.
