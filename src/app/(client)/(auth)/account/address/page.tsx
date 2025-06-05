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
        <div className='w-full p-4'>
            {/* Title */}
            <p className='font-bold text-xl'>Địa chỉ</p>
            {/* add new address */}
            {/* <div className='flex justify-center items-center mt-4 w-full h-[68px] bg-white text-sm font-light border-dashed border-gray-400 border-2 rounded cursor-pointer'>
                Thêm địa chỉ mới
            </div> */}
            {/* address */}
            <ListAddressCard
             locationsData={locationsData?.data} />

        </div>
    )
}
