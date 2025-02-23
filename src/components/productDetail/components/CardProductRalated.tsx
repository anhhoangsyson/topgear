import React from "react";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";

interface ProductCardProps {
  product: ProductRelated;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 max-w-[300px] h-[350px]">
      <Image
        src={product?.imageUrl}
        alt={product?.name}
        className="w-full h-48  object-contain rounded-lg mb-4"
        width={300}
        height={300}
      />
      <h3 className="text-lg font-semibold text-gray-800 truncate">
        {product?.name}
      </h3>
      <p className="text-gray-600">Giá: {product?.price}</p>
      <button className="mt-4 bg-[#0E1746] text-white rounded-md px-4 py-2 w-full flex items-center justify-center gap-2">
        <ShoppingCart size={18} />
        Thêm vào giỏ hàng
      </button>
    </div>
  );
};

export default ProductCard;
