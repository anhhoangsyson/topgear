import React from 'react';
import { cn } from '@/lib/utils';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'default' | 'blue' | 'white';
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  className,
  variant = 'default',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  // variantClasses is defined but not used - variants are applied inline

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className={cn('relative', sizeClasses[size])}>
        {/* Outer ring */}
        <div
          className={cn(
            'absolute inset-0 rounded-full border-4 border-transparent',
            variant === 'default' && 'border-t-gray-600 border-r-gray-200',
            variant === 'blue' && 'border-t-blue-600 border-r-blue-200',
            variant === 'white' && 'border-t-white border-r-white/20',
            'animate-spin'
          )}
          style={{ animationDuration: '0.8s' }}
        />
        {/* Inner ring */}
        <div
          className={cn(
            'absolute inset-2 rounded-full border-4 border-transparent',
            variant === 'default' && 'border-b-gray-400 border-l-gray-200',
            variant === 'blue' && 'border-b-blue-400 border-l-blue-200',
            variant === 'white' && 'border-b-white/60 border-l-white/20',
            'animate-spin'
          )}
          style={{ animationDuration: '1.2s', animationDirection: 'reverse' }}
        />
        {/* Center dot */}
        <div
          className={cn(
            'absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full',
            variant === 'default' && 'bg-gray-600',
            variant === 'blue' && 'bg-blue-600',
            variant === 'white' && 'bg-white',
            size === 'sm' && 'w-1 h-1',
            size === 'md' && 'w-1.5 h-1.5',
            size === 'lg' && 'w-2 h-2',
            size === 'xl' && 'w-2.5 h-2.5',
            'animate-pulse'
          )}
        />
      </div>
    </div>
  );
};