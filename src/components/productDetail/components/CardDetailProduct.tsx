"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ILaptop, ProductVariantDetail } from "@/types";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import useCartStore from "@/store/cartStore";
import { toast } from "@/hooks/use-toast";
import StarRating from "@/components/productDetail/components/StarRating";

const CardDetailLaptop = ({ data }: { data: ILaptop }) => {

  const [thumbnail, setThumbnail] = useState(data.images[0]?.imageUrl);
  const [isRender, setIsRender] = useState(0); // State to manage the image click rendering
  const [showFullDesc, setShowFullDesc] = useState(false);
  const handleClickImage = (index: number) => {
    // Handle image click logic here
    setThumbnail(data.images[index]?.imageUrl);
    setIsRender(index);
  };

  const { addToCart } = useCartStore()

  const handleAddToCart = (laptop: ILaptop) => {
    addToCart({
      _id: laptop._id,
      name: laptop.name,
      price: laptop.price,
      discountPrice: laptop.discountPrice!,
      image: laptop.images[0].imageUrl,
    })

    toast({
      description: `Đã thêm "${laptop.name}" vào giỏ hàng!`,
      duration: 1000, // Thời gian hiển thị (1 giây)
    });
  };

  const handleBuyNow = (laptop: ILaptop) => {
    addToCart({
      _id: laptop._id,
      name: laptop.name,
      price: laptop.price,
      discountPrice: laptop.discountPrice!,
      image: laptop.images[0].imageUrl,
    })
    toast({
      description: `Đã thêm "${laptop.name}" vào giỏ hàng!`,
      duration: 2000, // Thời gian hiển thị (1 giây)
    });
    // Redirect to checkout page
    window.location.href = "/cart";
  };

  return (
    <div className="w-[75%] p-6 bg-white rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images Section */}
        <div className="space-y-4">
          <div className="h-72 rounded-xl p-8 flex items-center justify-center cursor-pointer">
            {thumbnail ? (
              <Image
                onClick={() => window.open(thumbnail, "_blank")}
                src={thumbnail}
                width={300}
                height={300}
                alt="Mac Mini M4"
                className="max-h-full max-w-full object-contain hover:cursor-pointer hover:scale-125 transition-transform duration-300 ease-in-out"
              />
            ) : (
              <div className="text-gray-400">No image available</div>
            )}
          </div>
          <div className="flex space-x-4">
            {data.images.map((img, index) => (
              <button
                key={index}
                className={cn(
                  "border rounded p-2 w-16 h-16 flex items-center justify-center",
                  isRender === index && "border-blue-600"
                )}
                onClick={() => handleClickImage(index)}
              >
                {img.imageUrl ? (
                  <Image
                    src={img.imageUrl}
                    alt={`Mac Mini view ${index}`}
                    width={50}
                    height={50}
                    className="w-12 h-12 object-contain"
                  />
                ) : (
                  <div className="text-xs text-gray-400">No image</div>
                )}
              </button>
            ))}
          </div>

          <hr className="my-5 border-dashed" />
          {/* Description Section */}
          <div className="mt-8 text-gray-600">
            <span>
              {showFullDesc
                ? data.description
                : data.description!.slice(0, 120) + (data.description!.length > 120 ? '...' : '')}
            </span>
            <button
              className="text-blue-600 hover:text-blue-700"
              onClick={() => setShowFullDesc(!showFullDesc)}
            >
              {showFullDesc ? 'Thu gọn' : 'Xem thêm'}
            </button>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">{data.name}</h1>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Thương hiệu</span>
              <a href={`/brand/${data.brandId._id}`} className="text-blue-600 underline">
                {data.brandId.name}
              </a>
              <span>Thể loại</span>
              <a href={`/brand/${data.categoryId._id}`} className="text-blue-600 underline">
                {data.categoryId.name}
              </a>
              {/* <span>SKU: 24110612</span> */}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-2xl font-bold text-blue-600">
              {data.discountPrice!.toLocaleString("vi-VN", {})}đ
            </span>
            <span className="block text-gray-500 line-through">
              {data.price.toLocaleString("vi-VN", {})}đ
            </span>
          </div>
          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              onClick={() => handleAddToCart(data)}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              THÊM VÀO GIỎ HÀNG
            </Button>
            <Button
              onClick={() => handleBuyNow(data)}
              className="flex-1 border border-blue-600 bg-white text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              MUA NGAY
            </Button>
          </div>
          <div className="h-0.5 w-full bg-gray-300"></div>
          <div className="p-4 rounded border border-gray-300">
            <h3 className="text-gray-700 font-bold text-xl pb-2">Đánh giá laptop </h3>
            {data.ratings
              ? <StarRating rating={data.ratings.average} ratingCount={data.ratings.count} />
              : <span className="text-xs text-gray-300">Chưa có đánh giá</span>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailLaptop;
