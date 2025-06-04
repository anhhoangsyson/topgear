"use client";
import { useEffect, useState } from "react";
import { ILaptop } from "@/types";
import LaptopCard from "@/components/home/LaptopCard";

export const ListRelatedLaptop = ({ brandId, categoryId, excludeId }: {
  brandId: string;
  categoryId: string;
  excludeId: string;
}) => {
  const [relatedLaptops, setRelatedLaptops] = useState<ILaptop[]>([]);

  useEffect(() => {
    const fetchRelatedVariants = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/laptop/related/?brandId=${brandId}&categoryId=${categoryId}`,
      );
      const laptops = await res.json();

      setRelatedLaptops(laptops.data);
      if (!res.ok) {
        throw new Error("Failed to fetch product variant");
      }
    };
    fetchRelatedVariants();
  }, [brandId, categoryId]);

  return (
    <div className="mt-[80px]">
      <h2 className="text-[#1F2937] font-bold mb-4 text-xl">
        Sản phẩm liên quan
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedLaptops.map((Laptop) => (
          <LaptopCard
            laptop={Laptop}
            key={Laptop._id}
          />
        ))}
      </div>
    </div>
  );
};
