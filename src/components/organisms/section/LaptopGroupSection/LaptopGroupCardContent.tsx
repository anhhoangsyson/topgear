'use client'
import { Button } from '@/components/atoms/ui/Button'
import { formatLaptopName, formatPrice } from '@/lib/utils'
import useCartStore from '@/store/cartStore'
import { ILaptop } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { toast } from '@/hooks/use-toast'

export default function LaptopGroupCardContent({ laptop }: { laptop: ILaptop }) {

    const { addToCart } = useCartStore()
    return (
        <div className='bg-white px-2 sm:px-3 flex flex-col h-full shadow-md hover:shadow-lg transition-all duration-300 py-2 sm:py-4'>
            <Link
                className='w-full h-auto relative block mb-2'
                href={`/laptop/${laptop._id}`}>
                <div className="relative w-full aspect-square overflow-hidden rounded">
                    <Image
                        className='w-full h-full object-cover'
                        src={laptop.images[0].imageUrl}
                        alt={laptop.images[0].altText || laptop.name}
                        width={300}
                        height={300}
                    />
                </div>
            </Link>
            <div className='flex flex-col flex-1 py-2 justify-between w-full px-1'>
                <p className='text-xs sm:text-sm font-normal line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] mb-2'>
                    {formatLaptopName(laptop.name, laptop.specifications)}
                </p>

                <div className='flex flex-col items-start gap-1 mt-auto'>
                    <p className='text-blue-500 font-bold text-sm sm:text-base break-words'>
                        {formatPrice(String(laptop.discountPrice))}
                    </p>
                    {laptop.price && laptop.discountPrice && laptop.price > laptop.discountPrice && (
                        <p className='text-gray-500 line-through text-xs sm:text-sm'>
                            {formatPrice(String(laptop.price))}
                        </p>
                    )}
                </div>
            </div>
            <Button
                onClick={() => {
                    addToCart({
                        _id: laptop._id,
                        name: laptop.name,
                        price: laptop.price,
                        discountPrice: laptop.discountPrice!,
                        image: laptop.images[0].imageUrl,
                    })
                    toast({
                        description: `Đã thêm "${laptop.name}" vào giỏ hàng!`,
                        duration: 2000,
                    })
                }}
                className='w-full text-xs sm:text-sm text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white py-2 px-2 sm:px-4 whitespace-nowrap mt-2'
                variant='ghost'>
                Thêm vào giỏ hàng
            </Button>
        </div>
    )
}
