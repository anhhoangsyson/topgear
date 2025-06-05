import { IBrand, ICategory, ILaptop } from '@/types';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'
import Loading from '@/app/(client)/products/[id]/Loading';
import FilterColum from '@/components/common/FilterColum/FilterColum';
import LaptopColumn from '@/app/(client)/laptop/brand/[slug]/LaptopColumn';
import LaptopSectionWrapper from '@/app/(client)/laptop/category/[slug]/LaptopSectionWrapper';

async function getLaptopByBrand(slug: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/laptop/category?categorySlug=${slug}`, {
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

async function getBrandList() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/brand`, {
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
    const brandList: IBrand[] = await getBrandList();

    try {
        const laptop: ILaptop[] = await getLaptopByBrand(slug);
        if (!laptop) {
            return notFound();
        }
        return (
            <div>
                <Suspense fallback={<Loading />}  >
                    <div className='flex'>
                        {/* filter column */}
                        <FilterColum
                            type='category'
                            brandList={brandList}
                            categoryList={[]}
                        />
                        {/* laptop section */}
                        <LaptopSectionWrapper
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
