/**
 * 게시글 목록 페이지
 *
 * localStorage 기반 Redux store에서 실제 게시글 목록을 가져와 표시합니다.
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES, routeHelpers } from '../router/routes';
import {
  useAppDispatch,
  useAppSelector,
  fetchPosts,
  selectPosts,
  selectPostsLoading,
  selectPostsError,
  deletePost,
} from '../store';
import { MainLayout } from '@/components/layout/MainLayout';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SEO } from '@/components/common/SEO';
import {
  PenSquare,
  Loader2,
  AlertCircle,
  Calendar,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

const PostsPage = () => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectPosts);
  const loading = useAppSelector(selectPostsLoading);
  const error = useAppSelector(selectPostsError);

  // 컴포넌트 마운트 시 게시글 목록 조회
  useEffect(() => {
    dispatch(fetchPosts({}));
  }, [dispatch]);

  // 게시글 삭제 핸들러
  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`"${title}" 게시글을 삭제하시겠습니까?`)) {
      try {
        await dispatch(deletePost(id)).unwrap();
        alert('게시글이 삭제되었습니다');
        // 목록 새로고침
        dispatch(fetchPosts({}));
      } catch {
        alert('게시글 삭제에 실패했습니다');
      }
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
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

  return (
    <MainLayout>
      <SEO
        title="게시글 목록 | Blog"
        description="모든 블로그 게시글을 한눈에 확인하세요"
      />

      {/* Header */}
      <Section className="py-20 bg-gradient-to-b from-accent/5 to-transparent dark:from-accent/10">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">
                게시글 목록
              </h1>
              <p className="text-muted-foreground text-lg">
                전체 <span className="font-semibold text-accent">{posts.length}</span>개의 게시글
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Link to={ROUTES.POSTS_CREATE}>
                <Button size="lg" className="shadow-lg hover:shadow-xl transition-all group">
                  <PenSquare className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  새 게시글 작성
                </Button>
              </Link>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Loading State */}
      {loading && (
        <Section className="py-20">
          <Container>
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-accent mb-4" />
              <p className="text-muted-foreground">게시글을 불러오는 중...</p>
            </div>
          </Container>
        </Section>
      )}

      {/* Error State */}
      {error && (
        <Section className="py-20">
          <Container>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-xl bg-destructive/10 border border-destructive/30 text-center max-w-md mx-auto"
            >
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-3" />
              <p className="font-medium text-destructive mb-1">오류가 발생했습니다</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </motion.div>
          </Container>
        </Section>
      )}

      {/* Empty State */}
      {!loading && !error && posts.length === 0 && (
        <Section className="py-20">
          <Container>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <PenSquare className="w-12 h-12 text-accent" />
              </div>
              <h2 className="text-2xl font-bold mb-3">게시글이 없습니다</h2>
              <p className="text-muted-foreground mb-8">첫 번째 게시글을 작성해보세요!</p>
              <Link to={ROUTES.POSTS_CREATE}>
                <Button size="lg" variant="outline">
                  <PenSquare className="w-5 h-5 mr-2" />
                  첫 게시글 작성하기
                </Button>
              </Link>
            </motion.div>
          </Container>
        </Section>
      )}

      {/* Posts List */}
      {!loading && !error && posts.length > 0 && (
        <Section className="py-12">
          <Container>
            <div className="space-y-6">
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-card border border-border rounded-xl p-6 hover:border-accent/50 transition-all duration-300 hover:shadow-lg"
                >
                  {/* Header: Title & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <h3 className="flex-1">
                      <Link
                        to={routeHelpers.postDetail(post.id)}
                        className="text-2xl font-bold text-foreground hover:text-accent transition-colors group-hover:underline decoration-accent/30 underline-offset-4"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <Badge
                      variant="outline"
                      className={`${getStatusStyle(post.status)} px-3 py-1 text-xs font-semibold border shrink-0`}
                    >
                      {getStatusText(post.status)}
                    </Badge>
                  </div>

                  {/* Excerpt */}
                  <p className="text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm hover:bg-accent/20 transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer: Date & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-border">
                    {/* Date */}
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      {post.status === 'published' && post.publishedAt
                        ? `발행일: ${formatDate(post.publishedAt)}`
                        : `작성일: ${formatDate(post.createdAt)}`}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link to={routeHelpers.postDetail(post.id)}>
                        <Button variant="outline" size="sm" className="group/btn">
                          <Eye className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                          상세보기
                        </Button>
                      </Link>
                      <Link to={routeHelpers.postEdit(post.id)}>
                        <Button variant="outline" size="sm" className="group/btn">
                          <Edit className="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform" />
                          수정
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(post.id, post.title)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 group/btn"
                      >
                        <Trash2 className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                        삭제
                      </Button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </Container>
        </Section>
      )}
    </MainLayout>
  );
};

export default PostsPage;
