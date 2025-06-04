'use client'
import { IBrand } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function BrandCard({ brand }: { brand: IBrand }) {

    return (
        <Link
            href={`/laptop/brand/${brand.slug}`}
            key={brand._id}
            className="flex flex-col items-center hover:scale-105 transition-transform duration-300 ease-in-out hover:cursor-pointer">
            <Image
                width={100}
                height={100}
                src={brand.logo}
                alt={brand.name}
                className="h-12 w-auto object-contain mb-2 bg-transparent shadow-none fillter-none"
                loading="lazy"

            />
            <span className="text-sm text-center font-semibold text-gray-700">{brand.name}</span>
        </Link>
    )
}
