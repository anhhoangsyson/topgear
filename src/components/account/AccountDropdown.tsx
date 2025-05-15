'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

export default function AccountDropdown({ user }: { user: { name: string, image: string, email: string } }) {
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar>
                        <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
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
                        <Link href="/account/order">
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
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                        Đăng xuất
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
