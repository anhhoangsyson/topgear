'use client'
import React, { useState } from "react";
import { ICategory, IBrand } from "@/types";
import SectionWrapper from "@/components/section/SectionWrapper";
import { Checkbox } from "@/components/ui/checkbox";

const priceRanges = [
    { label: "Dưới 10 triệu", min: 0, max: 10000000 },
    { label: "10 - 15 triệu", min: 10000000, max: 15000000 },
    { label: "15 - 20 triệu", min: 15000000, max: 20000000 },
    { label: "Trên 20 triệu", min: 20000000, max: Infinity },
];

export default function CategorySection({
    categories,
    brands,
}: {
    categories: ICategory[];
    brands: IBrand[];
}) {
    const [activeCat, setActiveCat] = useState<string | null>(null);
    const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

    const handlePriceChange = (idx: number) => {
        setSelectedPrice(idx);
        console.log("Selected price range:", priceRanges[idx]);
    };

    // Handler cho chọn brand
    const handleBrandChange = (brandId: string) => {
        setSelectedBrands((prev) =>
            prev.includes(brandId)
                ? prev.filter((id) => id !== brandId)
                : [...prev, brandId]
        );
        console.log("Selected brands:", selectedBrands);

    };

    return (
        <SectionWrapper>
            <div className="mt-4 text-sm text-gray-600">
                {/* <div>
                    Giá đã chọn:{" "}
                    {selectedPrice !== null ? priceRanges[selectedPrice].label : "Chưa chọn"}
                </div> */}
                <div>
                    Hãng đã chọn:{" "}
                    {selectedBrands.length > 0
                        ? brands
                            .filter(b => selectedBrands.includes(b._id))
                            .map(b => b.name)
                            .join(", ")
                        : "Chưa chọn"}
                </div>
            </div>

            <div className="flex flex-col items-start relative"
                onMouseLeave={() => setActiveCat(null)}
            >
                {/* Danh mục dọc */}
                <ul className="w-48 border-r">
                    {categories.map((cat) => (
                        <li
                            key={cat._id}
                            className={`p-3 cursor-pointer hover:bg-blue-50 ${activeCat === cat._id ? "bg-blue-100" : ""}`}
                            onMouseEnter={() => setActiveCat(cat._id)}
                        >
                            {cat.name}
                        </li>
                    ))}
                </ul>

                {/* Filter phụ hiện theo chiều ngang */}
                {activeCat && (
                    <div
                        className="absolute left-48 top-0 ml-4 flex flex-row gap-32 p-4 bg-gray-50 rounded shadow w-full min-w-[400px] z-10"
                        onMouseEnter={() => setActiveCat(activeCat)}
                    >
                        {/* Lọc theo giá */}
                        <div>
                            <div className="font-semibold mb-2">Lọc theo giá</div>
                            <ul>
                                {priceRanges.map((range, idx) => (
                                    <li
                                        className="mb-1"
                                        key={idx}>
                                        <label
                                            htmlFor="price"
                                            className="flex gap-x-4 items-center cursor-pointer">
                                            <Checkbox
                                                onCheckedChange={() => handlePriceChange(idx)}
                                                checked={selectedPrice === idx}
                                                id={`price-${idx}`}
                                            />
                                            {range.label}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Lọc theo hãng */}
                        <div>
                            <div className="font-semibold mb-2">Lọc theo hãng</div>
                            <ul>
                                {brands.map((brand) => (
                                    <li
                                        className="mb-2"
                                        key={brand._id}>
                                        <label
                                            htmlFor="brand"
                                            className="cursor-pointer flex items-center gap-x-4 ">
                                            <Checkbox
                                                onCheckedChange={() => handleBrandChange(brand._id)}
                                                checked={selectedBrands.includes(brand._id)}
                                                id={`brand-${brand._id}`} />
                                            {brand.logo && (
                                                <img src={brand.logo} alt={brand.name} className="h-6 w-6 object-contain" />
                                            )}
                                            {brand.name}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </SectionWrapper>
    );
}