"use client";
import { Dropdown } from "@/app/admin/components/ui/dropDown/DropDown";
import { DropdownItem } from "@/app/admin/components/ui/dropDown/DropDownItem";
import { Button } from "@/components/atoms/ui/Button";
import { defaultAvatar } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const { data: session } = useSession();
  if (!session) return null;


  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  const handleSignOut = async () => {
    // Xóa cookies NextAuth trên client-side (để đảm bảo xóa hết)
    const cookiesToDelete = [
      'next-auth.callback-url',
      'next-auth.csrf-token',
      'next-auth.session-token',
      'accessToken'
    ];
    
    cookiesToDelete.forEach(cookieName => {
      // Xóa với các path khác nhau
      document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
      document.cookie = `${cookieName}=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
    });
    
    // Gọi API logout để xóa trên server
    await fetch(`${process.env.NEXT_PUBLIC_API_URL_NEXT_SERVER}/api/auth/logout`, {
      method: "POST"
    });
    
    // NextAuth signOut sẽ tự xóa session cookie
    signOut({ callbackUrl: "/admin/login" });
  }
return (
  <div className="relative z-20">
    <button
      onClick={toggleDropdown}
      className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle"
    >
      <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
        <Image
          width={44}
          height={44}
          src={session.user?.image || defaultAvatar}
          alt={session.user?.name || "User Avatar"}
        />
      </span>

      <span className="block mr-1 font-medium text-theme-sm">{session.user.name}</span>

      <svg
        className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
          }`}
        width="18"
        height="20"
        viewBox="0 0 18 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>

    <Dropdown
      isOpen={isOpen}
      onClose={closeDropdown}
      className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
    >
      <div className="px-1 py-2">
        <div className="flex items-center gap-3">
          <span className="overflow-hidden rounded-full h-10 w-10 flex-shrink-0">
            <Image
              width={40}
              height={40}
              src={session.user?.image || defaultAvatar}
              alt={session.user?.name || "User"}
              className="object-cover"
            />
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
              {session.user?.name || "Admin User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {session.user?.email || "admin@example.com"}
            </p>
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-200 dark:bg-gray-800 my-2" />

      <Button
        onClick={handleSignOut}
        variant="ghost"
        className="w-full justify-start gap-3 px-3 py-2 h-auto font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/30"
      >
        <svg
          className="fill-current w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497L14.3507 14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497L20.7507 5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501L14.3507 9.74501V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609L18.5007 4.74609C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609L19.2507 18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984C3.25073 12.2144 3.34204 12.4091 3.48817 12.546L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484L16.0007 12.7484C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484L5.81528 11.2484L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.3876 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z"
          />
        </svg>
        <span className="text-sm">Đăng xuất</span>
      </Button>
    </Dropdown>
  </div>
);
}
