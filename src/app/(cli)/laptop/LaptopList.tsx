'use client'
import LaptopSection from '@/components/organisms/section/LaptopSection/LaptopSection';
import { ILaptop } from '@/types'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Loader } from '@/components/atoms/feedback/Loader'
import { Button } from '@/components/atoms/ui/Button'
import { useRouter } from 'next/navigation'

export default function LaptopList() {
    const [laptops, setLaptops] = useState<ILaptop[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const fetchLaptops = async () => {
            setIsLoading(true);
            try {
                // Build query string from search params
                const params = new URLSearchParams();
                
                // Get all params from URL
                const brand = searchParams.get('brand');
                const category = searchParams.get('category');
                const ram = searchParams.get('ram');
                const cpu = searchParams.get('cpu');
                const minPrice = searchParams.get('minPrice');
                const maxPrice = searchParams.get('maxPrice');

                if (brand) params.set('brand', brand);
                if (category) params.set('category', category);
                if (ram) params.set('ram', ram);
                if (cpu) params.set('cpu', cpu);
                if (minPrice) params.append('minPrice', minPrice);
                if (maxPrice) params.append('maxPrice', maxPrice);

                const query = params.toString();
                const url = query 
                    ? `${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/laptop/filter?${query}`
                    : `${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/laptop`;

                const res = await fetch(url, {
                    method: 'GET',
                });
                
                const data = await res.json();
                setLaptops(data.data || []);
            } catch (error) {
                if (process.env.NODE_ENV === 'development') {
                  console.error('Error fetching laptops:', error);
                }
                setLaptops([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLaptops();
    }, [searchParams]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
                <Loader size="lg" variant="blue" />
                <p className="text-sm text-gray-600">Đang tải danh sách laptop...</p>
            </div>
        );
    }

    // Get active filters for display
    const activeFilters = {
        brand: searchParams.get('brand')?.split(',') || [],
        category: searchParams.get('category')?.split(',') || [],
        ram: searchParams.get('ram')?.split(',') || [],
        cpu: searchParams.get('cpu')?.split(',') || [],
    }

    const hasActiveFilters = activeFilters.brand.length > 0 || 
                           activeFilters.category.length > 0 || 
                           activeFilters.ram.length > 0 || 
                           activeFilters.cpu.length > 0 ||
                           searchParams.get('minPrice') || 
                           searchParams.get('maxPrice')

    const handleRemoveFilter = (type: string, value?: string) => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (type === 'brand' && value) {
            const brands = activeFilters.brand.filter(b => b !== value);
            if (brands.length > 0) {
                params.set('brand', brands.join(','));
            } else {
                params.delete('brand');
            }
        } else if (type === 'category' && value) {
            const categories = activeFilters.category.filter(c => c !== value);
            if (categories.length > 0) {
                params.set('category', categories.join(','));
            } else {
                params.delete('category');
            }
        } else if (type === 'ram' && value) {
            const rams = activeFilters.ram.filter(r => r !== value);
            if (rams.length > 0) {
                params.set('ram', rams.join(','));
            } else {
                params.delete('ram');
            }
        } else if (type === 'cpu' && value) {
            const cpus = activeFilters.cpu.filter(c => c !== value);
            if (cpus.length > 0) {
                params.set('cpu', cpus.join(','));
            } else {
                params.delete('cpu');
            }
        } else if (type === 'price') {
            params.delete('minPrice');
            params.delete('maxPrice');
        } else if (type === 'all') {
            params.delete('brand');
            params.delete('category');
            params.delete('ram');
            params.delete('cpu');
            params.delete('minPrice');
            params.delete('maxPrice');
        }
        
        const newUrl = params.toString() ? `?${params.toString()}` : '/laptop';
        router.replace(newUrl);
    }

    return (
        <div>
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-sm text-gray-600">
                    Tìm thấy <span className="font-semibold text-gray-900">{laptops.length}</span> sản phẩm
                </p>
                
                {/* Active Filters Tags - Mobile */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap items-center gap-2">
                        {activeFilters.brand.map(brand => (
                            <span
                                key={brand}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                            >
                                {brand}
                                <button
                                    onClick={() => handleRemoveFilter('brand', brand)}
                                    className="hover:bg-blue-200 rounded-full p-0.5"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                        {activeFilters.category.map(cat => (
                            <span
                                key={cat}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                            >
                                {cat}
                                <button
                                    onClick={() => handleRemoveFilter('category', cat)}
                                    className="hover:bg-blue-200 rounded-full p-0.5"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                        {activeFilters.ram.map(ram => (
                            <span
                                key={ram}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                            >
                                RAM {ram}GB
                                <button
                                    onClick={() => handleRemoveFilter('ram', ram)}
                                    className="hover:bg-blue-200 rounded-full p-0.5"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                        {activeFilters.cpu.map(cpu => (
                            <span
                                key={cpu}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                            >
                                {cpu}
                                <button
                                    onClick={() => handleRemoveFilter('cpu', cpu)}
                                    className="hover:bg-blue-200 rounded-full p-0.5"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                        {(searchParams.get('minPrice') || searchParams.get('maxPrice')) && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                Giá
                                <button
                                    onClick={() => handleRemoveFilter('price')}
                                    className="hover:bg-blue-200 rounded-full p-0.5"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveFilter('all')}
                                className="text-xs text-gray-600 hover:text-gray-900 h-6 px-2"
                            >
                                Xóa tất cả
                            </Button>
                        )}
                    </div>
                )}
            </div>
            {laptops.length > 0 ? (
                <LaptopSection laptops={laptops} withFilter={true} />
            ) : (
                <div className="text-center py-12 bg-white rounded-lg">
                    <p className="text-gray-500 text-lg">Không tìm thấy laptop nào.</p>
                    <p className="text-sm text-gray-400 mt-2">Thử thay đổi bộ lọc để xem thêm sản phẩm</p>
                </div>
            )}
        </div>
    );
}

