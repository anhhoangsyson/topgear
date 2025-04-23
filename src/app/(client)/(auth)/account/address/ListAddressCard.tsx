'use client'
import React from 'react'
import { Button } from '@/components/ui/Button'
import { formartLocation } from '@/lib/utils';


export default function ListAddressCard({ locationsData }: { locationsData: any[] }) {



    return (
        <div className='mt-8'>
            {locationsData?.map((location, index) => (
                <div
                key={index}
                    className='flex items-center justify-between mt-4 2xl:w-full p-4 bg-white rounded'>
                    <div className=''>
                        {/* name address */}
                        <div className='flex items-center gap-x-4'>
                            {/* <p className='font-bold text-base '>Anh Hoang</p> */}

                            <Button
                                variant='outline'
                                // default address will be disabled
                                disabled={location.isDefault ? true : false}
                                className='h-6 border-red-500 text-red-500 text-xs font-semibold hover:bg-red-500 hover:text-white'>
                                Mặc định
                            </Button>
                        </div>
                        <p
                            className='font-light text-xs mt-4'>
                            {`Địa chỉ: ${formartLocation(location.province, location.district, location.ward, location.street)}`}
                        </p>
                    </div>
                    <div className='flex flex-col gap-y-2'>
                        <Button
                            variant='outline'
                            className='text-gray-500 text-xs font-semibold hover:bg-red-500 hover:text-white'
                            >
                            Chỉnh sửa
                        </Button>
                        <Button
                            variant='outline'
                            className='border-red-500 outline-none text-red-500 text-xs font-semibold hover:bg-red-500 hover:text-white'>
                            Xóa
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    )
}
