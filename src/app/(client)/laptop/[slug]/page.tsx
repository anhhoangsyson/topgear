import { ILaptop } from '@/types';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'
import DetailProductPage from '@/components/productDetail';
import Loading from '@/app/(client)/products/[id]/Loading';
import DetailLaptopPage from '@/components/productDetail';

async function getLaptopBySlug(slug: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/laptop/slug/${slug}`, {
            method: 'GET',
        })
        const data = await res.json();
        if (!res.ok) {

            throw new Error(data.message || 'Failed to fetch laptop');
        }
        return data.data;
    } catch (error) {
        console.log('Error fetching laptop by slug:', error);

    }

}

export default async function LaptopDetail({ params}: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const laptop = await getLaptopBySlug(slug);
    

    try {
        const laptop: ILaptop = await getLaptopBySlug(slug);
        if (!laptop) {
            return notFound();
        }
        return (
            <Suspense fallback={<Loading />}  >
                <DetailLaptopPage data={laptop} />;
            </Suspense>
        )
    } catch (error) {
        console.error('Error fetching laptop:', error);
        return notFound();
    }

}
