import React, { Suspense } from 'react'
import OrdersClient from './OrdersClient'

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-6">Đang tải...</div>}>
      <OrdersClient />
    </Suspense>
  )
}