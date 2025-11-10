'use client'
import React from "react";
import { ICategory } from "@/types";
import Link from "next/link";

import banner1 from "/public/banner.png";
import banner2 from "/public/banner2.webp";
import banner3 from "/public/banner3.webp";
import SectionWrapper from "@/components/organisms/section/SectionWrapper";
import SlideBanner from "@/components/organisms/section/SlideBanner";


const banners = [
    {
        image: banner1.src,
        alt: "Banner 1",
        link: "#",
    },
    {
        image: banner2.src,
        alt: "Banner 2",
        link: "#",
    },
    {
        image: banner3.src,
        alt: "Banner 3",
        link: "#",
    },
];

export default function CategorySection({ categories, }: { categories: ICategory[] }) {
    return (
        <SectionWrapper>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Menu Categories - Ẩn trên mobile, hiển thị trên desktop */}
                <div className="lg:block lg:col-span-2 flex flex-col items-start relative">
                    <ul className="w-full">
                        {categories.map((cat: ICategory) => (
                            <li
                                key={cat._id}
                                className="p-3 cursor-pointer hover:bg-blue-50 rounded transition-colors"
                            >
                                <Link
                                    href={`laptop/category/${cat.slug}`}
                                    className="text-sm font-medium text-gray-700 hover:text-blue-600"
                                >
                                    {cat.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                
                {/* Slideshow - Full width trên mobile, col-span-10 trên desktop */}
                <div className="col-span-1 lg:col-span-10">
                    <SlideBanner banners={banners} />
                </div>
            </div>
        </SectionWrapper >
    );
}