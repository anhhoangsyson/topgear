import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CartIcon, SearchIcon, UserIcon } from "./icons";

export interface menuNavData {
  name: string;
  url: string;
}

const menuNavData: menuNavData[] = [
  {
    name: "Trang chủ",
    url: "/",
  },
  {
    name: "Tất cả sản phẩm",
    url: "/products",
  },
  {
    name: "Blogs",
    url: "/blogs",
  },
  {
    name: "Liên hệ",
    url: "/lien-he",
  },
  {
    name: "Blogs",
    url: "/blog",
  },
];

export default function Header() {
  return (
    <div className="flex align-center bg-[#0E1746] text-white justify-between py-4 px-24 shadow-lg">
      {/* logo */}
      <div className="flex items-center">
        <Link href={"/"}>
          <Image
            src="/logo.png"
            alt="logo"
            width={100}
            height={100}
            className="cursor-pointer"
          />
        </Link>
        {/* nav menu */}
        <nav>
          <ul className="flex ">
            {menuNavData.map((item, index) => (
              <li
                key={index}
                className={`px-4 py-2 ${index === 0 ? "text-blue-600 font-bold" : ""
                  }`}
              >
                <Link href={item.url}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {/* riglt nav */}
      <div className="flex gap-x-1 items-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-200 cursor-pointer">
          <Link href="/search">
            <SearchIcon />
          </Link>
        </div>
        <div className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-200 cursor-pointer">
          <Link href={"/cart"}>
            <CartIcon />
          </Link>
        </div>
        <Link
          href={"/login"}
          className="flex items-center bg-transparent border border-white text-white rounded-md"
        >
          <div className="flex items-center gap-2 px-6 py-3">
            <UserIcon />
            Tài Khoản
          </div>
        </Link>
      </div>
    </div>
  );
}
