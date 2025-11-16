'use client'
import React, { Suspense } from 'react'
import CheckoutClient from './CheckoutClient'

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CheckoutClient />
        </Suspense>
    )
}
