"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import WrapModal from "@/components/common/WrapModal";
import UpdateAttributeForm from "@/app/admin/attributes/UpdateAttributeForm";
import { Switch } from "@/components/ui/switch";
import { GoPencil } from "react-icons/go";
import { toast } from "@/hooks/use-toast";

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
      const [isActive, setIsActive] = useState(attribute.isActive);
      const [isLoading, setIsLoading] = useState(false);

      const handleEditClick = () => {
        setIsModalOpen(true);
      }

      const handleCloseModal = () => {
        setIsModalOpen(false); // Đóng modal
      };

      const handleSwitchChange = async (checked: boolean) => {
        const url = checked
          ? `${process.env.NEXT_PUBLIC_API_URL_PROD}/attribute/active/${attribute._id}`
          : `${process.env.NEXT_PUBLIC_API_URL_PROD}/attribute/inactive/${attribute._id}`;
        try {
          setIsLoading(true);
          // Cập nhật trạng thái trên server (nếu cần)
          const response = await fetch(url, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ isActive: checked }),
          });

          if (!response.ok) {
            throw new Error("Failed to update attribute status");
          }

          // Cập nhật trạng thái trong UI
          setIsActive(checked);

          toast({
            title: "Cập nhật trạng thái thành công",
            description: `Trạng thái thuộc tính đã được cập nhật thành ${checked ? "hoạt động" : "không hoạt động"}`,
            variant: "default",
            duration: 2000,
          })
          console.log(`Attribute ${attribute._id} is now ${checked ? "active" : "inactive"}`);
        } catch (error) {
          console.error("Error updating attribute status:", error);
        }
        finally {
          setIsLoading(false);
        }
      };

      return (
        <>
          <div className="flex items-center gap-x-2">
            <Switch
              checked={isActive}
              id={`switch-${attribute._id}`}
              onCheckedChange={handleSwitchChange}
              disabled={isLoading}
            />
            {isLoading && (
              <div className="fixed z-50 w-screen h-screen inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
                <div className="loader border-t-transparent border-4 border-white rounded-full w-5 h-5 animate-spin"></div>
              </div>
            )}
            <Button
              variant={"destructive"}
              onClick={handleEditClick}
            >
              <GoPencil />
            </Button>
          </div>

          {/* // modal for update attribute */}
          <WrapModal isOpenModal={isModalOpen} onClose={handleCloseModal}>
            < UpdateAttributeForm
              attribute={attribute}
              onClose={handleCloseModal}
            />
          </WrapModal>
        </>
      );
    },
  },
];