'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/atoms/ui/Button';
import { IComment } from '@/types/comment';
import { formatDate } from '@/lib/utils';
import { CheckCircle, XCircle, Eye, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/atoms/ui/badge';

export function commentColumns(
  onApprove: (commentId: string) => void,
  onReject: (commentId: string) => void,
  onBlogClick?: (blogId: string, blogTitle: string, blogSlug: string, commentId: string) => void
): ColumnDef<IComment>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Tên người dùng',
      cell: ({ row }) => {
        const comment = row.original;
        const user = typeof comment.user_id === 'object' ? comment.user_id : null;
        return (
          <div className="flex items-center gap-2">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.fullname || 'User'}
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-gray-400" />
              </div>
            )}
            <div>
              <p className="font-medium text-gray-900">{comment.name}</p>
              {user?.email && (
                <p className="text-xs text-gray-500">{user.email}</p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'content',
      header: 'Nội dung',
      cell: ({ row }) => {
        const content = row.getValue('content') as string;
        return (
          <div className="max-w-md">
            <p className="text-sm text-gray-700 line-clamp-2">
              {content}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: 'blog_id',
      header: 'Blog',
      cell: ({ row }) => {
        const comment = row.original;
        const blog = typeof comment.blog_id === 'object' ? comment.blog_id : null;
        const blogId = typeof comment.blog_id === 'object' ? comment.blog_id._id : comment.blog_id;
        
        if (!blog) {
          return <span className="text-gray-400">-</span>;
        }

        return (
          <button
            onClick={() => {
              if (onBlogClick && blogId) {
                onBlogClick(blogId, blog.title, blog.slug, comment._id);
              }
            }}
            className="text-left hover:text-blue-600 transition-colors cursor-pointer"
          >
            <p className="font-medium text-gray-900 text-sm hover:underline">{blog.title}</p>
            <p className="text-xs text-gray-500">/{blog.slug}</p>
          </button>
        );
      },
    },
    {
      accessorKey: 'isApproved',
      header: 'Trạng thái',
      cell: ({ row }) => {
        const isApproved = row.getValue('isApproved') as boolean;
        return (
          <Badge variant={isApproved ? 'default' : 'secondary'}>
            {isApproved ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Đã duyệt
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3 mr-1" />
                Chờ duyệt
              </>
            )}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Ngày tạo',
      cell: ({ row }) => {
        return (
          <p className="text-sm text-gray-600">
            {formatDate(row.getValue('createdAt'))}
          </p>
        );
      },
    },
    {
      id: 'actions',
      header: 'Hành động',
      enableHiding: false,
      cell: ({ row }) => {
        const comment = row.original;
        const isApproved = comment.isApproved;

        return (
          <div className="flex items-center gap-2">
            {!isApproved ? (
              <Button
                variant="default"
                size="sm"
                onClick={() => onApprove(comment._id)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Duyệt
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReject(comment._id)}
                className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Từ chối
              </Button>
            )}
          </div>
        );
      },
    },
  ];
}

