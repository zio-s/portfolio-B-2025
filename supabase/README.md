# Supabase Database Setup Guide

Phase 8-2: Database 스키마 생성 및 초기 데이터 삽입 가이드

## 📋 목차
1. [스키마 생성](#1-스키마-생성)
2. [초기 데이터 삽입](#2-초기-데이터-삽입)
3. [TypeScript 타입 생성](#3-typescript-타입-생성)
4. [검증](#4-검증)

---

## 1. 스키마 생성

### 1️⃣ Supabase SQL Editor 접속
1. https://supabase.com/dashboard 로그인
2. 프로젝트 선택: `portfolio-cms` (또는 생성한 프로젝트 이름)
3. 좌측 사이드바에서 **SQL Editor** 클릭

### 2️⃣ schema.sql 실행
1. SQL Editor에서 **New query** 클릭
2. `supabase/schema.sql` 파일의 **전체 내용**을 복사
3. SQL Editor에 붙여넣기
4. **Run** 버튼 클릭 (또는 Cmd/Ctrl + Enter)
5. 성공 메시지 확인: `Success. No rows returned`

### 3️⃣ 생성된 테이블 확인
좌측 사이드바에서 **Database** → **Tables** 클릭

다음 테이블들이 보여야 합니다:
- ✅ `admin_users` - 관리자 계정
- ✅ `projects` - 프로젝트 정보
- ✅ `comments` - 댓글 정보

---

## 2. 초기 데이터 삽입

### 1️⃣ seed.sql 실행
1. SQL Editor에서 **New query** 클릭
2. `supabase/seed.sql` 파일의 **전체 내용**을 복사
3. SQL Editor에 붙여넣기
4. **Run** 버튼 클릭
5. 성공 메시지 확인

### 2️⃣ 데이터 확인
좌측 사이드바 **Database** → **Tables**에서 각 테이블 클릭

**예상 데이터:**
- `admin_users`: 1개 (admin@example.com)
- `projects`: 5개 (E-Commerce Platform, Chat App, AI Generator 등)
- `comments`: 5개 (댓글과 답글)

---

## 3. TypeScript 타입 생성

### ⚠️ 중요: 환경 변수 설정 필수

타입 생성 전에 Supabase CLI가 인증할 수 있도록 **Access Token**을 설정해야 합니다.

### 1️⃣ Access Token 발급
1. https://supabase.com/dashboard/account/tokens 접속
2. **Generate new token** 클릭
3. Token 이름: `CLI Access` (원하는 이름)
4. **Generate token** 클릭
5. 생성된 토큰 복사 (다시 볼 수 없으니 안전하게 보관!)

### 2️⃣ 환경 변수에 토큰 추가
`.env.local` 파일을 열고 다음 줄을 추가:

```bash
# Supabase Access Token for CLI
SUPABASE_ACCESS_TOKEN=sbp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3️⃣ 타입 자동 생성
터미널에서 다음 명령어 실행:

```bash
yarn db:types
```

또는 수동으로:

```bash
npx supabase gen types typescript --project-id smgwzotugeqzahcxicsa > src/lib/database.types.ts
```

### 4️⃣ 생성된 타입 확인
`src/lib/database.types.ts` 파일이 실제 데이터베이스 스키마를 반영한 TypeScript 타입으로 업데이트되었는지 확인

---

## 4. 검증

### ✅ 체크리스트

#### Database 검증
- [ ] `admin_users` 테이블에 1개 레코드 존재
- [ ] `projects` 테이블에 5개 레코드 존재
- [ ] `comments` 테이블에 5개 레코드 존재
- [ ] RLS (Row Level Security) 활성화 확인
- [ ] Triggers 생성 확인 (updated_at 자동 업데이트)

#### TypeScript 타입 검증
- [ ] `src/lib/database.types.ts` 파일 업데이트됨
- [ ] 파일에 `admin_users`, `projects`, `comments` 타입 존재
- [ ] 타입 에러 없이 빌드 성공: `yarn type-check`

#### 연결 테스트
1. 개발 서버 실행: `yarn dev`
2. http://localhost:5174 접속
3. 로그인 후 대시보드 이동
4. "🧪 Supabase 연결 테스트" 버튼 클릭
5. ✅ 연결 성공 및 데이터베이스 테이블 확인 성공 메시지 확인

---

## 🔧 문제 해결

### SQL 실행 오류
```
ERROR: relation "projects" already exists
```
**해결:** 테이블이 이미 존재합니다. `DROP TABLE` 후 재실행하거나 seed.sql만 다시 실행하세요.

### 타입 생성 오류
```
Error: Failed to generate types
```
**원인 1:** Access Token이 설정되지 않음
**해결:** `.env.local`에 `SUPABASE_ACCESS_TOKEN` 추가

**원인 2:** 프로젝트 ID가 잘못됨
**해결:** `package.json`의 `db:types` 스크립트에서 프로젝트 ID 확인

### RLS 정책 오류
```
ERROR: permission denied for table projects
```
**원인:** RLS 정책이 올바르게 설정되지 않음
**해결:** `schema.sql`을 다시 실행하여 RLS 정책 재생성

---

## 📚 다음 단계

✅ Phase 8-2 완료 후:
- **Phase 8-3**: MSW → Supabase API 교체
  - RTK Query 엔드포인트를 Supabase 클라이언트로 변경
  - 인증 시스템 Supabase Auth로 전환
  - 실시간 구독 기능 추가

---

## 🎯 Admin 로그인 정보

**테스트용 계정:**
- Email: `admin@example.com`
- Password: `admin123`

⚠️ **주의:** 이 계정은 테스트용입니다. 프로덕션 배포 전에 반드시 변경하세요!

---

## 📞 문제 발생 시

1. Supabase 대시보드에서 **Logs** 확인
2. 브라우저 개발자 도구 Console 확인
3. 터미널 에러 메시지 확인
4. SQL Editor에서 수동으로 테이블 확인:
   ```sql
   SELECT * FROM projects LIMIT 5;
   SELECT * FROM comments LIMIT 5;
   SELECT * FROM admin_users LIMIT 1;
   ```
