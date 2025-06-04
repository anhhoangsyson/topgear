'use client'
import { ISpecifications } from "@/types";
import React, { useEffect, useRef, useState } from "react";

const LeftSideDetailLaptop = ({ data }: { data: ISpecifications }) => {
  const specList = [
    { label: "CPU", value: data.processor + (data.processorGen ? ` (${data.processorGen})` : "") + (data.processorSpeed ? ` - ${data.processorSpeed} GHz` : "") },
    { label: "RAM", value: `${data.ram} GB${data.ramType ? ` (${data.ramType})` : ""}` },
    { label: "Ổ cứng", value: `${data.storage} GB${data.storageType ? ` (${data.storageType})` : ""}` },
    { label: "Card đồ họa", value: data.graphicsCard ? `${data.graphicsCard}${data.graphicsMemory ? ` - ${data.graphicsMemory} GB` : ""}` : "" },
    { label: "Màn hình", value: `${data.displaySize}"${data.displayResolution ? ` - ${data.displayResolution}` : ""}${data.displayType ? ` (${data.displayType})` : ""}${data.refreshRate ? ` - ${data.refreshRate}Hz` : ""}${data.touchscreen ? " - Cảm ứng" : ""}` },
    { label: "Pin", value: `${data.battery || ""}${data.batteryLife ? ` - ${data.batteryLife} giờ` : ""}` },
    { label: "Hệ điều hành", value: data.operatingSystem || "" },
    { label: "Cổng kết nối", value: data.ports?.join(", ") || "" },
    { label: "Webcam", value: data.webcam || "" },
    { label: "Bàn phím", value: data.keyboard || "" },
    { label: "Loa", value: data.speakers || "" },
    { label: "Kết nối không dây", value: data.connectivity || "" },
  ];

  const [showAll, setShowAll] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const [needShowButton, setNeedShowButton] = useState(false);

  // check if the list is scrollable
  useEffect(() => {
    if (listRef.current) {
      setNeedShowButton(listRef.current.scrollHeight > 156); // 256px = max-h-64
    }
  }, []);
  return (
    <div className="bg-white rounded p-4 space-y-8 w-[30%]">
      <h2 className="font-semibold text-xl">Thông tin chi tiết</h2>
      <ul
        ref={listRef}
        className={`space-y-2 pr-2 transition-all duration-300 ${showAll ? "" : "max-h-64 overflow-hidden"}`}
      >
        {specList.map(
          (item, idx) =>
            item.value && (
              <li key={idx}
                className={`flex justify-between items-start my-4 px-2 rounded min-h-20 p-2 ${idx % 2 === 0 ? "bg-white" : "bg-gray-100"
                  }`}
              >
                <span className="min-w-[120px] text-sm text-gray-600">{item.label}:</span>
                <span className="ml-2 text-sm font-semibold break-words">{item.value}</span>
              </li>
            )
        )}
      </ul>
      {/* xem themm */}
      {needShowButton && (
        <button
          className="w-full text-blue-500 py-2 rounded-lg hover:underline"
          onClick={() => setShowAll((v) => !v)}
        >
          {showAll ? "Thu gọn" : "Xem thêm"}
        </button>
      )}
    
    </div>
  );
};

export default LeftSideDetailLaptop;
