/**
 * S3 Upload Service
 *
 * 이미지 및 동영상 파일을 S3에 업로드하고 CloudFront URL 반환
 */

import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, BUCKET_NAME, CLOUDFRONT_URL } from '@/lib/s3Client';

export interface UploadResult {
  url: string;
  key: string;
  type: 'image' | 'video';
}

/**
 * 파일을 S3에 업로드하고 CloudFront URL 반환
 */
export const uploadToS3 = async (
  file: File,
  folder: 'images' | 'videos' = 'images'
): Promise<UploadResult> => {
  try {
    // 파일 확장자 추출
    const extension = file.name.split('.').pop();

    // 고유한 파일명 생성 (타임스탬프 + 랜덤 문자열)
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const key = `${folder}/${timestamp}-${randomString}.${extension}`;

    // Content-Type 결정
    const contentType = file.type || (
      folder === 'videos' ? 'video/mp4' : 'image/jpeg'
    );

    // S3 업로드 명령
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
      // 캐시 제어 (1년)
      CacheControl: 'public, max-age=31536000, immutable',
    });

    await s3Client.send(command);

    // CloudFront URL 생성
    const url = `${CLOUDFRONT_URL}/${key}`;

    return {
      url,
      key,
      type: folder === 'videos' ? 'video' : 'image',
    };
  } catch (error) {
    console.error('S3 upload failed:', error);
    throw new Error('파일 업로드에 실패했습니다.');
  }
};

/**
 * 여러 파일을 동시에 업로드
 */
export const uploadMultipleFiles = async (
  files: File[],
  folder: 'images' | 'videos' = 'images'
): Promise<UploadResult[]> => {
  const uploadPromises = files.map((file) => uploadToS3(file, folder));
  return Promise.all(uploadPromises);
};

/**
 * S3에서 파일 삭제 (선택사항 - 관리자 기능)
 */
export const deleteFromS3 = async (key: string): Promise<void> => {
  // TODO: DeleteObjectCommand 구현
  console.log('Delete file:', key);
};
