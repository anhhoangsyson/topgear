import Button from "@/components/UI/Button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import img1 from "../../../public/1607431213-guide-to-finding-out-phone-name.avif";
import Wraper from "@/components/core/Wraper";

const categories: Category[] = [
  { id: "0", name: "Tất cả" },
  { id: "1", name: "Laptop" },
  { id: "2", name: "PC, Màn hình, Máy in" },
  { id: "3", name: "Phụ kiện" },
  { id: "4", name: "TV" },
  { id: "5", name: "Âm thanh" },
  { id: "6", name: "Điện thoại" },
  { id: "7", name: "Đồng hồ" },
];

const products: Product[] = [
  {
    id: 1,
    name: "Điện thoại đẹp trai số 1 thế giới",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum, ducimus officiis repellat quibusdam pariatur nesciunt dolor ipsam? Itaque officia minus tempore nesciunt nostrum mollitia, odit harum, fuga accusantium laudantium atque.",
    price: 135000000,
    currency: "VND",
    image: img1,
    category: "Điện thoại",
    isAvailable: true,
  },
  {
    id: 1,
    name: "Điện thoại đẹp trai số 1 thế giới",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum, ducimus officiis repellat quibusdam pariatur nesciunt dolor ipsam? Itaque officia minus tempore nesciunt nostrum mollitia, odit harum, fuga accusantium laudantium atque.",
    price: 135000000,
    currency: "VND",
    image: img1,
    category: "Điện thoại",
    isAvailable: true,
  },
  {
    id: 1,
    name: "Điện thoại đẹp trai số 1 thế giới",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum, ducimus officiis repellat quibusdam pariatur nesciunt dolor ipsam? Itaque officia minus tempore nesciunt nostrum mollitia, odit harum, fuga accusantium laudantium atque.",
    price: 135000000,
    currency: "VND",
    image: img1,
    category: "Điện thoại",
    isAvailable: true,
  },
  {
    id: 1,
    name: "Điện thoại đẹp trai số 1 thế giới",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum, ducimus officiis repellat quibusdam pariatur nesciunt dolor ipsam? Itaque officia minus tempore nesciunt nostrum mollitia, odit harum, fuga accusantium laudantium atque.",
    price: 135000000,
    currency: "VND",
    image: img1,
    category: "Điện thoại",
    isAvailable: true,
  },
  {
    id: 1,
    name: "Điện thoại đẹp trai số 1 thế giới",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum, ducimus officiis repellat quibusdam pariatur nesciunt dolor ipsam? Itaque officia minus tempore nesciunt nostrum mollitia, odit harum, fuga accusantium laudantium atque.",
    price: 135000000,
    currency: "VND",
    image: img1,
    category: "Điện thoại",
    isAvailable: true,
  },
  {
    id: 1,
    name: "Điện thoại đẹp trai số 1 thế giới",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum, ducimus officiis repellat quibusdam pariatur nesciunt dolor ipsam? Itaque officia minus tempore nesciunt nostrum mollitia, odit harum, fuga accusantium laudantium atque.",
    price: 135000000,
    currency: "VND",
    image: img1,
    category: "Điện thoại",
    isAvailable: true,
  },
  {
    id: 1,
    name: "Điện thoại đẹp trai số 1 thế giới",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum, ducimus officiis repellat quibusdam pariatur nesciunt dolor ipsam? Itaque officia minus tempore nesciunt nostrum mollitia, odit harum, fuga accusantium laudantium atque.",
    price: 135000000,
    currency: "VND",
    image: img1,
    category: "Điện thoại",
    isAvailable: true,
  },
  {
    id: 1,
    name: "Điện thoại đẹp trai số 1 thế giới",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum, ducimus officiis repellat quibusdam pariatur nesciunt dolor ipsam? Itaque officia minus tempore nesciunt nostrum mollitia, odit harum, fuga accusantium laudantium atque.",
    price: 135000000,
    currency: "VND",
    image: img1,
    category: "Điện thoại",
    isAvailable: true,
  },
  {
    id: 1,
    name: "Điện thoại đẹp trai số 1 thế giới",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum, ducimus officiis repellat quibusdam pariatur nesciunt dolor ipsam? Itaque officia minus tempore nesciunt nostrum mollitia, odit harum, fuga accusantium laudantium atque.",
    price: 135000000,
    currency: "VND",
    image: img1,
    category: "Điện thoại",
    isAvailable: true,
  },
  {
    id: 1,
    name: "Điện thoại đẹp trai số 1 thế giới",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum, ducimus officiis repellat quibusdam pariatur nesciunt dolor ipsam? Itaque officia minus tempore nesciunt nostrum mollitia, odit harum, fuga accusantium laudantium atque.",
    price: 135000000,
    currency: "VND",
    image: img1,
    category: "Điện thoại",
    isAvailable: true,
  },
];

