'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { IComment, ICommentListResponse } from '@/types/comment';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import { getCommentsByBlog } from '@/services/comment-api';
import { toast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { MessageSquare, LoaderCircle } from 'lucide-react';
import { buildNestedComments } from '@/lib/comment-utils';

interface BlogCommentsSectionProps {
  blogId: string;
}

export default function BlogCommentsSection({ blogId }: BlogCommentsSectionProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [refetchKey, setRefetchKey] = useState(0);

  const [flatComments, setFlatComments] = useState<IComment[]>([]);

  const fetchComments = async (page: number = 1) => {
    try {
      setLoading(true);
      const data: ICommentListResponse = await getCommentsByBlog(blogId, page, 20, true);
      setFlatComments(data.comments);
      setPagination({
        page: data.page,
        totalPages: data.totalPages,
        total: data.total,
      });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching comments:', error);
      }
      toast({
        title: 'Lỗi',
        description: 'Không thể tải bình luận. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Build nested structure from flat array
  const nestedComments = useMemo(() => {
    if (flatComments.length === 0) return [];
    return buildNestedComments(flatComments);
  }, [flatComments]);

  useEffect(() => {
    fetchComments(1);
  }, [blogId, refetchKey]);

  const handleCommentSuccess = () => {
    setRefetchKey((prev) => prev + 1);
    fetchComments(1); // Reset về trang đầu khi có comment mới
  };

  const handlePageChange = (page: number) => {
    fetchComments(page);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-blue-600" />
        Bình luận ({pagination.total})
      </h2>

      {/* Comment Form - Only show if logged in */}
      {session ? (
        <div className="mb-8">
          <CommentForm
            blogId={blogId}
            onSuccess={handleCommentSuccess}
            placeholder="Viết bình luận của bạn..."
          />
        </div>
      ) : (
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            Vui lòng{' '}
            <a href="/login" className="font-semibold underline hover:text-blue-900">
              đăng nhập
            </a>{' '}
            để bình luận
          </p>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <LoaderCircle className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <CommentList
          comments={nestedComments}
          blogId={blogId}
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          onUpdate={handleCommentSuccess}
        />
      )}
    </div>
  );
}

