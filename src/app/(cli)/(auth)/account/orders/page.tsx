import OrdersList from '@/app/(cli)/(auth)/account/ui/Order'
import React from 'react'
import { getMyOrders } from '@/services/order-api'

// moved getMyOrders into src/services/order-api.ts

export default async function MyOrders() {
    const myOrders = await getMyOrders()

    return (
        <OrdersList initialOrderList={myOrders.data} />
    )
}
