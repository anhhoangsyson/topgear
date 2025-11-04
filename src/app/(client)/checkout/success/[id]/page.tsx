import Navigation from '@/app/(client)/checkout/success/[id]/Navigation';
import { cookies } from 'next/headers'
import React from 'react'
import { GiConfirmed } from "react-icons/gi";
async function fetchOrderDetails(id: string, accessToken: string) {
    const res = await fetch(`https://top-gear-be.vercel.app/api/v1/order/${id}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
    })

    if (!res.ok) {
        throw new Error('Failed to fetch order details')
    }

    return res.json()
}
export default async function OrderSuccess({ params }: { params: { id: string } }) {
    const { id } = await params
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value
    if (!accessToken) {
        return (
            <div className='w-full h-screen flex items-center justify-center'>
                <h1 className='text-2xl font-bold'>Bạn chưa đăng nhập</h1>
            </div>
        )
    }
    const order = await fetchOrderDetails(id, accessToken)

    return (
        <div className='w-full h-[500px]'>
            <div className='grid'>
                <GiConfirmed className='my-4 w-36 h-36 text-[#0e1746] mx-auto' />
                <h2 className='font-semibold text-gray-800 text-4xl text-center'>Đặt hàng thành công!!!</h2>
                <h3 className='my-4 text-sm font-normal text-gray-500 text-center'>Cảm ơn thượng đế vì đã tin tưởng và mua hàng của E-COM.</h3>
                <Navigation/>
            </div>
        </div>
    )
}
