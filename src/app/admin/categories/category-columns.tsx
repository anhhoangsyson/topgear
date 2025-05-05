"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import WrapModal from "@/components/common/WrapModal";
import { CategoriesRes } from "@/types/Res/Product";
import { Switch } from "@/components/ui/switch";

import { GoPencil } from "react-icons/go";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { formatDate } from "@/lib/utils";
import ModalCategoryDetail from "@/app/admin/categories/ModalCategoryDetail";
import { toast } from "@/hooks/use-toast";
import ModalEditCategory from "@/app/admin/categories/ModalEditCategory";

export const categoriesColumns: ColumnDef<CategoriesRes>[] = [
    {
        accessorKey: "_id",
        header: "Id",
    },
    {
        accessorKey: "categoryName",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Tên danh mục
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div>{(row.getValue("categoryName") as string) || "#Nan"}</div>
        )
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
            <div>{formatDate(row.getValue("createdAt")) || "#Nan"}</div>
        ),
    },
    {
        id: "actions",
        header: "Hành động",
        enableHiding: false,
        cell: ({ row }) => {
            const category = row.original
            console.log(category, "category");

            const id = row.getValue("_id") as string;
            const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
            const [isEditModalOpen, setIsEditModalOpen] = useState(false);
            const [isActive, setIsActive] = useState(category.isDeleted);
            const [isLoading, setIsLoading] = useState(false);

            const handleShowDetailClick = () => {
                setIsDetailModalOpen(true); // Mở modal chi tiết
            };

            const handleEditClick = () => {
                setIsEditModalOpen(true); // Mở modal chỉnh sửa
            };

            const handleCloseDetailModal = () => {
                setIsDetailModalOpen(false); // Đóng modal chi tiết
            };

            const handleCloseEditModal = () => {
                setIsEditModalOpen(false); // Đóng modal chỉnh sửa
            };

            const handleCheckedChange = (checked: boolean) => {
                setIsLoading(true);
                setIsActive(checked);
                // Call API to update the isActive status
                // Simulate API call with setTimeout
                setTimeout(() => {
                    toast({
                        title: "Cập nhật trạng thái thành công",
                        description: `Trạng thái của danh mục ${category.categoryName} đã được cập nhật.`,
                        variant: "default",
                        duration: 2000,
                    })
                    setIsLoading(false);
                }, 2000);
            };
            return (
                <div className="flex items-center gap-x-2">
                    <Button
                        variant={'ghost'}
                        onClick={handleShowDetailClick}
                    >
                        <MdOutlineRemoveRedEye />
                    </Button>
                    <Switch
                        id={`switch-${id}`}
                        checked={isActive}
                        onCheckedChange={handleCheckedChange}
                        disabled={isLoading}
                    />
                    {isLoading && (
                        <div className="fixed z-50 w-screen h-screen inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
                            <div className="loader border-t-transparent border-4 border-white rounded-full w-5 h-5 animate-spin"></div>
                        </div>
                    )}
                    <div className="flex items-center gap-x-2">
                        <Button
                            variant={"destructive"}
                            onClick={handleEditClick}
                        >
                            <GoPencil />
                        </Button>
                    </div>

                    {/* // modal for update attribute */}
                    <WrapModal isOpenModal={isDetailModalOpen}>
                        <ModalCategoryDetail
                            open={isDetailModalOpen}
                            id={id}
                            onClose={handleCloseDetailModal}
                        />
                    </WrapModal>
                    {/* modal edit */}
                    <WrapModal isOpenModal={isEditModalOpen} onClose={handleCloseEditModal}>
                        <ModalEditCategory
                            open={isEditModalOpen}
                            category={category}
                            onClose={handleCloseEditModal}
                        />
                    </WrapModal>
                </div>
            );
        },
    },

];