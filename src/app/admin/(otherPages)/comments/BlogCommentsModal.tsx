'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/atoms/ui/dialog';
import { IComment } from '@/types/comment';
import { getCommentsByBlog } from '@/services/comment-api';
import { LoaderCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface BlogCommentsModalProps {
  open: boolean;
  onClose: () => void;
  blogId: string;
  blogTitle?: string;
  blogSlug?: string;
  highlightedCommentId?: string;
}

export default function BlogCommentsModal({
  open,
  onClose,
  blogId,
  blogTitle,
  blogSlug,
  highlightedCommentId,
}: BlogCommentsModalProps) {
  const [comments, setComments] = useState<IComment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && blogId) {
      fetchComments();
    }
  }, [open, blogId]);

  // Scroll to highlighted comment when modal opens
  useEffect(() => {
    if (open && highlightedCommentId && comments.length > 0) {
      setTimeout(() => {
        const element = document.getElementById(`comment-${highlightedCommentId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [open, highlightedCommentId, comments]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await getCommentsByBlog(blogId, 1, 100, true);
      setComments(data.comments);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching comments:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {blogTitle || 'Blog Comments'}
          </DialogTitle>
          {blogSlug && (
            <p className="text-sm text-gray-500">/{blogSlug}</p>
          )}
        </DialogHeader>

        <div className="mt-4">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoaderCircle className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <div className="space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Chưa có bình luận nào cho blog này.</p>
                </div>
              ) : (
                comments.map((comment) => {
                  const isHighlighted = comment._id === highlightedCommentId;
                  return (
                    <div
                      id={`comment-${comment._id}`}
                      key={comment._id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isHighlighted
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          {typeof comment.user_id === 'object' && comment.user_id.avatar ? (
                            <img
                              src={comment.user_id.avatar}
                              alt={comment.user_id.fullname || 'User'}
                              className="w-10 h-10 rounded-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400 text-sm">
                                {comment.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-semibold text-gray-900">{comment.name}</p>
                              {typeof comment.user_id === 'object' && comment.user_id.email && (
                                <p className="text-xs text-gray-500">{comment.user_id.email}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">
                                {formatDate(comment.createdAt)}
                              </p>
                              {isHighlighted && (
                                <span className="inline-block mt-1 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                                  Đang xem
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-700 whitespace-pre-wrap mb-2">
                            {comment.content}
                          </p>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                comment.isApproved
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {comment.isApproved ? 'Đã duyệt' : 'Chờ duyệt'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

