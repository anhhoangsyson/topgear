"use client";

import { Button } from "@/components/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface CategorySelectFormProps {
  categories: { _id: string; categoryName: string }[];
  onSubmit: (categoryId: string) => void;
  isSubmitting: boolean;
}

export default function CategorySelectForm({ categories, onSubmit, isSubmitting }: CategorySelectFormProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  
  const handleSubmit = () => {
    if (selectedCategory) {
      onSubmit(selectedCategory);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Chọn danh mục</h2>
      <Select onValueChange={setSelectedCategory}>
        <SelectTrigger>
          <SelectValue placeholder="Chọn danh mục" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category._id} value={category._id}>
              {category.categoryName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={handleSubmit} disabled={isSubmitting || !selectedCategory}>
        Tiếp tục
      </Button>
    </div>
  );
}