'use client'
import { Button } from '@/components/atoms/ui/Button';
import { formatPrice } from '@/lib/utils';
import { OrderDetail } from '@/types';
import Image from 'next/image';
import Link from 'next/link'
import React, { useState } from 'react'

const Skeleton = () => {
    return (
        <div>
            <div
                className='flex gap-x-4 items-center animate-pulse justify-between p-4 mb-4 bg-white rounded'>
                <div className='w-24 h-24 bg-gray-300 animate-pulse'></div>
                <p className='w-full h-4 bg-gray-300 animate-pulse rounded mt-2'></p>
            </div>
        </div>
    )
}

export default function ListOrderDetails({ orderDetails }: { orderDetails: OrderDetail[] }) {

    // const [error, setError] = useState<string | null>(null);
    // const [loading, setLoading] = useState(true);


    // if (loading) return <div><Skeleton /></div>;
    // if (error) return <div>Error: {error}</div>;


    return (
        <div>
            {orderDetails.map((item: OrderDetail, index: number) => (
                <div
                    key={index}
                    className='flex items-center justify-between p-4 mb-4 gap-x-4 bg-white rounded'>
                    {item.images.length > 0 ? (
                        <div
                            className='flex gap-x-4 items-center justify-between'>
                            <Image
                                src={item.images[0].imageUrl || '/cardgift.png'}
                                alt="order"
                                width={100}
                                height={100}
                                className='w-auto h-24 rounded-md object-cover'
                            />
                            <Link
                                href={item.images[0]?._id ? `/laptop/${item.slug}` : '#'}>
                                <p className='text-blue-500 cursor-pointer text-sm '>{item.name}</p>
                            </Link>
                        </div>
                    ) : (<Skeleton />)}


                    <div className='flex gap-x-4 items-baseline'>
                        <p><span>{formatPrice(item.price)}</span></p>
                        x
                        <p><span>{item.quantity}</span></p>
                    </div>
                    <div className='flex flex-col gap-y-8'>
                        <p><span>{formatPrice(item.subTotal)}</span></p>
                        <Button
                            onClick={() => { location.href = `/products/${item._id}`; }}
                            className='bg-blue-500 text-white'
                            variant={'outline'}
                            size={'sm'}>
                            Mua lại
                        </Button>
                    </div>

                </div>
            ))}
        </div>
    )
}
