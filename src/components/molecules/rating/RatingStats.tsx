'use client';

import React from 'react';
import { IRatingStats } from '@/types/rating';
import RatingStars from './RatingStars';
import { Progress } from '@/components/atoms/ui/progress';

interface RatingStatsProps {
  stats: IRatingStats;
  className?: string;
}

export default function RatingStats({ stats, className = '' }: RatingStatsProps) {
  const { average, count, distribution } = stats;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Overall Rating */}
      <div className="flex items-center gap-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900">{average.toFixed(1)}</div>
          <RatingStars rating={average} size="md" showNumber={false} />
          <p className="text-sm text-gray-500 mt-1">{count} đánh giá</p>
        </div>

        {/* Distribution */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const dist = distribution.find((d) => d.rating === star);
            const percentage = dist ? (dist.count / count) * 100 : 0;
            
            return (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-4">{star}</span>
                <StarIcon className="w-4 h-4 text-yellow-400" />
                <Progress value={percentage} className="flex-1 h-2" />
                <span className="text-sm text-gray-500 w-12 text-right">
                  {dist?.count || 0}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

