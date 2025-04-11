'use client'
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CartIcon, SearchIcon, UserIcon } from "./icons";
import useCartStore from "@/store/cartStore";

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

  const [cartQuantity, setCartQuantity] = useState(0)

  const cartStore = useCartStore((state) => state.cartItems);

  useEffect(() => {
    const totalQuantity = cartStore.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
    setCartQuantity(totalQuantity)
  }, [cartStore])
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
        <div className="flex items-center justify-center w-12 h-12 rounded-full hover:opacity-75 cursor-pointer">
          <Link href={"/cart"}>
            <div className="relative">
              <CartIcon />
              {
                cartQuantity > 0 && (
                  <div className="absolute -top-2.5 left-5 text-red-500">
                    {cartQuantity}
                  </div>
                )
              }
            </div>
          </Link>
        </div>
        <Link
          href={"/login"}
          className="flex items-center bg-transparent border border-white text-white rounded"
        >
          <div className="flex items-center gap-2 py-2 px-3 hover:bg-white hover:text-[#0E1746] transition-all duration-300 ease-in-out rounded">
            <UserIcon />
            Tài Khoản
          </div>
        </Link>
      </div>
    </div>
  );
}
