'use client'
import LaptopSection from '@/components/section/LaptopSection/LaptopSection'
import { ILaptop } from '@/types'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function LaptopColumn({ slug }: { slug: string }) {
    const [laptops, setLaptops] = useState<ILaptop[]>([]);

    const searchParams = useSearchParams();

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('brand', slug);
        const fetchLaptops = async () => {
            const query = params.toString();
            const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/laptop/filter?${query}`, {
                method: 'GET',
            })
            const data = await res.json();
            setLaptops(data.data || []);
        }

        fetchLaptops();
    }, [slug, searchParams])
    return (
        <div>
            <LaptopSection
                laptops={laptops}
            />
        </div>
    )
}
