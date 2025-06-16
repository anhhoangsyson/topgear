import SectionWrapper from '@/components/organisms/section/SectionWrapper';
import { ILaptop } from '@/types';
import React from 'react'
import LaptopGroupSectionChild from '@/components/organisms/section/LaptopGroupSection/LaptopGroupSectionChild';

interface LaptopGroup {
    _id: string;
    name: string;
    slug: string;
    description: string;
    laptops: [ILaptop],
    isActive: boolean;
    sortOrder: number;
    backgroundImage: string;
    createdAt: Date;
    updatedAt: Date;
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
