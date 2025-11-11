/**
 * 게시글 상세 페이지
 *
 * Supabase 기반 RTK Query로 게시글 상세 정보를 가져옵니다.
 * 조회수 자동 증가, 좋아요, 댓글 기능을 포함합니다.
 */

import { useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { ROUTES, routeHelpers } from '../router/routes';
import {
  useAppSelector,
  selectUser,
  useGetPostByIdQuery,
  useDeletePostMutation,
  useToggleLikeMutation,
  useIncrementViewMutation,
} from '../store';
import { MainLayout } from '@/components/layout/MainLayout';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SEO } from '@/components/common/SEO';
import { PostCommentList } from '@/features/post-comments/components/PostCommentList';
import { PostCommentForm } from '@/features/post-comments/components/PostCommentForm';
import { useAlertModal } from '@/components/modal/hooks';
import {
  ArrowLeft,
  Calendar,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  Clock,
  Heart,
  MessageCircle,
  Eye,
} from 'lucide-react';

const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showAlert } = useAlertModal();

  const user = useAppSelector(selectUser);

  // 어드민 권한 확인: 로그인한 사용자
  const isAdmin = !!user;
  const backPath = '/blog';

  // RTK Query hooks
  const { data: post, isLoading: loading, error } = useGetPostByIdQuery(id || '', {
    skip: !id,
  });
  const [deletePostMutation] = useDeletePostMutation();
  const [toggleLike] = useToggleLikeMutation();
  const [incrementView] = useIncrementViewMutation();

  // 조회수 자동 증가 (페이지 진입 시 1회만)
  useEffect(() => {
    if (id) {
      incrementView(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // id가 변경될 때만 실행 (post 제거로 중복 호출 방지)

  // 게시글 삭제
  const handleDelete = async () => {
    if (!id || !post) return;

    if (window.confirm(`"${post.title}" 게시글을 삭제하시겠습니까?`)) {
      try {
        await deletePostMutation(id).unwrap();
        showAlert({
          title: '완료',
          message: '게시글이 삭제되었습니다',
          type: 'success',
          onConfirm: () => {
            navigate(backPath);
          },
        });
      } catch {
        showAlert({
          title: '오류',
          message: '게시글 삭제에 실패했습니다',
          type: 'error',
        });
      }
    }
  };

  // 좋아요 토글
  const handleLike = async () => {
    if (!id) return;
    try {
      await toggleLike(id).unwrap();
    } catch {
      console.error('좋아요 처리 실패');
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 상태 뱃지 스타일
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
      case 'draft':
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
      case 'archived':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
      default:
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    }
  };

  // 상태 텍스트
  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return '발행됨';
      case 'draft':
        return '임시저장';
      case 'archived':
        return '보관됨';
      default:
        return status;
    }
  };

  // 로딩 상태
  if (loading) {
    return (
      <MainLayout>
        <Section className="py-20">
          <Container>
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-accent mb-4" />
              <p className="text-muted-foreground">게시글을 불러오는 중...</p>
            </div>
          </Container>
        </Section>
      </MainLayout>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <MainLayout>
        <Section className="py-20">
          <Container>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto"
            >
              <div className="p-6 rounded-xl bg-destructive/10 border border-destructive/30 mb-6">
                <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-3" />
                <p className="font-medium text-destructive mb-1 text-center">오류가 발생했습니다</p>
                <p className="text-sm text-muted-foreground text-center">
                  {'data' in error ? (error.data as any)?.message : '게시글을 불러올 수 없습니다'}
                </p>
              </div>
              <Link to={backPath}>
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  목록으로 돌아가기
                </Button>
              </Link>
            </motion.div>
          </Container>
        </Section>
      </MainLayout>
    );
  }

  // 게시글이 없는 경우
  if (!post) {
    return (
      <MainLayout>
        <Section className="py-20">
          <Container>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 max-w-md mx-auto"
            >
              <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-12 h-12 text-accent" />
              </div>
              <h2 className="text-2xl font-bold mb-3">게시글을 찾을 수 없습니다</h2>
              <p className="text-muted-foreground mb-8">삭제되었거나 존재하지 않는 게시글입니다</p>
              <Link to={backPath}>
                <Button size="lg">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  목록으로 돌아가기
                </Button>
              </Link>
            </motion.div>
          </Container>
        </Section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SEO
        title={`${post.title} | Blog`}
        description={post.excerpt}
      />

      {/* Back Button */}
      <Section className="pt-8 pb-4">
        <Container>
          <Link to={backPath}>
            <Button variant="ghost" className="group -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              목록으로 돌아가기
            </Button>
          </Link>
        </Container>
      </Section>

      {/* Article */}
      <Section className="py-8">
        <Container>
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <header className="mb-12">
              {/* Title & Status */}
              <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-4xl md:text-5xl font-bold leading-tight flex-1">
                    {post.title}
                  </h1>
                  {isAdmin && (
                    <Badge
                      variant="outline"
                      className={`${getStatusStyle(post.status)} px-3 py-1.5 text-xs font-semibold border shrink-0`}
                    >
                      {getStatusText(post.status)}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pb-8 border-b border-border">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {post.status === 'published' && post.publishedAt
                    ? `발행일: ${formatDate(post.publishedAt)}`
                    : `작성일: ${formatDate(post.createdAt)}`}
                </div>
                {post.updatedAt !== post.createdAt && (
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    수정일: {formatDate(post.updatedAt)}
                  </div>
                )}
              </div>

              {/* Excerpt */}
              {post.excerpt && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-8 p-6 bg-accent/5 dark:bg-accent/10 border-l-4 border-accent rounded-r-lg"
                >
                  <p className="text-lg text-muted-foreground italic leading-relaxed">
                    {post.excerpt}
                  </p>
                </motion.div>
              )}
            </header>

            {/* Content - Markdown Rendered */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="prose prose-lg dark:prose-invert max-w-none mb-12
                prose-headings:font-bold prose-headings:tracking-tight
                prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-12
                prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-10
                prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-8
                prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                prose-code:text-accent prose-code:bg-accent/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-['']
                prose-pre:bg-card prose-pre:border prose-pre:border-border prose-pre:shadow-lg
                prose-blockquote:border-l-accent prose-blockquote:bg-accent/5 prose-blockquote:py-1
                prose-ul:my-4 prose-ol:my-4
                prose-li:my-2
                prose-img:rounded-xl prose-img:shadow-lg
                prose-hr:border-border prose-hr:my-12
                prose-table:border-collapse prose-table:border prose-table:border-border
                prose-th:bg-accent/10 prose-th:border prose-th:border-border prose-th:p-3
                prose-td:border prose-td:border-border prose-td:p-3"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {post.content}
              </ReactMarkdown>
            </motion.div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="pt-8 border-t border-border mb-8"
              >
                <h3 className="text-sm font-semibold text-muted-foreground mb-4">태그</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium hover:bg-accent/20 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="pt-8 border-t border-border"
            >
              <div className="flex items-center gap-6">
                {/* Like Button */}
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleLike}
                  className={`gap-2 transition-all ${
                    post.is_liked
                      ? 'text-red-500 border-red-500/50 hover:bg-red-50 dark:hover:bg-red-950'
                      : 'hover:text-red-500 hover:border-red-500/50'
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 transition-all ${
                      post.is_liked ? 'fill-current' : ''
                    }`}
                  />
                  <span className="font-semibold">{post.likes_count || 0}</span>
                </Button>

                {/* Comments Count */}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.comments_count || 0}개의 댓글</span>
                </div>

                {/* Views Count */}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.views_count || 0}회 조회</span>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex gap-3 pt-8 border-t border-border"
              >
                <Link to={routeHelpers.blogEdit(post.id)} className="flex-1">
                  <Button variant="outline" className="w-full group">
                    <Edit className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                    수정
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  onClick={handleDelete}
                  className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10 group"
                >
                  <Trash2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  삭제
                </Button>
              </motion.div>
            )}
          </motion.article>
        </Container>
      </Section>

      {/* Comments Section */}
      <Section className="py-12 bg-accent/5 dark:bg-accent/10">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-accent" />
              댓글
            </h2>

            {/* Comment Form */}
            <div className="mb-8">
              <PostCommentForm
                postId={id!}
                onSuccess={() => {
                  // Comments will auto-refresh via RTK Query
                }}
                placeholder="댓글을 작성해주세요..."
              />
            </div>

            {/* Comment List */}
            <PostCommentList postId={id!} />
          </motion.div>
        </Container>
      </Section>
    </MainLayout>
  );
};

export default PostDetailPage;
