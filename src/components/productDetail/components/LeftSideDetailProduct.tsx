import { cn } from "@/lib/utils";
import React from "react";

const LeftSideDetailProduct = ({ data }: { data: { attributeName: string, attributeValue: string }[] }) => {
  return (
    <div className="bg-white p-4 space-y-8 w-[30%]">
      <h2 className="font-semibold text-xl">Thông tin chi tiết</h2>
      <div className="max-h-[700px]">
        {data.map((item, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center gap-12 list-none py-2 px-4 rounded-lg",
              index % 2 === 0 && "bg-gray-100"
            )}
          >
            <span className="min-w-[30%] text-sm text-nowrap">{item.attributeName}</span>
            <span className="text-sm font-semibold text-nowrap truncate">{item.attributeValue}</span>
          </div>
        ))}
      </div>
      <button className="w-full text-blue-500 py-2 rounded-lg">
        Xem thêm nội dung
      </button>
    </div>
  );
};

export default LeftSideDetailProduct;
