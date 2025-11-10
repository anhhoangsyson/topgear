'use client';

import { Star } from 'lucide-react';
import React from 'react';

interface RatingStarsProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export default function RatingStars({
  rating,
  size = 'md',
  showNumber = false,
  interactive = false,
  onRatingChange,
  className = '',
}: RatingStarsProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleStarClick = (starValue: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starValue);
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= rating;
        return (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              isFilled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={() => handleStarClick(star)}
          />
        );
      })}
      {showNumber && (
        <span className="ml-2 text-sm text-gray-600 font-medium">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

