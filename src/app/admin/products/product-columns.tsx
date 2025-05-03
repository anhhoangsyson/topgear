"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import WrapModal from "@/components/common/WrapModal";
import UpdateAttributeForm from "@/app/admin/attributes/UpdateAttributeForm";
import { Switch } from "@/components/ui/switch";
import { ProductsRes } from "@/types/Res/Product";


export const productsColumns: ColumnDef<ProductsRes>[] = [
  {
    accessorKey: "_id",
    header: "ID",
  },
  {
    accessorKey: "productName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Dòng sản phẩm
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "categoryName",
    header: "Danh mục",
    cell: ({ row }) => (
      <div>{(row.getValue("categoryName") as string) || "Không có danh mục"}</div>
    ),
  },
  {
    id: "actions",
    header: "Hành động",
    enableHiding: false,
    cell: ({ row }) => {
      const attribute = row.original;

      const [isModalOpen, setIsModalOpen] = useState(false);
      const [selectedAttribute, setSelectedAttribute] = useState<ProductsRes | null>(null);

      const handleEditClick = () => {
        setSelectedAttribute(attribute);
        setIsModalOpen(true);
      }
      return (
        <>
          <div className="flex items-center gap-x-2">
            <Button
              variant={"destructive"}
              onClick={handleEditClick}
            >
              Sửa
            </Button>
          </div>

          {/* // modal for update attribute */}
          <WrapModal isOpenModal={isModalOpen}>
           <div></div>
          </WrapModal>
        </>
      );
    },
  },
];