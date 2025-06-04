"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye, MoreHorizontal, Pencil, Trash } from 'lucide-react';

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { toast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import OverlayLoader from "@/components/OverlayLoader";
import { GoPencil } from "react-icons/go";
import { Switch } from "@/components/ui/switch";
import { IImage, ILaptop, ILaptopGroup } from '../../../../types/index';



export function LaptopGroupColumns(onShowLaptopGroupDetail: (laptopGroup: ILaptopGroup) => void): ColumnDef<ILaptopGroup>[] {
    return [
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Tên Group
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                return <div>
                    <div className="flex items-center gap-x-2">
                        <p className="text-center truncate">{row.getValue("name")}</p>
                    </div>
                </div>
            }
        },
        {
            accessorKey: "sortOrder",
            header: ({ column }) => {
                return (
                    <Button
                        className="text-ce"
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Thu tu hien thi
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                return <div className="text-center">{row.getValue("sortOrder")}</div>
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
            id: "actions",
            header: "Trạng thái | Hành động",
            enableHiding: false,
            cell: ({ row }) => {
                const laptopGroup = row.original as ILaptopGroup;
                const [, setIsModalOpen] = useState(false);
                const [isActive, setIsActive] = useState(laptopGroup.isActive);
                const [isLoading, setIsLoading] = useState(false);

                const handleEditClick = () => {
                    setIsModalOpen(true);
                }


                const handleSwitchChange = async (checked: boolean) => {
                    const url = checked
                        ? `${process.env.NEXT_PUBLIC_API_URL}/laptop-group/${laptopGroup._id}/activate`
                        : `${process.env.NEXT_PUBLIC_API_URL}/laptop-group/${laptopGroup._id}/inactivate`;
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
                                id={`switch-${laptopGroup._id}`}
                                onCheckedChange={handleSwitchChange}
                                disabled={isLoading}
                            />

                            <Button
                                onClick={() => onShowLaptopGroupDetail(laptopGroup)}
                            >

                                <Eye />
                            </Button>
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
    ]
};