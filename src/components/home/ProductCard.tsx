import { ProductData } from "@/app/(client)/page";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: ProductData;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { id, name, description, price, image } = product;

  // Format price with commas
  const formattedPrice = new Intl.NumberFormat("vi-VN").format(price);

  return (
    <figure className="w-80 grid grid-cols-1 gap-y-2 shadow-2xl py-8">
      <div className="h-[270px]">
        <Link href={`/product/${id}`}>
          <Image
            className="h-auto"
            src={image || "/placeholder.svg"}
            alt={name}
            width={320}
            height={300}
          />
        </Link>
      </div>
      {/* Product name and detail */}
      <div className="w-11/12 mx-auto">
        <p className="text-lg font-semibold">{name}</p>
        <p className="text-md font-normal truncate">{description}</p>
      </div>
      {/* Product price */}
      <div className="w-11/12 mx-auto flex gap-x-1 items-end justify-start">
        <p className="text-xs text-gray-500">Giá tiền: </p>
        <strong className="text-sm text-red-600">{formattedPrice} VND</strong>
      </div>
      {/* Product action */}
      <div className="flex justify-around">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-xl">
          Thêm vào giỏ hàng
        </button>
        <button className="px-4 py-2 bg-red-500 text-white rounded-xl">
          Mua ngay
        </button>
      </div>
    </figure>
  );
}
