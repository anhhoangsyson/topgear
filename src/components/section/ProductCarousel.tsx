"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/Button"

interface Product {
  id: number
  name: string
  image: string
  price: number
  originalPrice: number
  soldCount: number
  totalCount: number
  status: string
}

export default function ProductCarousel() {
  const products: Product[] = [
    {
      id: 1,
      name: "Máy chơi Game cầm tay",
      image: "/placeholder.svg?height=200&width=200",
      price: 4290000,
      originalPrice: 4290000,
      soldCount: 0,
      totalCount: 5,
      status: "Sắp diễn ra",
    },
    {
      id: 2,
      name: "Máy chơi Game cầm tay",
      image: "/placeholder.svg?height=200&width=200",
      price: 4290000,
      originalPrice: 4290000,
      soldCount: 0,
      totalCount: 5,
      status: "Sắp diễn ra",
    },
    {
      id: 3,
      name: "Máy chơi Game cầm tay",
      image: "/placeholder.svg?height=200&width=200",
      price: 4290000,
      originalPrice: 4290000,
      soldCount: 0,
      totalCount: 5,
      status: "Sắp diễn ra",
    },
    {
      id: 4,
      name: "Máy chơi Game cầm tay",
      image: "/placeholder.svg?height=200&width=200",
      price: 4290000,
      originalPrice: 4290000,
      soldCount: 0,
      totalCount: 5,
      status: "Sắp diễn ra",
    },
    {
      id: 5,
      name: "Máy chơi Game cầm tay",
      image: "/placeholder.svg?height=200&width=200",
      price: 4290000,
      originalPrice: 4290000,
      soldCount: 0,
      totalCount: 5,
      status: "Sắp diễn ra",
    },
    {
      id: 6,
      name: "Máy chơi Game cầm tay",
      image: "/placeholder.svg?height=200&width=200",
      price: 4290000,
      originalPrice: 4290000,
      soldCount: 0,
      totalCount: 5,
      status: "Sắp diễn ra",
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerPage = {
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1 >= products.length - (itemsPerPage.xl - 1) ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 < 0 ? products.length - itemsPerPage.xl : prevIndex - 1))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price)
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 border border-pink-500 rounded-lg">
      {/* Header with pink background and teddy bears */}
      <div className="relative w-full h-24 md:h-28 bg-pink-200 rounded-t-lg mb-4 overflow-hidden">
        <div className="absolute inset-0 bg-pink-200">{/* Background pattern or teddy bears would go here */}</div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <h2 className="text-2xl md:text-3xl font-bold text-pink-600 tracking-wider drop-shadow-md">
            GIẢM SỐC <span className="mx-1">⚡</span> SẢN THẦN TỐC
          </h2>
        </div>
      </div>

      {/* Product Carousel */}
      <div className="relative">
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md hover:bg-white"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage.xl)}%)` }}
          >
            {products.map((product) => (
              <div key={product.id} className="w-full sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-2">
                <div className="border border-pink-200 rounded-lg overflow-hidden flex flex-col h-full">
                  <div className="p-4 flex items-center justify-center">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={150}
                      height={150}
                      className="object-contain h-32 w-auto"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-medium text-gray-800">{product.name}</h3>
                  </div>
                  <div className="mt-auto">
                    <div className="bg-red-100 py-1 px-2 text-center text-sm">
                      Đã bán {product.soldCount}/{product.totalCount} suất
                    </div>
                    <div className="p-3 flex flex-col items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-red-600">{formatPrice(product.price)} VND</span>
                        {product.originalPrice > product.price && (
                          <span className="text-gray-500 line-through text-sm">
                            {formatPrice(product.originalPrice)} VND
                          </span>
                        )}
                      </div>
                      <Button className="mt-2 bg-red-500 hover:bg-red-600 text-white rounded-full px-4 py-1 text-sm">
                        {product.status}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md hover:bg-white"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
}

