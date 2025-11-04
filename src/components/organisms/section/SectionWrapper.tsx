import React from 'react'

export default function SectionWrapper({children}: {children: React.ReactNode}) {
  return (
    <div
    className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white py-8 sm:py-12 lg:py-16'
    >
      {children}
    </div>
  )
}
