'use client'
import React, { useEffect, useState } from 'react'
import { formatPrice, formatDate, formatOrderStatus } from '../../../../../lib/utils';
import { Button } from '@/components/ui/Button';

export default function OrdersList({ initialOrderList }: { initialOrderList: any[] }) {

  const [orderList, setOrderList] = useState<any[]>(initialOrderList)
  const [filterStatus, setFilterStatus] = useState('Tất cả')

  const filterOrder = (status: string) => {
    setFilterStatus(status)
    console.log(status);

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

  return (
    <div className='flex gap-x-4'>
      {/* order list */}
      <div className='p-4 bg-white rounded w-11/12'>
        <p className='text-xl font-bold mb-4'>Đơn hàng của bạn</p>

        <div className="text-[12px] overflow-x-auto">
          <table className="text-[12px] min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="text-[12px] bg-gray-100 text-gray-600 text-left">
                <th
                  className="text-[12px] py-3 px-4 border-b">Mã đơn hàng</th>
                <th className="text-[12px] py-3 px-4 border-b">Ngày mua</th>
                <th className="text-[12px] py-3 px-4 border-b">Sản phẩm</th>
                <th className="text-[12px] py-3 px-4 border-b">Tổng tiền (đ)</th>
                <th className="text-[12px] py-3 px-4 border-b">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {orderList.length > 0 && orderList.map((order, index) => (
                <tr
                  key={index}
                  className="text-[12px] hover:bg-gray-50">
                  <td
                    onClick={() => window.location.href = `/account/orders/${order._id}`}
                    className="text-[12px] py-3 px-4 border-b text-blue-500 hover:cursor-pointer">{order._id}</td>
                  <td className="text-[12px] py-3 px-4 border-b">{formatDate(order.createAt)}</td>
                  <td className="text-[12px] py-3 px-4 border-b">{order.orderDetails.length} sản phẩm</td>
                  <td className="text-[12px] py-3 px-4 border-b">{formatPrice(order.totalAmount)}</td>
                  <td className="text-[12px] py-3 px-4 border-b text-red-500">{formatOrderStatus(order.orderStatus)}</td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </div>

      {/* sort by order status   */}
      <div className='w1/5 max-w'>
        {orderStatus.map((status, index) => (
          <Button
            variant={'outline'}
            size={'sm'}
            className={`block mb-4 min-w-40 max-w-[200px] text-xs bg-white ${status === filterStatus ? 'text-blue-500 font-semibold border-blue-500' : 'font-light  text-[#72767C]'}`}
            onClick={() => filterOrder(status)}
            key={index}>
            {orderStatus[index]}
          </Button>
        ))}
      </div>
    </div>
  )
}
