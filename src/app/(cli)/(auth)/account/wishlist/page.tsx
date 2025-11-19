'use client';

import React, { useState, useEffect } from 'react';
import { useWishlist } from '@/hooks/useWishlist';
import { ILaptop } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/atoms/ui/Button';
import { formatPrice, formatLaptopName } from '@/lib/utils';
import useCartStore from '@/store/cartStore';
import { toast } from '@/hooks/use-toast';
import Panigation from '@/components/common/Panigation';

export default function WishlistPage() {
  const { wishlist, loading, fetchWishlist, toggleWishlist, isChecking } = useWishlist();
  const { addToCart } = useCartStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const loadWishlist = async () => {
      const data = await fetchWishlist(currentPage, itemsPerPage);
      if (data) {
        setTotalPages(data.totalPages);
      }
    };
    loadWishlist();
  }, [currentPage, fetchWishlist]);

  const handleRemoveFromWishlist = async (laptopId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(laptopId);
  };

  const handleAddToCart = (laptop: ILaptop, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      _id: laptop._id,
      name: laptop.name,
      price: laptop.price,
      discountPrice: laptop.discountPrice!,
      image: laptop.images[0]?.imageUrl || '',
    });
    toast({
      description: `Đã thêm "${laptop.name}" vào giỏ hàng!`,
      duration: 2000,
    });
  };

  if (loading && wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <LoaderCircle className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 fill-red-500" />
            Danh sách yêu thích
          </h1>
          <p className="text-gray-600">
            {wishlist.length > 0 ? `${wishlist.length} sản phẩm` : 'Chưa có sản phẩm nào'}
          </p>
        </div>

        {/* Wishlist Grid */}
        {wishlist.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Danh sách yêu thích trống</h2>
            <p className="text-gray-600 mb-6">Bạn chưa có sản phẩm nào trong danh sách yêu thích</p>
            <Link href="/laptop">
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                Khám phá sản phẩm
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {wishlist.map((item) => {
                const laptop = typeof item.laptopId === 'object' ? item.laptopId : null;
                if (!laptop) return null;

                const laptopId = laptop._id;
                const percent =
                  laptop.price && laptop.discountPrice
                    ? Math.round(100 - (laptop.discountPrice / laptop.price) * 100)
                    : 0;

                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-300 group relative"
                  >
                    {/* Remove from wishlist button */}
                    <button
                      onClick={(e) => handleRemoveFromWishlist(laptopId, e)}
                      disabled={isChecking[laptopId]}
                      className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed z-10"
                      aria-label="Xóa khỏi wishlist"
                    >
                      <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                    </button>

                    <Link href={`/laptop/${laptop.slug}`} className="block">
                      {/* Product Image */}
                      <div className="relative aspect-square overflow-hidden rounded-lg mb-3 bg-gray-50">
                        <Image
                          src={laptop.images[0]?.imageUrl || ''}
                          alt={laptop.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                        {percent > 0 && (
                          <span className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-md">
                            -{percent}%
                          </span>
                        )}
                      </div>

                      {/* Product Info */}
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem] mb-2">
                        {formatLaptopName(laptop.name, laptop.specifications)}
                      </h3>

                      {/* Price */}
                      <div className="flex flex-col gap-1 mb-3">
                        <span className="text-blue-600 font-bold text-base">
                          {formatPrice(String(laptop.discountPrice))}
                        </span>
                        {laptop.price && laptop.discountPrice && laptop.price > laptop.discountPrice && (
                          <span className="text-gray-500 line-through text-xs">
                            {formatPrice(String(laptop.price))}
                          </span>
                        )}
                      </div>
                    </Link>

                    {/* Add to Cart Button */}
                    <Button
                      onClick={(e) => handleAddToCart(laptop, e)}
                      className="w-full text-xs sm:text-sm text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white py-2 flex items-center justify-center gap-1.5"
                      variant="outline"
                    >
                      <ShoppingCart className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">Thêm vào giỏ hàng</span>
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Panigation
                  totalPages={totalPages}
                  page={currentPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

