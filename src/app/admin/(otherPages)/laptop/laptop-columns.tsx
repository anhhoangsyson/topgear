"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from 'lucide-react';

import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { toast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import OverlayLoader from "@/components/OverlayLoader";
import { GoPencil } from "react-icons/go";
import { Switch } from "@/components/ui/switch";
import { IImage, ILaptop } from '../../../../types/index';
import Image from "next/image";
import { Badge } from "@/components/ui/badge";


export const LaptopColumns: ColumnDef<ILaptop>[] = [
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
                    Tên
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const isPromoted: boolean = row.original.isPromoted
            return <div>
                <div className="flex items-center gap-x-2">
                    <p className="text-center truncate">{row.getValue("name")}</p>
                    {isPromoted && (
                        <Badge variant="default" className="text-xs">
                            Nổi bật
                        </Badge>
                    )}
                </div>
            </div>
        }
    },
    {
        accessorKey: "images",
        header: "Thumbnails",
        cell: ({ row }) => {
            const rows = row.original;
            const images: IImage[] = row.getValue("images");
            
            return (
                <div className="max-w-[300px] truncate" >
                    <Image
                        src={images[0].imageUrl}
                        alt={images[0].altText || "laptop thumbnail"}
                        width={50}
                        height={50} />
                </div>
            );
        },
    },
    {
        accessorKey: "brandId",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Thương hiệu
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const brand: { _id: string, name: string, logo: string } = row.getValue("brandId");
            console.log('brandid', brand);
                
            return <div className="text-center">{brand.name}</div>
        },
    },
    {
        accessorKey: "categoryId",
        header: ({ column }) => {
            return (
                <Button
                    className="text-ce"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Danh mục
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const category: { _id: string, name: string, slug: string } = row.getValue("categoryId");
            console.log('categoryid', category);
            return <div className="text-center">{category.name}</div>
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Ngày tạo
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },

        cell: ({ row }) => {
            return (
                <p className="">{formatDate(row.getValue("createdAt"))}</p>
            );
        },
    },
    {
        accessorKey: "price",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Giá
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
                    {/* <WrapModal isOpenModal={isModalOpen} onClose={handleCloseModal}>
                        <UpdateCategoryForm
                            category={category}
                            onClose={handleCloseModal}
                        />
                    </WrapModal> */}


                    {/* neu dang thao tac api -> setloading(true) thi se hien overlay de cho nguoi dung khong the click lung tung */}
                    {isLoading && (<OverlayLoader />)}
                </>
            );
        },
    },
];