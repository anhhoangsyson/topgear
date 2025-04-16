'use client'
import { useEffect, useState } from "react";
import ProductCard from "./CardProductRalated";
import img1 from "/public/Laptop-ASUS-Vivobook-14-X1404-ZA-NK389.png";

export const ListRelatedProduct = ({ id }: { id: string }) => {
  const [relatedProducts, setRelatedProducts] = useState<ProductRelated[]>([]);
  useEffect(() => {
    const fetchRelatedVariants = async () => {
      const res = await fetch(`https://top-gear-be.vercel.app/api/v1/pvariants/related/${id}`)
      const productVariant = await res.json();
      
      setRelatedProducts(productVariant.data);
      if (!res.ok) {
        throw new Error("Failed to fetch product variant");
      }
    }
    fetchRelatedVariants()
  })

  return (
    <div className="mt-[80px]">
      <h2 className="text-[#1F2937] font-bold mb-4 text-xl">
        Sản phẩm liên quan
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};
