"use client";

import { Heading } from "@/components/ui/heading";
import { AddCategoryForm } from "./AddCategoryForm";

export default function AddCategoryPage() {
  return <div className="h-screen flex flex-col gap-y-4">
    <div className="py-4">
      <Heading
        title="Thêm danh mục mới"
      // description="Tạo một danh mục sản phẩm mới"
      />
    </div>
    <AddCategoryForm />;
  </div>
}