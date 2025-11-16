'use client'
import React from 'react'
import dynamic from 'next/dynamic'

const ReactQuillWrapper = dynamic(
  () => import('@/app/admin/(otherPages)/blog/ReactQuillWrapper'),
  { ssr: false }
)

export default function BlogAddClient() {
  return (
    <div>
      <ReactQuillWrapper />
    </div>
  )
}
