"use client";
import { useEffect, useState } from "react";
import { ILaptop } from "@/types";
import LaptopCard from "@/components/molecules/cards/LaptopCard";
import { Package } from "lucide-react";
import { Loader } from "@/components/atoms/feedback/Loader";

export const ListRelatedLaptop = ({ brandId, categoryId, excludeId }: {
  brandId: string;
  categoryId: string;
  excludeId: string;
}) => {
  const [relatedLaptops, setRelatedLaptops] = useState<ILaptop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedVariants = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/laptop/related/?brandId=${brandId}&categoryId=${categoryId}`,
        );
        const laptops = await res.json();

        if (res.ok && laptops.data) {
          // Filter out the current laptop
          const filtered = laptops.data.filter((laptop: ILaptop) => laptop._id !== excludeId);
          setRelatedLaptops(filtered);
        }
      } catch (error) {
        console.error("Failed to fetch related laptops:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRelatedVariants();
  }, [brandId, categoryId, excludeId]);

  if (loading) {
    return (
      <div className="mt-12 sm:mt-16 lg:mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Package className="w-6 h-6 text-blue-600" />
          Sản phẩm liên quan
        </h2>
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Loader size="lg" variant="blue" />
          <p className="text-sm text-gray-600">Đang tải sản phẩm liên quan...</p>
        </div>
      </div>
    );
  }

  if (relatedLaptops.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 sm:mt-16 lg:mt-20">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Package className="w-6 h-6 text-blue-600" />
        Sản phẩm liên quan
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
        {relatedLaptops.map((laptop) => (
          <LaptopCard
            laptop={laptop}
            key={laptop._id}
          />
        ))}
      </div>
    </div>
  );
};
