import LaptopGroupCardContent from '@/components/section/LaptopGroupSection/LaptopGroupCardContent';
import { ILaptop } from '@/types';
import React from 'react'

interface LaptopGroup {
    _id: string;
    name: string;
    slug: string;
    description: string;
    laptops: [ILaptop],
    isActive: boolean;
    sortOrder: number;
    backgroundImage: string;
    createdAt: string;
    updatedAt: string;
}
export default function LaptopGroupSectionChild({ group }: { group: LaptopGroup }) {
    return (
        <div
            className="w-full min-h-[400px] object-cover mb-8"
            style={{
                backgroundImage: `url(${group.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className='p-4'>
                <h2 className='text-white font-semibold'>{group.name}</h2>
                <div className='my-2 h-[1px] bg-white w-full'></div>
                <div className='grid grid-cols-5 gap-4'>
                    {group.laptops.map((laptop) => (
                        <LaptopGroupCardContent
                        key={laptop._id}
                        laptop={laptop}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