export default function ProductsPage() {
  return (
    <Wraper>
      {/* store products  */}
      <div className="py-24">
        <div className="text-center">
          <span className="text-5xl font-bold text-black text-center">
            Sản phẩm tại &nbsp;
            <span className="text-5xl font-bold text-blue-500 text-center">
              8 Bit Store
            </span>
          </span>
        </div>
        <p className="mt-3 text-center font-normal text-xl">
          Đa dạng các loại sản phẩm laptop, đồ điện tử đang giảm giá sốc
        </p>
        <div className="text-center">
          <Button className="mt-5" variant="default" size="lg">
            Mua hàng tại đây
          </Button>
        </div>
      </div>
      {/* section prorducts */}
      <div>
        {/* filter bar */}
        <div className="flex justify-between items-center">
          {/* left filter */}
          <div className="flex justify-center gap-x-4">
            {categories.map((category) => (
              <Button
                className="block bg-white text-black font-normal  hover:bg-blue-500 hover:text-white"
                key={category.id}
                variant="default"
                size="sm"
              >
                {category.name}
              </Button>
            ))}
          </div>
          {/* right filter */}
          <div>
            <div className="flex items-center gap-x-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.2492 0H0.750872C0.0846841 0 -0.251472 0.808313 0.220559 1.28034L6 7.06066V13.5C6 13.7447 6.1194 13.9741 6.3199 14.1144L8.8199 15.8638C9.31312 16.2091 10 15.8592 10 15.2494V7.06066L15.7796 1.28034C16.2507 0.80925 15.9168 0 15.2492 0Z"
                  fill="black"
                />
              </svg>
              <select className="p-2 ">
                <option value="0">Mặc định</option>
                <option value="1">Giá cao đến thấp</option>
                <option value="2">Giá thấp đến cao</option>
                <option value="3">A - Z</option>
                <option value="4">Z - A</option>
              </select>
            </div>
          </div>
        </div>
        {/* products */}
        <>
          <div className="grid grid-cols-4 gap-y-8 my-9">
            {products.map((item, index) => (
              <figure
                key={index}
                className="w-80 grid grid-cols-1 gap-y-2 shadow-2xl py-8"
              >
                <div className="h-[270px]">
                  <Link href={`/products/${item?.id}`}>
                    <Image
                      className="h-auto"
                      src={item?.image}
                      alt="product"
                      width={320}
                      height={300}
                    />
                  </Link>
                </div>
                {/* product name and detail */}
                <div className="w-11/12 mx-auto">
                  <p className="text-lg font-semibold">{item?.name}</p>
                  <p className="text-md font-normalF truncate">
                    {item?.description}
                  </p>
                </div>
                {/* product price */}
                <div className="w-11/12 mx-auto flex gap-x-1 items-end justify-start">
                  <p className="text-xs text-gray-500">Giá tiền: </p>
                  <strong className="text-sm text-red-600">
                    {" "}
                    {item?.price} {item?.currency}
                  </strong>
                </div>
                {/* product action */}
                <div className="flex justify-around">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-xl">
                    Thêm vào giỏ hàng
                  </button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-xl">
                    Mua ngay
                  </button>
                </div>
              </figure>
            ))}
          </div>
          {/* panigatation */}
          <div className="flex justify-center gap-x-2">
            <Link
              className="flex justify-center px-4 py-2 flex-wrap gap-x-2 bg-blue-500 rounded-full"
              href={"#"}
            >
              1
            </Link>
            <Link
              className="flex justify-center px-4 py-2 flex-wrap gap-x-2 bg-gray-300 rounded-full"
              href={"#"}
            >
              2
            </Link>
            <Link
              className="flex justify-center px-4 py-2 flex-wrap gap-x-2 bg-gray-300 rounded-full"
              href={"#"}
            >
              3
            </Link>
            <Link
              className="flex justify-center px-4 py-2 flex-wrap gap-x-2 bg-gray-300 rounded-full"
              href={"#"}
            >
              4
            </Link>
            <Link
              className="flex justify-center px-4 py-2 flex-wrap gap-x-2 bg-gray-300 rounded-full"
              href={"#"}
            >
              5
            </Link>
          </div>
        </>
      </div>
    </Wraper>
  );
}
