import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { formatDate } from '@/lib/utils';
import { IBlog } from '@/types';
import { X } from 'lucide-react';
import Image from 'next/image';
import React from 'react'

interface BlogPreviewProps {
    open: boolean;
    onClose: () => void;
    blog?: IBlog | null;
}
export default function BlogPreview({ open, onClose, blog }: BlogPreviewProps) {
    if (!open || !blog) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative flex flex-col"
                style={{ maxHeight: '90vh' }}>
                <Button
                    variant={"secondary"}
                    className="absolute top-2 right-2 text-gray-500 hover:text-black"
                    onClick={onClose}
                >
                    <div>
                        <X />
                    </div>
                </Button>
                <div
                    className="p-4 mt-6 overflow-y-auto" style={{ maxHeight: '75vh' }}>
                    <div>
                        <div className="border-b-2 border-gray-200 pb-4 mb-6">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight text-center">
                                {blog.title}
                            </h1>
                            <Image
                                className='py-4 rounded-lg shadow-md w-full h-auto object-cover'
                                src={blog.thumbnail || '/default-thumbnail.jpg'}
                                alt={blog.title}
                                width={800}
                                height={450}
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-2">
                            <p className="text-gray-500 text-sm sm:text-base">
                                By <strong className="text-gray-700">{blog.userId.fullname}</strong>
                                <span className="mx-2">•</span>
                                {formatDate(blog.createdAt instanceof Date ? blog.createdAt.toISOString() : blog.createdAt)}
                            </p>
                        </div>
                        <div
                            className="prose prose-img:rounded-lg prose-img:mx-auto prose-headings:text-gray-800 prose-p:text-gray-700 max-w-none text-justify"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
