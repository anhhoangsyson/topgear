import React from 'react';
import { Loader } from './Loader';

interface OverlayLoaderProps {
  message?: string;
  variant?: 'default' | 'blue' | 'white';
}

export default function OverlayLoader({ 
  message = 'Đang tải...', 
  variant = 'white' 
}: OverlayLoaderProps) {
    return (
        <div className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm'>
            <div className='bg-white rounded-2xl shadow-2xl p-8 sm:p-10 flex flex-col items-center gap-4 min-w-[200px]'>
                <Loader size='lg' variant={variant === 'white' ? 'blue' : variant} />
                {message && (
                    <p className='text-sm sm:text-base font-medium text-gray-700 text-center'>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}
