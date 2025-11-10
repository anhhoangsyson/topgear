'use client';

import React from 'react';
import { IComment } from '@/types/comment';
import CommentItem from './CommentItem';
import Panigation from '@/components/common/Panigation';

interface CommentListProps {
  comments: IComment[];
  blogId: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onUpdate?: () => void;
}

export default function CommentList({
  comments,
  blogId,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onUpdate,
}: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg mb-2">Chưa có bình luận nào</p>
        <p className="text-sm">Hãy là người đầu tiên bình luận!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          blogId={blogId}
          onUpdate={onUpdate || (() => {})}
          depth={0}
        />
      ))}

      {/* Pagination */}
      {totalPages > 1 && onPageChange && (
        <div className="mt-8 flex justify-center">
          <Panigation
            totalPages={totalPages}
            page={currentPage}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}

