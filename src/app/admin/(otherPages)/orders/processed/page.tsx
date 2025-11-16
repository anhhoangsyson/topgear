'use client'
import React, { Suspense } from 'react'
import ProcessedOrdersClient from './ProcessedOrdersClient'

export default function ProcessedOrdersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProcessedOrdersClient />
    </Suspense>
  )
}

