'use client'
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import useCartStore from '@/store/cartStore'
import { toast, useToast } from "@/hooks/use-toast";

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
      duration: 1000, // Thời gian hiển thị (3 giây)
    });
  }
  const { _id, variantName, variantPrice, variantPriceSale, images } = product;
  // Format price with commas

  const formattedPrice = new Intl.NumberFormat("vi-VN").format(variantPrice);

  return (
    <figure className="w-60 grid grid-cols-1 gap-y-2 shadow-sm py-8 bg-white">
      <div className="h-[250px]">
        <Link href={`/products/${_id}`}>
          <div className="w-full h-full flex justify-center items-center">
            <Image
              className="h-auto"
              src={images[0]?.imageUrl || "/placeholder.svg"}
              alt={variantName}
              width={180}
              height={300}
            />
          </div>
        </Link>
      </div>
      {/* Product name and detail */}
      <div className="w-11/12 mx-auto">
        <p className="text-base font-semibold">{variantName}</p>
      </div>
      {/* Product price */}
      <div className="w-11/12 mx-auto flex gap-x-1 items-end justify-start">
        <p className="text-xs text-gray-500">Giá tiền: </p>
        <strong className="text-sm text-red-600">{formattedPrice} VND</strong>
      </div>
      {/* Product action */}
      <div className="flex justify-around">
        <Button
          variant="ghost"
          size={"sm"}
        >
          <Link href={`/products/${_id}`}>

            <span className="text-sm">Xem chi tiết</span>
          </Link>
        </Button>

        <Button
          variant={"default"}
          size={"sm"}
          onClick={handleAddToCart}
          disabled={product.variantStock <= 0}
        >
          <span className="text-sm">Thêm vào giỏ</span>
        </Button>
      </div>
    </figure>
  );
}
