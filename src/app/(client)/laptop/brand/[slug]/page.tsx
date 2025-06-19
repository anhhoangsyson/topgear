import { ICategory, ILaptop } from '@/types';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'
import FilterColum from '@/components/common/FilterColum/FilterColum';
import LaptopColumn from '@/app/(client)/laptop/brand/[slug]/LaptopColumn';

async function getLaptopByBrand(slug: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/laptop/brand?brandSlug=${slug}`, {
            method: 'GET',
        })
        const data = await res.json();
        if (!res.ok) {

            throw new Error(data.message || 'Failed to fetch laptop');
        }
        return data.data;
    } catch (error) {

    }

}

async function getCategoryList() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/category`, {
            method: 'GET',
        })
        const data = await res.json();
        if (!res.ok) {

            throw new Error(data.message || 'Failed to fetch laptop');
        }
        return data.data;
    } catch (error) {

    }

}

export default async function LaptopsByBrandPage({ params, }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const categoryList: ICategory[] = await getCategoryList();

    try {
        const laptop: ILaptop[] = await getLaptopByBrand(slug);
        if (!laptop) {
            return notFound();
        }
        return (
            <div>
                <Suspense fallback={<>loading</>}  >
                    <div className='flex'>
                        {/* filter column */}
                        <FilterColum
                            type='brand'
                            brandList={[]}
                            categoryList={categoryList}
                        />
                        {/* laptop section */}
                        <LaptopColumn
                            slug={slug}
                        />
                    </div>
                </Suspense>
            </div>
        )
    } catch (error) {
        console.error('Error fetching laptop:', error);
        return notFound();
    }

}
