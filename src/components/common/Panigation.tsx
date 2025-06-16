import { Button } from '@/components/atoms/ui/Button'
import Link from 'next/link'
import React from 'react'

export default function Panigation({ totalPages, page }: { totalPages: number, page: number }) {
    return (
        <div className="flex justify-center gap-x-2 mt-6 flex-wrap">
            <Button
                variant={'link'}
                disabled={page === 1}>
                <Link href={`/products?page=${page - 1}`}>
                    Previous
                </Link>
            </Button>
            {totalPages <= 5
                ? Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <Link
                        key={`page-${pageNum}`}
                        href={`/products?page=${pageNum}`}
                        className={`px-4 py-2 rounded-full ${page === pageNum ? 'bg-blue-500 text-white' : 'bg-gray-300'
                            }`}
                    >
                        {pageNum}
                    </Link>
                ))
                : [
                    1,
                    2,
                    page > 3 ? page : 3,
                    page + 1 <= totalPages ? page + 1 : totalPages - 1,
                    totalPages,
                ].map((pageNum, index, arr) => (
                    <Link
                        key={`page-${pageNum}`}
                        href={`/products?page=${pageNum}`}
                        className={`px-4 py-2 rounded-full ${page === pageNum ? 'bg-blue-500 text-white' : 'bg-gray-300'
                            } ${index === arr.length - 2 && page < totalPages - 2 ? 'mr-2' : ''}`}
                    >
                        {index === arr.length - 2 && page < totalPages - 2 ? '...' : pageNum}
                    </Link>
                ))}
            <Button
                variant={'link'}
                disabled={page === totalPages}
            >
                <Link
                    href={`/products?page=${page + 1}`}
                >
                    Next
                </Link>
            </Button>
        </div>
    )
}
