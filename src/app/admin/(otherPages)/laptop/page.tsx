"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from 'lucide-react';
import { ILaptop } from "@/types";
import { toast } from "@/hooks/use-toast";
import { DataTable } from "@/components/common/data-table";
import { LaptopColumns } from "@/app/admin/(otherPages)/laptop/laptop-columns";
import LaptopDetailModal from "@/app/admin/(otherPages)/laptop/LaptopDetailModal";
import { Loader } from "@/components/atoms/feedback/Loader";
import { Button } from "@/components/atoms/ui/Button";
import { Separator } from "@/components/atoms/ui/separator";

export default function LaptopsPage() {
  const router = useRouter();
  // setIsLoading is assigned but not used
  const [isLoading, setIsLoading] = useState(false);
  const [laptops, setLaptops] = useState<ILaptop[]>([]);
  const [showModalLaptopDetail, setShowModalLaptopDetail] = useState(false);
  const [selectedLaptop, setSelectedLaptop] = useState<ILaptop | null>(null);

  useEffect(() => {
    const fetchLaptops = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/laptop`, {
          method: "GET",
        })

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();
        setLaptops(data.data)

      } catch {
        toast({
          variant: "destructive",
          title: "Có lỗi xảy ra",
          description: "Không thể tải danh laptop. Vui lòng thử lại sau.",
        });

      }
    }
    fetchLaptops();
  }, []);

  const handleShowLaptopDetail = (laptop: ILaptop) => {
    setSelectedLaptop(laptop);
    setShowModalLaptopDetail(true);
  }
  return (

    <div className="flex-col">
      <h1 className="text-2xl font-bold mb-4">Laptop</h1>
      {isLoading
        ? (
          <div className="flex h-screen items-center justify-center">
            <Loader />
          </div>
        )
        : (
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">

              <Button onClick={() => router.push("/admin/laptop/add")}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm mới
              </Button>
            </div>
            <Separator />
            <DataTable
              columns={LaptopColumns(handleShowLaptopDetail)}
              data={laptops}
              searchBy="name"
            />
            {/* modal laptopdetail */}
            <LaptopDetailModal
              open={showModalLaptopDetail}
              onClose={() => setShowModalLaptopDetail(false)}
              laptop={selectedLaptop}
            />
            
          </div>
        )}

    </div>
  );
}