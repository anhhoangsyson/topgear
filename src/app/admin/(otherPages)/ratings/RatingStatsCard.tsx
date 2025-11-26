"use client";

import React from "react";
import { IAdminRatingStats } from "@/types/rating";
import { Star, TrendingUp, BarChart3, Clock, CheckCircle, XCircle } from "lucide-react";

interface RatingStatsCardProps {
  stats: IAdminRatingStats | null;
  isLoading?: boolean;
}

export default function RatingStatsCard({ stats, isLoading }: RatingStatsCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <p className="text-gray-500 text-center">Không có dữ liệu thống kê</p>
      </div>
    );
  }

  const totalRatings = stats.totalRatings || 0;
  const averageRating = stats.averageRating || 0;
  const pendingCount = stats.byStatus?.pending || 0;
  const approvedCount = stats.byStatus?.approved || 0;
  const rejectedCount = stats.byStatus?.rejected || 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Thống kê đánh giá
        </h2>
      </div>

      <div className="p-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Total Ratings */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Tổng đánh giá</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{totalRatings}</p>
          </div>

          {/* Average Rating */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-900">Trung bình</span>
            </div>
            <div className="flex items-center gap-1">
              <p className="text-2xl font-bold text-yellow-600">{averageRating.toFixed(1)}</p>
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </div>
          </div>

          {/* Pending */}
          {/* <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Chờ duyệt</span>
            </div>
            <p className="text-2xl font-bold text-gray-600">{pendingCount}</p>
          </div> */}

          {/* Approved */}
          {/* <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-900">Đã duyệt</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
          </div> */}
        </div>

        {/* Rating Distribution */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Phân bố theo sao</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((starCount) => {
              const count = stats.byRating?.[starCount.toString()] || 0;
              const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;

              return (
                <div key={starCount} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium">{starCount}</span>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-yellow-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-16 text-right">
                    {count} ({percentage.toFixed(0)}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Summary */}
        {stats.byStatus && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Tình trạng duyệt</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600">{pendingCount}</p>
                <p className="text-xs text-gray-500 mt-1">Chờ duyệt</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
                <p className="text-xs text-gray-500 mt-1">Đã duyệt</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
                <p className="text-xs text-gray-500 mt-1">Từ chối</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
