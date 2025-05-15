"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { UpdateCategoryForm } from "../UpdateCategoryForm";
import { useToast } from "@/hooks/use-toast";
import OverlayLoader from "@/components/OverlayLoader";

export default function CategoryPage() {
  const params = useParams();
  const { toast } = useToast();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/${params.categoryId}`,{
          method: "GET",
        });
        const data = await response.json();
        setCategory(data.data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Có lỗi xảy ra",
          description: "Không thể tải thông tin danh mục. Vui lòng thử lại sau.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (params.categoryId) {
      fetchCategory();
    }
  }, [params.categoryId, toast]);

  if (loading) {
    return (
      <OverlayLoader/>
    );
  }

  if (!category) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-muted-foreground">Không tìm thấy danh mục</p>
      </div>
    );
  }

  return <UpdateCategoryForm category={category} />;
}