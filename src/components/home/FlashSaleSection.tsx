import Image from "next/image";
import type { StaticImageData } from "next/image";
import FlashSaleProductCard from "./FlashSaleProductCard";

interface FlashSaleSectionProps {
  flashsaleImg: StaticImageData;
  returnIcon: StaticImageData;
  maintainIcon: StaticImageData;
  freeShipIcon: StaticImageData;
  bannerFlashSale1: StaticImageData;
}

export default function FlashSaleSection({
  flashsaleImg,
  returnIcon,
  maintainIcon,
  freeShipIcon,
  bannerFlashSale1,
}: FlashSaleSectionProps) {
  return (
    <div className="mt-8">
      {/* Flash sale banner */}
      <div className="flex justify-center items-center gap-x-2.5">
        <Image src={flashsaleImg || "/placeholder.svg"} alt="flashsale" />
        <div className="flex justify-center items-center gap-x-2">
          <Image
            src={returnIcon || "/placeholder.svg"}
            alt="hoan-hang-mien-phi-trong-15-ngay"
          />
          <p className="font-normal text-base">Trả hàng miễn phí 15 ngày</p>
        </div>
        <div className="flex justify-center items-center gap-x-2">
          <Image
            src={maintainIcon || "/placeholder.svg"}
            alt="bao-hanh-chinh-hang"
          />
          <p className="font-normal text-base">Hàng chính hãng 100%</p>
        </div>
        <div className="flex justify-center items-center gap-x-2">
          <Image
            src={freeShipIcon || "/placeholder.svg"}
            alt="Mien-phi-van-chuyen"
          />
          <p className="font-normal text-base">Miễn phí vận chuyển</p>
        </div>
      </div>

      {/* Section flash sale 1 */}
      <div className="mx-auto 2xl:w-10/12 h-96 border-2 border-[#F96262] rounded-xl">
        <div className="w-full">
          <Image
            className="w-full h-auto"
            src={bannerFlashSale1 || "/placeholder.svg"}
            alt="bannerfFashSale1"
          />
        </div>
        <FlashSaleProductCard data={"dd"} />
      </div>
    </div>
  );
}
