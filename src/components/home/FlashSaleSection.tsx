import Image from "next/image";
import type { StaticImageData } from "next/image";
import FlashSaleProductCard from "./FlashSaleProductCard";

interface FlashSaleSectionProps {
  bannerFlashSale1: StaticImageData;
  data: CartFlashSale[];
}

export default function FlashSaleSection({
  bannerFlashSale1,
  data,
}: FlashSaleSectionProps) {
  return (
    <div className="mt-8 bg-white">
      {/* Section flash sale 1 */}
      <div className="mx-auto 2xl:w-10/12 border-2 border-[#F96262] rounded-xl">
        <div className="w-full">
          <Image
            className="w-full h-auto"
            src={bannerFlashSale1 || "/placeholder.svg"}
            alt="bannerfFashSale1"
          />
        </div>
        <FlashSaleProductCard data={data} />
      </div>
    </div>
  );
}
