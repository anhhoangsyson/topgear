'use client'
import { Button } from '@/components/atoms/ui/Button'
import { Card, CardContent, CardFooter, CardTitle } from '@/components/atoms/ui/card'
import { formatLaptopName, formatPrice } from '@/lib/utils'
import useCartStore from '@/store/cartStore'
import { ILaptop } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { toast } from '@/hooks/use-toast'
import { useWishlist } from '@/hooks/useWishlist'
import { Heart } from 'lucide-react'
import { useSession } from 'next-auth/react'

export default function LaptopCard({ laptop }: { laptop: ILaptop }) {
    const { addToCart } = useCartStore()
    const { data: session } = useSession()
    const { toggleWishlist, isChecking, wishlist } = useWishlist()
    const [isInWishlist, setIsInWishlist] = useState(false)

    // Tính phần trăm giảm giá nếu có
    const percent =
        laptop.price && laptop.discountPrice
            ? Math.round(100 - (laptop.discountPrice / laptop.price) * 100)
            : 0

    // Check if laptop is in wishlist
    useEffect(() => {
        if (session && wishlist.length > 0) {
            const inWishlist = wishlist.some(item => {
                const itemLaptopId = typeof item.laptopId === 'string' ? item.laptopId : item.laptopId._id;
                return itemLaptopId === laptop._id;
            });
            setIsInWishlist(inWishlist);
        } else {
            setIsInWishlist(false);
        }
    }, [session, wishlist, laptop._id]);

    const handleWishlistToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        await toggleWishlist(laptop._id);
    };

    return (
        <Card className="flex flex-col h-full shadow-md hover:shadow-xl transition-all duration-300 p-3 sm:p-4">
            <Link className="w-full h-auto relative block mb-3"
                href={`/laptop/${laptop.slug}`}
            >
                <div className="relative w-full aspect-square overflow-hidden rounded-lg">
                    <Image
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        src={laptop.images[0].imageUrl}
                        alt={laptop.images[0].altText || laptop.name}
                        width={300}
                        height={300}
                    />
                    {/* Wishlist Button */}
                    {session && (
                        <button
                            onClick={handleWishlistToggle}
                            disabled={isChecking[laptop._id]}
                            className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed z-10"
                            aria-label={isInWishlist ? 'Xóa khỏi wishlist' : 'Thêm vào wishlist'}
                        >
                            <Heart
                                className={`w-5 h-5 transition-colors ${
                                    isInWishlist
                                        ? 'fill-red-500 text-red-500'
                                        : 'text-gray-600 hover:text-red-500'
                                }`}
                            />
                        </button>
                    )}
                </div>
                {percent > 0 && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-red-500 text-white text-xs sm:text-sm font-semibold rounded-md shadow-lg">
                        -{percent}%
                    </span>
                )}
            </Link>
            <CardContent className="flex flex-col flex-1 py-2 w-full px-2">
                <CardTitle className="text-sm sm:text-base font-medium line-clamp-2 min-h-[3rem] sm:min-h-[3.5rem] mb-3 text-gray-900">
                    {formatLaptopName(laptop.name, laptop.specifications)}
                </CardTitle>
                <div className="flex flex-col items-start mt-auto gap-1.5">
                    <span className="text-blue-600 font-bold text-base sm:text-lg break-words">
                        {formatPrice(String(laptop.discountPrice))}
                    </span>
                    {laptop.price && laptop.discountPrice && laptop.price > laptop.discountPrice && (
                        <span className="text-gray-500 line-through text-xs sm:text-sm">
                            {formatPrice(String(laptop.price))}
                        </span>
                    )}
                </div>
            </CardContent>
            <CardFooter className="w-full p-0 mt-3">
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
                    className="w-full text-sm sm:text-base text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white py-2.5 px-4 whitespace-nowrap font-medium transition-colors"
                    variant="outline"
                >
                    Thêm vào giỏ hàng
                </Button>
            </CardFooter>
        </Card>
    )
}