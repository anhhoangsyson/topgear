import ListAddressCard from '@/app/(client)/(auth)/account/address/ListAddressCard'
import { cookies } from 'next/headers'
import React from 'react'

async function getListAddress(accessToken: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_NEXT_SERVER}/api/user/location`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })

    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }
    return res.json()
}

export default async function UserAdrressesPage() {

    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value || ''

    const locationsData = await getListAddress(accessToken)
    
    return (
        <div className='w-full'>
            <div className="mb-6 pb-4 border-b">
                <h2 className="text-2xl font-bold text-gray-900">Địa chỉ giao hàng</h2>
                <p className="text-sm text-gray-500 mt-1">Quản lý địa chỉ giao hàng của bạn</p>
            </div>
            <ListAddressCard locationsData={locationsData?.data} />
        </div>
    )
}
