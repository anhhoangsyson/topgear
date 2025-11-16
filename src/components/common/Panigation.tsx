import { Button } from '@/components/atoms/ui/Button'
import Link from 'next/link'
import React from 'react'

type PanigationProps = {
    totalPages: number
    page: number
    onPageChange?: (page: number) => void
}

export default function Panigation({ totalPages, page, onPageChange }: PanigationProps) {
    const renderLinkOrButton = (pageNum: number, children: React.ReactNode) => {
        if (onPageChange) {
            return (
                <button
                    onClick={() => onPageChange(pageNum)}
                    className={`px-4 py-2 rounded-full ${page === pageNum ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                >
                    {children}
                </button>
            )
        }

        return (
            <Link
                href={`/products?page=${pageNum}`}
                className={`px-4 py-2 rounded-full ${page === pageNum ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            >
                {children}
            </Link>
        )
    }

    return (
        <div className="flex justify-center gap-x-2 mt-6 flex-wrap">
            <Button
                variant={'link'}
                disabled={page === 1}
            >
                {onPageChange ? (
                    <button onClick={() => onPageChange(page - 1)}>Previous</button>
                ) : (
                    <Link href={`/products?page=${page - 1}`}>Previous</Link>
                )}
            </Button>

            {totalPages <= 5
                ? Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <React.Fragment key={`page-${pageNum}`}>
                            {renderLinkOrButton(pageNum, pageNum)}
                        </React.Fragment>
                    ))
                : [
                        1,
                        2,
                        page > 3 ? page : 3,
                        page + 1 <= totalPages ? page + 1 : totalPages - 1,
                        totalPages,
                    ].map((pageNum, index, arr) => (
                        <React.Fragment key={`page-${pageNum}`}>
                            {renderLinkOrButton(pageNum, index === arr.length - 2 && page < totalPages - 2 ? '...' : pageNum)}
                        </React.Fragment>
                    ))}

            <Button
                variant={'link'}
                disabled={page === totalPages}
            >
                {onPageChange ? (
                    <button onClick={() => onPageChange(page + 1)}>Next</button>
                ) : (
                    <Link href={`/products?page=${page + 1}`}>Next</Link>
                )}
            </Button>
        </div>
    )
}
