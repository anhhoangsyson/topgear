import { Loader } from '@/components/atoms/feedback/Loader';
import DetailLaptopPage from '@/components/pages/DetailLaptopPage';
import { ILaptop } from '@/types';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'

async function getLaptopBySlug(slug: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/laptop/slug/${slug}`, {
            method: 'GET',
            cache: 'no-store',
        })
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || 'Failed to fetch laptop');
        }
        return data.data;
    } catch (error) {
        console.error('Error fetching laptop:', error);
        return null;
    }
}

export default async function LaptopDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    
    try {
        const laptop: ILaptop | null = await getLaptopBySlug(slug);
        
        if (!laptop) {
            return notFound();
        }
        
        return (
            <Suspense fallback={<Loader />}>
                <DetailLaptopPage data={laptop} />
            </Suspense>
        )
    } catch (error) {
        console.error('Error in LaptopDetail:', error);
        return notFound();
    }
}
