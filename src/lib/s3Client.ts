/**
 * AWS S3 Client Configuration
 *
 * S3 버킷에 파일 업로드 및 CloudFront를 통한 배포
 */

import { S3Client } from '@aws-sdk/client-s3';

// S3 클라이언트 초기화
export const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION || 'ap-northeast-2',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '',
  },
});

export const BUCKET_NAME = import.meta.env.VITE_AWS_BUCKET || 'portfolio-semin-media';
export const CLOUDFRONT_URL = import.meta.env.VITE_CLOUDFRONT_URL || '';
