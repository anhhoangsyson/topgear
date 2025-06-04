'use client'
import React from "react";
import { ICategory } from "@/types";
import Link from "next/link";
import SectionWrapper from "@/components/section/SectionWrapper";
import SlideBanner from "@/components/slide-banner/SlideBanner";

import banner1 from "/public/banner.png";
import banner2 from "/public/banner2.webp";
import banner3 from "/public/banner3.webp";


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
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-2 flex flex-col items-start relative">
                    {/* Danh mục dọc */}
                    <ul className="w-48">
                        {categories.map((cat: ICategory) => (
                            <li
                                key={cat._id}
                                className={`p-3 cursor-pointer hover:bg-blue-50 `}
                            >
                                <Link
                                    href={`laptop/category/${cat.slug}`}>
                                    {cat.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="col-span-10">
                    <SlideBanner banners={banners} />
                </div>
            </div>
        </SectionWrapper >
    );
}