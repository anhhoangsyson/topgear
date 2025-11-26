"use client";

import React, { useEffect, useState } from "react";
import { ratingColumns } from "./rating-columns";
import RatingDetailModal from "./RatingDetailModal";
import RatingStatsCard from "./RatingStatsCard";
import { DataTable } from "@/components/common/data-table";
import { IRating, IAdminRatingStats, RatingStatus } from "@/types/rating";
import { getAdminRatings, getAdminRatingStats } from "@/services/admin-rating-api";
import { useToast } from "@/hooks/use-toast";
import { Filter, RefreshCw } from "lucide-react";
import { Button } from "@/components/atoms/ui/Button";

export default function RatingsClient() {
  const { toast } = useToast();
  const [ratings, setRatings] = useState<IRating[]>([]);
  const [stats, setStats] = useState<IAdminRatingStats | null>(null);
  const [selectedRating, setSelectedRating] = useState<IRating | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<RatingStatus | "all">("all");
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const [hasReplyFilter, setHasReplyFilter] = useState<"all" | "replied" | "not_replied">("all");

  const fetchRatings = async () => {
    setIsLoading(true);
    try {
      const filters: any = {
        page: 1,
        limit: 100,
        sortBy: "createdAt:desc",
      };

      if (statusFilter !== "all") {
        filters.status = statusFilter;
      }

      if (ratingFilter !== "all") {
        filters.rating = ratingFilter;
      }

      const response = await getAdminRatings(filters);
      console.log(response);

      let filteredRatings = response.items || [];

      // Client-side filter for hasReply (since backend might not support this yet)
      if (hasReplyFilter === "replied") {
        filteredRatings = filteredRatings.filter((r) => !!r.adminReply);
      } else if (hasReplyFilter === "not_replied") {
        filteredRatings = filteredRatings.filter((r) => !r.adminReply);
      }

      setRatings(filteredRatings);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể tải danh sách đánh giá",
        variant: "destructive",
      });
      setRatings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    setIsStatsLoading(true);
    try {
      const statsData = await getAdminRatingStats();
      setStats(statsData);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể tải thống kê",
        variant: "destructive",
      });
      setStats(null);
    } finally {
      setIsStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
    fetchStats();
  }, [statusFilter, ratingFilter, hasReplyFilter]);

  const handleShowRatingDetail = (rating: IRating) => {
    setSelectedRating(rating);
    setShowModal(true);
  };

  const handleRatingUpdate = (updatedRating: IRating) => {
    setRatings((prev) =>
      prev.map((r) => (r._id === updatedRating._id ? updatedRating : r))
    );
    if (selectedRating?._id === updatedRating._id) {
      setSelectedRating(updatedRating);
    }
    // Refresh stats after update
    fetchStats();
  };

  const handleRatingDelete = (ratingId: string) => {
    setRatings((prev) => prev.filter((r) => r._id !== ratingId));
    fetchStats();
  };

  const handleRefresh = () => {
    fetchRatings();
    fetchStats();
  };

  return (
    <div className="container mx-auto py-6 sm:py-10 px-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Quản lý đánh giá
        </h1>
        <p className="text-gray-600 mb-4">
          Xem và quản lý tất cả đánh giá của khách hàng
        </p>
      </div>

      {/* Stats Card */}
      <div className="mb-6">
        <RatingStatsCard stats={stats} isLoading={isStatsLoading} />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Lọc:</span>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Hiển thị:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as RatingStatus | "all")}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả</option>
              <option value="visible">Hiển thị</option>
              <option value="hidden">Đã ẩn</option>
            </select>
          </div>

          {/* Rating Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Số sao:</label>
            <select
              value={ratingFilter}
              onChange={(e) =>
                setRatingFilter(
                  e.target.value === "all" ? "all" : Number(e.target.value)
                )
              }
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả</option>
              <option value="5">5 sao</option>
              <option value="4">4 sao</option>
              <option value="3">3 sao</option>
              <option value="2">2 sao</option>
              <option value="1">1 sao</option>
            </select>
          </div>

          {/* Reply Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Trả lời:</label>
            <select
              value={hasReplyFilter}
              onChange={(e) =>
                setHasReplyFilter(e.target.value as "all" | "replied" | "not_replied")
              }
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả</option>
              <option value="replied">Đã trả lời</option>
              <option value="not_replied">Chưa trả lời</option>
            </select>
          </div>

          <div className="ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Làm mới
            </Button>
          </div>
        </div>
      </div>

      {/* Ratings Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : ratings.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Không có đánh giá nào
          </div>
        ) : (
          <DataTable
            columns={ratingColumns(handleShowRatingDetail)}
            data={ratings}
            searchBy={"_id"}
          />
        )}
      </div>

      {/* Rating Detail Modal */}
      <RatingDetailModal
        rating={selectedRating}
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedRating(null);
        }}
        onRatingUpdate={handleRatingUpdate}
        onRatingDelete={handleRatingDelete}
      />
    </div>
  );
}
