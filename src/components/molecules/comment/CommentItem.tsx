'use client';

import React, { useState, useEffect } from 'react';
import { IComment } from '@/types/comment';
import { formatDate } from '@/lib/utils';
import { User, Reply, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/atoms/ui/Button';
import CommentForm from './CommentForm';
import { deleteComment } from '@/services/comment-api';
import { toast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { useUserId } from '@/hooks/useUserId';

interface CommentItemProps {
  comment: IComment;
  blogId: string;
  onUpdate: () => void;
  depth?: number;
  parentName?: string; // Name of parent comment if this is a reply
}

export default function CommentItem({ comment, blogId, onUpdate, depth = 0, parentName }: CommentItemProps) {
  const { data: session } = useSession();
  const userId = useUserId();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const user = typeof comment.user_id === 'object' ? comment.user_id : null;
  
  // Check if comment belongs to current user
  const commentUserId = user?._id || (typeof comment.user_id === 'string' ? comment.user_id : null);
  // Explicitly convert to boolean to avoid null
  const isMyComment = Boolean(userId && commentUserId && userId === commentUserId);
  
  // Debug nested replies
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && comment.replies) {
      console.log('Comment replies:', {
        commentId: comment._id,
        repliesCount: comment.replies?.length || 0,
        replies: comment.replies,
      });
    }
  }, [comment.replies, comment._id]);
  
  // Debug ownership check
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && session) {
      const userInfo = typeof comment.user_id === 'object' ? {
        _id: comment.user_id._id,
        fullname: comment.user_id.fullname,
      } : comment.user_id;
      
      const match = userId && commentUserId && userId === commentUserId;
      
      console.log(`[CommentItem] Ownership check for "${comment.name}" (${comment._id.slice(-8)}):`, {
        'Current User ID': userId || '❌ Not logged in',
        'Comment Owner ID': commentUserId || '❌ Unknown',
        'Match': match ? '✅ YES' : '❌ NO',
        'Can Edit/Delete': match ? '✅ YES' : '❌ NO',
        'User Info': userInfo,
      });
    }
  }, [session, comment._id, userId, commentUserId, isMyComment, comment.name, comment.user_id]);
  const maxDepth = 1; // Only 2 levels: parent (0) and replies (1)

  // Get blog_id from comment (can be object or string)
  const commentBlogId = typeof comment.blog_id === 'object' 
    ? comment.blog_id._id 
    : comment.blog_id || blogId;

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteComment(comment._id);
      toast({
        title: 'Thành công',
        description: 'Đã xóa bình luận',
      });
      onUpdate();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Không thể xóa bình luận';
      toast({
        title: 'Lỗi',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReplySuccess = () => {
    setShowReplyForm(false);
    onUpdate();
  };

  const handleEditSuccess = () => {
    setShowEditForm(false);
    onUpdate();
  };

  // Check if this is a reply
  const isReply = depth > 0;

  return (
    <div className={`relative ${isReply ? 'ml-8 sm:ml-12' : ''}`}>
      {/* Visual connection line for replies */}
      {isReply && (
        <>
          {/* Vertical line connecting to parent */}
          <div className="absolute -left-4 sm:-left-6 top-0 bottom-0 w-0.5 bg-blue-300"></div>
          {/* Horizontal line connecting to parent */}
          <div className="absolute -left-4 sm:-left-6 top-6 w-4 sm:w-6 h-0.5 bg-blue-300"></div>
        </>
      )}
      
      <div className={`bg-white rounded-lg p-4 border transition-all ${
        isReply 
          ? 'border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50/50 to-white shadow-sm' 
          : 'border-gray-200 hover:shadow-md'
      }`}>
        {/* Comment Header */}
        <div className="flex items-start gap-3 mb-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.fullname || 'User'}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    `;
                  }
                }}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-400" />
              </div>
            )}
          </div>

          {/* Comment Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="font-semibold text-gray-900">{comment.name}</p>
                  {isReply && parentName && (
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full flex items-center gap-1">
                      <Reply className="w-3 h-3" />
                      <span>Trả lời <span className="font-medium">{parentName}</span></span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {formatDate(comment.createdAt)}
                </p>
              </div>
              {!comment.isApproved && (
                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full flex-shrink-0">
                  Chờ duyệt
                </span>
              )}
            </div>

            {/* Comment Content */}
            {!showEditForm ? (
              <div className="text-gray-700 whitespace-pre-wrap mb-3">
                {comment.content}
              </div>
            ) : (
              <div className="mb-3">
                <CommentForm
                  blogId={commentBlogId}
                  parentId={null}
                  onSuccess={handleEditSuccess}
                  onCancel={() => setShowEditForm(false)}
                  editMode={true}
                  initialName={comment.name}
                  initialContent={comment.content}
                  commentId={comment._id}
                />
              </div>
            )}

            {/* Comment Images */}
            {comment.images && comment.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {comment.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Comment image ${idx + 1}`}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ))}
              </div>
            )}

            {/* Actions */}
            {!showEditForm && (
              <div className="flex items-center gap-3">
                {session && depth < maxDepth && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    <Reply className="w-4 h-4 mr-1" />
                    Phản hồi
                  </Button>
                )}
                {isMyComment && (
                  <>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowEditForm(true)}
                      className="text-sm text-gray-600 hover:text-blue-600"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Sửa
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      {isDeleting ? 'Đang xóa...' : 'Xóa'}
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Reply Form */}
        {showReplyForm && session && (() => {
          if (process.env.NODE_ENV === 'development') {
            console.log('Reply form - Comment blog_id:', comment.blog_id, 'Extracted blogId:', commentBlogId, 'Parent ID:', comment._id);
          }
          return (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <CommentForm
                blogId={commentBlogId}
                parentId={comment._id}
                onSuccess={handleReplySuccess}
                onCancel={() => setShowReplyForm(false)}
                replyTo={comment.name}
                placeholder={`Phản hồi ${comment.name}...`}
              />
            </div>
          );
        })()}

        {/* Replies - Only show if this is a top-level comment (depth 0) */}
        {depth === 0 && comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-3 font-medium flex items-center gap-1.5">
              <Reply className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-blue-600">{comment.replies.length} phản hồi</span>
            </div>
            <div className="space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  blogId={commentBlogId}
                  onUpdate={onUpdate}
                  depth={1}
                  parentName={comment.name}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

