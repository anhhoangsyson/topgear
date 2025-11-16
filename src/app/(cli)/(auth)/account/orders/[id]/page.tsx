import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Package, Calendar, CreditCard } from 'lucide-react'
import { Badge } from '@/components/atoms/ui/badge'
import CustomerInfoOrder from '@/app/(client)/(auth)/account/orders/[id]/CustomerInfoOrder';
import ListOrderDetails from '@/app/(client)/(auth)/account/orders/[id]/ListOrderDetails';
import OrderRatingSection from '@/app/(client)/(auth)/account/orders/[id]/OrderRatingSection';
import { formatDate, formatOrderStatus, formatPrice } from '../../../../../../lib/utils';
import { getMyOrder } from '@/services/order-api'

export default async function page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const myOrder = await getMyOrder(id)
    
    if (!myOrder.data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy đơn hàng</h1>
                    <p className="text-gray-600 mb-6">Đơn hàng không tồn tại hoặc bạn không có quyền truy cập.</p>
                    <Link 
                        href="/account/orders"
                        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Quay lại danh sách đơn hàng
                    </Link>
                </div>
            </div>
        )
    }

    const order = myOrder.data;
    const isPaid = order.orderStatus === 'payment_success' || order.orderStatus === 'completed';
    const remainingAmount = isPaid ? 0 : order.totalAmount;

    return (
        <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Back Button */}
                <Link 
                    href="/account/orders"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại danh sách đơn hàng
                </Link>

                {/* Order Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                Chi tiết đơn hàng
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Package className="w-4 h-4" />
                                    <span className="font-mono">{order._id}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <time dateTime={order.createdAt || order.createAt}>
                                        {formatDate(order.createdAt || order.createAt)}
                                    </time>
                                </div>
                            </div>
                        </div>
                        <Badge 
                            className={`text-sm px-4 py-2 ${
                                isPaid 
                                    ? 'bg-green-100 text-green-700 border-green-300' 
                                    : 'bg-yellow-100 text-yellow-700 border-yellow-300'
                            }`}
                        >
                            {formatOrderStatus(order.orderStatus)}
                        </Badge>
                    </div>

                    {/* Order Items */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sản phẩm đã đặt</h2>
                        <ListOrderDetails orderDetails={order.orderDetails} />
                    </div>
                </div>

                {/* Payment Summary & Customer Info Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Payment Summary */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                            Thông tin thanh toán
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-gray-600">
                                <span>Tổng tiền đơn hàng</span>
                                <span className="font-medium">{formatPrice(order.totalAmount)}</span>
                            </div>
                            {order.discountAmount > 0 && (
                                <div className="flex items-center justify-between text-green-600">
                                    <span>Giảm giá</span>
                                    <span className="font-medium">-{formatPrice(order.discountAmount)}</span>
                                </div>
                            )}
                            <div className="h-px w-full bg-gray-200 my-4"></div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Phải thanh toán</span>
                                <span className="font-semibold text-gray-900 text-lg">
                                    {formatPrice(order.totalAmount - (order.discountAmount || 0))}
                                </span>
                            </div>
                            {!isPaid && (
                                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="flex items-center justify-between text-red-600 font-semibold">
                                        <span>Còn phải thanh toán</span>
                                        <span className="text-lg">{formatPrice(remainingAmount)}</span>
                                    </div>
                                </div>
                            )}
                            {isPaid && (
                                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center justify-between text-green-600 font-semibold">
                                        <span>Đã thanh toán</span>
                                        <span className="text-lg">✓ {formatPrice(order.totalAmount - (order.discountAmount || 0))}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
                        <CustomerInfoOrder
                            customerInfo={order.customer}
                            note={order.note}
                        />
                    </div>
                </div>

                {/* Rating Section */}
                {order.orderStatus === 'completed' && (
                    <OrderRatingSection
                        orderId={order._id}
                        orderStatus={order.orderStatus}
                        orderDetails={order.orderDetails.map((item: { laptopId: string; images?: string[] }) => ({
                            laptopId: item.laptopId,
                            images: item.images || []
                        }))}
                    />
                )}
            </div>
        </div>
    )
}
