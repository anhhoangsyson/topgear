'use client'
import { Button } from '@/components/atoms/ui/Button';
import { formatPrice } from '@/lib/utils';
import { OrderDetail } from '@/types';
import Image from 'next/image';
import Link from 'next/link'
import React from 'react'
import { ShoppingCart } from 'lucide-react'

export default function ListOrderDetails({ orderDetails }: { orderDetails: OrderDetail[] }) {
    return (
        <div className="space-y-4">
            {orderDetails.map((item: OrderDetail, index: number) => (
                <div
                    key={index}
                    className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-all"
                >
                    {/* Product Image & Info */}
                    <div className="flex flex-col sm:flex-row gap-4 flex-1 min-w-0">
                        {item.images.length > 0 ? (
                            <Link
                                href={item.slug ? `/laptop/${item.slug}` : '#'}
                                className="flex-shrink-0"
                            >
                                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-white border border-gray-200">
                                    <Image
                                        src={item.images[0].imageUrl || '/cardgift.png'}
                                        alt={item.name || 'Product'}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </Link>
                        ) : (
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                                <ShoppingCart className="w-8 h-8 text-gray-400" />
                            </div>
                        )}

                        <div className="flex-1 min-w-0">
                            <Link
                                href={item.slug ? `/laptop/${item.slug}` : '#'}
                                className="block"
                            >
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                                    {item.name}
                                </h3>
                            </Link>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                <span className="font-medium text-gray-900">
                                    {formatPrice(item.price)}
                                </span>
                                <span className="text-gray-400">×</span>
                                <span className="font-medium">{item.quantity}</span>
                                <span className="text-gray-400">sản phẩm</span>
                            </div>
                        </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 border-t sm:border-t-0 sm:border-l border-gray-200 pt-4 sm:pt-0 sm:pl-6">
                        <div className="flex flex-col items-start sm:items-end">
                            <p className="text-sm text-gray-500 mb-1">Thành tiền</p>
                            <p className="text-lg sm:text-xl font-bold text-gray-900">
                                {formatPrice(item.subTotal)}
                            </p>
                        </div>
                        <Link href={item.slug ? `/laptop/${item.slug}` : '#'} className="w-full sm:w-auto">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                            >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Mua lại
                            </Button>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    )
}
