import NotFound from '@/app/not-found';
import React from 'react'
import { formatDate } from '../../../../lib/utils';
import BlogBreadcrumb from '@/app/(client)/blogs/[slug]/BlogBreadCrumb';
import Image from 'next/image';
import { Calendar, User, Tag } from 'lucide-react';
import Link from 'next/link';

export default async function page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/blog/slug/${slug}`, {
        method: 'GET',
        cache: 'no-store',
    })

    if (!res.ok) {
        return NotFound();
    }
    const data = await res.json();
    const blogDetai = data.data;
    
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Breadcrumb */}
                <div className='mb-6 sm:mb-8'>
                    <BlogBreadcrumb title={blogDetai.title} />
                </div>

                {/* Article Container */}
                <article className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {/* Header Section */}
                    <div className="px-6 sm:px-8 lg:px-12 pt-8 sm:pt-12 pb-6">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                            {blogDetai.title}
                        </h1>

                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-600 pb-6 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span className="font-medium text-gray-700">{blogDetai.userId?.fullname || 'Admin'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <time dateTime={blogDetai.createdAt}>
                                    {formatDate(blogDetai.createdAt)}
                                </time>
                            </div>
                            {blogDetai.tags && blogDetai.tags.length > 0 && (
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Tag className="w-4 h-4" />
                                    <div className="flex flex-wrap gap-2">
                                        {blogDetai.tags.map((tag: string, index: number) => (
                                            <span
                                                key={index}
                                                className="px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Featured Image */}
                    {blogDetai.thumbnail && (
                        <div className="relative w-full aspect-video bg-gray-200 mb-8">
                            <Image
                                className='object-cover w-full h-full'
                                src={blogDetai.thumbnail}
                                alt={blogDetai.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 896px, 896px"
                                priority
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="px-6 sm:px-8 lg:px-12 pb-8 sm:pb-12">
                        <div
                            className="prose prose-lg sm:prose-xl max-w-none
                                prose-headings:text-gray-900 prose-headings:font-bold
                                prose-h1:text-3xl prose-h1:sm:text-4xl prose-h1:mb-6 prose-h1:mt-8
                                prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:mb-4 prose-h2:mt-8
                                prose-h3:text-xl prose-h3:sm:text-2xl prose-h3:mb-3 prose-h3:mt-6
                                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
                                prose-a:text-blue-600 prose-a:no-underline prose-a:font-medium hover:prose-a:underline
                                prose-strong:text-gray-900 prose-strong:font-semibold
                                prose-ul:text-gray-700 prose-ul:mb-6 prose-ul:pl-6
                                prose-ol:text-gray-700 prose-ol:mb-6 prose-ol:pl-6
                                prose-li:text-gray-700 prose-li:mb-2
                                prose-img:rounded-xl prose-img:shadow-md prose-img:mx-auto prose-img:my-8
                                prose-img:w-full prose-img:h-auto
                                prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
                                prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                                prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto
                                prose-hr:border-gray-200 prose-hr:my-8
                            "
                            dangerouslySetInnerHTML={{ __html: blogDetai.content }}
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="px-6 sm:px-8 lg:px-12 pb-8 sm:pb-12 pt-6 border-t border-gray-200">
                        <Link
                            href="/blogs"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            ← Quay lại danh sách blog
                        </Link>
                    </div>
                </article>
            </div>
        </div>
    )
}