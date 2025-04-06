'use client'
import { Button } from '@/components/ui/Button';
import { ICategory } from '@/types';
import React, { use, useEffect, useState } from 'react'
import { set } from 'zod';

// get filter categorey
export default function FilterProduct({ id, onFilter }: { id: string, onFilter: (fillter: any) => void }) {
    const [filterValue, setFilterValue] = useState<{ [key: string]: string }>({})
    const [filterData, setFilterData] = useState<ICategory[]>([])
    const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string }>({})
    const [openFilters, setOpenFilters] = useState<{ [key: string]: boolean }>({});
    const [loading, setLoading] = useState<boolean>(false);
    const handleClickFilter = (parentCategoryId: string, value: string) => {

        setFilterValue(prev => ({
            ...prev,
            [parentCategoryId]: prev[parentCategoryId] === value ? "" : value,
        }))

        setSelectedFilters(prev => ({
            ...prev,
            [parentCategoryId]: prev[parentCategoryId] === value ? '' : value, // Chỉ có một filter được chọn trong mỗi danh mục
        }));
        setLoading(false)
    }

    const toggleFilter = (id: string) => {
        setOpenFilters(prev => ({
            ...prev,
            [id]: !prev[id], // Đảo ngược trạng thái mở/đóng
        }));
    };

    useEffect(() => {
        const fetchFilter = async () => {
            const res = await fetch(`https://top-gear-be.vercel.app/api/v1/categories/categoriesByChildId/${id}`);
            const filterData = await res.json()
            console.log('filter at cpm', filterData);

            setFilterData(filterData.data);
        }
        fetchFilter()
    }, [id])

    const handleFilter = () => {
        onFilter(selectedFilters)
        setLoading(true)
    }

    return (
        <div>
            <h3 className='py-2 font-semibold'>Chọn theo tiêu chí</h3>
            <div className="w-full grid 2xl:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 gap-4">
                {filterData && filterData.map((item: ICategory) => (
                    <div
                        key={item._id}
                        className="relative min-w-[160px] px-3 py-2 bg-white border border-gray-300 rounded shadow-md 
                                     text-gray-700 text-[15px] font-medium cursor-pointer 
                                    transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 
                                     hover:border-blue-400"
                    >
                        <div
                            onClick={() => toggleFilter(item._id as string)}
                            className="flex items-center justify-between"
                        >
                            <span>{item.categoryName}</span>
                            <span className={`transition-transform ${item._id && openFilters[item._id] ? 'rotate-180' : 'rotate-0'}`}>
                                ▼
                            </span>
                        </div>
                        <div
                            className={`absolute left-0 top-9 bg-white min-w-[160px] mt-2 px-2 py-2 shadow-2xl rounded text-sm transition-all duration-300 ${item._id && openFilters[item._id] ? 'opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                            {item.children?.map((child: ICategory) => (
                                <div
                                    onClick={() => handleClickFilter(child._id as string, child.categoryName)}
                                    className={`grid grid-cols-1 gap-2 py-2 px-4 text-gray-700 text-[15px] font-medium cursor-pointer rounded-lg
                                        ${selectedFilters[child._id  as string] === child.categoryName
                                            ? 'bg-blue-500 text-white font-semibold'
                                            : 'text-gray-70'}
                                        `}
                                    key={child._id}>
                                    {child.categoryName}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                <Button
                    {...loading ? { disabled: true } : {}}
                    type='submit' variant={'default'} onClick={handleFilter}>Loc</Button>
            </div>
        </div>
    )
}
