import { Badge } from '@/components/atoms/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/atoms/ui/dialog';
import { ScrollArea } from '@/components/atoms/ui/scroll-area';
import { Separator } from '@/components/atoms/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/ui/select';
import { IOrderWithDetails } from '@/types';
import React, { useState } from 'react';
import { 
    User, Mail, Phone, MapPin, Calendar, Package, CreditCard, 
    FileText, Tag, Receipt, ShoppingCart, Image as ImageIcon, 
    LoaderCircle
} from 'lucide-react';
import { formatPrice, formatPaymentMethod } from '@/lib/utils';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';

interface OrderPreviewModalProps {
    order: IOrderWithDetails | null;
    open: boolean;
    onClose: () => void;
    onOrderUpdate?: (updatedOrder: IOrderWithDetails) => void;
}
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

export default function OrderPreviewModal({ order, open, onClose, onOrderUpdate }: OrderPreviewModalProps) {
    const [currentStatus, setCurrentStatus] = useState(order?.orderStatus || '');
    const [isUpdating, setIsUpdating] = useState(false);

    // Update currentStatus when order changes
    React.useEffect(() => {
        if (order?.orderStatus) {
            setCurrentStatus(order.orderStatus);
        }
    }, [order?.orderStatus]);

    if (!order) return null;

    const subtotal = order.orderDetails.reduce((sum, item) => sum + item.subTotal, 0);
    const discount = order.discountAmount || 0;
    const total = order.totalAmount;

    const visibleStatuses = [
        { value: "pending", label: "Chờ xử lý" },
        { value: "payment_pending", label: "Chờ thanh toán" },
        { value: "payment_cancelling", label: "Đang hủy thanh toán" },
        { value: "payment_success", label: "Thanh toán thành công" },
        { value: "completed", label: "Hoàn thành" },
        { value: "cancelled", label: "Đã hủy" },
    ];

    const isStatusEditable = !["completed", "cancelled"].includes(currentStatus);

    const handleStatusChange = async (newStatus: string) => {
        if (!isStatusEditable || newStatus === currentStatus) return;
        
        // Validate status
        const validStatuses = visibleStatuses.map(s => s.value);
        if (!validStatuses.includes(newStatus)) {
            toast({
                title: "Lỗi",
                description: "Trạng thái không hợp lệ",
                variant: "destructive",
            });
            return;
        }
        
        setIsUpdating(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/order/change-order-status/${order._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Cập nhật trạng thái thất bại");
            }

            const responseData = await response.json().catch(() => ({}));
            const updatedOrder = responseData.data || { ...order, orderStatus: newStatus };
            setCurrentStatus(newStatus);
            
            // Call callback to update parent
            if (onOrderUpdate) {
                onOrderUpdate(updatedOrder);
            }

            toast({
                title: "Thành công",
                description: `Đã cập nhật trạng thái đơn hàng thành "${visibleStatuses.find(s => s.value === newStatus)?.label || newStatus}"`,
            });
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
              console.error("Lỗi khi cập nhật trạng thái:", error);
            }
            toast({
                title: "Lỗi",
                description: error instanceof Error ? error.message : "Không thể cập nhật trạng thái đơn hàng",
                variant: "destructive",
            });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
            <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                <DialogHeader className='p-6 border-b bg-gradient-to-r from-blue-50 to-white'>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <Receipt className="w-6 h-6 text-blue-600" />
                        Chi tiết đơn hàng
                        <span className="font-mono text-blue-600">#{order._id.slice(-8)}</span>
                        </DialogTitle>
                    </DialogHeader>
                
                <ScrollArea className="max-h-[calc(90vh-200px)]">
                    <div className="p-6 space-y-6">
                        {/* Order Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Customer Info */}
                            <div className="bg-white border rounded-lg p-4 shadow-sm">
                                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                    <User className="w-5 h-5 text-blue-600" />
                                    Thông tin khách hàng
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <User className="w-4 h-4 text-gray-400" />
                                        <div>
                                            <span className="text-sm text-gray-500">Họ tên</span>
                                            <p className="font-medium">{order.user?.fullname || "N/A"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <div>
                                            <span className="text-sm text-gray-500">Email</span>
                                            <p className="font-medium">{order.user?.email || "N/A"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <div>
                                            <span className="text-sm text-gray-500">Số điện thoại</span>
                                            <p className="font-medium">{order.user?.phone || "N/A"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                                        <div className="flex-1">
                                            <span className="text-sm text-gray-500">Địa chỉ giao hàng</span>
                                            <p className="font-medium">{order.address || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Status & Payment */}
                            <div className="bg-white border rounded-lg p-4 shadow-sm">
                                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                    <Package className="w-5 h-5 text-blue-600" />
                                    Thông tin đơn hàng
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <div>
                                            <span className="text-sm text-gray-500">Ngày đặt</span>
                                            <p className="font-medium">
                                                {order.createdAt ? formatDate(order.createdAt as string) : "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {isStatusEditable ? (
                            <div className="flex items-center gap-2">
                                                <Select
                                                    value={currentStatus}
                                                    onValueChange={handleStatusChange}
                                                    disabled={isUpdating}
                                                >
                                                    <SelectTrigger className="w-[200px]">
                                                        <SelectValue placeholder="Chọn trạng thái" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {visibleStatuses
                                                            .filter(status => status.value !== "completed" && status.value !== "cancelled")
                                                            .map((status) => (
                                                                <SelectItem 
                                                                    key={status.value} 
                                                                    value={status.value}
                                                                >
                                                                    {status.label}
                                                                </SelectItem>
                                                            ))}
                                                    </SelectContent>
                                                </Select>
                                                {isUpdating && (
                                                    <LoaderCircle className="w-4 h-4 animate-spin text-gray-400" />
                                                )}
                                            </div>
                                        ) : (
                                            <Badge variant={getStatusBadgeVariant(currentStatus)} className="text-sm">
                                                {visibleStatuses.find(s => s.value === currentStatus)?.label || currentStatus}
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CreditCard className="w-4 h-4 text-gray-400" />
                                        <div>
                                            <span className="text-sm text-gray-500">Phương thức thanh toán</span>
                                            <p className="font-medium">{formatPaymentMethod(order.paymentMethod)}</p>
                                        </div>
                            </div>
                            {order.paymentTransactionId && (
                                        <div className="flex items-center gap-3">
                                            <Receipt className="w-4 h-4 text-gray-400" />
                                            <div>
                                                <span className="text-sm text-gray-500">Mã giao dịch</span>
                                                <p className="font-mono text-sm font-medium">{order.paymentTransactionId}</p>
                                            </div>
                                        </div>
                            )}
                            {order.voucherId && (
                                        <div className="flex items-center gap-3">
                                            <Tag className="w-4 h-4 text-gray-400" />
                                            <div>
                                                <span className="text-sm text-gray-500">Mã voucher</span>
                                                <p className="font-medium">{order.voucherId}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Note */}
                        {order.note && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                                        <span className="text-sm font-semibold text-blue-900">Ghi chú đơn hàng</span>
                                        <p className="text-blue-800 mt-1">{order.note}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Products */}
                        <div className="bg-white border rounded-lg shadow-sm">
                            <div className="p-4 border-b bg-gray-50">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                                    Sản phẩm ({order.orderDetails.length})
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="p-3 text-left text-sm font-semibold text-gray-700">Sản phẩm</th>
                                            <th className="p-3 text-center text-sm font-semibold text-gray-700">Số lượng</th>
                                            <th className="p-3 text-right text-sm font-semibold text-gray-700">Đơn giá</th>
                                            <th className="p-3 text-right text-sm font-semibold text-gray-700">Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.orderDetails.map((item, index) => (
                                            <tr key={item._id || index} className="border-b hover:bg-gray-50 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                            {item.images?.[0]?.imageUrl ? (
                                                                <Image
                                                                    src={item.images[0].imageUrl}
                                                                    alt={`Product ${index + 1}`}
                                                                    width={64}
                                                                    height={64}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <ImageIcon className="w-6 h-6 text-gray-400" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-gray-900 truncate">
                                                                Laptop ID: {item.laptopId}
                                                            </p>
                                                            <p className="text-sm text-gray-500 mt-1">
                                                                Mã sản phẩm: {item._id ? item._id.slice(-8) : 'N/A'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className="font-semibold">{item.quantity}</span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <span className="font-medium">{formatPrice((item.price || 0).toString())}</span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <span className="font-semibold text-gray-900">{formatPrice((item.subTotal || 0).toString())}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="bg-gradient-to-r from-gray-50 to-white border rounded-lg p-6">
                            <div className="flex justify-end">
                                <div className="w-full md:w-80 space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">Tạm tính:</span>
                                        <span className="font-medium">{formatPrice(subtotal.toString())}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600">Giảm giá:</span>
                                            <span className="font-medium text-red-600">-{formatPrice(discount.toString())}</span>
                                        </div>
                                    )}
                                    <Separator />
                                    <div className="flex justify-between items-center text-lg font-bold">
                                        <span className="text-gray-900">Tổng cộng:</span>
                                        <span className="text-green-600 text-xl">{formatPrice(total.toString())}</span>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
    );
}
