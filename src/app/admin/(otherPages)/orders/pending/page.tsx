import React, { Suspense } from 'react'
import PendingOrdersClient from './PendingOrdersClient'

export default function PendingOrdersPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-6">Đang tải...</div>}>
      <PendingOrdersClient />
    </Suspense>
  )
}

