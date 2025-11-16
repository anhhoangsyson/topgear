import React from 'react'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function Page() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="text-center p-8 bg-white rounded-lg shadow">
				<CheckCircle className="mx-auto w-14 h-14 text-green-600 mb-4" />
				<h1 className="text-2xl font-bold mb-2">Thanh toán thành công</h1>
				<p className="text-gray-600 mb-4">Cảm ơn bạn. Đơn hàng của bạn đã được xử lý thành công.</p>
				<Link
					href="/"
					className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
				>
					Quay về trang chủ
				</Link>
			</div>
		</div>
	)
}
