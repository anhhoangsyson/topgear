"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import useCartStore from "@/store/cartStore";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { CartIcon, SearchIcon, MenuIcon, CloseIcon } from "@/components/atoms/icon/icons";
import AccountDropdown from "@/components/molecules/auth/AccountDropdown";
import LoginButton from "@/components/molecules/auth/LoginButton";

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
    url: "/laptop/",
  },
  {
    name: "Blogs",
    url: "/blogs",
  },
  {
    name: "Liên hệ",
    url: "/lien-he",
  },
];

export default function Header() {
  const [cartQuantity, setCartQuantity] = useState(0);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isHidden, setIsHidden] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartStore = useCartStore((state) => state.cartItems);
  const pathName = usePathname();

  const { data: session, status } = useSession()
  const user = session?.user;


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
  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const res = await fetch(
  //       "https://top-gear-be.vercel.app/api/v1/pvariants"
  //     );
  //     const data = await res.json();
  //     setProducts(data.data); // Giả định `data.data` là mảng sản phẩm
  //   };
  //   fetchProducts();
  // }, []);


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

  return (
    <>
    <div
        className={`fixed top-0 left-0 w-full h-16 md:h-20 flex items-center bg-[#0E1746] text-white justify-between py-2 md:py-4 px-4 md:px-6 lg:px-24 shadow-lg transition-transform duration-300 z-50
    ${isHidden ? "-translate-y-full" : "translate-y-0"}`}
    >
        {/* Logo & Hamburger Menu */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Hamburger Menu Button - Mobile Only */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-white/10 rounded"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

        <Link href={"/"}>
          <Image
            src="/logo-icon.svg"
            alt="E-COM Logo"
            width={40}
            height={40}
            className="cursor-pointer"
          />
        </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:block">
          <ul className="flex">
            {menuNavData.map((item, index) => (
              <li key={index}>
                <Link
                  className={`px-4 py-2 text-sm rounded transition-colors ${
                    pathName == item.url 
                      ? "text-blue-400 font-semibold bg-white/10" 
                      : "text-white hover:text-blue-300 hover:bg-white/5"
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
        <div className="flex items-center gap-2 md:gap-3">
          {/* Search Input - Hidden on mobile, show icon only */}
          <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Tìm sản phẩm..."
              className="px-3 py-2 rounded bg-white text-black text-sm w-48 lg:w-64"
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
                      href={`/products/${product._id}`}
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

          {/* Mobile Search Icon */}
          <button
            className="md:hidden p-2 hover:bg-white/10 rounded"
            aria-label="Search"
          >
            <SearchIcon />
          </button>

        {/* Cart Icon */}
          <Link href={"/cart"} className="relative p-2 hover:bg-white/10 rounded">
              <CartIcon />
              {cartQuantity > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartQuantity > 9 ? '9+' : cartQuantity}
              </span>
            )}
          </Link>

        {/* User Icon + Notification Icon - Hiển thị trên mobile (AccountDropdown đã bao gồm NotificationDropdown) */}
          {status === "authenticated"
          ? (
            <AccountDropdown
              user={{
                name: user?.name ?? "",
                email: user?.email ?? "",
                image: user?.image ?? ""
              }}
            />
          )
          : (
            <LoginButton />
          )
        }
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-transform duration-300
          ${isHidden ? "translate-y-0" : "translate-y-0"}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Sidebar - Luôn bắt đầu từ top: 0, có padding top để tránh bị header che */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#0E1746] text-white shadow-2xl transform transition-all duration-300 z-50 lg:hidden overflow-y-auto
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        pt-16 md:pt-20`}
      >
        <nav className="p-4">
          <ul className="flex flex-col gap-2">
            {menuNavData.map((item, index) => (
              <li key={index}>
                <Link
                  className={`block px-4 py-3 rounded transition-colors ${
                    pathName == item.url 
                      ? "text-blue-400 font-semibold bg-white/10" 
                      : "text-white hover:text-blue-300 hover:bg-white/5"
                  }`}
                  href={item.url}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Search */}
          <div className="mt-4 px-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm sản phẩm..."
                className="w-full px-3 py-2 rounded bg-white text-black text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute top-0 right-0 flex items-center h-full pr-2 text-black">
                <SearchIcon />
              </div>
              {/* Dropdown search results */}
              {filtered.length > 0 && (
                <ul className="absolute top-full mt-1 w-full bg-white text-black rounded shadow-md z-50 max-h-60 overflow-y-auto">
                  {filtered.map((product, index) => (
                    <li key={index} className="hover:bg-gray-100">
                      <Link
                        href={`/products/${product._id}`}
                        className="block px-3 py-2 text-sm"
                        onClick={() => {
                          setSearchQuery("");
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        {product.variantName}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Mobile User Section */}
          <div className="mt-4 px-4 border-t border-white/10 pt-4">
            {status === "authenticated"
              ? (
                <div className="flex items-center gap-3">
                  {user?.image && (
                    <Image
                      src={user.image}
                      alt={user.name ?? ""}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-semibold">{user?.name}</p>
                    <p className="text-sm text-white/70">{user?.email}</p>
                  </div>
                </div>
              )
              : (
                <LoginButton />
              )
            }
          </div>
        </nav>
      </div>
    </>
  );
}
