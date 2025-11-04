'use client'
import { ISpecifications } from "@/types";
import React, { useEffect, useRef, useState } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  Info, 
  Cpu, 
  HardDrive, 
  Monitor, 
  Battery, 
  Zap,
  MemoryStick,
  Radio,
  Webcam,
  Keyboard,
  Volume2,
  Plug,
  Laptop
} from "lucide-react";
import { cn } from "@/lib/utils";

const LeftSideDetailLaptop = ({ data }: { data: ISpecifications }) => {
  const specList = [
    { 
      label: "CPU", 
      value: data.processor + (data.processorGen ? ` (${data.processorGen})` : "") + (data.processorSpeed ? ` - ${data.processorSpeed} GHz` : ""),
      icon: Cpu,
      highlight: true
    },
    { 
      label: "RAM", 
      value: `${data.ram} GB${data.ramType ? ` (${data.ramType})` : ""}`,
      icon: MemoryStick,
      highlight: true
    },
    { 
      label: "Ổ cứng", 
      value: `${data.storage} GB${data.storageType ? ` (${data.storageType})` : ""}`,
      icon: HardDrive,
      highlight: true
    },
    { 
      label: "Card đồ họa", 
      value: data.graphicsCard ? `${data.graphicsCard}${data.graphicsMemory ? ` - ${data.graphicsMemory} GB` : ""}` : "",
      icon: Zap,
      highlight: true
    },
    { 
      label: "Màn hình", 
      value: `${data.displaySize}"${data.displayResolution ? ` - ${data.displayResolution}` : ""}${data.displayType ? ` (${data.displayType})` : ""}${data.refreshRate ? ` - ${data.refreshRate}Hz` : ""}${data.touchscreen ? " - Cảm ứng" : ""}`,
      icon: Monitor,
      highlight: true
    },
    { 
      label: "Pin", 
      value: `${data.battery || ""}${data.batteryLife ? ` - ${data.batteryLife} giờ` : ""}`,
      icon: Battery,
      highlight: false
    },
    { 
      label: "Hệ điều hành", 
      value: data.operatingSystem || "",
      icon: Laptop,
      highlight: false
    },
    { 
      label: "Cổng kết nối", 
      value: data.ports?.join(", ") || "",
      icon: Plug,
      highlight: false
    },
    { 
      label: "Webcam", 
      value: data.webcam || "",
      icon: Webcam,
      highlight: false
    },
    { 
      label: "Bàn phím", 
      value: data.keyboard || "",
      icon: Keyboard,
      highlight: false
    },
    { 
      label: "Loa", 
      value: data.speakers || "",
      icon: Volume2,
      highlight: false
    },
    { 
      label: "Kết nối không dây", 
      value: data.connectivity || "",
      icon: Radio,
      highlight: false
    },
  ].filter(item => item.value && item.value.trim() !== "");

  const [showAll, setShowAll] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const [needShowButton, setNeedShowButton] = useState(false);

  useEffect(() => {
    if (listRef.current) {
      const maxHeight = 500; // Increased for better UX
      setNeedShowButton(listRef.current.scrollHeight > maxHeight);
    }
  }, []);

  return (
    <div className="w-full lg:w-[30%] bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 sticky top-4">
      <div className="flex items-center gap-2 mb-5 sm:mb-6 pb-4 border-b border-gray-200">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Info className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Thông tin chi tiết</h2>
      </div>
      
      <div
        ref={listRef}
        className={cn(
          "space-y-2.5 transition-all duration-300",
          !showAll && "max-h-[500px] overflow-hidden"
        )}
      >
        {specList.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div
              key={idx}
              className={cn(
                "group flex items-start gap-3 p-3 sm:p-4 rounded-xl transition-all duration-200",
                "border border-transparent hover:border-blue-200 hover:bg-blue-50/50",
                item.highlight && "bg-gradient-to-r from-blue-50/50 to-transparent border-blue-100/50"
              )}
            >
              <div className={cn(
                "flex-shrink-0 p-2 rounded-lg transition-colors",
                item.highlight 
                  ? "bg-blue-100 text-blue-600 group-hover:bg-blue-200" 
                  : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
              )}>
                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-xs sm:text-sm font-semibold mb-1",
                      item.highlight ? "text-blue-700" : "text-gray-700"
                    )}>
                      {item.label}
                    </p>
                    <p className="text-sm sm:text-base font-medium text-gray-900 leading-relaxed break-words">
                      {item.value}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {needShowButton && (
        <button
          className="w-full mt-4 flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-semibold py-3 rounded-xl hover:bg-blue-50 transition-all duration-200 border border-transparent hover:border-blue-200 text-sm sm:text-base group"
          onClick={() => setShowAll((v) => !v)}
        >
          {showAll ? (
            <>
              <ChevronUp className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              Thu gọn
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              Xem thêm thông tin
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default LeftSideDetailLaptop;
