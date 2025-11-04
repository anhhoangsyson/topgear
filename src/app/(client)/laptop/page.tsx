import React, { Suspense } from 'react'
import { IBrand, ICategory } from '@/types'
import UnifiedFilterColumn from '@/components/common/FilterColum/UnifiedFilterColumn'
import MobileFilterDrawer from '@/components/common/FilterColum/MobileFilterDrawer'
import LaptopList from '@/app/(client)/laptop/LaptopList'
import { Loader } from '@/components/atoms/feedback/Loader'

async function getBrandList() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/brand`, {
      method: 'GET',
      cache: 'no-store',
    })
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch brands');
    }
    return data.data;
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
}

async function getCategoryList() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/category`, {
      method: 'GET',
      cache: 'no-store',
    })
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch categories');
    }
    return data.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function LaptopsPage() {
  const brandList: IBrand[] = await getBrandList();
  const categoryList: ICategory[] = await getCategoryList();

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Tất cả Laptop
          </h1>
          <p className="text-gray-600">
            Tìm kiếm và lọc laptop theo hãng, danh mục, giá và thông số kỹ thuật
          </p>
        </div>

        {/* Mobile Filter Button */}
        <div className="mb-4 md:hidden">
          <Suspense fallback={<div className="h-10 bg-gray-200 rounded animate-pulse" />}>
            <MobileFilterDrawer
              categoryList={categoryList}
              brandList={brandList}
            />
          </Suspense>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar - Desktop Only */}
          <div className="hidden lg:block lg:w-64 flex-shrink-0">
            <Suspense fallback={<div className="bg-white rounded-lg p-4 h-96 animate-pulse" />}>
              <UnifiedFilterColumn
                categoryList={categoryList}
                brandList={brandList}
              />
            </Suspense>
          </div>

          {/* Laptop List */}
          <div className="flex-1">
            <Suspense fallback={
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <Loader size="lg" variant="blue" />
                <p className="text-sm text-gray-600">Đang tải...</p>
              </div>
            }>
              <LaptopList />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

