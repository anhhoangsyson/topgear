'use client'
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import useCartStore from '@/store/cartStore'
import { toast, useToast } from "@/hooks/use-toast";
import { caculateSalePercent } from "@/lib/utils";

interface ProductCardProps {
  product: {
    _id: string;
    variantName: string,
    variantStock: number,
    variantPrice: number,
    variantPriceSale: number,
    images: [
      {
        imageUrl: string;
      }
    ]
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const addToCart = useCartStore((state) => state.addToCart);
  const handleAddToCart = () => {
    addToCart({ ...product, quantity: 1, image: product.images[0]?.imageUrl || "/placeholder.svg" })
    toast({
      description: `Đã thêm "${product.variantName}" vào giỏ hàng!`,
      duration: 1000,
    });
  }
  const { _id, variantName, variantPrice, variantPriceSale, images } = product;
  // const salePercent = (100 - (variantPriceSale / variantPrice * 100)).toFixed(0) + "%";
  const salePercent=caculateSalePercent(variantPrice, variantPriceSale)
  // Format price with commas
  const formattedPrice = new Intl.NumberFormat("vi-VN").format(variantPriceSale);

  return (
    <figure className="relative w-[220px] grid grid-cols-1 gap-y-2 shadow-sm pb-8 bg-white rounded">
      <div className="h-[240px] flex justify-center items-center">
        <Link href={`/products/${_id}`}>
          <div className="w-full h-full flex justify-center items-center">
            <Image
              className=" h-auto "
              src={images[0]?.imageUrl || "/placeholder.svg"}
              alt={variantName}
              width={180}
              height={300}
            />
            <p
            className="absolute top-0 right-0 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded"
            >-{salePercent}</p>
          </div>
        </Link>
      </div>
      {/* Product name and detail */}
      <div className="w-11/12 mx-auto">
        <p className="text-[13.5px] font-semibold">{variantName}</p>
      </div>
      {/* Product price */}
      <div className="w-11/12 mx-auto flex gap-x-8 items-center justify-start">
        <strong className="text-[12px] text-red-600">{variantPrice.toLocaleString(
          "vi-VN",
          {
            style: "currency",
            currency: "VND",
          }
        )} VND</strong>
        <p className="text-[12px] text-gray-800 line-through">{variantPrice.toLocaleString(
          "vi-VN",
          {
            style: "currency",
            currency: "VND",
          }
        )}</p>
      </div>
      {/* Product action */}
      <div className="flex justify-around">
        <Button
          variant="ghost"
          size={"sm"}
        >
          <Link href={`/products/${_id}`}>

            <span className="text-xs">Xem chi tiết</span>
          </Link>
        </Button>

        <Button
          variant={"default"}
          size={"sm"}
          onClick={handleAddToCart}
          disabled={product.variantStock <= 0}
        >
          <span className="text-[13px]">Thêm vào giỏ</span>
        </Button>
      </div>
    </figure>
  );
}
