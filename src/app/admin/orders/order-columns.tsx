"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { formatPaymentMethod, formatPrice } from "@/lib/utils";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import WrapModal from "@/components/common/WrapModal";

export type OrderRes = {
    _id: string;
    voucherId: string;
    customerId: string;
    totalAmount: number;
    orderStatus: string;
    address: string;
    discountAmout: number;
    paymentMethod: string | null;
    paymentTransactionId: string | null;
    paymentUrl: string | null;
    orderDetai: string[];
    note: string | "";
    createAt: string;
    customer: {
        fullname: string;
        phone: string;
    }
};

export const orderColumns: ColumnDef<OrderRes>[] = [
    {
        accessorKey: "_id",
        header: "ID",
    },
    {
        accessorKey: "customer.fullname",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Tên khách hàng
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "createAt",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Ngày đặt
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            // <div>{formatDate(row.getValue("createdAt"))}</div>
            <div>{new Date(row.getValue("createAt")).toLocaleDateString()}</div>

        ),
    },
    {
        accessorKey: "totalAmount",
        header: "Giá trị đơn hàng",
        cell: ({ row }) => (
            <div>{formatPrice((row.getValue("totalAmount") as string[])) || "#Nan"}</div>
        ),
    },
    {
        accessorKey: "paymentMethod",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Phương thức thanh toán
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="text-center">{formatPaymentMethod(row.getValue("paymentMethod"))}</div>
        ),
    },
    {
        id: "actions",
        header: "Hành động",
        enableHiding: false,
        cell: ({ row }) => {
            const order = row.original;
            
            const visibleStatuses = [
                "pending",
                "payment_pending",
                "payment_cancelling",
                "payment_success",
                "completed",
                "cancelled",
            ];

            const [currentStatus, setCurrentStatus] = useState(order.orderStatus);
            const [isLoading, setIsLoading] = useState(false);
            const isStatusEditable = !["completed", "cancelled"].includes(currentStatus);
            const [isModalOpen, setIsModalOpen] = useState(false);

            const handleStatusChange = async (newStatus: string) => {
                if (!isStatusEditable) return;
                setIsLoading(true);
                try {
                    console.log("Đang cập nhật trạng thái:", newStatus);

                    // Gửi yêu cầu cập nhật trạng thái lên server
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PROD}/change-order-status`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ status: newStatus }),
                    });

                    if (!response.ok) {
                        throw new Error("Cập nhật trạng thái thất bại");
                    }

                    setCurrentStatus(newStatus); // Cập nhật trạng thái mới
                } catch (error) {
                    console.error("Lỗi khi cập nhật trạng thái:", error);
                } finally {
                    setIsLoading(false);
                }
            };

            const handleShowOrderDetails = () => {

            }
            return (
                <>
                    {isLoading && (
                        <div className="fixed z-50 w-screen h-screen inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
                            <div className="loader border-t-transparent border-4 border-white rounded-full w-5 h-5 animate-spin"><LoaderCircle className="animate-spin" /></div>
                        </div>
                    )}

                    <div className="flex items-center gap-x-2">
                        <Button
                            variant={'ghost'}
                            onClick={handleShowOrderDetails}
                        >
                            <MdOutlineRemoveRedEye />
                        </Button>

                        {isStatusEditable ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">
                                        {currentStatus}
                                        <ChevronDown />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 z-50 bg-white shadow-lg rounded-md p-2">
                                    {visibleStatuses.map((status) => (
                                        <DropdownMenuItem
                                            className={`cursor-pointer bg-white mb-4 hover:outline-none`}
                                            key={status}
                                            onClick={() => handleStatusChange(status)}
                                            disabled={status === currentStatus}
                                        >
                                            {status}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button
                                className=""
                                variant="outline" disabled>
                                {currentStatus}
                            </Button>
                        )}
                    </div>
                    <WrapModal
                        isOpenModal={isModalOpen}
                        // onClose={isModalOpen}
                    >
                        <div></div>
                    </WrapModal>
                </>
            );
        },
    },
];