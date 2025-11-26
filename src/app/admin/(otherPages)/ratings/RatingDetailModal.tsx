"use client";

import React, { useState, useEffect } from "react";
import { IRating, RatingStatus } from "@/types/rating";
import { Button } from "@/components/atoms/ui/Button";
import { Badge } from "@/components/atoms/ui/badge";
import { Star, X, Loader2, User, Package, Calendar, MessageSquare, Eye, EyeOff, Reply, Trash2 } from "lucide-react";
import {
  deleteAdminRating,
  addAdminReply,
  updateAdminReply,
  deleteAdminReply,
  updateRatingStatus
} from "@/services/admin-rating-api";
import { useToast } from "@/hooks/use-toast";

interface RatingDetailModalProps {
  rating: IRating | null;
  open: boolean;
  onClose: () => void;
  onRatingUpdate: (rating: IRating) => void;
  onRatingDelete: (ratingId: string) => void;
}

export default function RatingDetailModal({
  rating,
  open,
  onClose,
  onRatingUpdate,
  onRatingDelete,
}: RatingDetailModalProps) {
  const { toast } = useToast();
  const [status, setStatus] = useState<RatingStatus>("visible");
  const [replyContent, setReplyContent] = useState("");
  const [isEditingReply, setIsEditingReply] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isReplyLoading, setIsReplyLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (rating) {
      setStatus(rating.status || "visible");
      setReplyContent(rating.adminReply?.content || "");
      setIsEditingReply(false);
    }
  }, [rating]);

  if (!open || !rating) return null;

  const getUserName = (userId: IRating["userId"]): string => {
    if (typeof userId === "string") return userId;
    return userId?.fullname || "N/A";
  };

  const getUserEmail = (userId: IRating["userId"]): string => {
    if (typeof userId === "string") return "";
    return userId?.email || "";
  };

  const getLaptopName = (laptopId?: IRating["laptopId"]): string => {
    if (!laptopId) return "Đánh giá chung về đơn hàng";
    if (typeof laptopId === "string") return laptopId;
    return `${laptopId?.name} - ${laptopId?.modelName}` || "N/A";
  };

  const getLaptopImage = (laptopId?: IRating["laptopId"]): string | undefined => {
    if (!laptopId || typeof laptopId === "string") return undefined;
    return laptopId?.images?.[0]?.imageUrl;
  };

  const getOrderId = (orderId: IRating["orderId"]): string => {
    if (typeof orderId === "string") return orderId;
    return orderId?._id || "N/A";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getAdminName = (adminId: any): string => {
    if (typeof adminId === "string") return "Admin";
    return adminId?.fullname || "Admin";
  };

  const handleStatusToggle = async () => {
    if (!rating) return;

    const newStatus: RatingStatus = status === "visible" ? "hidden" : "visible";
    setIsUpdatingStatus(true);

    try {
      const updatedRating = await updateRatingStatus(rating._id, { status: newStatus });

      toast({
        title: "Thành công",
        description: `Đã ${newStatus === "hidden" ? "ẩn" : "hiện"} đánh giá`,
      });

      setStatus(newStatus);
      onRatingUpdate(updatedRating);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể cập nhật trạng thái",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAddOrUpdateReply = async () => {
    if (!rating || !replyContent.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập nội dung reply",
        variant: "destructive",
      });
      return;
    }

    setIsReplyLoading(true);
    try {
      const updatedRating = rating.adminReply
        ? await updateAdminReply(rating._id, { content: replyContent })
        : await addAdminReply(rating._id, { content: replyContent });

      toast({
        title: "Thành công",
        description: rating.adminReply ? "Cập nhật reply thành công" : "Thêm reply thành công",
      });

      onRatingUpdate(updatedRating);
      setIsEditingReply(false);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể thêm/cập nhật reply",
        variant: "destructive",
      });
    } finally {
      setIsReplyLoading(false);
    }
  };

  const handleDeleteReply = async () => {
    if (!rating || !rating.adminReply) return;
    if (!confirm("Bạn có chắc chắn muốn xóa reply này?")) return;

    setIsReplyLoading(true);
    try {
      const updatedRating = await deleteAdminReply(rating._id);

      toast({
        title: "Thành công",
        description: "Xóa reply thành công",
      });

      setReplyContent("");
      onRatingUpdate(updatedRating);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể xóa reply",
        variant: "destructive",
      });
    } finally {
      setIsReplyLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!rating) return;
    if (!confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) return;

    setIsDeleting(true);
    try {
      await deleteAdminRating(rating._id);
      toast({
        title: "Thành công",
        description: "Xóa đánh giá thành công!",
      });
      onRatingDelete(rating._id);
      onClose();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể xóa đánh giá",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const laptopImage = getLaptopImage(rating.laptopId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Chi tiết đánh giá</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Rating Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 ${
                      star <= rating.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-2xl font-bold ml-2">{rating.rating}/5</span>
              </div>
              <Badge variant={status === "visible" ? "default" : "secondary"}>
                {status === "visible" ? "Hiển thị" : "Đã ẩn"}
              </Badge>
            </div>

            {rating.comment && (
              <div className="bg-white rounded p-3 border">
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Nhận xét của khách hàng</p>
                    <p className="text-gray-700">{rating.comment}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-gray-400" />
              <span className="font-medium text-gray-500">Người dùng:</span>
              <span className="text-gray-900">{getUserName(rating.userId)}</span>
            </div>
            {getUserEmail(rating.userId) && (
              <div className="text-sm text-gray-500 ml-6">
                Email: {getUserEmail(rating.userId)}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4 text-gray-400" />
              <span className="font-medium text-gray-500">Sản phẩm:</span>
              <span className="text-gray-900">{getLaptopName(rating.laptopId)}</span>
            </div>
            {laptopImage && (
              <div className="ml-6">
                <img
                  src={laptopImage}
                  alt="Product"
                  className="h-20 w-20 object-cover rounded border"
                />
              </div>
            )}
          </div>

          {/* Order & Date Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-500">Đơn hàng:</span>
              <div className="font-mono text-blue-600 mt-1">
                #{getOrderId(rating.orderId).slice(-8)}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="font-medium text-gray-500">Ngày tạo:</span>
              </div>
              <div className="text-gray-900 mt-1">{formatDate(rating.createdAt)}</div>
            </div>
          </div>

          {/* Admin Reply Section */}
          <div className="border-t pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Reply className="h-5 w-5" />
                Trả lời đánh giá
              </h3>
            </div>

            {/* Existing Reply Display */}
            {rating.adminReply && !isEditingReply && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Admin Reply</Badge>
                    <span className="text-sm text-gray-600">
                      {getAdminName(rating.adminReply.adminId)} • {formatDate(rating.adminReply.repliedAt)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditingReply(true)}
                      disabled={isReplyLoading}
                    >
                      Sửa
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleDeleteReply}
                      disabled={isReplyLoading}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{rating.adminReply.content}</p>
              </div>
            )}

            {/* Reply Form */}
            {(!rating.adminReply || isEditingReply) && (
              <div className="space-y-3">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={4}
                  maxLength={2000}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập nội dung trả lời cho khách hàng (1-2000 ký tự)..."
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {replyContent.length}/2000 ký tự
                  </span>
                  <div className="flex gap-2">
                    {isEditingReply && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setReplyContent(rating.adminReply?.content || "");
                          setIsEditingReply(false);
                        }}
                        disabled={isReplyLoading}
                      >
                        Hủy
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={handleAddOrUpdateReply}
                      disabled={isReplyLoading || !replyContent.trim()}
                    >
                      {isReplyLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang lưu...
                        </>
                      ) : (
                        rating.adminReply ? "Cập nhật reply" : "Gửi reply"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Status Management */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Quản lý hiển thị</h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">
                  Trạng thái hiển thị: {status === "visible" ? "Đang hiển thị" : "Đã ẩn"}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {status === "visible"
                    ? "Đánh giá này đang hiển thị công khai cho khách hàng"
                    : "Đánh giá này đã bị ẩn và không hiển thị công khai"}
                </p>
              </div>
              <Button
                onClick={handleStatusToggle}
                disabled={isUpdatingStatus}
                variant={status === "visible" ? "outline" : "default"}
              >
                {isUpdatingStatus ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : status === "visible" ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Ẩn đánh giá
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Hiện đánh giá
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xóa...
              </>
            ) : (
              "Xóa đánh giá"
            )}
          </Button>

          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
}
