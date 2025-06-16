import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function SlideBanner({ banners }: { banners: { image: string; alt: string; link: string }[] }) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [banners.length]);

    return (
        <div className="relative w-full h-[350px] rounded-lg overflow-hidden mb-8 shadow">
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
                    />
                </Link>
            ))}
            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {banners.map((_, idx) => (
                    <button
                        key={idx}
                        className={`w-3 h-3 rounded-full ${idx === current ? "bg-blue-600" : "bg-gray-300"}`}
                        onClick={e => { e.stopPropagation(); setCurrent(idx); }}
                        aria-label={`Chọn banner ${idx + 1}`}
                        type="button"
                    />
                ))}
            </div>
            {/* Nút chuyển trái/phải */}
            <button
                type="button"
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow hover:bg-white z-20"
                onClick={e => { e.stopPropagation(); setCurrent((current - 1 + banners.length) % banners.length); }}
                aria-label="Trước"
            >
                <svg width="20" height="20" fill="none"><path d="M13 16l-4-4 4-4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow hover:bg-white z-20"
                onClick={e => { e.stopPropagation(); setCurrent((current + 1) % banners.length); }}
                aria-label="Sau"
            >
                <svg width="20" height="20" fill="none"><path d="M7 8l4 4-4 4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
        </div>
    );
}