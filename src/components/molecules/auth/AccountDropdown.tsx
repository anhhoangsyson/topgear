'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/atoms/ui/dropdown-menu'
import { defaultAvatar } from '@/lib/utils'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

export default function AccountDropdown({ user }: { user: { name: string, image: string, email: string } }) {

    const handleLogout = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL_NEXT_SERVER}/api/auth/logout`, {
            method: "POST"
        })
        signOut({ callbackUrl: "/" });
    }
    return (
        <div>
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
                    <DropdownMenuItem>
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
