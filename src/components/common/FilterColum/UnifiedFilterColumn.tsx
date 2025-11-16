'use client'
import { IBrand, ICategory } from '@/types'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Checkbox } from '@/components/atoms/ui/checkbox'
import { Button } from '@/components/atoms/ui/Button'
import { X } from 'lucide-react'

const priceRanges = [
  { label: "Dưới 10 triệu", min: 0, max: 10000000 },
  { label: "10 - 15 triệu", min: 10000000, max: 15000000 },
  { label: "15 - 20 triệu", min: 15000000, max: 20000000 },
  { label: "Trên 20 triệu", min: 20000000, max: Infinity },
]
const ramOptions = ["4", "8", "16", "32"]
const cpuOptions = ["i3", "i5", "i7", "Ryzen 5", "Ryzen 7"]

export default function UnifiedFilterColumn({
  categoryList,
  brandList
}: {
  categoryList: ICategory[],
  brandList: IBrand[]
}) {
  const router = useRouter();
  const searchParams = useSearchParams()

  // Initialize from URL params
  const brandParam = searchParams?.get('brand')?.split(',') || []
  const categoryParam = searchParams?.get('category')?.split(',') || []

  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryParam)
  const [selectedBrands, setSelectedBrands] = useState<string[]>(brandParam)
  const [selectedPrices, setSelectedPrices] = useState<number[]>([])
  const [selectedRAM, setSelectedRAM] = useState<string[]>([])
  const [selectedCPU, setSelectedCPU] = useState<string[]>([])

  // Sync with URL params
  useEffect(() => {
    setSelectedBrands(brandParam)
    setSelectedCategories(categoryParam)
  }, [searchParams])

  // Handler cho filter
  const handleBrandFilter = (slug: string) => {
    setSelectedBrands(prev =>
      prev.includes(slug) ? prev.filter(b => b !== slug) : [...prev, slug]
    )
  }

  const handleCategoryFilter = (slug: string) => {
    setSelectedCategories(prev =>
      prev.includes(slug) ? prev.filter(c => c !== slug) : [...prev, slug]
    )
  }

  const handleClearFilters = () => {
    setSelectedBrands([])
    setSelectedCategories([])
    setSelectedPrices([])
    setSelectedRAM([])
    setSelectedCPU([])
  }

  // Update URL khi filter thay đổi
  useEffect(() => {
    const params = new URLSearchParams()

    if (selectedBrands.length > 0) {
      params.set("brand", selectedBrands.join(","));
    }
    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","));
    }
    if (selectedPrices.length > 0) {
      selectedPrices.forEach(idx => {
        const range = priceRanges[idx];
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
    const newUrl = params.toString() ? `?${params.toString()}` : '/laptop'
    router.replace(newUrl);
  }, [selectedCategories, selectedBrands, selectedPrices, selectedRAM, selectedCPU, router]);

  const hasActiveFilters = selectedBrands.length > 0 || selectedCategories.length > 0 || 
                          selectedPrices.length > 0 || selectedRAM.length > 0 || selectedCPU.length > 0

  return (
    <aside className="w-full md:w-64 bg-white rounded-lg p-4 sm:p-6 shadow-sm border mb-6 md:mb-0 sticky top-24 h-fit">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <h2 className="text-lg font-bold text-gray-900">Bộ lọc</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4 mr-1" />
            Xóa
          </Button>
        )}
      </div>

      {/* Brand Filter */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3 text-base text-gray-900">Hãng sản xuất</h3>
        <ul className="max-h-48 overflow-y-auto space-y-2">
          {brandList.map(brand => (
            <li key={brand._id}>
              <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors">
                <Checkbox
                  checked={selectedBrands.includes(brand.slug)}
                  onCheckedChange={() => handleBrandFilter(brand.slug)}
                />
                <div className="flex items-center gap-2 flex-1">
                  {brand.logo && (
                    <img src={brand.logo} alt={brand.name} className="h-5 w-5 object-contain" />
                  )}
                  <span className="text-sm">{brand.name}</span>
                </div>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3 text-base text-gray-900">Danh mục</h3>
        <ul className="max-h-48 overflow-y-auto space-y-2">
          {categoryList.map(cat => (
            <li key={cat._id}>
              <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors">
                <Checkbox
                  checked={selectedCategories.includes(cat.slug)}
                  onCheckedChange={() => handleCategoryFilter(cat.slug)}
                />
                <span className="text-sm">{cat.name}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3 text-base text-gray-900">Khoảng giá</h3>
        <ul className="space-y-2">
          {priceRanges.map((range, idx) => (
            <li key={idx}>
              <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors">
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
                <span className="text-sm">{range.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* RAM Filter */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3 text-base text-gray-900">RAM</h3>
        <div className="flex flex-wrap gap-2">
          {ramOptions.map(ram => (
            <Button
              key={ram}
              variant={selectedRAM.includes(ram) ? "default" : "outline"}
              size="sm"
              className="rounded-lg text-xs"
              onClick={() =>
                setSelectedRAM(prev =>
                  prev.includes(ram)
                    ? prev.filter(r => r !== ram)
                    : [...prev, ram]
                )
              }
            >
              {ram} GB
            </Button>
          ))}
        </div>
      </div>

      {/* CPU Filter */}
      <div>
        <h3 className="font-semibold mb-3 text-base text-gray-900">CPU</h3>
        <div className="flex flex-wrap gap-2">
          {cpuOptions.map(cpu => (
            <Button
              key={cpu}
              variant={selectedCPU.includes(cpu) ? "default" : "outline"}
              size="sm"
              className="rounded-lg text-xs"
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
          ))}
        </div>
      </div>
    </aside>
  )
}

