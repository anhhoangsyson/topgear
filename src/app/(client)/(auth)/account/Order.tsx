'use client'
import {Button} from '@/components/ui/Button'
import Link from 'next/link'
import React, { useState } from 'react'

export default function Orders() {
  const ordersFakeData = [
    {
      id: 'JQKA123456789',
      shippingUnit: 'Express JS',
      product: 'Màn hình Gaming ASUS TUF VG249Q3A 24 inch',
      quantity: 1,
      totalPrice: '4.900.000 VND',
      status: 'Chưa thanh toán',
      paymentMethod: 'Thanh toán khi nhận hàng',
    },
    {
      id: 'JQKA987654321',
      shippingUnit: 'Fast Delivery',
      product: 'Laptop Dell Inspiron 15 3000',
      quantity: 1,
      totalPrice: '15.000.000 VND',
      status: 'Đã thanh toán',
      paymentMethod: 'Chuyển khoản ngân hàng',
    },
    {
      id: 'JQKA112233445',
      shippingUnit: 'Standard Shipping',
      product: 'Chuột Logitech MX Master 3',
      quantity: 2,
      totalPrice: '3.200.000 VND',
      status: 'Đang giao hàng',
      paymentMethod: 'Thanh toán khi nhận hàng',
    },
    {
      id: 'JQKA556677889',
      shippingUnit: 'Express JS',
      product: 'Bàn phím cơ Keychron K6',
      quantity: 1,
      totalPrice: '2.500.000 VND',
      status: 'Đã thanh toán',
      paymentMethod: 'Chuyển khoản ngân hàng',
    },
    {
      id: 'JQKA998877665',
      shippingUnit: 'Fast Delivery',
      product: 'Tai nghe Sony WH-1000XM4',
      quantity: 1,
      totalPrice: '6.000.000 VND',
      status: 'Đang giao hàng',
      paymentMethod: 'Thanh toán khi nhận hàng',
    },
    {
      id: 'JQKA443322110',
      shippingUnit: 'Standard Shipping',
      product: 'Ổ cứng SSD Samsung 970 EVO Plus 1TB',
      quantity: 1,
      totalPrice: '3.800.000 VND',
      status: 'Chưa thanh toán',
      paymentMethod: 'Thanh toán khi nhận hàng',
    }
  ]
  const [filter, setFilter] = useState('Tất cả')
  const filteredOrders = filter === 'Tất cả' ? ordersFakeData : ordersFakeData.filter(order => order.status === filter)
  const orderStatus = ['Tất cả', 'Chưa thanh toán', 'Đã thanh toán', 'Đang giao hàng']

  return (
    <div className='flex gap-x-4'>
      {/* order list */}
      <div className='p-4 bg-white rounded w-4/5'>
        <p className='text-xl font-bold mb-4'>Quản lý đơn hàng</p>
        {/* order card */}
        {filteredOrders.map(order => (
          <div key={order.id} className='rounded bg-[#F6F6F6] mb-4'>
            <div className='w-full grid grid-cols-2 h-10'>
              <div className='flex items-center gap-x-2'>
                <p className='pl-2 text-sm font-semibold'>Mã đơn hàng</p>
                <p className='text-sm font-light'>{order.id}</p>
              </div>
              <div className='flex items-center gap-x-2'>
                <p className='pl-2 text-sm font-semibold text-nowrap'>Đơn vị vận chuyển</p>
                <p className='text-sm font-light text-nowrap truncate'>{order.shippingUnit}</p>
              </div>
            </div>

            <div className='w-full grid grid-cols-2 h-10'>
              <div className='flex items-center gap-x-2'>
                <p className='pl-2 text-sm font-semibold text-nowrap'>Sản phẩm</p>
                <p className='text-sm font-light truncate'>{order.product}</p>
              </div>
              <div className='flex items-center gap-x-2'>
                <p className='pl-2 text-sm font-semibold'>Số lượng</p>
                <p className='text-sm font-light truncate'>{order.quantity}</p>
              </div>
            </div>

            <div className='flex items-center gap-x-2 h-10'>
              <p className='pl-2 text-sm font-semibold text-nowrap'>Tồng giá</p>
              <p className='text-sm font-light truncate'>{order.totalPrice}</p>
            </div>

            <div className='w-full grid grid-cols-2 h-10'>
              <div className='flex items-center gap-x-2'>
                <p className='pl-2 text-sm font-semibold text-nowrap'>Trạng thái đơn hàng</p>
                <p className='text-sm font-light truncate'>{order.status}</p>
              </div>

              <div className='flex items-center gap-x-2'>
                <p className='pl-2 text-sm font-semibold text-nowrap'>Hình thức thanh toán</p>
                <p className='text-sm font-light text-nowrap truncate'>{order.paymentMethod}</p>
              </div>
            </div>
            <div className='flex items-center gap-x-2 h-10'>
              <p className='pl-2 text-sm font-semibold text-nowrap'>Xem vị trí đơn hàng của bạn </p>
              <Link className='text-sm font-light text-blue-500' href={'/'}>
                Tại đây
              </Link>
            </div>
          </div>
        ))}
      </div>
      {/* sort by order status   */}
      <div className='w1/5 max-w'>
        {orderStatus.map((status, index) => (
          <Button
            className={`block mb-4 min-w-40 max-w-[200px] text-xs bg-white ${status === filter ? 'text-blue-500 font-semibold border-blue-500' : 'font-light  text-[#72767C]'}`}
            onClick={() => setFilter(status)}
            key={index}>
            {orderStatus[index]}
          </Button>
        ))}
      </div>
    </div>
  )
}
