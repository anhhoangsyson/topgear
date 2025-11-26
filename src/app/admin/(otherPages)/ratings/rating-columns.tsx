"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye, Star, EyeOff, MessageCircle } from "lucide-react";
import { IRating } from "@/types/rating";
import { Button } from "@/components/atoms/ui/Button";
import { Badge } from "@/components/atoms/ui/badge";

const getStatusBadgeVariant = (status?: string) => {
  switch (status) {
    case "visible":
      return "default";
    case "hidden":
      return "secondary";
    default:
      return "secondary";
  }
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

const getUserName = (userId: IRating['userId']): string => {
  if (typeof userId === 'string') return userId;
  return userId?.fullname || 'N/A';
};

const getUserEmail = (userId: IRating['userId']): string => {
  if (typeof userId === 'string') return '';
  return userId?.email || '';
};

const getLaptopName = (laptopId?: IRating['laptopId']): string => {
  if (!laptopId) return 'N/A';
  if (typeof laptopId === 'string') return laptopId;
  return laptopId?.name || 'N/A';
};

const getOrderId = (orderId: IRating['orderId']): string => {
  if (typeof orderId === 'string') return orderId;
  return orderId?._id || 'N/A';
};

export function ratingColumns(
  onShowRatingDetail: (rating: IRating) => void
): ColumnDef<IRating>[] {
  return [
    {
      accessorKey: "_id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          <span className="font-semibold">Mã</span>
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-mono text-xs font-semibold text-blue-600">
          #{row.getValue("_id")?.toString().slice(-8)}
        </div>
      ),
    },
    {
      accessorKey: "userId",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          <span className="font-semibold">Người dùng</span>
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const rating = row.original;
        return (
          <div className="flex flex-col gap-1">
            <span className="font-medium">{getUserName(rating.userId)}</span>
            <span className="text-xs text-gray-500">{getUserEmail(rating.userId)}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "laptopId",
      header: "Sản phẩm",
      cell: ({ row }) => {
        const rating = row.original;
        return (
          <div className="text-sm">
            {getLaptopName(rating.laptopId)}
          </div>
        );
      },
    },
    {
      accessorKey: "rating",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          <Star className="mr-2 h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">Đánh giá</span>
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const rating = row.getValue("rating") as number;
        return (
          <div className="flex items-center gap-1">
            <span className="font-semibold text-lg">{rating}</span>
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        );
      },
    },
    {
      accessorKey: "comment",
      header: "Nhận xét",
      cell: ({ row }) => {
        const comment = row.getValue("comment") as string | undefined;
        const rating = row.original;
        const hasReply = !!rating.adminReply;

        return (
          <div className="max-w-xs">
            <div className="truncate text-sm">
              {comment || <span className="text-gray-400 italic">Không có</span>}
            </div>
            {hasReply && (
              <div className="flex items-center gap-1 mt-1">
                <MessageCircle className="h-3 w-3 text-blue-500" />
                <span className="text-xs text-blue-600">Đã trả lời</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          <span className="font-semibold">Hiển thị</span>
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string | undefined;
        const isVisible = status === 'visible';

        return (
          <div className="flex items-center gap-2">
            {isVisible ? (
              <Eye className="h-4 w-4 text-green-600" />
            ) : (
              <EyeOff className="h-4 w-4 text-gray-400" />
            )}
            <Badge variant={getStatusBadgeVariant(status)} className="text-xs">
              {isVisible ? 'Hiển thị' : 'Đã ẩn'}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "orderId",
      header: "Đơn hàng",
      cell: ({ row }) => {
        const rating = row.original;
        return (
          <div className="font-mono text-xs">
            #{getOrderId(rating.orderId).slice(-8)}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          <span className="font-semibold">Ngày tạo</span>
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as string;
        return <div className="text-sm">{formatDate(date)}</div>;
      },
    },
    {
      id: "actions",
      header: "Hành động",
      enableHiding: false,
      cell: ({ row }) => {
        const rating = row.original;
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onShowRatingDetail(rating)}
            className="h-8"
          >
            <Eye className="h-4 w-4 mr-1" />
            Chi tiết
          </Button>
        );
      },
    },
  ];
}
