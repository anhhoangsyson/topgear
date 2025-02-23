import Image from "next/image";
import Frame_48 from "/public/Frame 48.png";
import { cn } from "@/lib/utils";

const CardDetailProduct = () => {
  return (
    <div className="w-[75%] p-6 bg-white rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images Section */}
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-8 flex items-center justify-center">
            <Image
              src={Frame_48}
              alt="Mac Mini M4"
              className="size-full object-cover"
            />
          </div>
          <div className="flex space-x-4">
            {[1, 2, 3, 4].map((index) => (
              <button
                key={index}
                className={cn(
                  "border rounded p-2 w-16 h-16 flex items-center justify-center",
                  index === 1 && "border-blue-600"
                )}
              >
                <Image
                  src={Frame_48}
                  alt={`Mac Mini view ${index}`}
                  className="w-12 h-12 object-contain"
                />
              </button>
            ))}
          </div>
          <hr className="my-5 border-dashed" />
          {/* Description Section */}
          <div className="mt-8 text-gray-600">
            <span>
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout. The
              point of using Lorem Ipsum is that It is a long established fact
              that a reader will be distracted by the readable content of a page
              when looking at its layout. The point of using Lorem Ipsum is
              that...
            </span>
            <button className="text-blue-600 hover:text-blue-700">
              {" "}
              SeeMore
            </button>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Mac mini M4 (10C CPU/10C GPU/16GB/256GB)
            </h1>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Thương hiệu</span>
              <a href="#" className="text-blue-600 underline">
                APPLE
              </a>
              <span>SKU: 24110612</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-2xl font-bold text-blue-600">
              14.790.000đ
            </span>
            <span className="block text-gray-500 line-through">
              15.479.000đ
            </span>
          </div>

          {/* Voucher Section */}
          <hr className="border-dashed" />
          <div className="rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg mb-4">Chọn Voucher giảm giá</h3>
            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Image src={Frame_48} alt="Voucher icon" className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <p className="font-medium">
                  Giảm 200.000đ (áp dụng vào giá sản phẩm)
                </p>
                <p className="text-sm text-gray-500">
                  Khuyến mãi áp dụng khi mua đủ 1 sản phẩm, mua tối thiểu 1 sản
                  phẩm
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-500 ">HSD: 28/2/2025</p>
                  <button className="text-blue-600 hover:text-blue-700">
                    Bỏ chọn
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
              MUA NGAY
            </button>
            <button className="flex-1 border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-colors">
              THÊM VÀO GIỎ HÀNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailProduct;
