'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { User, Package, MapPin, Bell, ChevronRight, Menu, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/ui/avatar'
import { Button } from '@/components/atoms/ui/Button'

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const isActive = (label: string) => {
        return pathname === `/account/${label}` || (label === 'info' && pathname === '/account');
    };

    const userFullname = session?.user?.fullname || session?.user?.name || 'Người dùng';
    const userEmail = session?.user?.email || '';
    const userInitials = userFullname.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    const menuAccount = [
        {
            icon: User,
            subTitle: 'Thông tin',
            label: 'info',
            href: '/account'
        },
        {
            icon: Package,
            subTitle: 'Đơn hàng',
            label: 'orders',
            href: '/account/orders'
        },
        {
            icon: MapPin,
            subTitle: 'Địa chỉ',
            label: 'address',
            href: '/account/address'
        },
        {
            icon: Bell,
            subTitle: 'Thông báo',
            label: 'notification',
            href: '/account/notification'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Sidebar - Desktop */}
                    <aside className="hidden lg:block lg:col-span-3">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                            {/* User Info */}
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                                <Avatar className="w-12 h-12">
                                    <AvatarImage src={session?.user?.image || ''} alt={userFullname} />
                                    <AvatarFallback className="bg-blue-500 text-white font-semibold">
                                        {userInitials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-500 font-medium">Tài khoản của</p>
                                    <p className="text-base font-semibold text-gray-900 truncate">{userFullname}</p>
                                    <p className="text-xs text-gray-400 truncate">{userEmail}</p>
                                </div>
                            </div>

                            {/* Menu */}
                            <nav className="space-y-2">
                                {menuAccount.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.label);
                                    return (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <div
                                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer group
                                                    ${active 
                                                        ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm' 
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                                <span className="text-sm flex-1">{item.subTitle}</span>
                                                <ChevronRight className={`w-4 h-4 transition-transform ${active ? 'text-blue-600' : 'text-gray-300 group-hover:text-gray-400'} ${active ? 'translate-x-0' : 'translate-x-1'}`} />
                                            </div>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </aside>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <Button
                            variant="outline"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="w-full justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <Menu className="w-5 h-5" />
                                <span className="font-medium">Menu tài khoản</span>
                            </div>
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                        </Button>

                        {/* Mobile Menu Dropdown */}
                        {isMobileMenuOpen && (
                            <div className="mt-4 bg-white rounded-xl shadow-lg p-4 space-y-2">
                                {/* Mobile User Info */}
                                <div className="flex items-center gap-3 pb-4 mb-4 border-b">
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage src={session?.user?.image || ''} alt={userFullname} />
                                        <AvatarFallback className="bg-blue-500 text-white font-semibold text-sm">
                                            {userInitials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 font-medium">Tài khoản của</p>
                                        <p className="text-sm font-semibold text-gray-900 truncate">{userFullname}</p>
                                    </div>
                                </div>

                                {/* Mobile Menu Items */}
                                {menuAccount.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.label);
                                    return (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <div
                                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                                                    ${active 
                                                        ? 'bg-blue-50 text-blue-600 font-semibold' 
                                                        : 'text-gray-600 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
                                                <span className="text-sm flex-1">{item.subTitle}</span>
                                                <ChevronRight className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-gray-300'}`} />
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Main Content */}
                    <main className="lg:col-span-9">
                        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
