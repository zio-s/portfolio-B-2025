/**
 * SEO 컴포넌트
 *
 * react-helmet-async를 사용하여 페이지별 동적 메타 태그를 관리합니다.
 */

import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  /** 페이지 제목 */
  title?: string;
  /** 페이지 설명 */
  description?: string;
  /** 페이지 키워드 */
  keywords?: string;
  /** 페이지 URL (절대 경로) */
  url?: string;
  /** OG 이미지 URL (절대 경로) */
  image?: string;
  /** 페이지 타입 (website, article 등) */
  type?: 'website' | 'article';
  /** 작성자 */
  author?: string;
  /** 작성일 (ISO 8601 형식) */
  publishedTime?: string;
  /** 수정일 (ISO 8601 형식) */
  modifiedTime?: string;
}

const DEFAULT_SEO = {
  title: '변세민 | 프론트엔드 개발자 포트폴리오 | React, TypeScript',
  description: '프론트엔드 개발자 변세민의 포트폴리오입니다. React, TypeScript, Redux를 활용한 웹 애플리케이션 개발 프로젝트를 소개합니다.',
  keywords: '프론트엔드 개발자, Frontend Developer, React, TypeScript, Redux, 포트폴리오, 변세민, Semin Byun',
  url: 'https://semincode.com',
  image: 'https://semincode.com/android-chrome-512x512.png',
  type: 'website' as const,
  author: '변세민 (Semin Byun)',
};

export function SEO({
  title,
  description,
  keywords,
  url,
  image,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
}: SEOProps) {
  const seo = {
    title: title || DEFAULT_SEO.title,
    description: description || DEFAULT_SEO.description,
    keywords: keywords || DEFAULT_SEO.keywords,
    url: url || DEFAULT_SEO.url,
    image: image || DEFAULT_SEO.image,
    type: type || DEFAULT_SEO.type,
    author: author || DEFAULT_SEO.author,
  };

  return (
    <Helmet>
      {/* 기본 메타 태그 */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      <meta name="author" content={seo.author} />

      {/* Canonical URL */}
      <link rel="canonical" href={seo.url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={seo.type} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:locale" content="ko_KR" />

      {/* Article 타입인 경우 추가 메타 태그 */}
      {seo.type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {seo.type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {seo.type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seo.url} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
    </Helmet>
  );
}
