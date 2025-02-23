import { cn } from "@/lib/utils";
import React from "react";

interface DetailProduct {
  title: string;
  content: string;
}

const ListDetail: DetailProduct[] = [
  {
    title: "Thương hiệu",
    content: "Apple",
  },
  {
    title: "Thương hiệu",
    content: "Apple",
  },
  {
    title: "Thương hiệu",
    content: "Apple",
  },
  {
    title: "Thương hiệu",
    content: "Apple",
  },
  {
    title: "Thương hiệu",
    content: "Apple",
  },
  {
    title: "Thương hiệu",
    content: "Apple",
  },
  {
    title: "Thương hiệu",
    content: "Apple",
  },
];

const LeftSideDetailProduct = () => {
  return (
    <div className="bg-white p-4 space-y-8 w-[25%]">
      <h2 className="font-semibold text-xl">Thông tin chi tiết</h2>
      <div>
        {ListDetail.map((item, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center gap-12 list-none py-2 px-4 rounded-lg",
              index % 2 === 0 && "bg-gray-100"
            )}
          >
            <span className="text-sm">{item.title}</span>
            <span className="text-sm font-semibold">{item.content}</span>
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
