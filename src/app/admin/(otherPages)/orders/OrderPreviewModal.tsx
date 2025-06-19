import { Badge } from '@/components/atoms/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/atoms/ui/dialog';
import { ScrollArea } from '@/components/atoms/ui/scroll-area';
import { Separator } from '@/components/atoms/ui/separator';
import { IOrderWithDetails } from '@/types';
import React from 'react'

interface OrderPreviewModalProps {
    order: IOrderWithDetails | null;
    open: boolean;
    onClose: () => void;
}
export default function OrderPreviewModal({ order, open, onClose }: OrderPreviewModalProps) {
    if (!order) return null;

    return (
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="max-w-2xl p-4">
                    <DialogHeader className='p-4'>
                        <DialogTitle>
                            Chi tiết đơn hàng <span className="text-blue-600">#{order._id}</span>
                        </DialogTitle>
                    </DialogHeader>
                    <Separator />
                    <ScrollArea className="max-h-[70vh] px-6 py-4">
                        <div className="space-y-2 mb-4">
                            <div className="flex flex-wrap gap-2 items-center">
                                <span className="font-semibold">Khách hàng:</span>
                                <span>{order.user.fullname}</span>
                                <Badge variant="outline">{order.user.email}</Badge>
                                <Badge variant="secondary">{order.user.phone}</Badge>
                            </div>
                            <div><span className="font-semibold">Địa chỉ:</span> {order.address}</div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">Trạng thái:</span>
                                <Badge variant="default">{order.orderStatus}</Badge>
                            </div>
                            <div><span className="font-semibold">Phương thức thanh toán:</span> {order.paymentMethod}</div>
                            {order.paymentTransactionId && (
                                <div><span className="font-semibold">Mã giao dịch:</span> {order.paymentTransactionId}</div>
                            )}
                            {order.voucherId && (
                                <div><span className="font-semibold">Mã voucher:</span> {order.voucherId}</div>
                            )}
                        </div>
                        <Separator className="my-3" />
                        <div>
                            <h3 className="font-semibold mb-2">Sản phẩm</h3>
                            <div className="rounded-lg border overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-muted">
                                            <th className="p-2 border">ID Laptop</th>
                                            <th className="p-2 border">Số lượng</th>
                                            <th className="p-2 border">Đơn giá</th>
                                            <th className="p-2 border">Thành tiền</th>
                                            <th className="p-2 border">Ảnh</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.orderDetails.map((item) => (
                                            <tr key={item._id} className="hover:bg-accent transition">
                                                <td className="p-2 border">{item.laptopId}</td>
                                                <td className="p-2 border text-center">{item.quantity}</td>
                                                <td className="p-2 border text-right">{item.price.toLocaleString()} đ</td>
                                                <td className="p-2 border text-right">{item.subTotal.toLocaleString()} đ</td>
                                                <td className="p-2 border text-center">
                                                    {item.images?.[0]?.imageUrl && (
                                                        <img src={item.images[0].imageUrl} alt="" className="w-12 h-12 object-cover rounded" />
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <Separator className="my-3" />
                        <div className="flex flex-col sm:flex-row justify-end gap-8 mt-4">
                            <div>
                                <div><span className="font-semibold">Giảm giá:</span> {order.discountAmount?.toLocaleString()} đ</div>
                                <div>
                                    <span className="font-semibold">Tổng tiền:</span>
                                    <span className="text-lg font-bold text-green-600 ml-2">{order.totalAmount.toLocaleString()} đ</span>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
    );
}
