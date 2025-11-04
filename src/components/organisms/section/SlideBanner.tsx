'use client'
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SlideBanner({ banners }: { banners: { image: string; alt: string; link: string }[] }) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [banners.length]);

    return (
        <div className="relative w-full h-[200px] sm:h-[280px] md:h-[320px] lg:h-[350px] rounded-lg overflow-hidden mb-4 sm:mb-8 shadow">
            {banners.map((banner, idx) => (
                <Link
                    href={banner.link}
                    key={idx}
                    tabIndex={idx === current ? 0 : -1}
                    className={`absolute inset-0 transition-opacity duration-700 ${idx === current ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"}`}
                >
                    <Image
                        src={banner.image}
                        alt={banner.alt}
                        fill
                        className="object-cover w-full h-full"
                        priority={idx === 0}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 83vw, 100vw"
                    />
                </Link>
            ))}
            {/* Dots */}
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-20">
                {banners.map((_, idx) => (
                    <button
                        key={idx}
                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${idx === current ? "bg-blue-600" : "bg-white/70"}`}
                        onClick={e => { e.stopPropagation(); setCurrent(idx); }}
                        aria-label={`Chọn banner ${idx + 1}`}
                        type="button"
                    />
                ))}
            </div>
            {/* Nút chuyển trái/phải */}
            <button
                type="button"
                className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-1.5 sm:p-2 shadow-lg z-20 transition-all"
                onClick={e => { e.stopPropagation(); setCurrent((current - 1 + banners.length) % banners.length); }}
                aria-label="Trước"
            >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </button>
            <button
                type="button"
                className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-1.5 sm:p-2 shadow-lg z-20 transition-all"
                onClick={e => { e.stopPropagation(); setCurrent((current + 1) % banners.length); }}
                aria-label="Sau"
            >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </button>
        </div>
    );
}