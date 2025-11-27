"use client";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ILaptop } from "@/types";
import { useState } from "react";
import useCartStore from "@/store/cartStore";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/atoms/ui/Button";
import StarRating from "@/components/molecules/cards/StarRating";
import { ShoppingCart, ExternalLink, ChevronRight, Tag, Award } from "lucide-react";
import { Badge } from "@/components/atoms/ui/badge";

const CardDetailLaptop = ({ data }: { data: ILaptop }) => {

  const [thumbnail, setThumbnail] = useState(data.images[0]?.imageUrl);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showFullDesc, setShowFullDesc] = useState(false);

  const handleClickImage = (index: number) => {
    setThumbnail(data.images[index]?.imageUrl);
    setSelectedImageIndex(index);
  };

  const { addToCart } = useCartStore();

  const handleAddToCart = (laptop: ILaptop) => {
    addToCart({
      _id: laptop._id,
      name: laptop.name,
      price: laptop.price,
      discountPrice: laptop.discountPrice!,
      image: laptop.images[0].imageUrl,
    });

    toast({
      description: `Đã thêm "${laptop.name}" vào giỏ hàng!`,
      duration: 2000,
    });
  };

  const handleBuyNow = (laptop: ILaptop) => {
    addToCart({
      _id: laptop._id,
      name: laptop.name,
      price: laptop.price,
      discountPrice: laptop.discountPrice!,
      image: laptop.images[0].imageUrl,
    });
    toast({
      description: `Đã thêm "${laptop.name}" vào giỏ hàng!`,
      duration: 2000,
    });
    window.location.href = "/cart";
  };

  const discountPercentage = data.discountPrice && data.price
    ? Math.round(((data.price - data.discountPrice) / data.price) * 100)
    : 0;

  return (
    <div className="w-full lg:w-[68%] bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Product Images Section */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square bg-gray-50 rounded-xl p-4 sm:p-6 lg:p-8 flex items-center justify-center border border-gray-200 group">
            {thumbnail ? (
              <div className="relative w-full h-full">
                <Image
                  onClick={() => window.open(thumbnail, "_blank")}
                  src={thumbnail}
                  fill
                  alt={data.name || "Product"}
                  className="object-contain cursor-zoom-in hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-5 h-5 text-gray-600 bg-white/80 p-1 rounded" />
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-center">
                <p className="text-sm">Không có hình ảnh</p>
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {data.images.length > 1 && (
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {data.images.map((img, index) => (
                <button
                  key={index}
                  className={cn(
                    "flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 p-1 transition-all",
                    selectedImageIndex === index
                      ? "border-blue-600 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                  onClick={() => handleClickImage(index)}
                >
                  {img.imageUrl ? (
                    <div className="relative w-full h-full rounded">
                      <Image
                        src={img.imageUrl}
                        alt={`${data.name} view ${index + 1}`}
                        fill
                        className="object-cover rounded"
                        sizes="64px"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-400">N/A</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Description Section */}
          {data.description && (
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Mô tả sản phẩm</h3>
              <div className="text-sm text-gray-600 leading-relaxed">
                <p className={cn(!showFullDesc && "line-clamp-3")}>
                  {data.description}
                </p>
                {data.description.length > 150 && (
                  <button
                    className="text-blue-600 hover:text-blue-700 font-medium mt-2 flex items-center gap-1 text-sm"
                    onClick={() => setShowFullDesc(!showFullDesc)}
                  >
                    {showFullDesc ? (
                      <>
                        Thu gọn <ChevronRight className="w-4 h-4 rotate-90" />
                      </>
                    ) : (
                      <>
                        Xem thêm <ChevronRight className="w-4 h-4 -rotate-90" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="space-y-4 sm:space-y-6">
          {/* Title & Meta */}
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight">
              {data.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                <span>Thương hiệu:</span>
                <Link
                  href={`/laptop?brand=${data.brandId._id}`}
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                  {data.brandId.name}
                </Link>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                <span>Danh mục:</span>
                <Link
                  href={`/laptop?category=${data.categoryId._id}`}
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                  {data.categoryId.name}
                </Link>
              </div>
            </div>
          </div>

          {/* Price Section */}
          <div className="space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-100">
            {discountPercentage > 0 && (
              <Badge className="bg-red-500 text-white mb-2">
                Giảm {discountPercentage}%
              </Badge>
            )}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                {data.discountPrice?.toLocaleString("vi-VN") || data.price.toLocaleString("vi-VN")}đ
              </span>
              {data.discountPrice && data.price > data.discountPrice && (
                <span className="text-lg text-gray-500 line-through">
                  {data.price.toLocaleString("vi-VN")}đ
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {data.stock > 0 ? (
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                onClick={() => handleAddToCart(data)}
                className="flex-1 bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm sm:text-base min-w-0"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                <span className="truncate">Thêm vào giỏ hàng</span>
              </Button>
              <Button
                onClick={() => handleBuyNow(data)}
                variant="outline"
                className="flex-1 border-2 border-blue-600 text-blue-600 py-2.5 sm:py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-sm sm:text-base min-w-0"
              >
                <span className="truncate">Mua ngay</span>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="text-red-600 font-semibold">Hết hàng</div>
            </div>
          )}

          {/* Rating Section */}
          <div className="p-4 sm:p-5 rounded-lg border border-gray-200 bg-gray-50">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
              Đánh giá sản phẩm
            </h3>
            {data.ratings ? (
              <StarRating rating={data.ratings.average} ratingCount={data.ratings.count} />
            ) : (
              <div className="text-sm text-gray-500">
                <p>Chưa có đánh giá</p>
                <p className="text-xs mt-1">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailLaptop;
