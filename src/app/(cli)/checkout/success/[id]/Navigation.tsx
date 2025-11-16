'use client'
import { Button } from '@/components/atoms/ui/Button'
import React from 'react'
import Link from 'next/link'
import { ShoppingBag, Package } from 'lucide-react'

export default function Navigation() {
  return (
    <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-center relative z-10'>
      <Link href="/" className="w-full sm:w-auto">
        <Button
          className='w-full sm:px-8 py-6 sm:py-3 bg-blue-600 text-white hover:bg-blue-700 transition-colors font-semibold shadow-lg hover:shadow-xl'
          size="lg"
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          Tiếp tục mua hàng
        </Button>
      </Link>

      <Link href="/account/orders" className="w-full sm:w-auto">
        <Button
          variant="outline"
          className='w-full sm:px-8 py-6 sm:py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors font-semibold'
          size="lg"
        >
          <Package className="w-4 h-4 mr-2" />
          Xem đơn hàng của tôi
        </Button>
      </Link>
    </div>
  )
}
