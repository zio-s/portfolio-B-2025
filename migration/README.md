# 📦 포트폴리오 프로젝트 마이그레이션 가이드

기존 포트폴리오(`project-portfolio`)의 프로젝트 데이터를 CMS 데이터베이스로 이관하는 가이드입니다.

---

## 📋 개요

### 현재 상황
- **기존 포트폴리오**: `/Users/semin/Downloads/--project/project-portfolio`
  - Next.js + TypeScript
  - Static 데이터 (`src/data/projects.ts`)
  - Vercel 배포 유지 (이미지 URL 계속 사용)

- **새 CMS**: `/Users/semin/Downloads/--project/frontend-portfolio-cms`
  - React + Supabase
  - 데이터베이스 중심
  - 도메인 연결 예정

### 이관 전략
- **데이터**: Supabase DB에 저장
- **이미지**: 기존 Vercel URL 그대로 사용 (별도 업로드 불필요)
- **UI**: 새로운 디자인으로 표시

---

## 🚀 마이그레이션 실행

### 1단계: 환경 변수 확인

`.env.local` 파일에 Supabase 설정이 있는지 확인:

```bash
VITE_SUPABASE_URL=https://smgwzotugeqzahcxicsa.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

### 2단계: 데이터 확인

`migration/projects-data.json` 파일을 열어서 프로젝트 데이터가 올바른지 확인:

```bash
cat migration/projects-data.json
```

현재 **5개 프로젝트** 포함:
1. OHESHIO Renewal (E-commerce)
2. Genie Music (Music Platform)
3. Gamers-Nest (Gaming Community)
4. Viewee (OTT Platform)
5. Portfolio 2024 (개발자 포트폴리오)

### 3단계: 마이그레이션 실행

```bash
npm run migrate
```

또는 직접 실행:

```bash
npx tsx migration/run-migration.ts
```

### 4단계: 결과 확인

**Supabase Dashboard**에서 확인:
1. https://supabase.com/dashboard 접속
2. 프로젝트 선택: `portfolio-cms`
3. **Table Editor** → **projects** 테이블 확인
4. 5개 프로젝트가 추가되었는지 확인

---

## 📊 데이터 변환 상세

### 기존 데이터 구조 → CMS 데이터베이스

| 기존 필드 | CMS 필드 | 변환 방법 |
|-----------|----------|-----------|
| `id` | (자동 생성 UUID) | Supabase가 자동 생성 |
| `title` | `title` | 그대로 |
| `subtitle` | `description` | 짧은 설명 |
| `description` | `content` | 긴 설명 (마크다운) |
| `image[0]` | `thumbnail` | 첫 번째 이미지 |
| `image[]` | `images[]` | 전체 이미지 배열 |
| `techStack[]` | `tech_stack[]` | 그대로 |
| `links.github` | `github_url` | 그대로 |
| `links.live` | `demo_url` | 그대로 |
| `period` | `duration` | 그대로 |
| `client: "Team Project (5인)"` | `team_size: 5` | 숫자 추출 |
| `responsibilities[]` | `role` | 요약 |
| `responsibilities[]` | `achievements[]` | 주요 성과 |
| `challenges[].description` | `challenges[]` | 설명만 |
| `challenges[].solution` | `solutions[]` | 해결 방법만 |
| `showOnMain` | `featured` | 메인 노출 여부 |

### 이미지 URL 변환

**기존 경로**:
```
/images/pattern/oheshio-2.png
```

**변환 후**:
```
https://project-portfolio-gules.vercel.app/images/pattern/oheshio-2.png
```

---

## 🔍 문제 해결

### ❌ "Supabase 환경 변수가 설정되지 않았습니다"

**해결**:
```bash
# .env.local 파일 확인
cat .env.local

# 없다면 생성
cp .env.example .env.local
# VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY 입력
```

### ❌ "파일을 찾을 수 없습니다: projects-data.json"

**해결**:
```bash
# migration 폴더로 이동
cd migration

# 파일 확인
ls -la

# projects-data.json이 있는지 확인
```

### ❌ "duplicate key value violates unique constraint"

**원인**: 이미 데이터가 삽입되어 있음

**해결**:
```sql
-- Supabase Dashboard SQL Editor에서 실행
DELETE FROM projects WHERE title = 'OHESHIO Renewal';
-- 또는 전체 삭제
TRUNCATE TABLE projects CASCADE;
```

### ❌ 이미지가 404 에러

**원인**: Vercel URL이 잘못되었거나 배포가 중단됨

**해결**:
1. 기존 포트폴리오 Vercel 배포 확인
2. URL이 변경되었다면 `migration/run-migration.ts`의 `baseUrl` 수정:
   ```typescript
   const baseUrl = 'https://project-portfolio-gules.vercel.app';
   ```

---

## 📝 수동 데이터 추가

마이그레이션 스크립트를 사용하지 않고 직접 추가하려면:

### Supabase Dashboard 사용

1. https://supabase.com/dashboard 접속
2. **Table Editor** → **projects** 클릭
3. **Insert row** 클릭
4. 데이터 입력 후 **Save**

### SQL Editor 사용

```sql
INSERT INTO projects (
  title,
  description,
  content,
  thumbnail,
  category,
  featured,
  tech_stack,
  github_url,
  demo_url,
  duration,
  team_size,
  role,
  images
) VALUES (
  'My Project',
  'Short description',
  'Long markdown content',
  'https://project-portfolio-gules.vercel.app/images/pattern/project.png',
  'Web Development',
  true,
  ARRAY['React', 'TypeScript'],
  'https://github.com/username/repo',
  'https://demo.com',
  '2025.01 - 2025.03',
  1,
  'Full-stack Developer',
  ARRAY['https://project-portfolio-gules.vercel.app/images/pattern/image1.png']
);
```

---

## 🎯 다음 단계

### 1. CMS 프론트엔드 구현

프로젝트 목록 페이지 구현:

```typescript
// src/pages/ProjectsPage.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

function ProjectsPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      setProjects(data || []);
    };

    fetchProjects();
  }, []);

  return (
    <div>
      <h1>프로젝트</h1>
      {projects.map(project => (
        <div key={project.id}>
          <img src={project.thumbnail} alt={project.title} />
          <h2>{project.title}</h2>
          <p>{project.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### 2. 관리자 페이지 구현

프로젝트 CRUD 기능 추가

### 3. 도메인 연결

Vercel에서 커스텀 도메인 연결

---

## 💡 팁

### 빠른 테스트

마이그레이션 전에 1개 프로젝트만 테스트:

```typescript
// migration/run-migration.ts 수정
const testProjects = oldProjects.slice(0, 1); // 첫 번째만
const cmsProjects = testProjects.map(transformProject);
```

### JSON 데이터 수정

새 프로젝트 추가 또는 기존 데이터 수정:

```bash
# migration/projects-data.json 편집
code migration/projects-data.json

# 마이그레이션 재실행
npm run migrate
```

### 백업

마이그레이션 전 기존 데이터 백업:

```sql
-- Supabase Dashboard SQL Editor
SELECT * FROM projects;
-- 결과를 CSV로 다운로드
```

---

## 📚 참고 자료

- [Supabase 공식 문서](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [프로젝트 스키마](../supabase/schema.sql)

---

## 🆘 지원

문제가 발생하면:
1. 에러 메시지 확인
2. Supabase Dashboard에서 로그 확인
3. `migration/run-migration.ts` 디버깅
