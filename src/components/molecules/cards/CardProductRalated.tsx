import React from "react";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { caculateSalePercent, formatPrice } from '../../../lib/utils';
import { Button } from "@/components/atoms/ui/Button";

interface ProductCardProps {
  product: ProductRelated;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const salePercent = parseFloat(caculateSalePercent(parseInt(product.variantPrice), parseInt(product.variantPriceSale)));
  return (
    <div className="relative bg-white rounded-lg shadow-md p-4 max-w-[300px] h-[350px]">
      <Image
        src={product?.image}
        alt={product?.variantName}
        className="w-full h-48  object-contain rounded-lg mb-4"
        width={300}
        height={300}
      />
      {salePercent > 0 &&(
        <p className="absolute top-0 right-0 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
          -{salePercent}</p>
      )}
      
      <h3 className="text-lg font-semibold text-gray-800 truncate">
        {product?.variantName}
      </h3>
      <div className="flex items-center justify-between mt-2">
        <p className="text-gray-700 line-through text-[13px] font-semibold"> {formatPrice(product?.variantPrice)}</p>
        <p className="text-red-600 text-[13px] font-semibold"> {formatPrice(product?.variantPriceSale)}</p>
      </div>
      <Button
        className="w-full mt-4 bg-[#0E1746] text-white hover:bg-white hover:text-[#0E1746] border border-[#0E1746] rounded-md"
        variant={"default"}>
        <ShoppingCart size={16} />
        Thêm vào giỏ hàng
      </Button>
    </div>
  );
};

export default ProductCard;
