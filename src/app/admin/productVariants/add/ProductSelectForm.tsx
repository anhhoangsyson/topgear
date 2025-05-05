"use client";

import { Button } from "@/components/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IProduct, IProductVariant } from "@/types";
import { useState } from "react";

interface ProductSelectFormProps {
  products: IProduct[];
  onSubmit: (productId: string) => void;
  isSubmitting: boolean;
}

export default function ProductSelectForm({ products, onSubmit, isSubmitting }: ProductSelectFormProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>("");

  

  const handleSubmit = () => {
    if (selectedProduct) {
      onSubmit(selectedProduct);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Chọn sản phẩm</h2>
      <Select onValueChange={setSelectedProduct}>
        <SelectTrigger>
          <SelectValue placeholder="Chọn sản phẩm" />
        </SelectTrigger>
        <SelectContent>
          {products.map((product) => (
            <SelectItem key={product._id} value={product._id!}>
              {product.productName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={handleSubmit} disabled={isSubmitting || !selectedProduct}>
        Tiếp tục
      </Button>
    </div>
  );
}