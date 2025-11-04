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
        <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-all duration-300 p-2 sm:p-3">
            <Link className="w-full h-auto relative block mb-2"
                href={`/laptop/${laptop.slug}`}
            >
                <div className="relative w-full aspect-square overflow-hidden rounded">
                    <Image
                        className="w-full h-full object-cover"
                        src={laptop.images[0].imageUrl}
                        alt={laptop.images[0].altText || laptop.name}
                        width={300}
                        height={300}
                    />
                </div>
                {percent > 0 && (
                    <span className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs sm:text-sm font-semibold rounded shadow-md">
                        -{percent}%
                    </span>
                )}
            </Link>
            <CardContent className="flex flex-col flex-1 py-2 w-full px-1">
                <CardTitle className="text-xs sm:text-sm font-normal line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] mb-2">
                    {formatLaptopName(laptop.name, laptop.specifications)}
                </CardTitle>
                <div className="flex flex-col items-start mt-auto gap-1">
                    <span className="text-blue-500 font-bold text-sm sm:text-base break-words">
                        {formatPrice(laptop.discountPrice)}
                    </span>
                    {laptop.price && laptop.price > laptop.discountPrice && (
                        <span className="text-gray-500 line-through text-xs sm:text-sm">
                            {formatPrice(laptop.price)}
                        </span>
                    )}
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
                    className="w-full text-xs sm:text-sm text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white py-2 px-2 sm:px-4 whitespace-nowrap"
                    variant="ghost"
                >
                    Thêm vào giỏ hàng
                </Button>
            </CardFooter>
        </Card>
    )
}