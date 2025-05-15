import LaptopGroupSectionChild from '@/components/section/LaptopGroupSection/LaptopGroupSectionChild';
import SectionWrapper from '@/components/section/SectionWrapper'
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

export default function LaptopGroupSection({ laptopGroups }: { laptopGroups: LaptopGroup[] }) {
    return (
        <SectionWrapper>
            <div>
                {laptopGroups.map((group: LaptopGroup) => (
                    <LaptopGroupSectionChild
                        key={group._id}
                        group={group}
                    />
                ))}
            </div>
        </SectionWrapper>
    )
}
