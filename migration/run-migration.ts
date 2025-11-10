/**
 * 마이그레이션 실행 스크립트
 *
 * 사용법:
 * npm install tsx dotenv @supabase/supabase-js
 * npx tsx migration/run-migration.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
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

// 기존 프로젝트 타입
interface OldProject {
  id: string;
  showOnMain?: boolean;
  title: string;
  subtitle: string;
  description?: string;
  year: string;
  client: string;
  image: string[];
  period?: string;
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

// CMS 프로젝트 타입
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
 * 이미지 URL 변환
 */
function convertImageUrl(imagePath: string): string {
  const baseUrl = 'https://project-portfolio-gules.vercel.app';

  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  return `${baseUrl}${imagePath}`;
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

  if (stack.some(t => ['react', 'next.js', 'next', 'vue'].includes(t))) {
    return 'Frontend Development';
  }
  if (stack.some(t => ['node', 'express', 'django'].includes(t))) {
    return 'Backend Development';
  }
  return 'Web Development';
}

/**
 * 역할 요약
 */
function summarizeRole(responsibilities: string[] = []): string {
  if (responsibilities.length === 0) {
    return 'Full-stack Developer';
  }

  const firstTwo = responsibilities.slice(0, 2).join('. ');
  return firstTwo.length > 200 ? firstTwo.substring(0, 197) + '...' : firstTwo;
}

/**
 * 상세 콘텐츠 생성 (마크다운)
 */
function generateContent(project: OldProject): string {
  let content = '';

  if (project.description) {
    content += `${project.description}\n\n`;
  }

  // 주요 기능
  if (project.keyFeatures && project.keyFeatures.length > 0) {
    content += '## 주요 기능\n\n';
    project.keyFeatures.forEach(feature => {
      content += `### ${feature.title}\n${feature.description}\n\n`;
      if (feature.image) {
        const imageUrl = convertImageUrl(feature.image);
        if (feature.type === 'video') {
          content += `🎥 [영상 보기](${imageUrl})\n\n`;
        } else {
          content += `![${feature.title}](${imageUrl})\n\n`;
        }
      }
    });
  }

  // 기술적 도전
  if (project.challenges && project.challenges.length > 0) {
    content += '## 기술적 도전과 해결\n\n';
    project.challenges.forEach(challenge => {
      content += `### ${challenge.title}\n\n`;
      content += `**문제**: ${challenge.description}\n\n`;
      content += `**해결**: ${challenge.solution}\n\n`;
    });
  }

  return content;
}

/**
 * 프로젝트 변환
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
 * 메인 함수
 */
async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   포트폴리오 프로젝트 마이그레이션   ║');
  console.log('╚════════════════════════════════════════╝\n');

  try {
    // 1. JSON 파일 읽기
    const jsonPath = './migration/projects-data.json';
    console.log('📂 프로젝트 데이터 로드 중...');

    if (!fs.existsSync(jsonPath)) {
      console.error(`❌ 파일을 찾을 수 없습니다: ${jsonPath}`);
      process.exit(1);
    }

    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const oldProjects: OldProject[] = JSON.parse(rawData);

    console.log(`✅ ${oldProjects.length}개 프로젝트 로드 완료\n`);

    // 2. 데이터 변환
    console.log('🔄 데이터 변환 중...\n');
    const cmsProjects = oldProjects.map(transformProject);

    // 3. 변환된 데이터 미리보기
    console.log('📊 변환된 프로젝트:\n');
    cmsProjects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title}`);
      console.log(`   카테고리: ${project.category}`);
      console.log(`   팀 규모: ${project.team_size}명`);
      console.log(`   기술 스택: ${project.tech_stack.join(', ')}`);
      console.log(`   이미지: ${project.images.length}개`);
      console.log(`   Featured: ${project.featured ? '✅' : '❌'}\n`);
    });

    // 4. Supabase에 삽입
    console.log('\n🚀 Supabase에 데이터 삽입 중...\n');

    for (let i = 0; i < cmsProjects.length; i++) {
      const project = cmsProjects[i];

      console.log(`[${i + 1}/${cmsProjects.length}] ${project.title} 삽입 중...`);

      const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select();

      if (error) {
        console.error(`❌ 실패: ${project.title}`);
        console.error(error.message);
      } else {
        console.log(`✅ 성공: ${project.title}`);
      }
    }

    console.log('\n✅ 마이그레이션 완료!');
    console.log('\n📍 다음 단계:');
    console.log('1. Supabase 대시보드에서 데이터 확인');
    console.log('2. CMS 프론트엔드에서 프로젝트 목록 확인');
    console.log('3. 이미지 URL이 제대로 작동하는지 테스트\n');

  } catch (error) {
    console.error('\n❌ 마이그레이션 실패:', error);
    process.exit(1);
  }
}

// 실행
main();
