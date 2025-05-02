"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import WrapModal from "@/components/common/WrapModal";
import UpdateAttributeForm from "@/app/admin/attributes/UpdateAttributeForm";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

export type AttributeRes = {
  _id: string;
  attributeName: string;
  categoryIds: string[];
  isActive: boolean;
  categoryNames: string[];
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<AttributeRes>[] = [
  {
    accessorKey: "_id",
    header: "ID",
  },
  {
    accessorKey: "attributeName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Tên thuộc tính
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "categoryNames",
    header: "Danh mục",
    cell: ({ row }) => (
      <div>{(row.getValue("categoryNames") as string[])?.join(", ") || "Không có danh mục"}</div>
    ),
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
    cell: ({ row }) => (
      <div>{new Date(row.getValue("createdAt")).toLocaleDateString()}</div>
    ),
  },
  {
    id: "actions",
    header: "Hành động",
    enableHiding: false,
    cell: ({ row }) => {
      const attribute = row.original;

      const [isModalOpen, setIsModalOpen] = useState(false);
      const [selectedAttribute, setSelectedAttribute] = useState<AttributeRes | null>(null);

      const handleEditClick = () => {
        setSelectedAttribute(attribute);
        setIsModalOpen(true);
      }

      const handleActiveClick = async (id: string) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PROD}/attribute/active/${id}`, {
          method: "PUT",
        })

        if (!res.ok) {
          toast({
            title: "Cập nhật thuộc tính thất bại",
            description: "Có lỗi xảy ra khi cập nhật thuộc tính",
            variant: "destructive",
            duration: 2000,
          })

        }

        toast({
          title: "Cập nhật thuộc tính thành công",
          description: "Đã cập nhật thuộc tính thành công",
          variant: "default",
          duration: 2000,
        })

      }

      const handleInActiveClick = async (id: string) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PROD}/attribute/inactive/${id}`, {
          method: "PUT",
        })

        if (!res.ok) {
          toast({
            title: "Cập nhật thuộc tính thất bại",
            description: "Có lỗi xảy ra khi cập nhật thuộc tính",
            variant: "destructive",
            duration: 2000,
          })

        }

        toast({
          title: "Cập nhật thuộc tính thành công",
          description: "Đã cập nhật thuộc tính thành công",
          variant: "default",
          duration: 2000,
        })
      }



      return (
        <>
          <div className="flex items-center gap-x-2">
            <Switch
              onChange={(e) => { console.log(e.target) }}
              id="airplane-mode" />
            <Button
              variant={"destructive"}
              onClick={handleEditClick}
            >
              Sửa
            </Button>
          </div>

          {/* // modal for update attribute */}
          <WrapModal isOpenModal={isModalOpen}>
            <UpdateAttributeForm
              attribute={selectedAttribute}
              onClose={() => setIsModalOpen(false)}
            />
          </WrapModal>
        </>
      );
    },
  },
];