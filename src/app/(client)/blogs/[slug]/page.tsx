import NotFound from '@/app/not-found';
import React from 'react'
import { formatDate } from '../../../../lib/utils';
import BlogBreadcrumb from '@/app/(client)/blogs/[slug]/BlogBreadCrumb';
import Image from 'next/image';

export default async function page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/blog/slug/${slug}`, {
        method: 'GET',
    })

    if (!res.ok) {
        return NotFound();
    }
    const data = await res.json();
    const blogDetai = data.data;
    return (
        <div className="max-w-3xl mx-auto  sm:px-6 lg:px-0">
            <div className='mb-8'>
                <BlogBreadcrumb title={blogDetai.title} />
            </div>
            <div className="border-b-2 border-gray-200 pb-4 mb-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight text-center">
                    {blogDetai.title}
                </h1>
                <Image
                    className='py-4 rounded-lg shadow-md w-full h-auto object-cover'
                    src={blogDetai.thumbnail || '/default-thumbnail.jpg'}
                    alt={blogDetai.title}
                    width={800}
                    height={450}
                />
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-2">
                <p className="text-gray-500 text-sm sm:text-base">
                    By <strong className="text-gray-700">{blogDetai.userId.fullname}</strong>
                    <span className="mx-2">•</span>
                    {formatDate(blogDetai.createdAt)}
                </p>
            </div>
            <div
                className="prose prose-img:rounded-lg prose-img:mx-auto prose-headings:text-gray-800 prose-p:text-gray-700 max-w-none text-justify"
                dangerouslySetInnerHTML={{ __html: blogDetai.content }}
            >
            </div>
        </div>
    )
}