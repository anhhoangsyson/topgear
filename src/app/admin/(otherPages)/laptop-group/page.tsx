"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/Button";
import { ICategory, ILaptop, ILaptopGroup } from "@/types";
import { toast } from "@/hooks/use-toast";
import { Loader } from "@/components/Loader";
import { useCategoryStore } from "@/store/categoryStore";
import { DataTable } from "@/components/common/data-table";
import { LaptopColumns } from "@/app/admin/(otherPages)/laptop/laptop-columns";
import { LaptopGroupColumns } from "@/app/admin/(otherPages)/laptop-group/laptop-group-columns";

export default function LaptopGroupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [laptops, setLaptops] = useState<ILaptopGroup[]>([]);

  useEffect(() => {
    const fetchLaptopGroups = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/laptop-group`, {
          method: "GET",
        })

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();
        setLaptops(data.data)
        console.log(data.data);
        
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Có lỗi xảy ra",
          description: "Không thể tải danh sách danh mục. Vui lòng thử lại sau.",
        });

      }
    }
    fetchLaptopGroups();
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
              columns={LaptopGroupColumns}
              data={laptops}
              searchBy="name"
            />
          </div>
        )}

    </div>
  );
}