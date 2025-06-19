"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from 'lucide-react';
import { CategoryColumns } from "./category-columns";
import { useCategoryStore } from "@/store/categoryStore";
import { DataTable } from "@/components/common/data-table";
import { Loader } from "@/components/atoms/feedback/Loader";
import { Button } from "@/components/atoms/ui/Button";
import { Separator } from "@/components/atoms/ui/separator";

export default function CategoriesPage() {
  const router = useRouter();
  // const [categories, setCategories] = useState<ICategory[]>([]);
  // const [isLoading, setIsLoading] = useState(true);

  const { categories, isLoading, fetchCategories } = useCategoryStore();

  // const fetchCategories = async () => {
  //   try {
  //     setIsLoading(true);
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
  //       method: "GET",
  //     })

  //     const data = await response.json();
  //     setCategories(data.data);
  //   } catch (error) {
  //     toast({
  //       variant: "destructive",
  //       title: "Có lỗi xảy ra",
  //       description: "Không thể tải danh sách danh mục. Vui lòng thử lại sau.",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (

    <div className="flex-col">
      <h1 className="text-2xl font-bold mb-4">Danh mục</h1>
      <div></div>
      {isLoading
        ? (
          <div className="flex h-screen items-center justify-center">
            <Loader />
          </div>
        )
        : (
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">

              <Button onClick={() => router.push("/admin/category/add")}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm mới
              </Button>
            </div>
            <Separator />
            <DataTable
              columns={CategoryColumns}
              data={categories}
              searchBy="name"
            />
          </div>
        )}

    </div>
  );
}