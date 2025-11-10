'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/atoms/ui/Button';
import RatingList from '@/components/molecules/rating/RatingList';
import RatingStats from '@/components/molecules/rating/RatingStats';
import { getRatingsByLaptop, getLaptopRatingStats } from '@/services/rating-api';
import { IRating, IRatingStats } from '@/types/rating';
import { Star, LoaderCircle } from 'lucide-react';
// Note: Rating form requires orderId, so it should be accessed from order detail page

interface LaptopRatingSectionProps {
  laptopId: string;
}

export default function LaptopRatingSection({ laptopId }: LaptopRatingSectionProps) {
  const [ratings, setRatings] = useState<IRating[]>([]);
  const [stats, setStats] = useState<IRatingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setLoading(true);
        const [ratingsData, statsData] = await Promise.all([
          getRatingsByLaptop(laptopId, page, 10),
          getLaptopRatingStats(laptopId),
        ]);

        setRatings(ratingsData.ratings);
        setTotalPages(ratingsData.totalPages);
        setStats(statsData);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching ratings:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    if (laptopId) {
      fetchRatings();
    }
  }, [laptopId, page]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <h2 className="text-xl font-semibold text-gray-900">Đánh giá sản phẩm</h2>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Để đánh giá sản phẩm, vui lòng vào trang chi tiết đơn hàng đã hoàn thành của bạn.
        </p>
      </div>

      {/* Rating Stats */}
      {stats && (
        <div className="mb-8 pb-8 border-b">
          <RatingStats stats={stats} />
        </div>
      )}

      {/* Ratings List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <LoaderCircle className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Đánh giá ({stats?.count || 0})
            </h3>
            <RatingList ratings={ratings} showLaptopInfo={false} />
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Trước
              </Button>
              <span className="text-sm text-gray-600">
                Trang {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Sau
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

