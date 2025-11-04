"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, LoaderCircle, Package, User, Calendar, DollarSign, CreditCard, Eye } from "lucide-react";
import { useState } from "react";
import { formatPaymentMethod, formatPrice } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { IOrderWithDetails } from "@/types";
import { Button } from "@/components/atoms/ui/Button";
import { Badge } from "@/components/atoms/ui/badge";

// export type OrderRes = {
//     _id: string;
//     voucherId: string;
//     customerId: string;
//     totalAmount: number;
//     orderStatus: string;
//     address: string;
//     discountAmout: number;
//     paymentMethod: string | null;
//     paymentTransactionId: string | null;
//     paymentUrl: string | null;
//     orderDetai: string[];
//     note: string | "";
//     createdAt: string;
//     customer: {
//         fullname: string;
//         phone: string;
//     }
// };

const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case "pending":
            return "secondary";
        case "payment_pending":
            return "outline";
        case "payment_success":
            return "default";
        case "completed":
            return "default";
        case "cancelled":
        case "payment_cancelling":
            return "destructive";
        default:
            return "outline";
    }
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

export function orderColumns(onShowOrderPreview: (order: IOrderWithDetails) => void): ColumnDef<IOrderWithDetails>[] {
    return [
        {
            accessorKey: "_id",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 px-2"
                >
                    <span className="font-semibold">Mã đơn</span>
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="font-mono text-xs font-semibold text-blue-600">
                    #{row.getValue("_id")?.toString().slice(-8)}
                </div>
            ),
        },
        {
            accessorKey: "user.fullname",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 px-2"
                >
                    <User className="mr-2 h-4 w-4" />
                    <span className="font-semibold">Khách hàng</span>
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
            ),
            cell: ({ row }) => {
                const order = row.original;
                return (
                    <div className="flex flex-col gap-1">
                        <span className="font-medium">{order.user?.fullname || "N/A"}</span>
                        <span className="text-xs text-gray-500">{order.user?.phone || ""}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: "orderStatus",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 px-2"
                >
                    <span className="font-semibold">Trạng thái</span>
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
            ),
            cell: ({ row }) => {
                const status = row.getValue("orderStatus") as string;
                return (
                    <Badge variant={getStatusBadgeVariant(status)} className="text-xs">
                        {status}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "orderDetails",
            header: () => (
                <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span className="font-semibold">Sản phẩm</span>
                </div>
            ),
            cell: ({ row }) => {
                const order = row.original;
                const itemCount = order.orderDetails?.length || 0;
                const totalQuantity = order.orderDetails?.reduce((sum, item) => sum + item.quantity, 0) || 0;
                return (
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">{itemCount} sản phẩm</span>
                        <span className="text-xs text-gray-500">{totalQuantity} chiếc</span>
                    </div>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 px-2"
                >
                    <Calendar className="mr-2 h-4 w-4" />
                    <span className="font-semibold">Ngày đặt</span>
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
            ),
            cell: ({ row }) => {
                const date = (row.original as any).createdAt as string | undefined;
                return (
                    <div className="flex flex-col gap-1">
                        <span className="text-sm">
                            {date ? formatDate(date) : "N/A"}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: "totalAmount",
            header: () => (
                <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-semibold">Tổng tiền</span>
                </div>
            ),
            cell: ({ row }) => {
                const amount = row.getValue("totalAmount") as number;
                const discount = row.original.discountAmount || 0;
                return (
                    <div className="flex flex-col gap-1 text-right">
                        {discount > 0 && (
                            <span className="text-xs text-gray-500 line-through">
                                {formatPrice((amount + discount).toString())}
                            </span>
                        )}
                        <span className="text-sm font-semibold text-green-600">
                            {formatPrice(amount.toString())}
                        </span>
                        {discount > 0 && (
                            <span className="text-xs text-red-500">
                                -{formatPrice(discount.toString())}
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "paymentMethod",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 px-2"
                >
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span className="font-semibold">Thanh toán</span>
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="text-center">
                    <Badge variant="outline" className="text-xs">
                        {formatPaymentMethod(row.getValue("paymentMethod"))}
                    </Badge>
                </div>
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

                const handleStatusChange = async (newStatus: string) => {
                    if (!isStatusEditable) return;
                    setIsLoading(true);
                    try {

                        // Gửi yêu cầu cập nhật trạng thái lên server
                        const response = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/order/change-order-status/${order._id}`, {
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

                return (
                    <>
                        {isLoading && (
                            <div className="fixed z-50 w-screen h-screen inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
                                <div className="loader border-t-transparent border-4 border-white rounded-full w-5 h-5 animate-spin"><LoaderCircle className="animate-spin" /></div>
                            </div>
                        )}

                        <div className="flex items-center gap-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onShowOrderPreview(order)}
                                className="h-8"
                            >
                                <Eye className="h-4 w-4 mr-1" />
                                Chi tiết
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
                    </>
                );
            },
        }
    ];
}