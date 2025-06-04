'use client'
import { Card, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/Button'
import { formatLaptopName, formatPrice } from '@/lib/utils'
import useCartStore from '@/store/cartStore'
import { ILaptop } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function LaptopCardSecond({ laptop }: { laptop: ILaptop }) {
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
              
            </Link>
            <CardContent className="flex flex-col min-h-32 py-2 w-full">
                <CardTitle className="text-[11px] font-normal h-full max-h-20 overflow-hidden text-ellipsis  sm:whitespace-normal sm:line-clamp-2">
                    {formatLaptopName(laptop.name, laptop.specifications)}
                </CardTitle>
            </CardContent>
          
        </Card>
    )
}