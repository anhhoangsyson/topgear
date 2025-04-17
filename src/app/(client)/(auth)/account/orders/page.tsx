import OrdersList from '@/app/(client)/(auth)/account/ui/Order'
import { cookies } from 'next/headers'
import React from 'react'

export async function getMyOrders() {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    if (!accessToken) {
        throw new Error('No access token found')
    }

    const res = await fetch(`https://top-gear-be.vercel.app/api/v1/order/my`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })

    if (!res.ok) {
        throw new Error('Failed to fetch orders')
    }
    return res.json()
}

export default async function MyOrders() {
    const myOrders = await getMyOrders()
    console.log(myOrders);
    
    return (
    <OrdersList initialOrderList={myOrders.data}/>
    )
}
