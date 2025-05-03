
import { cookies } from 'next/headers';
import React from 'react'

import { IoChevronBackOutline } from "react-icons/io5";

import CustomerInfoOrder from '@/app/(client)/(auth)/account/orders/[id]/CustomerInfoOrder';
import ListOrderDetails from '@/app/(client)/(auth)/account/orders/[id]/ListOrderDetails';

import { formatDate, formatOrderStatus, formatPrice } from '../../../../../../lib/utils';


export async function getMyOrder(id: string) {

    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    const res = await fetch(`https://top-gear-be.vercel.app/api/v1/order/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })

    if (!res.ok) {
        if (res.status === 401) {
            return {
                error: "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.",
                status: 401
            };
        }
        return {
            error: "Không thể tải danh sách đơn hàng.",
            status: res.status
        };
    }
    return res.json()
}

export default async function page({ params }: { params: { id: string }; }) {
    const id =  params.id;
    const myOrder = await getMyOrder(id)
    if (!myOrder.data){
        return (
            <div>
                Can not find your order
            </div>
        )
    }
        return (
            <div className=''>
                <div className='p-4 mb-4 flex items-center justify-between bg-white rounded'>
                    <div
                        className='flex gap-x-4 items-center'><IoChevronBackOutline
                            className='cursor-pointer'
                        />
                        <p>Đơn hàng <span>{myOrder.data._id}</span></p>
                        <p>{formatDate(myOrder.data.createAt)}</p>
                    </div>
                    <p>{formatOrderStatus(myOrder.data.orderStatus)}</p>
                </div>

                        <ListOrderDetails orderDetails={myOrder.data.orderDetails} />

                <div className='mb-4 p-4 bg-white rounded'>
                    <p className='py-2 text-[16px] font-semibold'>
                        Thông tin thanh toán
                    </p>
                    <div className='pb-2 flex gap-x-4 items-center justify-between text-gray-500 text-base'>
                        <p>Tổng tiền đơn hàng</p>
                        <p>{formatPrice(myOrder.data.totalAmount)}</p>
                    </div>
                    <div className='pb-2 flex gap-x-4 items-center justify-between text-gray-500 text-base'>
                        <p>Giảm giá</p>
                        <p>{formatPrice(myOrder.data.discountAmount)}</p>
                    </div>
                    <div className='pb-2 flex gap-x-4 items-center justify-between text-gray-500 text-base'>
                        <p>Phải thanh toán</p>
                        <p>{formatPrice(myOrder.data.totalAmount)}</p>
                    </div>
                    <div className='h-[1px] w-full bg-gray-200 my-2'></div>
                    <div className='pb-2 flex gap-x-4 items-center justify-between text-red-500 font-semibold'>
                        Còn phải thanh toán <span>{myOrder.data.orderStatus === 'payment_success' ? formatPrice(0) : myOrder.data.totalAmount}</span>
                    </div>
                </div>

                <CustomerInfoOrder
                    customerInfo={myOrder.data.customer}
                    note={myOrder.data.note}
                />
            </div>
        )
}
