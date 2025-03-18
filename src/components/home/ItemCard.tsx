import Image from "next/image";
import React from "react";

export const ItemCard = ({ name, img, hot }: Item) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <Image src={img} alt="item" width={80} height={80} />
        {hot && (
          <div className="absolute top-0 right-0 bg-red-400 text-red-600 px-2 py-1 rounded-full text-xs">
            Hot
          </div>
        )}
      </div>
      <div className="text-sm">{name}</div>
    </div>
  );
};
