import LaptopCard from '@/components/home/LaptopCard';
import { ILaptop, ILaptopGroup } from '@/types';
import React from 'react'



export default function LaptopGroupSectionChild({ group }: { group: ILaptopGroup }) {
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
                <div className='grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-5 gap-4'>
                    {group.laptops.map((laptop) => (
                        <LaptopCard
                            key={laptop._id}
                            laptop={laptop}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
