import LoginForm from '@/app/(client)/(auth)/login/LoginForm'
import React, { Suspense } from 'react'

export default function page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Đang tải...</div>}>
      <div>
        <LoginForm />
      </div>
    </Suspense>
  )
}
