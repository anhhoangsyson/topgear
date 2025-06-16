'use client'
import { IBrand, ICategory } from '@/types'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Checkbox } from '@/components/atoms/ui/checkbox'
import { Button } from '@/components/atoms/ui/Button'

const priceRanges = [
  { label: "Dưới 10 triệu", min: 0, max: 10000000 },
  { label: "10 - 15 triệu", min: 10000000, max: 15000000 },
  { label: "15 - 20 triệu", min: 15000000, max: 20000000 },
  { label: "Trên 20 triệu", min: 20000000, max: Infinity },
]
const ramOptions = ["4", "8", "16", "32"]
const cpuOptions = ["i3", "i5", "i7", "Ryzen 5", "Ryzen 7"]

export default function FilterColum({
  type, categoryList, brandList
}: {
  type: "brand" | "category",
  categoryList: ICategory[],
  brandList: IBrand[]
}) {

  const router = useRouter();

  // Sử dụng useSearchParams để lấy các tham số tìm kiếm từ URL
  const searchParams = useSearchParams()

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedPrices, setSelectedPrices] = useState<number[]>([])
  const [selectedRAM, setSelectedRAM] = useState<string[]>([])
  const [selectedCPU, setSelectedCPU] = useState<string[]>([])

  // Handler cho filter chính
  const handleMainFilter = (id: string, isBrand: boolean) => {
    if (isBrand) {
      setSelectedBrands(prev =>
        prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
      )
    } else {
      setSelectedCategories(prev =>
        prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
      )
    }
  }

  // set filter data de pass url de chuan bi goi api filter o be.
  useEffect(() => {
    const params = new URLSearchParams()

    if (type === "brand" && selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","));
    }
    if (type === "category" && selectedBrands.length > 0) {
      params.set("brand", selectedBrands.join(","));
    }
    if (selectedPrices.length > 0) {
      selectedPrices.forEach(idx => {
        const range = priceRanges[idx];
        // Có thể truyền nhiều khoảng giá, hoặc chỉ lấy 1 khoảng (nếu chỉ chọn 1)
        params.append("minPrice", range.min.toString());
        params.append("maxPrice", range.max.toString());
      });
    }
    if (selectedRAM.length > 0) {
      params.set("ram", selectedRAM.join(","));
    }
    if (selectedCPU.length > 0) {
      params.set("cpu", selectedCPU.join(","));
    }

    // Cập nhật URL (không reload trang)
    router.replace(`?${params.toString()}`);
  }, [selectedCategories, selectedBrands, selectedPrices, selectedRAM, selectedCPU, type, router]);



  return (
    <aside className="w-full md:w-64 bg-white rounded-lg p-4 shadow-sm border mb-6 md:mb-0">
      {/* Filter chính */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2 text-base">
          {type === "brand" ? "Danh mục" : "Hãng"}
        </h3>
        <ul className="max-h-40 overflow-y-auto">
          {type === "brand"
            ? categoryList.map(cat => (
              <li key={cat._id} className="mb-1">
                <label className="flex items-center gap-x-2 cursor-pointer">
                  <Checkbox
                    checked={selectedCategories.includes(cat.slug)}
                    onCheckedChange={() => handleMainFilter(cat.slug, false)}
                  />
                  {cat.name}
                </label>
              </li>
            ))
            : brandList.map(brand => (
              <li key={brand._id} className="mb-1">
                <label className="flex items-center gap-x-2 cursor-pointer">
                  <Checkbox
                    checked={selectedBrands.includes(brand.slug)}
                    onCheckedChange={() => handleMainFilter(brand.slug, true)}
                  />
                  {brand.logo && (
                    <img src={brand.logo} alt={brand.name} className="h-5 w-5 object-contain" />
                  )}
                  {brand.name}
                </label>
              </li>
            ))
          }
        </ul>
      </div>
      {/* Filter phụ: Giá */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2 text-base">Khoảng giá</h3>
        <ul>
          {priceRanges.map((range, idx) => (
            <li key={idx} className="mb-1">
              <label className="flex items-center gap-x-2 cursor-pointer">
                <Checkbox
                  checked={selectedPrices.includes(idx)}
                  onCheckedChange={() =>
                    setSelectedPrices(prev =>
                      prev.includes(idx)
                        ? prev.filter(i => i !== idx)
                        : [...prev, idx]
                    )
                  }
                />
                {range.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
      {/* Filter phụ: RAM */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2 text-base">RAM</h3>
        <ul className="flex flex-wrap gap-2">
          {ramOptions.map(ram => (
            <li key={ram}>
              <Button
                variant={selectedRAM.includes(ram) ? "default" : "outline"}
                size="sm"
                className="rounded"
                onClick={() =>
                  setSelectedRAM(prev =>
                    prev.includes(ram)
                      ? prev.filter(r => r !== ram)
                      : [...prev, ram]
                  )
                }
              >
                {ram}
              </Button>
            </li>
          ))}
        </ul>
      </div>
      {/* Filter phụ: CPU */}
      <div>
        <h3 className="font-semibold mb-2 text-base">CPU</h3>
        <ul className="flex flex-wrap gap-2">
          {cpuOptions.map(cpu => (
            <li key={cpu}>
              <Button
                variant={selectedCPU.includes(cpu) ? "default" : "outline"}
                size="sm"
                className="rounded"
                onClick={() =>
                  setSelectedCPU(prev =>
                    prev.includes(cpu)
                      ? prev.filter(c => c !== cpu)
                      : [...prev, cpu]
                  )
                }
              >
                {cpu}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}