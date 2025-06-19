"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { DataTable } from "@/components/common/data-table";
import { LaptopGroupColumns } from "@/app/admin/(otherPages)/laptop-group/laptop-group-columns";
import BlogPreview from "@/app/admin/(otherPages)/blog/BlogPreview";
import { BlogColumns } from "@/app/admin/(otherPages)/blog/BlogColumns";
import { IBlog } from "@/types";
import EditBlogModal from "@/app/admin/(otherPages)/blog/EditBlogModal";
import { Loader } from "@/components/atoms/feedback/Loader";
import { Button } from "@/components/atoms/ui/Button";
import { Separator } from "@/components/atoms/ui/separator";

export default function BlogsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [blogs, setBlogs] = useState<IBlog[]>([]);

  const [showBlogPreview, setShowBlogPreview] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<IBlog | null>(null);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const handleShowBlogPreview = (blog: IBlog) => {
    setSelectedBlog(blog);
    setShowBlogPreview(true);
  }

  const handleShowEditModal = (blog: IBlog) => {
    setSelectedBlog(blog);
    setShowModalEdit(true);
  }
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/blog`, {
          method: "GET",
        })

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();
        setBlogs(data.data)

      } catch (error) {
        toast({
          variant: "destructive",
          title: "Có lỗi xảy ra",
          description: "Không thể tải danh sách blog. Vui lòng thử lại sau.",
        });

      }
    }
    fetchBlogs();
  }, []);

  return (

    <div className="flex-col">
      <h1 className="text-2xl font-bold mb-4">Blogs</h1>
      {isLoading
        ? (
          <div className="flex h-screen items-center justify-center">
            <Loader />
          </div>
        )
        : (
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">

              <Button onClick={() => router.push("/admin/blog/add")}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm blog mới
              </Button>
            </div>
            <Separator />
            <DataTable
              columns={BlogColumns(handleShowBlogPreview, handleShowEditModal)}
              data={blogs}
              searchBy="title"
            />
            {/* modal laptop group detail */}
            <BlogPreview
              blog={selectedBlog || null}
              open={showBlogPreview}
              onClose={() => { setShowBlogPreview(false); setSelectedBlog(null) }}
            />
            <EditBlogModal
              blog={selectedBlog || null}
              open={showModalEdit}
              onClose={() => { setShowModalEdit(false); setSelectedBlog(null) }}
            />
          </div>
        )}
    </div>
  );
}