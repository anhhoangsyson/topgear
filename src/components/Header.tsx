'use client'
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CartIcon, SearchIcon, UserIcon } from "./icons";
import useCartStore from "@/store/cartStore";
import { useParams, usePathname } from "next/navigation";

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
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isHidden, setIsHidden] = useState(false);
  const cartStore = useCartStore((state) => state.cartItems);
  const pathName = usePathname();
  
  useEffect(() => {
    const totalQuantity = cartStore.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
    setCartQuantity(totalQuantity)
  }, [cartStore])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop) {
        // Cuộn xuống: ẩn header
        setIsHidden(true);
      } else {
        // Cuộn lên: hiện header
        setIsHidden(false);
      }
      setLastScrollTop(scrollTop);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop])

  return (
    <div className={`fixed top-0 left-0 w-full flex align-center bg-[#0E1746] text-white justify-between py-4 px-24 shadow-lg transition-transform duration-300 z-50
    ${isHidden ? "-translate-y-full" : "translate-y-0"}`}>
      {/* logo */}
      <div className="flex items-centrater">
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
                key={index}  >
                <Link
                  className={`px-4 py-2 text-sm ${pathName == item.url ? "text-blue-600 font-semibold" : ""
                    }`}
                  href={item.url}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {/* riglt nav */}
      <div className="flex gap-x-1 items-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-full hover:opacity-75 cursor-pointer">
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
          <div className="flex items-center gap-2 py-2 px-3 text-sm hover:bg-white hover:text-[#0E1746] transition-all duration-300 ease-in-out rounded">
            <UserIcon />
            Tài Khoản
          </div>
        </Link>
      </div>
    </div>
  );
}
