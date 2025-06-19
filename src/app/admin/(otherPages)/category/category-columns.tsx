"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from 'lucide-react';

import { useState } from "react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import WrapModal from "@/components/common/WrapModal";
import { GoPencil } from "react-icons/go";
import { UpdateCategoryForm } from "@/app/admin/(otherPages)/category/UpdateCategoryForm";
import { ICategory } from '../../../../types/index';
import { Checkbox } from "@/components/atoms/ui/checkbox";
import { Button } from "@/components/atoms/ui/Button";
import { Switch } from "@/components/atoms/ui/switch";
import OverlayLoader from "@/components/atoms/feedback/OverlayLoader";

export type Category = {
    _id: string;
    name: string;
    description: string;
    slug: string;
    parentId?: string | null;
    image?: string;
    isActive: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
};

export const CategoryColumns: ColumnDef<ICategory>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tên danh mục
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "description",
        header: "Mô tả",
        cell: ({ row }) => {
            const description = row.getValue("description") as string;
            return (
                <div className="max-w-[300px] truncate" title={description}>
                    {description || "Không có mô tả"}
                </div>
            );
        },
    },
    {
        accessorKey: "image",
        header: "Hình ảnh",
        cell: ({ row }) => {
            const imageUrl = row.getValue("image") as string;
            return imageUrl ? (
                <div className="relative h-10 w-10">
                    <Image
                        src={imageUrl || "/placeholder.svg"}
                        alt={row.getValue("name") as string}
                        fill
                        className="rounded-md object-cover"
                    />
                </div>
            ) : (
                <div className="text-sm text-gray-500">Không có ảnh</div>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Ngày tạo",
        cell: ({ row }) => {
            return (
                <p className="text-center">{formatDate(row.getValue("createdAt"))}</p>
            );
        },
    },
    {
        accessorKey: "sortOrder",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Thứ tự
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        id: "actions",
        header: "Trạng thái | Hành động",
        enableHiding: false,
        cell: ({ row }) => {
            const category = row.original;
            const [isModalOpen, setIsModalOpen] = useState(false);
            const [isActive, setIsActive] = useState(category.isActive);
            const [isLoading, setIsLoading] = useState(false);

            const handleEditClick = () => {
                setIsModalOpen(true);
            }

            const handleCloseModal = () => {
                setIsModalOpen(false); // Đóng modal
            };

            const handleSwitchChange = async (checked: boolean) => {
                const url = checked
                    ? `${process.env.NEXT_PUBLIC_API_URL}/category/${category._id}/activate`
                    : `${process.env.NEXT_PUBLIC_API_URL}/category/${category._id}/inactivate`;
                try {
                    setIsLoading(true);
                    // Cập nhật trạng thái trên server (nếu cần)
                    const response = await fetch(url, {
                        method: "PATCH",
                    });

                    if (!response.ok) {
                        throw new Error("Failed to category brand status");
                    }

                    // Cập nhật trạng thái trong UI
                    setIsActive(checked);

                    toast({
                        title: "Cập nhật trạng thái thành công",
                        description: `Trạng thái danh mục đã được cập nhật thành ${checked ? "hoạt động" : "không hoạt động"}`,
                        variant: "default",
                        duration: 2000,
                    })
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
                            id={`switch-${category._id}`}
                            onCheckedChange={handleSwitchChange}
                            disabled={isLoading}
                        />

                        <Button
                            variant={"destructive"}
                            onClick={handleEditClick}
                        >
                            <GoPencil />
                        </Button>
                    </div>

                    {/* // modal for update attribute */}
                    <WrapModal isOpenModal={isModalOpen} onClose={handleCloseModal}>
                        <UpdateCategoryForm
                            category={category}
                            onClose={handleCloseModal}
                        />
                    </WrapModal>


                    {/* neu dang thao tac api -> setloading(true) thi se hien overlay de cho nguoi dung khong the click lung tung */}
                    {isLoading && (<OverlayLoader />)}
                </>
            );
        },
    },
];