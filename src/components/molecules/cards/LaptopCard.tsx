'use client'
import { Button } from '@/components/atoms/ui/Button'
import { Card, CardContent, CardFooter, CardTitle } from '@/components/atoms/ui/card'
import { formatLaptopName, formatPrice } from '@/lib/utils'
import useCartStore from '@/store/cartStore'
import { ILaptop } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function LaptopCard({ laptop }: { laptop: ILaptop }) {
    const { addToCart } = useCartStore()

    // Tính phần trăm giảm giá nếu có
    const percent =
        laptop.price && laptop.discountPrice
            ? Math.round(100 - (laptop.discountPrice / laptop.price) * 100)
            : 0

    return (
        <Card className="flex flex-col items-center justify-between shadow-md hover:shadow-lg transition-all duration-300 p-2">
            <Link className="w-full h-auto relative block"
                href={`/laptop/${laptop.slug}`}
            >
                <Image
                    className="w-full h-auto object-cover rounded"
                    src={laptop.images[0].imageUrl}
                    alt={laptop.images[0].altText || laptop.name}
                    width={300}
                    height={200}
                />
                {percent > 0 && (
                    <span className="absolute top-2 left-2 mt-1 px-2 py-1 bg-red-100 text-red-600 text-xs rounded font-semibold">
                        -{percent}%
                    </span>
                )}
            </Link>
            <CardContent className="flex flex-col min-h-32 py-2 w-full">
                <CardTitle className="text-[11px] font-normal h-full max-h-20 overflow-hidden text-ellipsis  sm:whitespace-normal sm:line-clamp-2">
                    {formatLaptopName(laptop.name, laptop.specifications)}
                </CardTitle>
                <div className="flex flex-col items-start mt-2">
                    <span className="text-blue-500 font-bold text-[14px]">
                        {formatPrice(laptop.discountPrice)}
                    </span>
                    <span className="text-gray-500 line-through text-[13px]">
                        {formatPrice(laptop.price)}
                    </span>
                </div>
            </CardContent>
            <CardFooter className="w-full p-0 mt-2">
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
                    className="w-full text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white"
                    variant="ghost"
                >
                    Thêm vào giỏ hàng
                </Button>
            </CardFooter>
        </Card>
    )
}