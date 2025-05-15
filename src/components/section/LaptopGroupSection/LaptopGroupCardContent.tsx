'use client'
import { Button } from '@/components/ui/Button'
import { formatLaptopName, formatPrice } from '@/lib/utils'
import useCartStore from '@/store/cartStore'
import { ILaptop } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function LaptopGroupCardContent({ laptop }: { laptop: ILaptop }) {

    const { addToCart } = useCartStore()
    return (
        <div className='bg-white px-2 flex flex-col items-center justify-between shadow-md hover:shadow-lg transition-all duration-300 py-4'>
            <Link
                className='w-full h-auto'
                href={`/laptop/${laptop._id}`}>
                <Image
                    className='w-full h-auto object-cover'
                    src={laptop.images[0].imageUrl}
                    alt={laptop.images[0].altText || laptop.name}
                    width={300}
                    height={200}
                />
            </Link>
            <div className='flex flex-col min-h-32 py-2 justify-between'>
                <p className='text-[11px] h-full max-h-20 '>{formatLaptopName(laptop.name, laptop.specifications)}</p>

                <div className='flex flex-col items-start justify-between'>
                    <p className='text-blue-500 font-bold text-[14px]'>
                        {formatPrice(laptop.discountPrice)}
                    </p>
                    <p className='text-gray-500 line-through text-[13px]'>
                        {formatPrice(laptop.price)}
                    </p>
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
                }}
                className='w-full text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white'
                variant='ghost'   >
                Thêm vào giỏ hàng
            </Button>
        </div>
    )
}
