/**
 * 기존 포트폴리오 프로젝트를 CMS DB로 이관하는 스크립트
 *
 * 사용법:
 * npx tsx migration/import-projects.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// 환경 변수 로드
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase 환경 변수가 설정되지 않았습니다.');
  console.error('VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 .env.local에 설정하세요.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 기존 프로젝트 데이터 타입
interface OldProject {
  id: string;
  showOnMain?: boolean;
  title: string;
  subtitle: string;
  description?: string;
  year: string;
  client: string;
  desc?: string;
  image: string[];
  period?: string;
  colors?: Record<string, string>;
  links: {
    live?: string;
    github?: string;
  };
  responsibilities?: string[];
  techStack?: string[];
  keyFeatures?: Array<{
    title: string;
    description: string;
    image?: string;
    type?: 'image' | 'video';
  }>;
  challenges?: Array<{
    title: string;
    description: string;
    solution: string;
  }>;
}

// CMS DB 프로젝트 타입
interface CmsProject {
  title: string;
  description: string;
  content: string;
  thumbnail: string;
  category: string;
  featured: boolean;
  tags: string[];
  tech_stack: string[];
  github_url: string | null;
  demo_url: string | null;
  duration: string;
  team_size: number;
  role: string;
  achievements: string[];
  challenges: string[];
  solutions: string[];
  images: string[];
}

/**
 * 팀 규모 추출
 */
function extractTeamSize(client: string): number {
  const match = client.match(/(\d+)인/);
  if (match) {
    return parseInt(match[1]);
  }
  return client.includes('Personal') ? 1 : 1;
}

/**
 * 카테고리 결정
 */
function determineCategory(techStack: string[] = []): string {
  const stack = techStack.map(t => t.toLowerCase());

  if (stack.some(t => ['react', 'next.js', 'vue'].includes(t))) {
    return 'Frontend Development';
  }
  if (stack.some(t => ['node', 'express', 'django'].includes(t))) {
    return 'Backend Development';
  }
  return 'Web Development';
}

/**
 * 역할 요약 생성
 */
function summarizeRole(responsibilities: string[] = []): string {
  if (responsibilities.length === 0) {
    return 'Full-stack Developer';
  }

  const firstTwo = responsibilities.slice(0, 2).join('. ');
  return firstTwo.length > 200 ? firstTwo.substring(0, 200) + '...' : firstTwo;
}

/**
 * 상세 콘텐츠 생성 (마크다운)
 */
function generateContent(project: OldProject): string {
  let content = '';

  // 기본 설명
  if (project.description) {
    content += `${project.description}\n\n`;
  }

  // 주요 기능
  if (project.keyFeatures && project.keyFeatures.length > 0) {
    content += '## 주요 기능\n\n';
    project.keyFeatures.forEach(feature => {
      content += `### ${feature.title}\n${feature.description}\n\n`;
      if (feature.image) {
        content += `![${feature.title}](${convertImageUrl(feature.image)})\n\n`;
      }
    });
  }

  // 기술적 도전
  if (project.challenges && project.challenges.length > 0) {
    content += '## 기술적 도전과 해결\n\n';
    project.challenges.forEach(challenge => {
      content += `### ${challenge.title}\n`;
      content += `**문제**: ${challenge.description}\n\n`;
      content += `**해결**: ${challenge.solution}\n\n`;
    });
  }

  return content;
}

/**
 * 이미지 URL 변환
 * /images/pattern/xxx.png → https://project-portfolio-xxx.vercel.app/images/pattern/xxx.png
 */
function convertImageUrl(imagePath: string): string {
  const baseUrl = 'https://project-portfolio-gules.vercel.app';

  // 이미 전체 URL이면 그대로 반환
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // 상대 경로를 절대 URL로 변환
  return `${baseUrl}${imagePath}`;
}

/**
 * 기존 프로젝트 → CMS 프로젝트 변환
 */
