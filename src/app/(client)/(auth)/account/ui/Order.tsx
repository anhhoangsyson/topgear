'use client'
import React, { useState } from 'react'
import { formatPrice, formatDate, formatOrderStatus } from '../../../../../lib/utils';
import { fetchAccessToken } from '@/app/(client)/(auth)/account/address/ListAddressCard';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/atoms/ui/Button';
import { Badge } from '@/components/atoms/ui/badge';
import { Package } from 'lucide-react';

interface InititalOrderList {
  _id: string
  orderDetails: {
    productId: string
    productName: string
    productVariantId: string
    productVariantName: string
    quantity: number
  }[]
  totalAmount: number
  orderStatus: string
  createdAt: string
}

export default function OrdersList({ initialOrderList }: { initialOrderList: InititalOrderList[] }) {

  const [orderList, setOrderList] = useState<InititalOrderList[]>(initialOrderList)
  const [filterStatus, setFilterStatus] = useState('Tất cả')
  const [isLoading, setIsLoading] = useState(false)

  const filterOrder = (status: string) => {
    setFilterStatus(status)

    if (status === 'Tất cả') {
      setOrderList(initialOrderList)
    }
    else {
      const filterd = initialOrderList.filter(order => formatOrderStatus(order.orderStatus) === status)
      setOrderList(filterd)
    }
  }
  const orderStatus = ['Tất cả', 'Chưa thanh toán', 'Đã thanh toán', 'Đang chờ xử lý', 'Đã hoàn thành', 'Đã hủy']

  const handleCancelingOrder = async (orderId: string) => {
    setIsLoading(true)
    try {
      const acessToken = await fetchAccessToken()

      if (!acessToken) {
        toast({
          title: 'Lỗi',
          description: 'Không thể lấy access token',
          variant: 'destructive'
        })
        return
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/order/canceling-order/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${acessToken}`,
          'Content-Type': 'application/json',
        }
      })
      if (!res.ok) {
        toast({
          title: 'Yêu cầucầu hủy đơn hàng thất bại',
          description: 'Vui lòng thử lại sau',
          variant: 'destructive'
        })
        return
      }
      toast({
        title: 'Yêu cầu hủy đơn đơn hàng thành công',
        description: 'Vui lòng chờ xác nhận từ điện thoại',
        variant: 'default',
        duration: 1000,
      })
      window.location.reload()
    } catch {
    }
    finally {
      setIsLoading(false)
    }

  }
  return (
        <div className="w-full space-y-6">
            {/* Header */}
            <div className="mb-6 pb-4 border-b">
                <h2 className="text-2xl font-bold text-gray-900">Đơn hàng của tôi</h2>
                <p className="text-sm text-gray-500 mt-1">Theo dõi và quản lý đơn hàng của bạn</p>
            </div>

            {/* Filter Buttons - Mobile scrollable */}
            <div className="w-full overflow-x-auto pb-2">
                <div className="flex gap-2 min-w-max sm:flex-wrap">
        {orderStatus.map((status, index) => (
          <Button
                            key={index}
            variant={status === filterStatus ? 'default' : 'outline'}
            size="sm"
                            className={`whitespace-nowrap text-xs transition font-medium
          ${status === filterStatus
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'}
        `}
            onClick={() => filterOrder(status)}
          >
            {status}
          </Button>
        ))}
                </div>
      </div>

            {/* Order List */}
            {orderList.length > 0 ? (
                <div className="space-y-4">
                    {orderList.map((order, index) => (
                        <div
                  key={index}
                            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
                        >
                            {/* Mobile Card View */}
                            <div className="block sm:hidden p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <button
                                            onClick={() => window.location.href = `/account/orders/${order._id}`}
                                            className="text-xs font-semibold text-blue-600 hover:underline"
                                        >
                                            #{order._id.slice(-8)}
                                        </button>
                                        <p className="text-xs text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
                                    </div>
                                    <Badge className="text-xs">
                                        {formatOrderStatus(order.orderStatus)}
                                    </Badge>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Sản phẩm:</span>
                                        <span className="font-medium">{order.orderDetails.length} sản phẩm</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tổng tiền:</span>
                                        <span className="font-bold text-green-600">{formatPrice(order.totalAmount.toString())}</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t">
                                    <Button
                                        disabled={order.orderStatus === 'completed' || order.orderStatus === 'cancelled'}
                                        variant="outline"
                                        size="sm"
                                        className="w-full text-xs border-red-300 text-red-600 hover:bg-red-500 hover:text-white"
                                        onClick={() => handleCancelingOrder(order._id)}
                                    >
                                        Hủy đơn hàng
                                    </Button>
                                </div>
                            </div>

                            {/* Desktop Table Row */}
                            <div className="hidden sm:grid sm:grid-cols-12 gap-4 p-4 items-center">
                                <div className="col-span-12 sm:col-span-2">
                                    <button
                    onClick={() => window.location.href = `/account/orders/${order._id}`}
                                        className="text-sm font-semibold text-blue-600 hover:underline text-left"
                                    >
                                        #{order._id.slice(-8)}
                                    </button>
                                    <p className="text-xs text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
                                </div>
                                <div className="col-span-12 sm:col-span-2">
                                    <span className="text-sm text-gray-600">{order.orderDetails.length} sản phẩm</span>
                                </div>
                                <div className="col-span-12 sm:col-span-2">
                                    <span className="text-sm font-bold text-green-600">{formatPrice(order.totalAmount.toString())}</span>
                                </div>
                                <div className="col-span-12 sm:col-span-2">
                                    <Badge className="text-xs">
                        {formatOrderStatus(order.orderStatus)}
                      </Badge>
                                </div>
                                <div className="col-span-12 sm:col-span-2">
                    <Button
                      disabled={order.orderStatus === 'completed' || order.orderStatus === 'cancelled'}
                      variant="outline"
                      size="sm"
                                        className="w-full sm:w-auto text-xs border-red-300 text-red-600 hover:bg-red-500 hover:text-white hover:border-red-500"
                      onClick={() => handleCancelingOrder(order._id)}
                    >
                      Hủy đơn hàng
                    </Button>
        </div>
      </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Chưa có đơn hàng nào</p>
                    <p className="text-sm text-gray-400 mt-1">Đơn hàng của bạn sẽ hiển thị ở đây</p>
                </div>
            )}
    </div>
  )
}
