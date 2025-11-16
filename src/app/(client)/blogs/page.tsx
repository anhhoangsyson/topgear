import Image from "next/image";
import Link from "next/link";
import React from "react";
import img1 from "../../../../public/1607431213-guide-to-finding-out-phone-name.avif";
import Wraper from "@/components/core/Wraper";
import { formatDate } from "@/lib/utils";
import { Calendar, ArrowRight } from "lucide-react";
import { IBlog } from "@/types";

const fetchBlogs = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/blog`, {
    method: "GET",
    cache: 'no-store',
  })
  if (!res.ok) {
    throw new Error("Failed to fetch blogs");
  }
  const data = await res.json();
  return data?.data
}

export default async function BlogPage() {
  const blogs = await fetchBlogs()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Wraper>
        {/* Header Section */}
        <div className="pt-12 pb-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            E-COM Blogs
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 leading-relaxed">
            Chúng tôi luôn cập nhật những thông tin mới nhất về công nghệ, điện thoại, máy tính và các sản phẩm công nghệ khác. Hãy theo dõi để không bỏ lỡ những bài viết thú vị và hữu ích!
          </p>
        </div>

        {/* Blogs Grid */}
        {blogs && blogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 pb-12">
            {blogs.map((blog: IBlog) => (
              <article
                key={blog._id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
              >
                {/* Image */}
                <Link href={`/blogs/${blog.slug}`} className="block relative overflow-hidden">
                  <div className="relative aspect-video w-full bg-gray-200">
                    <Image
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      src={blog.thumbnail || img1}
                      alt={blog.title || "Blog Thumbnail"}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                  </div>
                </Link>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5 sm:p-6">
                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4" />
                    {
                      // createdAt can be Date or string in types — normalize to ISO string
                    }
                    {(() => {
                      const createdAtStr = typeof blog.createdAt === 'string' ? blog.createdAt : blog.createdAt.toISOString();
                      return (
                        <time dateTime={createdAtStr}>
                          {formatDate(createdAtStr)}
                        </time>
                      )
                    })()}
                  </div>

                  {/* Title */}
                  <Link href={`/blogs/${blog.slug}`}>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {blog.title}
                    </h3>
                  </Link>

                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags.slice(0, 3).map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Read More Link */}
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <Link
                      href={`/blogs/${blog.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 group/link transition-colors"
                    >
                      Đọc thêm
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Chưa có blog nào.</p>
          </div>
        )}
      </Wraper>
    </div>
  );
}
