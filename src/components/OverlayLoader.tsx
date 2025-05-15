import { LoaderCircle } from 'lucide-react'
import React from 'react'

export default function OverlayLoader() {
    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-90'>
            <LoaderCircle
                className='animate-spin text-white w-10 h-10 '
            />
        </div>
    )
}
