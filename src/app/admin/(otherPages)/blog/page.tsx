import React from 'react'
export const dynamic = 'force-dynamic';
import BlogPageClient from './BlogPageClient'
import { Suspense } from 'react'

export default function BlogsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogPageClient />
    </Suspense>
  )
}