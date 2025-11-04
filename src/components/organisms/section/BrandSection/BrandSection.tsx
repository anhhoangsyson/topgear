'use client'
import BrandCard from '@/components/organisms/section/BrandSection/BrandCard'
import SectionWrapper from '@/components/organisms/section/SectionWrapper'
import { IBrand } from '@/types'
import React, { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function BrandSection({ brands }: { brands: IBrand[] }) {
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
  }, [brands]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardElement = container.querySelector('.brand-card') as HTMLElement;
      
      if (cardElement) {
        const cardWidth = cardElement.offsetWidth;
        const gap = window.innerWidth >= 640 ? 24 : 12; // gap-6 (24px) trên sm+, gap-3 (12px) trên mobile
        const scrollAmount = cardWidth + gap;
        
        container.scrollBy({
          left: direction === 'left' ? -scrollAmount : scrollAmount,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <SectionWrapper>
      <h2 className="text-2xl font-bold mb-6 text-left my-4">Thương hiệu laptop</h2>
      
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
          className='flex gap-3 sm:gap-6 overflow-x-auto scroll-smooth pb-4 items-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
        >
          {brands.map((brand) => (
            <div
              key={brand._id}
              className='brand-card flex-shrink-0 w-[45%] sm:w-[22%] md:w-[18%] lg:w-[12%]'
            >
              <BrandCard brand={brand} />
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
          className={`p-2 rounded-full ${canScrollLeft ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-400'}`}
          aria-label='Scroll left'
        >
          <ChevronLeft className='w-4 h-4' />
        </button>
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className={`p-2 rounded-full ${canScrollRight ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-400'}`}
          aria-label='Scroll right'
        >
          <ChevronRight className='w-4 h-4' />
        </button>
      </div>
    </SectionWrapper>
  )
}
