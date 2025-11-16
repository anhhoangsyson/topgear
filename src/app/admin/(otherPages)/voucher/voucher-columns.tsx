"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useState } from "react";
import WrapModal from "@/components/common/WrapModal";
import { GoPencil } from "react-icons/go";
import { toast } from "@/hooks/use-toast";
import { IVoucher } from "@/types";
import { formatDate } from "@/lib/utils";
import UpdateVoucherForm from "./UpdateVoucherForm";
import { Button } from "@/components/atoms/ui/Button";
import { Switch } from "@/components/atoms/ui/switch";
import OverlayLoader from "@/components/atoms/feedback/OverlayLoader";
import { voucherApi } from "@/services/voucher-api";
import { Badge } from "@/components/atoms/ui/badge";

export const voucherColumns: ColumnDef<IVoucher>[] = [
  {
    accessorKey: "_id",
    header: "ID",
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Mã voucher
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("code") || <span className="text-gray-400">Auto</span>}
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Loại",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <Badge variant={type === "code" ? "default" : "secondary"}>
          {type === "code" ? "Mã giảm giá" : "Tự động"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "pricePercent",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Giảm giá
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center font-semibold text-green-600">
        {row.getValue("pricePercent")}%
      </div>
    ),
  },
  {
    accessorKey: "priceOrigin",
    header: "Đơn tối thiểu",
    cell: ({ row }) => {
      const price = row.getValue("priceOrigin") as number;
      return (
        <div className="text-right">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(price)}
        </div>
      );
    },
  },
  {
    accessorKey: "expiredDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Ngày hết hạn
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const expiredDate = new Date(row.getValue("expiredDate"));
      const isExpired = expiredDate < new Date();
      return (
        <div className={isExpired ? "text-red-500" : ""}>
          {formatDate(expiredDate.toISOString())}
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
      >
        Ngày tạo
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{formatDate(row.getValue("createdAt"))}</div>,
  },
  {
    id: "actions",
    header: "Trạng thái | Hành động",
    enableHiding: false,
    cell: ({ row }) => {
      const voucher = row.original;

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [isModalOpen, setIsModalOpen] = useState(false);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [isActive, setIsActive] = useState(voucher.status === "active");
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [isLoading, setIsLoading] = useState(false);

      const handleEditClick = () => {
        setIsModalOpen(true);
      };

      const handleCloseModal = () => {
        setIsModalOpen(false);
      };

      const handleSwitchChange = async (checked: boolean) => {
        const newStatus = checked ? "active" : "inactive";
        try {
          setIsLoading(true);
          await voucherApi.toggleVoucherStatus(voucher._id, newStatus);

          setIsActive(checked);

          toast({
            title: "Cập nhật trạng thái thành công",
            description: `Trạng thái voucher đã được cập nhật thành ${
              checked ? "hoạt động" : "không hoạt động"
            }`,
            variant: "default",
            duration: 2000,
          });
        } catch (error) {
          console.error("Error updating voucher status:", error);
          toast({
            title: "Lỗi",
            description: "Không thể cập nhật trạng thái voucher",
            variant: "destructive",
            duration: 2000,
          });
        } finally {
          setIsLoading(false);
        }
      };

      return (
        <>
          <div className="flex items-center gap-x-2">
            <Switch
              checked={isActive}
              id={`switch-${voucher._id}`}
              onCheckedChange={handleSwitchChange}
              disabled={isLoading}
            />

            <Button variant="destructive" onClick={handleEditClick}>
              <GoPencil />
            </Button>
          </div>

          <WrapModal isOpenModal={isModalOpen} onClose={handleCloseModal}>
            <UpdateVoucherForm voucher={voucher} onClose={handleCloseModal} />
          </WrapModal>

          {isLoading && <OverlayLoader />}
        </>
      );
    },
  },
];
