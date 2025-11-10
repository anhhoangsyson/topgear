'use client';

import React, { useState } from 'react';
import { Button } from '@/components/atoms/ui/Button';
import { Textarea } from '@/components/atoms/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { createRating } from '@/services/rating-api';
import RatingStars from './RatingStars';
import { LoaderCircle } from 'lucide-react';

interface RatingFormProps {
  orderId: string;
  laptopId?: string | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function RatingForm({ orderId, laptopId, onSuccess, onCancel }: RatingFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating < 1 || rating > 5) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn số sao từ 1 đến 5',
        variant: 'destructive',
      });
      return;
    }

    if (comment.length > 1000) {
      toast({
        title: 'Lỗi',
        description: 'Đánh giá không được vượt quá 1000 ký tự',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await createRating({
        orderId,
        laptopId: laptopId || null,
        rating,
        comment: comment.trim() || undefined,
      });

      toast({
        title: 'Thành công',
        description: 'Đánh giá của bạn đã được gửi thành công!',
      });

      // Reset form
      setRating(0);
      setComment('');

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Không thể tạo đánh giá';
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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Đánh giá của bạn
        </label>
        <RatingStars
          rating={rating}
          size="lg"
          interactive
          onRatingChange={setRating}
          className="justify-center"
        />
        {rating > 0 && (
          <p className="text-center text-sm text-gray-500 mt-2">
            {rating}/5 sao
          </p>
        )}
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Nhận xét (tùy chọn)
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
          maxLength={1000}
          rows={4}
          className="resize-none"
        />
        <p className="text-xs text-gray-500 mt-1 text-right">
          {comment.length}/1000 ký tự
        </p>
      </div>

      <div className="flex gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="flex-1"
          >
            Hủy
          </Button>
        )}
        <Button
          type="submit"
          disabled={loading || rating < 1}
          className="flex-1"
        >
          {loading ? (
            <>
              <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
              Đang gửi...
            </>
          ) : (
            'Gửi đánh giá'
          )}
        </Button>
      </div>
    </form>
  );
}

