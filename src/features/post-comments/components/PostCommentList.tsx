/**
 * PostCommentList Component
 *
 * 블로그 게시글 댓글 목록 컴포넌트
 */

import { useState } from 'react';
import { useGetPostCommentsQuery } from '../../../store/api/postCommentsApi';
import { PostCommentForm } from './PostCommentForm';
import type { PostComment } from '../../../store/types';

interface PostCommentListProps {
  postId: string;
  maxDepth?: number;
}

export const PostCommentList = ({ postId, maxDepth = 3 }: PostCommentListProps) => {
  const { data, isLoading, error, refetch } = useGetPostCommentsQuery(postId);

  /**
   * Loading Skeleton
   */
  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: '12px',
              padding: '16px 0',
              borderTop: '1px solid var(--border-color)',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--background-secondary)',
                flexShrink: 0,
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div
                style={{
                  width: '30%',
                  height: '14px',
                  background: 'var(--background-secondary)',
                  borderRadius: '4px',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
              <div
                style={{
                  width: '100%',
                  height: '48px',
                  background: 'var(--background-secondary)',
                  borderRadius: '4px',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
            </div>
          </div>
        ))}
        <style>
          {`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
          `}
        </style>
      </div>
    );
  }

  /**
   * Error State
   */
  if (error) {
    return (
      <div
        style={{
          padding: '32px',
          textAlign: 'center',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid #ef4444',
          borderRadius: '12px',
        }}
      >
        <p style={{ fontSize: '16px', color: '#ef4444', marginBottom: '12px' }}>
          댓글을 불러오는데 실패했습니다.
        </p>
        <button
          onClick={() => refetch()}
          style={{
            padding: '8px 16px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          다시 시도
        </button>
      </div>
    );
  }

  /**
   * Empty State
   */
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          padding: '48px 24px',
          textAlign: 'center',
          background: 'var(--background-secondary)',
          borderRadius: '12px',
        }}
      >
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          아직 댓글이 없습니다
        </p>
        <p style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>
          첫 번째 댓글을 작성해보세요!
        </p>
      </div>
    );
  }

  /**
   * 댓글 목록 렌더링
   */
  return (
    <div>
      {/* 댓글 개수 표시 */}
      <div
        style={{
          marginBottom: '16px',
          fontSize: '16px',
          fontWeight: '600',
          color: 'var(--text-primary)',
        }}
      >
        댓글 {data.length}개
      </div>

      {/* 댓글 트리 렌더링 */}
      <div>
        {data.map((comment) => (
          <CommentItem key={comment.id} comment={comment} postId={postId} depth={0} maxDepth={maxDepth} />
        ))}
      </div>
    </div>
  );
};

/**
 * CommentItem Component
 */
interface CommentItemProps {
  comment: PostComment;
  postId: string;
  depth: number;
  maxDepth: number;
}

const CommentItem = ({ comment, postId, depth, maxDepth }: CommentItemProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReplySuccess = () => {
    setShowReplyForm(false);
  };

  // 계층 구조 표시를 위한 스타일
  const isNested = depth > 0;
  const canReply = depth < maxDepth;

  return (
    <div
      style={{
        paddingLeft: isNested ? `${depth * 24}px` : '0',
        borderLeft: isNested ? '2px solid var(--border-color)' : 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '12px',
          padding: '16px 0',
          borderTop: '1px solid var(--border-color)',
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            flexShrink: 0,
          }}
        >
          {comment.author_name.charAt(0).toUpperCase()}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
              {comment.author_name}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
              {new Date(comment.created_at).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          {/* Body */}
          <p
            style={{
              fontSize: '14px',
              lineHeight: '1.6',
              color: 'var(--text-secondary)',
              marginBottom: '12px',
              wordBreak: 'break-word',
            }}
          >
            {comment.content}
          </p>

          {/* Actions */}
          {canReply && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              style={{
                fontSize: '13px',
                color: '#667eea',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 0',
                fontWeight: '500',
              }}
            >
              {showReplyForm ? '취소' : '답글'}
            </button>
          )}

          {/* Reply Form */}
          {showReplyForm && (
            <div style={{ marginTop: '12px' }}>
              <PostCommentForm
                postId={postId}
                parentId={comment.id}
                onSuccess={handleReplySuccess}
                onCancel={() => setShowReplyForm(false)}
                placeholder={`${comment.author_name}님에게 답글 작성...`}
                autoFocus
              />
            </div>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div>
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} postId={postId} depth={depth + 1} maxDepth={maxDepth} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostCommentList;
