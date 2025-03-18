import Image from "next/image";

interface FlashSaleProductCardProps {
  data: CartFlashSale[];
}

const Card = ({ name, price, sale, image }: CartFlashSale) => (
  <div className="flex flex-col items-center gap-2 ">
    <div className=" border-4 h-[203px] border-red-400 rounded-lg p-4">
      <Image src={image} alt="item" className="" />
      <div className="text-sm text-[15px] font-semibold text-center">
        {name}
      </div>
    </div>
    <div className="w-full rounded-full font-bold text-center bg-red-400 text-[10px] text-white">
      Đã bán 0/5 suất
    </div>
    <div className="w-full flex items-center justify-between">
      <div className="space-y-2 text-[10px] font-bold">
        <div>{price}</div>
        <del className="text-gray-400">{sale}</del>
      </div>
      <div className="text-white py-2 px-3 bg-red-400 rounded-full font-bold text-[10px]">
        Sắp diễn ra
      </div>
    </div>
  </div>
);
export default function FlashSaleProductCard({
  data,
}: FlashSaleProductCardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:grid-cols-4 px-20 py-4">
      {data.map((item, index) => (
        <Card key={index} {...item} />
      ))}
    </div>
  );
}
