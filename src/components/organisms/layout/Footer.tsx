import Link from "next/link";
import Image from "next/image";
import React from "react";
export default function Footer() {
  return (
    <footer className="w-full mx-auto pt-12 sm:pt-16 md:pt-24 pb-8 sm:pb-12 md:pb-16 bg-white mt-16 sm:mt-20 md:mt-24">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-8 sm:pt-12 md:pt-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div>
            <p className="text-lg sm:text-xl md:text-2xl font-bold">
              Đăng ký nhận bản tin để cập nhật thông tin mới nhất.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-2 sm:gap-4 mt-4">
              <input
                className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Địa chỉ email"
                type="email"
              />
              <button className="px-4 sm:px-6 py-2 sm:py-[10px] bg-blue-600 text-white rounded-lg whitespace-nowrap hover:bg-blue-700 transition-colors font-medium shadow-sm">
                Đăng ký
              </button>
            </div>
          </div>

          <div className="mx-auto md:mx-0">
            <p className="text-base sm:text-lg font-semibold text-gray-900">Liên Kết Nhanh</p>
            <div className="mt-4 sm:mt-5 space-y-2">
              <p className="text-sm sm:text-base font-normal text-gray-600 hover:text-blue-600 transition-colors">
                <Link href={"/"}>Trang Chủ</Link>
              </p>
              <p className="text-sm sm:text-base font-normal text-gray-600 hover:text-blue-600 transition-colors">
                <Link href={"/lien-he"}>Liên Hệ</Link>
              </p>
            </div>
          </div>

          <div className="mx-auto md:mx-0">
            <p className="text-base sm:text-lg font-semibold text-gray-900">Ngành Nghề</p>
            <div className="mt-4 sm:mt-5 space-y-2">
              <p className="text-sm sm:text-base font-normal text-gray-600 hover:text-blue-600 transition-colors">
                <Link href={""}>Bán Lẻ & Thương Mại Điện Tử</Link>
              </p>
              <p className="text-sm sm:text-base font-normal text-gray-600 hover:text-blue-600 transition-colors">
                <Link href={""}>Công Nghệ Thông Tin</Link>
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 sm:mt-8 h-[1px] w-full bg-gray-200"></div>
        <div className="my-6 sm:my-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/logo-icon.svg"
              alt="E-COM Logo"
              width={32}
              height={32}
              className="sm:w-10 sm:h-10"
            />
            <span className="text-sm sm:text-base font-semibold text-gray-900">E-COM</span>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-xs sm:text-sm md:text-base font-normal text-gray-600 text-center sm:text-left">
              Coppy right @2025 by E-COM Store. Design by E-COM Store
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
