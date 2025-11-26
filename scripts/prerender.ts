/**
 * Prerender 스크립트
 *
 * Puppeteer를 사용하여 빌드된 SPA를 정적 HTML로 렌더링합니다.
 * SEO 개선을 위해 주요 페이지들을 사전 렌더링합니다.
 *
 * 실행: yarn prerender
 */

import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import { createServer } from 'http';

const DIST_DIR = path.join(process.cwd(), 'dist');
const PORT = 5173;

// Prerender할 라우트 목록
const ROUTES = [
  '/',
  '/projects',
  '/blog',
  '/guestbook',
  '/404',
];

/**
 * 간단한 정적 파일 서버
 */
function createStaticServer(): Promise<ReturnType<typeof createServer>> {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      let filePath = path.join(DIST_DIR, req.url || '');

      // 디렉토리 요청이면 index.html 반환
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }

      // 파일이 없으면 index.html 반환 (SPA fallback)
      if (!fs.existsSync(filePath)) {
        filePath = path.join(DIST_DIR, 'index.html');
      }

      const ext = path.extname(filePath);
      const contentTypes: Record<string, string> = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
      };

      const contentType = contentTypes[ext] || 'application/octet-stream';

      try {
        const content = fs.readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      } catch (err) {
        res.writeHead(500);
        res.end('Server Error');
      }
    });

    server.listen(PORT, () => {
      console.log(`\n📦 정적 서버 시작: http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

/**
 * 페이지를 렌더링하고 HTML 저장
 */
async function renderPage(
  browser: puppeteer.Browser,
  route: string
): Promise<void> {
  const page = await browser.newPage();

  // 콘솔 로그 무시
  page.on('console', () => {});
  page.on('pageerror', () => {});

  const url = `http://localhost:${PORT}${route}`;

  try {
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    // React 앱이 완전히 렌더링될 때까지 대기
    await page.waitForSelector('#root > *', { timeout: 10000 });

    // 추가 대기 (애니메이션 등)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // HTML 가져오기
    const html = await page.content();

    // 파일 경로 결정
    let outputPath: string;
    if (route === '/') {
      outputPath = path.join(DIST_DIR, 'index.html');
    } else if (route === '/404') {
      outputPath = path.join(DIST_DIR, '404.html');
    } else {
      const dir = path.join(DIST_DIR, route);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      outputPath = path.join(dir, 'index.html');
    }

    fs.writeFileSync(outputPath, html, 'utf-8');
    console.log(`  ✓ ${route} → ${path.relative(DIST_DIR, outputPath)}`);
  } catch (error) {
    console.error(`  ✗ ${route} 렌더링 실패:`, error);
  } finally {
    await page.close();
  }
}

/**
 * 메인 함수
 */
async function main() {
  console.log('\n🚀 Prerender 시작...\n');

  // dist 폴더 확인
  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ dist 폴더가 없습니다. 먼저 빌드를 실행하세요.');
    process.exit(1);
  }

  // 정적 서버 시작
  const server = await createStaticServer();

  // Puppeteer 브라우저 시작
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  console.log(`\n📄 ${ROUTES.length}개 페이지 렌더링 중...\n`);

  // 각 라우트 렌더링
  for (const route of ROUTES) {
    await renderPage(browser, route);
  }

  // 정리
  await browser.close();
  server.close();

  console.log('\n✅ Prerender 완료!\n');
}

main().catch((err) => {
  console.error('Prerender 오류:', err);
  process.exit(1);
});
