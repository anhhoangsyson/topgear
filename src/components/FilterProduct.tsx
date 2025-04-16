"use client"
import { useEffect, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/Button"

interface CategoryItem {
    _id: string
    categoryName: string
    parentCategoryId: string
    children: CategoryItem[]
}

interface FilterProductProps {
    id: string
    onFilter?: (selectedFilters: Record<string, boolean>) => void
}

export default function FilterProduct({ id, onFilter }: FilterProductProps) {
    const [filterCategories, setFilterCategories] = useState<CategoryItem[]>([])
    const [selectedFilters, setSelectedFilters] = useState<Record<string, boolean>>({})
    const [loading, setLoading] = useState(false)
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    // Fetch filter data when component mounts
    useEffect(() => {
        const fetchFilterData = async () => {
            setLoading(true)
            try {
                const response = await fetch(`https://top-gear-be.vercel.app/api/v1/categories/categoriesByChildId/${id}`)
                const data = await response.json()
                if (data.data) {
                    setFilterCategories(data.data)
                }
            } catch (error) {
                console.error("Error fetching filter data:", error)
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchFilterData()
        }
    }, [id])

    // Handle checkbox change
    const handleFilterChange = (filterId: string, checked: boolean) => {
        setSelectedFilters((prev) => ({
            ...prev,
            [filterId]: checked,
        }))
    }

    // Apply filters
    const applyFilters = () => {
        // Filter out unchecked items
        const activeFilters = Object.entries(selectedFilters)
            .filter(([_, isSelected]) => isSelected)
            .reduce(
                (acc, [key, value]) => {
                    acc[key] = value
                    return acc
                },
                {} as Record<string, boolean>,
            )

        // Check if onFilter is a function before calling it
        if (typeof onFilter === "function") {
            onFilter(activeFilters)
        } else {
            console.warn("onFilter prop is not a function or not provided")
        }

        // On mobile, close the filter panel after applying
        if (typeof window !== "undefined" && window.innerWidth < 768) {
            setIsFilterOpen(false)
        }
    }

    // Clear all filters
    const clearFilters = () => {
        setSelectedFilters({})
        if (typeof onFilter === "function") {
            onFilter({})
        }
    }

    return (
        <div className="relative mt-6">
            {/* Mobile filter toggle button */}
            <div className="md:hidden flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button variant="outline" onClick={() => setIsFilterOpen(!isFilterOpen)} className="flex items-center gap-2">
                    <Filter size={16} />
                    Filter
                </Button>
            </div>

            {/* Filter sidebar - hidden on mobile unless toggled */}
            <div
                className={`
        ${isFilterOpen ? "fixed inset-0 z-50 bg-white" : "hidden"} 
        md:block md:relative md:z-auto md:bg-transparent
        w-full  p-4 overflow-auto
      `}
            >
                {/* Mobile header */}
                <div className="flex justify-between items-center mb-4 md:hidden">
                    <h2 className="text-xl font-bold">Filters</h2>
                    <Button variant="ghost" size="icon" onClick={() => setIsFilterOpen(false)}>
                        <X size={24} />
                    </Button>
                </div>

                <div className="">
                    <div className="flex justify-between items-center">
                        <div>
                            <Button
                                size={ "default" }
                                className="text-[12px]"
                                onClick={applyFilters}>
                                Lọc sản phẩm
                            </Button>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="text-[13px] text-gray-500 hover:text-gray-700"
                        >
                            Chọn lại
                        </Button>
                    </div>

                    {loading ? (
                        <div className="py-4 flex items-center justify-center space-y-4 w-full">
                            {[1, 2, 3, 4].map((_, index) => (
                                <div key={index} className="animate-pulse space-y-2 w-full">
                                    <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                                    <div className="space-y-1 pl-4">
                                        {[1].map((_, subIndex) => (
                                            <div key={subIndex} className="h-3 bg-gray-200 rounded w-2/3"></div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Accordion type="multiple" className="flex flex-col">
                            {filterCategories.map((category) => (
                                <AccordionItem key={category._id} value={category._id}>
                                    <AccordionTrigger className="text-[14px] font-medium ">{category.categoryName}</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-2 pl-2">
                                            {category.children &&
                                                category.children.map((child) => (
                                                    <div key={child._id} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={child._id}
                                                            checked={selectedFilters[child._id] || false}
                                                            onCheckedChange={(checked) => handleFilterChange(child._id, checked === true)}
                                                        />
                                                        <Label htmlFor={child._id} className="text-sm cursor-pointer">
                                                            {child.categoryName}
                                                        </Label>
                                                    </div>
                                                ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}


                </div>
            </div>
        </div>
    )
}
