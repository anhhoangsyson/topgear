'use client'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/atoms/ui/pagination';
import LaptopCard from '@/components/molecules/cards/LaptopCard';
import SectionWrapper from '@/components/organisms/section/SectionWrapper';
import { ILaptop } from '@/types'
import React, { useState } from 'react'

const pageSize = 10; // Số lượng laptop hiển thị mỗi trang
export default function LaptopSection({ laptops }: { laptops: ILaptop[] }) {

    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(laptops.length / pageSize);
    const startIdx = (page - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    const laptopToShow = laptops.slice(startIdx, endIdx)





    return (
        <SectionWrapper>
            <h2 className='text-2xl font-bold text-left my-4'>Laptop tại Top Gear</h2>
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4'>
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
