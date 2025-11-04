'use client'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/atoms/ui/pagination';
import LaptopCard from '@/components/molecules/cards/LaptopCard';
import SectionWrapper from '@/components/organisms/section/SectionWrapper';
import { ILaptop } from '@/types'
import React, { useState } from 'react'

const pageSize = 10; // Số lượng laptop hiển thị mỗi trang

interface LaptopSectionProps {
    laptops: ILaptop[];
    withFilter?: boolean; // Prop để biết có filter sidebar hay không
}

export default function LaptopSection({ laptops, withFilter = false }: LaptopSectionProps) {

    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(laptops.length / pageSize);
    const startIdx = (page - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    const laptopToShow = laptops.slice(startIdx, endIdx)





    return (
        <SectionWrapper>
            {!withFilter && <h2 className='text-2xl font-bold text-left my-4'>Laptop tại E-COM</h2>}
            <div className={withFilter 
                ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5'
                : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4'
            }>
                {/* render laptop */}
                {laptopToShow.map((laptop) => (
                    <LaptopCard
                        key={laptop._id}
                        laptop={laptop}
                    />
                ))}
            </div>
            {/* panigation */}
            <Pagination className="mt-6 flex justify-center">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            size={'default'}
                            href="#"
                            onClick={e => {
                                e.preventDefault();
                                if (page > 1) setPage(page - 1);
                            }}
                            aria-disabled={page === 1}
                        />
                    </PaginationItem>
                    {Array.from({ length: totalPages }).map((_, idx) => (
                        <PaginationItem key={idx}>
                            <PaginationLink
                                size={'default'}
                                href="#"
                                isActive={page === idx + 1}
                                onClick={e => {
                                    e.preventDefault();
                                    setPage(idx + 1);
                                }}
                            >
                                {idx + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext
                            size={'default'}
                            href="#"
                            onClick={e => {
                                e.preventDefault();
                                if (page < totalPages) setPage(page + 1);
                            }}
                            aria-disabled={page === totalPages}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </SectionWrapper>
    )
}
