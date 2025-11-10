# Phase 8: Supabase Database Setup Guide

이 가이드는 Supabase 데이터베이스에 필요한 테이블을 생성하는 방법을 안내합니다.

## 📋 준비사항

- ✅ Supabase 프로젝트 생성 완료
- ✅ Supabase 대시보드 접근 가능
- ✅ 프로젝트 URL: `https://smgwzotugeqzahcxicsa.supabase.co`

---

## 🚀 단계별 실행 가이드

### 1단계: Supabase 대시보드 접속

1. 브라우저에서 [Supabase Dashboard](https://app.supabase.com) 접속
2. 프로젝트 선택: `smgwzotugeqzahcxicsa`
3. 왼쪽 메뉴에서 **SQL Editor** 클릭

---

### 2단계: SQL 스크립트 실행 (순서 중요!)

#### ① schema.sql 실행

**파일**: `supabase/schema.sql`

**내용**:
- `admin_users` 테이블
- `projects` 테이블
- `comments` 테이블
- RLS 정책
- Helper functions

**실행 방법**:
1. SQL Editor에서 **New query** 클릭
2. `supabase/schema.sql` 파일 내용을 복사
3. 붙여넣기 후 **Run** 클릭
4. ✅ Success 확인

---

#### ② create_guestbook_table.sql 실행

**파일**: `supabase/migrations/create_guestbook_table.sql`

**내용**:
- `guestbook` 테이블
- RLS 정책
- Sample data

**실행 방법**:
1. SQL Editor에서 **New query** 클릭
2. `supabase/migrations/create_guestbook_table.sql` 파일 내용을 복사
3. 붙여넣기 후 **Run** 클릭
4. ✅ Success 확인

---

#### ③ create_guestbook_visitors_table.sql 실행 (새로 생성됨!)

**파일**: `supabase/migrations/create_guestbook_visitors_table.sql`

**내용**:
- `guestbook_visitors` 테이블
- RLS 정책
- 방문자 수 추적 로직

**실행 방법**:
1. SQL Editor에서 **New query** 클릭
2. `supabase/migrations/create_guestbook_visitors_table.sql` 파일 내용을 복사
3. 붙여넣기 후 **Run** 클릭
4. ✅ Success 확인

---

#### ④ seed.sql 실행 (선택사항 - 테스트 데이터)

**파일**: `supabase/seed.sql`

**내용**:
- 샘플 프로젝트 5개
- 샘플 댓글
- 테스트용 통계 데이터

**실행 방법**:
1. SQL Editor에서 **New query** 클릭
2. `supabase/seed.sql` 파일 내용을 복사
3. 붙여넣기 후 **Run** 클릭
4. ✅ Success 확인

⚠️ **주의**: 이미 실제 데이터가 있다면 seed.sql은 건너뛰세요!

---

### 3단계: 테이블 생성 확인

1. 왼쪽 메뉴에서 **Table Editor** 클릭
2. 다음 테이블들이 보이는지 확인:
   - ✅ `admin_users`
   - ✅ `projects`
   - ✅ `comments`
   - ✅ `guestbook`
   - ✅ `guestbook_visitors` ⭐ (새로 생성)

---

### 4단계: RLS 정책 확인

각 테이블 클릭 → **RLS** 탭 확인:

**projects**:
- ✅ "Projects are viewable by everyone" (SELECT)
- ✅ "Admins can insert/update/delete projects"

**guestbook**:
- ✅ "Anyone can read approved guestbook entries" (SELECT)
- ✅ "Anyone can create guestbook entries" (INSERT)

**guestbook_visitors**:
- ✅ "Anyone can read visitor counts" (SELECT)
- ✅ "Anyone can insert/update visitor counts"

---

### 5단계: 프론트엔드 앱 테스트

1. 로컬 개발 서버 실행 확인:
   ```bash
   npm run dev
   ```

2. 브라우저에서 접속: `http://localhost:5173`

3. 테스트:
   - ✅ 방문록 페이지 접속 → 방문자 수 표시 확인
   - ✅ 방문록 작성 → DB 저장 확인
   - ✅ 프로젝트 페이지 → 목록 표시 확인

---

## 🐛 문제 해결

### 에러: "table does not exist"
**원인**: SQL 스크립트가 실행되지 않음
**해결**: 위 2단계의 SQL 스크립트를 순서대로 다시 실행

### 에러: "permission denied"
**원인**: RLS 정책 문제
**해결**: 3단계에서 RLS 정책 확인, 필요시 SQL 재실행

### 방문자 수가 0으로 표시
**원인**: `guestbook_visitors` 테이블 미생성
**해결**: `create_guestbook_visitors_table.sql` 실행

---

## 📊 실행 순서 요약

```
1. schema.sql (기본 테이블)
   ↓
2. create_guestbook_table.sql (방문록)
   ↓
3. create_guestbook_visitors_table.sql (방문자 추적)
   ↓
4. seed.sql (선택사항 - 테스트 데이터)
   ↓
5. 테이블 확인
   ↓
6. 앱 테스트
```

---

## ✅ 완료 체크리스트

- [ ] Supabase 대시보드 접속
- [ ] schema.sql 실행 완료
- [ ] create_guestbook_table.sql 실행 완료
- [ ] create_guestbook_visitors_table.sql 실행 완료
- [ ] seed.sql 실행 (선택사항)
- [ ] Table Editor에서 5개 테이블 확인
- [ ] RLS 정책 확인
- [ ] 프론트엔드 앱 테스트 성공

---

## 🎉 완료!

모든 단계가 완료되면 프론트엔드 앱이 Supabase 데이터베이스와 완전히 연동됩니다!

**다음 단계**: 프로젝트 배포 또는 추가 기능 개발
