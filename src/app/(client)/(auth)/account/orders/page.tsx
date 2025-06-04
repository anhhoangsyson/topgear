import OrdersList from '@/app/(client)/(auth)/account/ui/Order'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import React from 'react'

export async function getMyOrders() {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    if (!accessToken) {
        return NextResponse.json(
            { error: "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại." },
            { status: 401 }
        );
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/order/my`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })

    if (!res.ok) {
        if (res.status === 401) {
            return NextResponse.json(
                { error: "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại." },
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: "Không thể tải danh sách đơn hàng." },
            { status: res.status }
        );
    }
    return res.json()
}

export default async function MyOrders() {
    const myOrders = await getMyOrders()

    return (
        <OrdersList initialOrderList={myOrders.data} />
    )
}
