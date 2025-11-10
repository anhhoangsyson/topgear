'use client'
import LaptopCard from '@/components/molecules/cards/LaptopCard';
import { ILaptopGroup } from '@/types';
import React, { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function LaptopGroupSectionChild({ group }: { group: ILaptopGroup }) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScrollability = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        // Đợi một chút để DOM render xong
        const timer = setTimeout(() => {
            checkScrollability();
        }, 100);
        
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScrollability);
            window.addEventListener('resize', checkScrollability);
            return () => {
                clearTimeout(timer);
                container.removeEventListener('scroll', checkScrollability);
                window.removeEventListener('resize', checkScrollability);
            };
        }
        return () => clearTimeout(timer);
    }, [group.laptops]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const cardElement = container.querySelector('.laptop-card') as HTMLElement;
            
            if (cardElement) {
                const cardWidth = cardElement.offsetWidth;
                const gap = window.innerWidth >= 640 ? 16 : 8; // gap-4 (16px) trên sm+, gap-2 (8px) trên mobile
                const scrollAmount = cardWidth + gap;
                
                container.scrollBy({
                    left: direction === 'left' ? -scrollAmount : scrollAmount,
                    behavior: 'smooth'
                });
            }
        }
    };

    return (
        <div
            className="w-full min-h-[400px] object-cover mb-8 relative"
            style={{
                backgroundImage: `url(${group.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className='p-4'>
                <h2 className='text-white font-semibold text-lg sm:text-xl'>{group.name}</h2>
                <div className='my-2 h-[1px] bg-white w-full'></div>
                
                {/* Scroll Container với nút điều hướng */}
                <div className='relative'>
                    {/* Nút Previous */}
                    {canScrollLeft && (
                        <button
                            onClick={() => scroll('left')}
                            className='absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hidden sm:flex items-center justify-center'
                            aria-label='Scroll left'
                        >
                            <ChevronLeft className='w-5 h-5' />
                        </button>
                    )}

                    {/* Scroll Container */}
                    <div
                        ref={scrollContainerRef}
                        className='flex gap-2 sm:gap-4 overflow-x-auto scroll-smooth pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
                    >
                        {group.laptops.map((laptop) => (
                            <div
                                key={laptop._id}
                                className='laptop-card flex-shrink-0 w-[48%] sm:w-[31%] md:w-[23.5%] lg:w-[18.5%]'
                            >
                                <LaptopCard laptop={laptop} />
                            </div>
                        ))}
                    </div>

                    {/* Nút Next */}
                    {canScrollRight && (
                        <button
                            onClick={() => scroll('right')}
                            className='absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hidden sm:flex items-center justify-center'
                            aria-label='Scroll right'
                        >
                            <ChevronRight className='w-5 h-5' />
                        </button>
                    )}
                </div>

                {/* Scroll indicators cho mobile */}
                <div className='flex justify-center gap-2 mt-4 sm:hidden'>
                    <button
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        className={`p-2 rounded-full ${canScrollLeft ? 'bg-white/90 text-gray-800' : 'bg-white/30 text-gray-400'}`}
                        aria-label='Scroll left'
                    >
                        <ChevronLeft className='w-4 h-4' />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        className={`p-2 rounded-full ${canScrollRight ? 'bg-white/90 text-gray-800' : 'bg-white/30 text-gray-400'}`}
                        aria-label='Scroll right'
                    >
                        <ChevronRight className='w-4 h-4' />
                    </button>
                </div>
            </div>
        </div>
    )
}
