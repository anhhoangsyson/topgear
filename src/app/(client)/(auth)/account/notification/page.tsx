import React, { Suspense } from 'react'
export const dynamic = 'force-dynamic';
import NotificationPageClient from './NotificationPageClient'

export default function NotificationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotificationPageClient />
    </Suspense>
  )
}