function transformProject(oldProject: OldProject): CmsProject {
  return {
    title: oldProject.title,
    description: oldProject.subtitle,
    content: generateContent(oldProject),
    thumbnail: convertImageUrl(oldProject.image[0]),
    category: determineCategory(oldProject.techStack),
    featured: oldProject.showOnMain ?? false,
    tags: oldProject.techStack ?? [],
    tech_stack: oldProject.techStack ?? [],
    github_url: oldProject.links.github ?? null,
    demo_url: oldProject.links.live ?? null,
    duration: oldProject.period ?? oldProject.year,
    team_size: extractTeamSize(oldProject.client),
    role: summarizeRole(oldProject.responsibilities),
    achievements: oldProject.responsibilities?.slice(0, 5) ?? [],
    challenges: oldProject.challenges?.map(c => c.description) ?? [],
    solutions: oldProject.challenges?.map(c => c.solution) ?? [],
    images: oldProject.image.map(convertImageUrl),
  };
}

/**
 * 프로젝트 데이터 로드
 */
async function loadProjectsData(): Promise<OldProject[]> {
  const projectsPath = '/Users/semin/Downloads/--project/project-portfolio/src/data/projects.ts';

  console.log('📂 프로젝트 데이터 파일 읽는 중...');

  if (!fs.existsSync(projectsPath)) {
    console.error(`❌ 파일을 찾을 수 없습니다: ${projectsPath}`);
    process.exit(1);
  }

  // TypeScript 파일을 동적으로 import
  // 실제 사용 시 tsx로 실행하거나 빌드 필요
  const content = fs.readFileSync(projectsPath, 'utf-8');

  // 간단한 파싱 (실제로는 더 정교한 방법 필요)
  // 여기서는 JSON으로 변환된 데이터를 사용한다고 가정

  console.log('⚠️  주의: 실제 실행 시 프로젝트 데이터를 직접 import하거나 JSON으로 변환해야 합니다.');
  console.log('📝 지금은 스크립트 템플릿만 생성합니다.');

  return [];
}

/**
 * Supabase에 프로젝트 삽입
 */
async function insertProjects(projects: CmsProject[]) {
  console.log(`\n🚀 ${projects.length}개 프로젝트를 Supabase에 삽입 중...\n`);

  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];

    console.log(`[${i + 1}/${projects.length}] ${project.title} 삽입 중...`);

    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select();

    if (error) {
      console.error(`❌ 실패: ${project.title}`);
      console.error(error);
    } else {
      console.log(`✅ 성공: ${project.title}`);
    }
  }
}

/**
 * 메인 실행 함수
 */
async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   포트폴리오 프로젝트 마이그레이션   ║');
  console.log('╚════════════════════════════════════════╝\n');

  try {
    // 1. 기존 프로젝트 데이터 로드
    const oldProjects = await loadProjectsData();

    if (oldProjects.length === 0) {
      console.log('\n⚠️  스크립트 템플릿이 생성되었습니다.');
      console.log('\n📋 실제 마이그레이션을 위해서는:');
      console.log('1. 기존 프로젝트 데이터를 JSON 파일로 내보내기');
      console.log('2. 이 스크립트에서 JSON 파일을 읽도록 수정');
      console.log('3. npx tsx migration/import-projects.ts 실행\n');
      return;
    }

    // 2. 데이터 변환
    console.log('\n🔄 데이터 변환 중...');
    const cmsProjects = oldProjects.map(transformProject);

    // 3. 변환된 데이터 미리보기
    console.log('\n📊 변환된 프로젝트 미리보기:');
    cmsProjects.forEach((project, index) => {
      console.log(`\n${index + 1}. ${project.title}`);
      console.log(`   카테고리: ${project.category}`);
      console.log(`   팀 규모: ${project.team_size}명`);
      console.log(`   기술 스택: ${project.tech_stack.join(', ')}`);
      console.log(`   이미지: ${project.images.length}개`);
    });

    // 4. 사용자 확인
    console.log('\n\n❓ Supabase에 삽입하시겠습니까? (y/n)');
    console.log('⚠️  기존 데이터가 있다면 중복될 수 있습니다.');

    // 실제 실행 시 readline 사용
    // const confirmed = await confirmAction();
    // if (!confirmed) {
    //   console.log('\n❌ 취소되었습니다.');
    //   return;
    // }

    // 5. Supabase에 삽입
    // await insertProjects(cmsProjects);

    console.log('\n✅ 마이그레이션 완료!');

  } catch (error) {
    console.error('\n❌ 마이그레이션 실패:', error);
    process.exit(1);
  }
}

// 스크립트 실행
if (require.main === module) {
  main();
}

export { transformProject, convertImageUrl };
