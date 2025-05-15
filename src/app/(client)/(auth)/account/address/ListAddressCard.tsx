'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { formartLocation } from '@/lib/utils';
import { LocationRes } from '@/types';
import { toast } from '@/hooks/use-toast';
import { LoaderCircle } from 'lucide-react';

export const fetchAccessToken = async (): Promise<string | null> => {
    try {
        const res = await fetch('/api/user/get-access-token', {
            method: 'GET',
        });

        if (!res.ok) {
            console.error('Lỗi khi lấy access token:', res.statusText);
            return null;
        }   

        const data = await res.json();
        console.log('Access token:', data.accessToken);
        
        return data.accessToken || null;
    } catch (error) {
        console.error('Lỗi khi gọi API get-access-token:', error);
        return null;
    }
};

export default function ListAddressCard({ locationsData }: { locationsData: LocationRes[] }) {

    const [isLoading, setIsLoading] = useState(false)

    const handleSetAddressDefault = async (id: string) => {
        setIsLoading(true)

        try {
            const accessToken = await fetchAccessToken();
            if (!accessToken) {
                toast({
                    title: 'Lỗi',
                    description: 'Không thể lấy access token',
                    variant: 'destructive'
                })
                setIsLoading(false)
                return
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PROD}/location/set-default/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            })
            if (!res.ok) {
                toast({
                    title: 'Đặt địa chỉ mặc định thất bại',
                    description: 'Vui lòng thử lại sau',
                    variant: 'destructive'
                })
                setIsLoading(false)
                return
            }

            toast({
                title: 'Đặt địa chỉ mặc định thành công',
                description: 'Địa chỉ đã được đặt làm địa chỉ mặc định',
                variant: 'default',
                duration: 1000,
            })
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        } catch (error) {

        }
        finally {
            setIsLoading(false)

        }
    }

    const handleDeleteAddress = async (id: string) => {
        setIsLoading(true)

        try {
            const accessToken = await fetchAccessToken();
            if (!accessToken) {
                toast({
                    title: 'Lỗi',
                    description: 'Không thể lấy access token',
                    variant: 'destructive'
                })
                setIsLoading(false)
                return
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PROD}/location/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            })
            if (!res.ok) {
                toast({
                    title: 'Xóa địa chỉ thất bại',
                    description: 'Vui lòng thử lại sau',
                    variant: 'destructive',
                    duration: 1000,
                })
                setIsLoading(false)
                return
            }
            toast({
                title: 'Xóa địa chỉ thành công',
                description: 'Địa chỉ đã được xóa',
                variant: 'default',
                duration: 1000,
            })
                window.location.reload()
        } catch (error) {

        }
        finally {
            setIsLoading(false)

        }
    }


    return (
        <div className='mt-8'>
            {isLoading && (
                <div className='fixed inset-0 w-screen h-screen z-50 bg-gray-500 bg-opacity-75 flex items-center justify-center'>
                    <LoaderCircle className='animate-spin' />
                </div>
            )}
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
                                onClick={() => handleSetAddressDefault(location._id)}
                                disabled={location.isDefault ? true : false}
                                className='h-6 border-red-500 text-red-500 text-xs font-semibold hover:bg-red-500 hover:text-white'>
                                {location.isDefault ? 'Địa chỉ mặc định' : 'Đặt làm địa chỉ mặc định'}
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
                            onClick={() => handleDeleteAddress(location._id)}
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
