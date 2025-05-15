"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import WrapModal from "@/components/common/WrapModal";
import { Switch } from "@/components/ui/switch";
import { GoPencil } from "react-icons/go";
import { toast } from "@/hooks/use-toast";
import { IBrand } from "@/types";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import OverlayLoader from "@/components/OverlayLoader";
import UpdateBrandForm from "@/app/admin/(otherPages)/brand/UpdateBrandForm";
import { useRouter } from "next/navigation";

//  field render in table
// name: string;
// logo ?: string;
// description ?: string;
// country ?: string;
// website ?: string;
// isActive: boolean;
// createdAt: Date;
// updatedAt: Date;

export const brandColumns: ColumnDef<Partial<IBrand>>[] = [
    {
        accessorKey: "_id",
        header: "ID",
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Tên thương hiệu
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "logo",
        header: "Logo",
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                {/* {(row.getValue("categoryNames") as string[])?.join(", ") || "Không có danh mục"} */}
                <Image
                    src={row.getValue("logo") || row.getValue("name")}
                    alt={row.original.description || "Logo"}
                    width={50}
                    height={50}
                    className="rounded-full"
                />
            </div>
        ),
    },
    {
        accessorKey: "country",
        header: "Quốc gia",
        cell: ({ row }) => (
            <div className="flex items-center justify-center w-full h-full">
                {row.getValue("country") || "Không x"}
            </div>
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
            <div>{formatDate(row.getValue("createdAt"))}</div>
        ),
    },
    {
        id: "actions",
        header: "Trạng thái | Hành động",
        enableHiding: false,
        cell: ({ row }) => {
            const brand = row.original;

            const [isModalOpen, setIsModalOpen] = useState(false);
            const [isActive, setIsActive] = useState(brand.isActive);
            const [isLoading, setIsLoading] = useState(false);

            const handleEditClick = () => {
                setIsModalOpen(true);
            }

            const handleCloseModal = () => {
                setIsModalOpen(false); // Đóng modal
            };

            const handleSwitchChange = async (checked: boolean) => {
                const url = checked
                    ? `${process.env.NEXT_PUBLIC_API_URL}/brand/active/${brand._id}`
                    : `${process.env.NEXT_PUBLIC_API_URL}/brand/inactive/${brand._id}`;
                try {
                    setIsLoading(true);
                    // Cập nhật trạng thái trên server (nếu cần)
                    const response = await fetch(url, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    if (!response.ok) {
                        throw new Error("Failed to update brand status");
                    }

                    // Cập nhật trạng thái trong UI
                    setIsActive(checked);

                    toast({
                        title: "Cập nhật trạng thái thành công",
                        description: `Trạng thái thương hiệu đã được cập nhật thành ${checked ? "hoạt động" : "không hoạt động"}`,
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
                            id={`switch-${brand._id}`}
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
                       <UpdateBrandForm
                       brand={brand}
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