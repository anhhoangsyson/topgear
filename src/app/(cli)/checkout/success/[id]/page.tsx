import Navigation from '@/app/(cli)/checkout/success/[id]/Navigation';
import { cookies } from 'next/headers'
import React from 'react'
import { CheckCircle2, Sparkles } from 'lucide-react'
import Link from 'next/link'

async function fetchOrderDetails(id: string, accessToken: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/order/${id}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        cache: 'no-store',
    })

    if (!res.ok) {
        throw new Error('Failed to fetch order details')
    }

    return res.json()
}

export default async function OrderSuccess({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value
    
    if (!accessToken) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-gray-50'>
                <div className="text-center">
                    <h1 className='text-2xl font-bold text-gray-900 mb-4'>Bạn chưa đăng nhập</h1>
                    <Link 
                        href="/login"
                        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Đăng nhập
                    </Link>
                </div>
            </div>
        )
    }
    
    let order = null;
    try {
        const orderData = await fetchOrderDetails(id, accessToken);
        order = orderData.data;
    } catch (error) {
        console.error('Error fetching order:', error);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-2xl w-full">
                <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 opacity-20"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-100 rounded-full -ml-12 -mb-12 opacity-20"></div>
                    
                    {/* Success Icon */}
                    <div className="relative z-10 mb-6">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4 animate-bounce">
                            <CheckCircle2 className="w-16 h-16 text-green-600" />
                        </div>
                        <div className="absolute -top-2 -right-2">
                            <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
                        </div>
                    </div>

                    {/* Success Message */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 relative z-10">
                        Đặt hàng thành công!
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 mb-2 relative z-10">
                        Cảm ơn bạn đã tin tưởng và mua hàng tại E-COM
                    </p>
                    {order && (
                        <p className="text-sm text-gray-500 mb-8 relative z-10">
                            Mã đơn hàng: <span className="font-semibold text-gray-700">{order._id || id}</span>
                        </p>
                    )}

                    {/* Information Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mb-8 text-left relative z-10">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                            Đơn hàng của bạn đã được xác nhận
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Chúng tôi đã gửi email xác nhận đến địa chỉ email của bạn</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Đơn hàng sẽ được xử lý và giao đến địa chỉ bạn đã cung cấp</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Bạn có thể theo dõi đơn hàng trong phần &quot;Đơn hàng của tôi&quot;</span>
                            </li>
                        </ul>
                    </div>

                    {/* Navigation */}
                    <Navigation />
                </div>
            </div>
        </div>
    )
}
