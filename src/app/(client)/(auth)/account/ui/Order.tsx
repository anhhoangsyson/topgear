'use client'
import React, { useState } from 'react'
import { formatPrice, formatDate, formatOrderStatus } from '../../../../../lib/utils';
import { Button } from '@/components/ui/Button';
import { fetchAccessToken } from '@/app/(client)/(auth)/account/address/ListAddressCard';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

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
      console.log(filterd);

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
    } catch (error) {
      console.log(error);
    }
    finally {
      setIsLoading(false)
    }

  }
  return (
    // <div className='flex gap-x-4'>

    //   {isLoading && (
    //     <div
    //     className='fixed inset-0 top-0 left-0 right-0 bottom-0 bg-gray-500 bg-opacity-75 z-[999] flex items-center justify-center'><LoaderCircle className='animate-spin'/> </div>
    //   )}
    //   {/* order list */}
    //   <div className='p-4 bg-white rounded w-11/12'>
    //     <p className='text-xl font-bold mb-4'>Đơn hàng của bạn</p>

    //     <div className="text-[12px] overflow-x-auto">
    //       <table className="text-[12px] min-w-full bg-white border border-gray-200">
    //         <thead>
    //           <tr className="text-[12px] bg-gray-100 text-gray-600 text-left">
    //             <th
    //               className="text-[12px] py-3 px-4 border-b">Mã đơn hàng</th>
    //             <th className="text-[12px] py-3 px-4 border-b">Ngày mua</th>
    //             <th className="text-[12px] py-3 px-4 border-b">Sản phẩm</th>
    //             <th className="text-[12px] py-3 px-4 border-b">Tổng tiền (đ)</th>
    //             <th className="text-[12px] py-3 px-4 border-b">Trạng thái</th>
    //             <th className="text-[12px] py-3 px-4 border-b">Hủy đơn hàng</th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {orderList.length > 0 && orderList.map((order, index) => (
    //             <tr
    //               key={index}
    //               className="text-[12px] hover:bg-gray-50">
    //               <td
    //                 onClick={() => window.location.href = `/account/orders/${order._id}`}
    //                 className="text-[12px] py-3 px-4 border-b text-blue-500 hover:cursor-pointer">{order._id}</td>
    //               <td className="text-[12px] py-3 px-4 border-b">{formatDate(order.createAt)}</td>
    //               <td className="text-[12px] py-3 px-4 border-b">{order.orderDetails.length} sản phẩm</td>
    //               <td className="text-[12px] py-3 px-4 border-b">{formatPrice(order.totalAmount)}</td>
    //               <td className="text-[12px] py-3 px-4 border-b text-red-500">{formatOrderStatus(order.orderStatus)}</td>
    //               <td>
    //                 <Button
    //                   disabled={order.orderStatus == 'completed'}
    //                   variant={'outline'}
    //                   size={'sm'}
    //                   className='text-xs bg-white text-red-500 hover:bg-red-500 hover:text-white'
    //                   onClick={() => handleCancelingOrder(order._id)}
    //                 >
    //                   Hủy đơn hàng
    //                 </Button>
    //               </td>
    //             </tr>
    //           ))}

    //         </tbody>
    //       </table>
    //     </div>
    //   </div>

    //   {/* sort by order status   */}
    //   <div className='w1/5 max-w'>
    //     {orderStatus.map((status, index) => (
    //       <Button
    //         variant={'outline'}
    //         size={'sm'}
    //         className={`block mb-4 min-w-40 max-w-[200px] text-xs bg-white ${status === filterStatus ? 'text-blue-500 font-semibold border-blue-500' : 'font-light  text-[#72767C]'}`}
    //         onClick={() => filterOrder(status)}
    //         key={index}>
    //         {orderStatus[index]}
    //       </Button>
    //     ))}
    //   </div>
    // </div>
    <div className="gap-y-4 w-full">
      {/* sort by order status   */}
      <div className="w-full flex min-w-[160px] gap-2 py-8">
        {orderStatus.map((status, index) => (
          <Button
            variant={status === filterStatus ? 'default' : 'outline'}
            size="sm"
            className={`w-full text-xs transition font-medium
          ${status === filterStatus
                ? 'bg-blue-500 text-white border-blue-500 shadow'
                : 'bg-white text-[#72767C] border-gray-200 hover:bg-blue-50 hover:text-blue-600'}
        `}
            onClick={() => filterOrder(status)}
            key={index}
          >
            {status}
          </Button>
        ))}
      </div>

      {/* order list */}
      <div className="w-full bg-white rounded-xl shadow p-6 overflow-x-auto">
        <p className="text-2xl font-bold mb-6 text-gray-700">Đơn hàng của bạn</p>
        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full text-sm border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-blue-50 text-gray-700">
                <th className="py-3 px-4 rounded-l-lg">Mã đơn hàng</th>
                <th className="py-3 px-4">Ngày đặt</th>
                <th className="py-3 px-4">Sản phẩm</th>
                <th className="py-3 px-4">Tổng tiền (đ)</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 rounded-r-lg">Hủy đơn hàng</th>
              </tr>
            </thead>
            <tbody>
              {orderList.length > 0 ? orderList.map((order, index) => (
                <tr
                  key={index}
                  className="bg-white hover:bg-blue-50 transition rounded-lg shadow-sm"
                >
                  <td
                    onClick={() => window.location.href = `/account/orders/${order._id}`}
                    className="py-3 px-4 text-blue-600 font-semibold cursor-pointer underline"
                  >
                    {order._id}
                  </td>
                  <td className="py-3 px-4">{formatDate(order.createdAt)}</td>
                  <td className="py-3 px-4">{order.orderDetails.length} sản phẩm</td>
                  <td className="py-3 px-4 font-bold text-green-600">{formatPrice(order.totalAmount)}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center">
                      <Badge>
                        {formatOrderStatus(order.orderStatus)}
                      </Badge>
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      disabled={order.orderStatus === 'completed' || order.orderStatus === 'cancelled'}
                      variant="outline"
                      size="sm"
                      className="text-xs bg-white text-red-500 hover:bg-red-500 hover:text-white border border-red-300"
                      onClick={() => handleCancelingOrder(order._id)}
                    >
                      Hủy đơn hàng
                    </Button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-400">
                    Không có đơn hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
