"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CartIcon, SearchIcon, UserIcon } from "./icons";
import useCartStore from "@/store/cartStore";
import { usePathname } from "next/navigation";

export interface Product {
  name: string;
  slug: string;
  // thêm các trường khác nếu cần
  variantName: string;
  _id: string;
  categoriesId: string;
}

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
  const [cartQuantity, setCartQuantity] = useState(0);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isHidden, setIsHidden] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const cartStore = useCartStore((state) => state.cartItems);
  const pathName = usePathname();

  // Get cart quantity
  useEffect(() => {
    const totalQuantity = cartStore.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
    setCartQuantity(totalQuantity);
  }, [cartStore]);

  // Hide/show header on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsHidden(scrollTop > lastScrollTop);
      setLastScrollTop(scrollTop);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(
        "https://top-gear-be.vercel.app/api/v1/pvariants"
      );
      const data = await res.json();
      setProducts(data.data); // Giả định `data.data` là mảng sản phẩm
    };
    fetchProducts();
  }, []);

  // Filter products
  // Filter products
  useEffect(() => {
    if (searchQuery.trim()) {
      const filteredData = products.filter((product) => {
        const name = product?.variantName ?? "";
        return name.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFiltered(filteredData);
    } else {
      setFiltered([]);
    }
  }, [searchQuery, products]);

  console.log(filtered);

  return (
    <div
      className={`fixed top-0 left-0 w-full flex align-center bg-[#0E1746] text-white justify-between py-4 px-24 shadow-lg transition-transform duration-300 z-50
    ${isHidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      {/* Logo & Nav */}
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
        <nav>
          <ul className="flex">
            {menuNavData.map((item, index) => (
              <li key={index}>
                <Link
                  className={`px-4 py-2 text-sm ${
                    pathName == item.url ? "text-blue-600 font-semibold" : ""
                  }`}
                  href={item.url}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Search + Cart + User */}
      <div className="flex items-center gap-3 relative">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm sản phẩm..."
            className="px-3 py-2 rounded bg-white text-black text-sm w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute top-0 right-0 flex items-center h-full pr-2">
            <SearchIcon />
          </div>
          {/* Dropdown search results */}
          {filtered.length > 0 && (
            <ul className="absolute top-full mt-1 w-full bg-white text-black rounded shadow-md z-50 max-h-60 overflow-y-auto">
              {filtered.map((product, index) => (
                <li key={index} className="hover:bg-gray-100">
                  <Link
                    href={`/products/${product._id}`} // hoặc slug nếu bạn có
                    className="block px-3 py-2 text-sm"
                    onClick={() => setSearchQuery("")}
                  >
                    {product.variantName}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Cart Icon */}
        <div className="w-12 h-12 flex items-center justify-center rounded-full hover:opacity-75 cursor-pointer">
          <Link href={"/cart"}>
            <div className="relative">
              <CartIcon />
              {cartQuantity > 0 && (
                <div className="absolute -top-2.5 left-5 text-red-500">
                  {cartQuantity}
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* User Icon */}
        <Link
          href={"/login"}
          className="flex items-center border border-white rounded"
        >
          <div className="flex items-center gap-2 py-2 px-3 text-sm hover:bg-white hover:text-[#0E1746] transition-all duration-300 rounded">
            <UserIcon />
            Tài Khoản
          </div>
        </Link>
      </div>
    </div>
  );
}
