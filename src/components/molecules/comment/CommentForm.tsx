'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/atoms/ui/Button';
import { Textarea } from '@/components/atoms/ui/textarea';
import { Input } from '@/components/atoms/ui/input';
import { toast } from '@/hooks/use-toast';
import { createComment, updateComment } from '@/services/comment-api';
import { LoaderCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useUserInfo } from '@/hooks/useUserInfo';

interface CommentFormProps {
  blogId: string;
  parentId?: string | null;
  onSuccess?: () => void;
  onCancel?: () => void;
  placeholder?: string;
  replyTo?: string; // Tên người đang reply
  editMode?: boolean; // Nếu true, đây là form edit
  initialName?: string; // Tên ban đầu khi edit
  initialContent?: string; // Nội dung ban đầu khi edit
  commentId?: string; // ID comment khi edit
}

export default function CommentForm({
  blogId,
  parentId = null,
  onSuccess,
  onCancel,
  placeholder,
  replyTo,
  editMode = false,
  initialName = '',
  initialContent = '',
  commentId,
}: CommentFormProps) {
  const { data: session } = useSession();
  const { userInfo, loading: userInfoLoading } = useUserInfo();
  const [name, setName] = useState(editMode ? initialName : '');
  const [content, setContent] = useState(editMode ? initialContent : '');
  const [loading, setLoading] = useState(false);

  // Auto-fill name from userInfo when available
  useEffect(() => {
    if (!editMode && !name && userInfo?.fullname) {
      setName(userInfo.fullname);
    }
  }, [userInfo, editMode, name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập tên của bạn',
        variant: 'destructive',
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập nội dung bình luận',
        variant: 'destructive',
      });
      return;
    }

    if (name.length > 100) {
      toast({
        title: 'Lỗi',
        description: 'Tên không được vượt quá 100 ký tự',
        variant: 'destructive',
      });
      return;
    }

    if (content.length > 2000) {
      toast({
        title: 'Lỗi',
        description: 'Nội dung bình luận không được vượt quá 2000 ký tự',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      if (editMode && commentId) {
        // Update existing comment
        await updateComment(commentId, {
          name: name.trim(),
          content: content.trim(),
        });

        toast({
          title: 'Thành công',
          description: 'Đã cập nhật bình luận!',
        });
      } else {
        // Create new comment
        const commentData = {
          name: name.trim(),
          content: content.trim(),
          blog_id: blogId,
          parent_id: parentId || null,
        };

        if (process.env.NODE_ENV === 'development') {
          console.log('Creating comment with data:', {
            ...commentData,
            blogId_received: blogId,
            parentId_received: parentId,
          });
        }

        await createComment(commentData);

        toast({
          title: 'Thành công',
          description: parentId ? 'Phản hồi của bạn đã được gửi!' : 'Bình luận của bạn đã được gửi!',
        });
      }

      // Reset form
      if (!editMode) {
        setContent('');
        if (!session?.user?.name) {
          setName('');
        }
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Không thể gửi bình luận';
      toast({
        title: 'Lỗi',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {replyTo && (
        <div className="text-sm text-gray-600 mb-2">
          Đang phản hồi <span className="font-semibold">{replyTo}</span>
        </div>
      )}

      {editMode && (
        <div className="text-sm text-blue-600 mb-2 font-medium">
          Chỉnh sửa bình luận
        </div>
      )}
      
      {!userInfo?.fullname && !editMode && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên của bạn <span className="text-red-500">*</span>
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={userInfoLoading ? "Đang tải..." : "Nhập tên của bạn"}
            maxLength={100}
            disabled={loading || userInfoLoading}
            required
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nội dung bình luận <span className="text-red-500">*</span>
        </label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder || 'Nhập bình luận của bạn...'}
          maxLength={2000}
          rows={4}
          className="resize-none"
          disabled={loading}
          required
        />
        <p className="text-sm text-gray-500 mt-1 text-right">
          {content.length}/2000 ký tự
        </p>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Hủy
          </Button>
        )}
        <Button type="submit" disabled={loading || !name.trim() || !content.trim()}>
          {loading ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Đang {editMode ? 'cập nhật' : 'gửi'}...
            </>
          ) : (
            editMode ? 'Cập nhật' : (parentId ? 'Gửi phản hồi' : 'Gửi bình luận')
          )}
        </Button>
      </div>
    </form>
  );
}

