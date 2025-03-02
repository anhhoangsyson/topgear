import Footer from '@/components/Footer'
import Header from '@/components/Header'
import React from 'react'

export default function ClientLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <>
        <Header />
        {children}
        <Footer />
    </>
  )
}
