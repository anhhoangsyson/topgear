'use client';

import React, { useState } from 'react';
import { IRating } from '@/types/rating';
import RatingStars from './RatingStars';
import { formatDate } from '@/lib/utils';
import { User } from 'lucide-react';

interface RatingListProps {
  ratings: IRating[];
  showLaptopInfo?: boolean;
}

function UserAvatarRatingItem({ 
  rating, 
  user, 
  laptop, 
  showLaptopInfo 
}: { 
  rating: IRating; 
  user: { _id: string; fullname: string; email: string; avatar?: string } | null;
  laptop: { _id: string; name: string; modelName: string; images?: Array<{ imageUrl: string }> } | null;
  showLaptopInfo: boolean;
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          {user?.avatar && !imageError ? (
            <img
              src={user.avatar}
              alt={user.fullname || 'User'}
              width={40}
              height={40}
              className="rounded-full object-cover w-10 h-10"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-400" />
            </div>
          )}
        </div>

        {/* Rating Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <p className="font-semibold text-gray-900">
                {user?.fullname || 'Người dùng ẩn danh'}
              </p>
              {showLaptopInfo && laptop && (
                <p className="text-sm text-gray-600 mt-1">
                  Đánh giá cho: {laptop.name}
                </p>
              )}
            </div>
            <div className="text-right">
              <RatingStars rating={rating.rating} size="sm" />
              <p className="text-xs text-gray-500 mt-1">
                {formatDate(rating.createdAt)}
              </p>
            </div>
          </div>

          {rating.comment && (
            <p className="text-gray-700 text-sm mt-2 whitespace-pre-wrap">
              {rating.comment}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RatingList({ ratings, showLaptopInfo = false }: RatingListProps) {
  if (ratings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Chưa có đánh giá nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {ratings.map((rating) => {
        const user = typeof rating.userId === 'object' ? rating.userId : null;
        const laptop = typeof rating.laptopId === 'object' ? rating.laptopId : null;

        return (
          <UserAvatarRatingItem 
            key={rating._id}
            rating={rating}
            user={user}
            laptop={laptop}
            showLaptopInfo={showLaptopInfo}
          />
        );
      })}
    </div>
  );
}
