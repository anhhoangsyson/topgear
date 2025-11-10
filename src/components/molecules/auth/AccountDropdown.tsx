'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/atoms/ui/dropdown-menu'
import { defaultAvatar } from '@/lib/utils'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import NotificationDropdown from '@/components/molecules/notification/NotificationDropdown'

export default function AccountDropdown({ user }: { user: { name: string, image: string, email: string } }) {

    const handleLogout = async () => {
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
        signOut({ callbackUrl: "/" });
    }
    return (
        <div className="flex items-center gap-4">
            <NotificationDropdown />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar>
                        <AvatarImage src={user?.image || ""} alt={user?.name || defaultAvatar} />
                        <AvatarFallback>
                            {user?.name?.[0] || user?.email?.[0] || "U"}
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>
                        <Link href="/account">
                            Hello, {user?.name || user?.email}
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href="/account/orders">
                            Đơn hàng
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href="/account/address">
                            Địa chỉ
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/account/notification">
                            Thông báo
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                        Đăng xuất
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
