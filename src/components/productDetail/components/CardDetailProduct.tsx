'use client';
import Image from "next/image";
import Frame_48 from "/public/Frame 48.png";
import { cn } from "@/lib/utils";
import { ProductVariantDetail } from "@/types";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import useCartStore from "@/store/cartStore";
import { toast, useToast } from "@/hooks/use-toast";

const CardDetailProduct = ({ data }: { data: ProductVariantDetail }) => {
  const [thumbnail, setThumbnail] = useState(data.images[0].imageUrl);
  const [isRender, setIsRender] = useState(0); // State to manage the image click rendering

  const handleClickImage = (index: number) => {
    // Handle image click logic here
    setThumbnail(data.images[index].imageUrl);
    setIsRender(index)
  }

  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    const product = {
      _id: data._id,
      variantName: data.variantName,
      variantPrice: data.variantPrice,
      variantPriceSale: data.variantPriceSale,
      variantStock: data.variantStock, // Include the variantStock property
      quantity: 1,
      image: data.images[0].imageUrl, // Use the selected thumbnail image
    };
    addToCart(product);

    toast({
      description: `Đã thêm "${product.variantName}" vào giỏ hàng!`,
      duration: 1000, // Thời gian hiển thị (1 giây)
    });

  };

  const handleBuyNow = () => {
    const product = {
      _id: data._id,
      variantName: data.variantName,
      variantPrice: data.variantPrice,
      variantPriceSale: data.variantPriceSale,
      variantStock: data.variantStock, 
      quantity: 1,
      image: data.images[0].imageUrl,
    };
    addToCart(product);
    toast({
      description: `Đã thêm "${product.variantName}" vào giỏ hàng!`,
      duration: 1000, // Thời gian hiển thị (1 giây)
    });
    // Redirect to checkout page
    window.location.href = "/cart";
  }
  return (
    <div className="w-[75%] p-6 bg-white rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images Section */}
        <div className="space-y-4">
          <div className="min-h-72 rounded-xl p-8 flex items-center justify-center">
            <Image
              src={thumbnail}
              width={300}
              height={300}
              alt="Mac Mini M4"
              className="size-full object-cover"
            />
          </div>
          <div className="flex space-x-4">
            {data.images.map((img, index) => (
              <button
                key={index}
                className={cn(
                  "border rounded p-2 w-16 h-16 flex items-center justify-center",
                  isRender === index && "border-blue-600"
                )}
                onClick={() => { handleClickImage(index) }}
              >
                <Image
                  src={img.imageUrl}
                  alt={`Mac Mini view ${index}`}
                  width={50}
                  height={50}
                  className="w-12 h-12 object-contain"
                />
              </button>
            ))}
          </div>
          <hr className="my-5 border-dashed" />
          {/* Description Section */}
          <div className="mt-8 text-gray-600">
            <span>
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout. The
              point of using Lorem Ipsum is that It is a long established fact
              that a reader will be distracted by the readable content of a page
              when looking at its layout. The point of using Lorem Ipsum is
              that...
            </span>
            <button className="text-blue-600 hover:text-blue-700">
              {" "}
              SeeMore
            </button>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {data.variantName}
            </h1>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Thương hiệu</span>
              <a href="#" className="text-blue-600 underline">
                {null}
              </a>
              {/* <span>SKU: 24110612</span> */}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-2xl font-bold text-blue-600">
              {data.variantPrice.toLocaleString("vi-VN", {})}đ
            </span>
            <span className="block text-gray-500 line-through">
              {data.variantPrice.toLocaleString("vi-VN", {})}đ
            </span>
          </div>

          {/* Voucher Section */}
          <hr className="border-dashed" />
          <div className="rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg mb-4">Chọn Voucher giảm giá</h3>
            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Image src={data.images[0].imageUrl}
                  alt="Voucher icon"
                  width={32}
                  height={32}
                  className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <p className="font-medium">
                  Giảm 200.000đ (áp dụng vào giá sản phẩm)
                </p>
                <p className="text-sm text-gray-500">
                  Khuyến mãi áp dụng khi mua đủ 1 sản phẩm, mua tối thiểu 1 sản
                  phẩm
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-500 ">HSD: 28/2/2025</p>
                  <button className="text-blue-600 hover:text-blue-700">
                    Bỏ chọn
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
              THÊM VÀO GIỎ HÀNG
            </Button>
            <Button
              onClick={handleBuyNow}
              className="flex-1 border border-blue-600 bg-white text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-colors">
              MUA NGAY
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailProduct;
