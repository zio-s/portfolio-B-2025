/**
 * Sitemap.xml 자동 생성 스크립트
 *
 * Supabase에서 프로젝트와 블로그 포스트를 가져와서
 * 최신 날짜로 sitemap.xml을 생성합니다.
 *
 * 실행: yarn generate-sitemap
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// .env.local 파일 로드
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const SITE_URL = 'https://semincode.com';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Error: Supabase 환경 변수가 설정되지 않았습니다.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

async function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];
  const urls: SitemapUrl[] = [];

  // 정적 페이지
  const staticPages: SitemapUrl[] = [
    { loc: '/', lastmod: today, changefreq: 'weekly', priority: 1.0 },
    { loc: '/projects', lastmod: today, changefreq: 'weekly', priority: 0.9 },
    { loc: '/blog', lastmod: today, changefreq: 'weekly', priority: 0.9 },
    { loc: '/guestbook', lastmod: today, changefreq: 'monthly', priority: 0.6 },
  ];
  urls.push(...staticPages);

  // Supabase에서 프로젝트 가져오기
  try {
    const { data: projects, error: projectError } = await supabase
      .from('projects')
      .select('id, updated_at')
      .eq('featured', true)
      .order('updated_at', { ascending: false });

    if (projectError) {
      console.warn('프로젝트 로드 실패:', projectError.message);
    } else if (projects) {
      for (const project of projects) {
        urls.push({
          loc: `/projects/${project.id}`,
          lastmod: project.updated_at?.split('T')[0] || today,
          changefreq: 'monthly',
          priority: 0.8,
        });
      }
      console.log(`✓ ${projects.length}개 프로젝트 추가`);
    }
  } catch (err) {
    console.warn('프로젝트 가져오기 오류:', err);
  }

  // Supabase에서 블로그 포스트 가져오기 (post_stats 뷰 사용)
  try {
    const { data: posts, error: postError } = await supabase
      .from('post_stats')
      .select('id, updated_at')
      .eq('status', 'published')
      .order('updated_at', { ascending: false });

    if (postError) {
      console.warn('블로그 포스트 로드 실패:', postError.message);
    } else if (posts) {
      for (const post of posts) {
        urls.push({
          loc: `/blog/${post.id}`,
          lastmod: post.updated_at?.split('T')[0] || today,
          changefreq: 'monthly',
          priority: 0.7,
        });
      }
      console.log(`✓ ${posts.length}개 블로그 포스트 추가`);
    }
  } catch (err) {
    console.warn('블로그 포스트 가져오기 오류:', err);
  }

  // XML 생성
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${SITE_URL}${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

  // 파일 저장
  const publicDir = path.join(process.cwd(), 'public');
  const sitemapPath = path.join(publicDir, 'sitemap.xml');

  fs.writeFileSync(sitemapPath, xml, 'utf-8');
  console.log(`\n✓ sitemap.xml 생성 완료: ${sitemapPath}`);
  console.log(`  총 ${urls.length}개 URL 포함`);
}

generateSitemap().catch((err) => {
  console.error('Sitemap 생성 오류:', err);
  process.exit(1);
});
