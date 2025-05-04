"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import WrapModal from "@/components/common/WrapModal";
import { ProductsVariantsRes } from "@/types/Res/Product";
import { Switch } from "@/components/ui/switch";

import { GoPencil } from "react-icons/go";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import ModalProductVariantDetail from "@/app/admin/productVariants/ModalProductVariantDetail";

export const productVariantColumns: ColumnDef<ProductsVariantsRes>[] = [
    {
        accessorKey: "_id",
        header: "Id",
    },
    {
        accessorKey: "variantName",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Tên biến thể
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
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
        accessorKey: "variantPrice",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Giá gốc
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div>{(row.getValue("variantPrice") as string) || "#Nan"}</div>
        ),
    },
    {
        accessorKey: "variantPriceSale",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Giá khuyến mãi
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div>{(row.getValue("variantPriceSale") as string) || "#Nan"}</div>
        ),
    },
    {
        accessorKey: "variantStock",
        header: "Số lượng",
        cell: ({ row }) => (
            <div>{(row.getValue("variantStock") as string) || "#Nan"}</div>
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
            <div>{(row.getValue("createdAt")) || "#Nan"}</div>
        ),
    },
    {
        id: "actions",
        header: "Hành động",
        enableHiding: false,
        cell: ({ row }) => {
            const id = row.getValue("_id") as string;

            const [isModalOpen, setIsModalOpen] = useState(false);

            const handleEditClick = () => {
                setIsModalOpen(true);
            }
            const handleShowDetailClick = () => {
                setIsModalOpen(false);
                setTimeout(() => {
                    setIsModalOpen(true); // Mở lại modal sau khi trạng thái được reset
                }, 0);
            }

            return (
                <div className="flex items-center gap-x-2">
                    <Button
                        variant={'ghost'}
                        onClick={handleShowDetailClick}
                    >
                        <MdOutlineRemoveRedEye />
                    </Button>
                    <Switch />
                    <div className="flex items-center gap-x-2">
                        <Button
                            variant={"destructive"}
                            onClick={handleEditClick}
                        >
                            <GoPencil />
                        </Button>
                    </div>

                    {/* // modal for update attribute */}
                    <WrapModal isOpenModal={isModalOpen}>
                        <ModalProductVariantDetail
                            id={id}
                            onClose={() => setIsModalOpen(false)}
                        />
                    </WrapModal>
                </div>
            );
        },
    },

];