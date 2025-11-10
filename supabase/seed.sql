-- ============================================
-- Portfolio CMS Seed Data
-- Phase 8-2: Initial Test Data
-- ============================================

-- ============================================
-- 1. ADMIN USER
-- ============================================
-- Password: admin123 (bcrypt hash)
-- NOTE: This is a TEST password. Change it in production!
INSERT INTO admin_users (email, password_hash, name) VALUES
  ('admin@example.com', '$2a$10$X8nQXJZ2lNJ3zH7yXKqLQu9YvJ.1rK8Y3VmZjLQX9K8YvJ.1rK8Y3V', 'Admin User')
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- 2. SAMPLE PROJECTS
-- ============================================
INSERT INTO projects (
  title,
  description,
  thumbnail,
  category,
  featured,
  tags,
  tech_stack,
  github_url,
  demo_url,
  duration,
  team_size,
  role,
  achievements,
  challenges,
  solutions,
  images
) VALUES
  (
    'E-Commerce Platform',
    'Modern e-commerce platform with React and Node.js featuring real-time inventory management and payment integration.',
    'https://images.unsplash.com/photo-1557821552-17105176677c?w=800',
    'Web Development',
    true,
    ARRAY['React', 'Node.js', 'MongoDB', 'Stripe'],
    ARRAY['React 19', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Stripe API'],
    'https://github.com/example/ecommerce',
    'https://demo.example.com',
    '2023.01 - 2023.06',
    4,
    'Full-stack Developer',
    ARRAY['처리 속도 40% 향상', '사용자 만족도 95%', '월 거래액 1억원 달성'],
    ARRAY['대용량 트래픽 처리', '결제 시스템 안정성', '실시간 재고 동기화'],
    ARRAY['Redis 캐싱 도입', 'MSA 아키텍처 전환', 'WebSocket 실시간 통신'],
    ARRAY[
      'https://images.unsplash.com/photo-1557821552-17105176677c?w=800',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'
    ]
  ),
  (
    'Real-time Chat Application',
    'WebSocket-based real-time chat with file sharing, video calls, and end-to-end encryption.',
    'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=800',
    'Web Development',
    true,
    ARRAY['WebSocket', 'React', 'WebRTC'],
    ARRAY['React', 'Socket.io', 'WebRTC', 'Node.js', 'PostgreSQL'],
    'https://github.com/example/chat',
    'https://chat.example.com',
    '2023.07 - 2023.10',
    3,
    'Frontend Lead',
    ARRAY['동시 접속자 10,000명 지원', '99.9% 가동률', '평균 응답시간 100ms'],
    ARRAY['실시간 통신 최적화', '파일 전송 속도', '보안 강화'],
    ARRAY['WebSocket 클러스터링', 'CDN 활용', 'E2E 암호화 구현'],
    ARRAY[
      'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=800',
      'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800'
    ]
  ),
  (
    'AI Image Generator',
    'AI-powered image generation tool using Stable Diffusion with custom training capabilities.',
    'https://images.unsplash.com/photo-1547954575-855750c57bd3?w=800',
    'AI/ML',
    true,
    ARRAY['AI', 'Python', 'TensorFlow'],
    ARRAY['Python', 'FastAPI', 'TensorFlow', 'React', 'AWS'],
    'https://github.com/example/ai-image',
    'https://ai-image.example.com',
    '2023.11 - 2024.02',
    5,
    'ML Engineer',
    ARRAY['생성 품질 30% 향상', '처리 시간 50% 단축', '일 사용자 5,000명'],
    ARRAY['모델 최적화', '대용량 GPU 관리', '비용 절감'],
    ARRAY['모델 경량화', 'GPU 스케줄링', 'S3 스토리지 최적화'],
    ARRAY[
      'https://images.unsplash.com/photo-1547954575-855750c57bd3?w=800',
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800'
    ]
  ),
  (
    'Mobile Fitness App',
    'Cross-platform fitness tracking app with workout plans, nutrition tracking, and social features.',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
    'Mobile',
    false,
    ARRAY['React Native', 'Firebase', 'HealthKit'],
    ARRAY['React Native', 'TypeScript', 'Firebase', 'Redux', 'HealthKit API'],
    'https://github.com/example/fitness',
    'https://apps.apple.com/fitness',
    '2024.03 - 2024.06',
    4,
    'Mobile Developer',
    ARRAY['앱스토어 평점 4.8', '다운로드 100,000+', '일 활성 사용자 15,000명'],
    ARRAY['배터리 최적화', '오프라인 동기화', '플랫폼 간 호환성'],
    ARRAY['백그라운드 작업 최적화', 'SQLite 로컬 DB', '플랫폼별 네이티브 모듈'],
    ARRAY[
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800'
    ]
  ),
  (
    'DevOps Dashboard',
    'Comprehensive DevOps monitoring dashboard with CI/CD pipeline visualization and alerting.',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    'DevOps',
    false,
    ARRAY['Docker', 'Kubernetes', 'Prometheus'],
    ARRAY['React', 'TypeScript', 'Docker', 'Kubernetes', 'Prometheus', 'Grafana'],
    'https://github.com/example/devops',
    null,
    '2024.07 - 2024.09',
    3,
    'DevOps Engineer',
    ARRAY['배포 시간 70% 단축', '장애 감지 시간 90% 감소', '시스템 가동률 99.95%'],
    ARRAY['멀티 클라우드 모니터링', '알림 최적화', '비용 가시화'],
    ARRAY['통합 메트릭 수집', 'Slack 연동', 'CloudWatch 통합'],
    ARRAY[
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'
    ]
  );

-- ============================================
-- 3. SAMPLE COMMENTS
-- ============================================
-- Get first project ID
DO $$
DECLARE
  first_project_id UUID;
  second_project_id UUID;
  first_comment_id UUID;
BEGIN
  -- Get project IDs
  SELECT id INTO first_project_id FROM projects WHERE title = 'E-Commerce Platform';
  SELECT id INTO second_project_id FROM projects WHERE title = 'Real-time Chat Application';

  -- Insert top-level comments
  INSERT INTO comments (project_id, author_name, author_email, author_avatar, content)
  VALUES
    (first_project_id, 'John Doe', 'john@example.com', 'https://i.pravatar.cc/150?img=1', '정말 인상적인 프로젝트네요! 특히 실시간 재고 동기화 부분이 흥미롭습니다.'),
    (first_project_id, 'Jane Smith', 'jane@example.com', 'https://i.pravatar.cc/150?img=2', 'Redis 캐싱 도입으로 40% 성능 향상을 이루신 부분이 대단하네요. 구체적인 아키텍처가 궁금합니다.'),
    (second_project_id, 'Mike Johnson', 'mike@example.com', 'https://i.pravatar.cc/150?img=3', 'WebSocket 클러스터링 구현 방법이 궁금합니다. 자세한 글 부탁드립니다!'),
    (second_project_id, 'Sarah Lee', 'sarah@example.com', 'https://i.pravatar.cc/150?img=4', '동시 접속자 10,000명 지원은 어떻게 구현하셨나요?');

  -- Get first comment ID for reply
  SELECT id INTO first_comment_id FROM comments WHERE author_name = 'John Doe' LIMIT 1;

  -- Insert reply
  INSERT INTO comments (project_id, parent_id, author_name, author_email, author_avatar, content)
  VALUES
    (first_project_id, first_comment_id, 'Portfolio Owner', 'admin@example.com', 'https://i.pravatar.cc/150?img=5', '감사합니다! 곧 상세한 기술 블로그 포스트를 작성할 예정입니다.');
END $$;

-- ============================================
-- 4. UPDATE STATS (simulate some activity)
-- ============================================
UPDATE projects SET views = 1250, likes = 89 WHERE title = 'E-Commerce Platform';
UPDATE projects SET views = 890, likes = 67 WHERE title = 'Real-time Chat Application';
UPDATE projects SET views = 2340, likes = 156 WHERE title = 'AI Image Generator';
UPDATE projects SET views = 560, likes = 45 WHERE title = 'Mobile Fitness App';
UPDATE projects SET views = 340, likes = 28 WHERE title = 'DevOps Dashboard';

UPDATE comments SET likes = 5 WHERE author_name = 'John Doe';
UPDATE comments SET likes = 3 WHERE author_name = 'Jane Smith';
UPDATE comments SET likes = 8 WHERE author_name = 'Mike Johnson';
UPDATE comments SET likes = 2 WHERE author_name = 'Sarah Lee';

-- ============================================
-- SEED DATA COMPLETE
-- ============================================
-- Run this AFTER schema.sql
-- ============================================
