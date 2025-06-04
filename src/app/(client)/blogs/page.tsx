import Image from "next/image";
import Link from "next/link";
import React from "react";
import img1 from "../../../../public/1607431213-guide-to-finding-out-phone-name.avif";
import Wraper from "@/components/core/Wraper";
import { formatDate } from "@/lib/utils";

const fetchBlogs = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/blog`, {
    method: "GET",
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
    <Wraper>
      {/* bannersection */}
      <div className="pt-12">
        <div className="text-center">
          <span className="text-5xl font-bold text-gray-700 text-center">
            Top Gear Blogs
          </span>
        </div>
        <p className="text-center font-normal text-base text-gray-500 mt-4 ">
         Chúng tôi luôn cập nhật những thông tin mới nhất về công nghệ, điện thoại, máy tính và các sản phẩm công nghệ khác. Hãy theo dõi để không bỏ lỡ những bài viết thú vị và hữu ích!
        </p>
      </div>
      {/* blogsection */}
      <div className="grid grid-cols-4 gap-y-8 gap-x-8 my-9">
        {blogs.map((blog: any)=>(
          <figure 
          key={blog._id}  
          className="p-4 grid grid-cols-1 gap-y-2 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 py-8">
          <div className="">
            <Link href={`/blogs/${blog.slug}`}>
              <Image
                className="h-auto"
                src={blog.thumbnail || img1}
                alt={blog.slug || blog.title || "Blog Thumbnail"}
                width={320}
                height={300}
              />
            </Link>
          </div>
          {/* blogs name and detail */}
          <div className="w-11/12 mx-auto pt-4">
            <h3 className="mt-2 text-lg font-bold">
             {blog.title}
            </h3>

            <div className="flex gap-4 mt-2 items-center ">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.91473 0.333252C3.67896 0.333252 0.24707 3.76473 0.24707 7.99999C0.24707 12.2352 3.67896 15.6667 7.91473 15.6667C12.1505 15.6667 15.5824 12.2352 15.5824 7.99999C15.5824 3.76473 12.1505 0.333252 7.91473 0.333252ZM7.91473 14.1828C4.49829 14.1828 1.73113 11.416 1.73113 7.99999C1.73113 4.58396 4.49829 1.81714 7.91473 1.81714C11.3312 1.81714 14.0983 4.58396 14.0983 7.99999C14.0983 11.416 11.3312 14.1828 7.91473 14.1828ZM9.82546 10.9554L7.20052 9.04798C7.10468 8.97688 7.04902 8.86559 7.04902 8.74811V3.67199C7.04902 3.46796 7.21598 3.30102 7.42004 3.30102H8.40941C8.61347 3.30102 8.78043 3.46796 8.78043 3.67199V8.05254L10.8457 9.55497C11.0127 9.67554 11.0467 9.9074 10.9261 10.0743L10.3449 10.875C10.2243 11.0389 9.99241 11.076 9.82546 10.9554Z"
                  fill="#4B5563"
                />
              </svg>
              <p className="text-sm font-light">
                Thời gian: lúc {formatDate(blog.createdAt)}
              </p>
            </div>
          </div>
        </figure>
        ))}
        
      </div>
    </Wraper>
  );
}
