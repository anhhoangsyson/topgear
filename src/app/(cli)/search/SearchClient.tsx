'use client';

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { searchApi, SearchProduct, SortOption } from "@/services/search-api";
import { Button } from "@/components/atoms/ui/Button";
import { Loader2, Search, ArrowUpDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const SORT_OPTIONS = [
  { value: 'relevance' as SortOption, label: 'Phù hợp nhất' },
  { value: 'price_asc' as SortOption, label: 'Giá thấp đến cao' },
  { value: 'price_desc' as SortOption, label: 'Giá cao đến thấp' },
  { value: 'rating' as SortOption, label: 'Đánh giá cao nhất' },
  { value: 'newest' as SortOption, label: 'Mới nhất' },
  { value: 'name' as SortOption, label: 'Tên A-Z' },
];

export default function SearchClient() {
  const searchParams = useSearchParams();
  const query = searchParams?.get("q") || "";

  const [results, setResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');

  // Fetch search results
  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await searchApi.searchProducts(
          query,
          currentPage,
          20,
          sortBy
        );
        console.log('djt me may', response.data);

        setResults(response.data);
        setTotalPages(response.pagination.totalPages);
        setTotal(response.pagination.total);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, currentPage, sortBy]);

  // Reset page when query or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query, sortBy]);

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-[60vh]">
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <Search className="h-16 w-16 text-gray-300" />
          <p className="text-gray-500 text-lg">
            Vui lòng nhập từ khóa để tìm kiếm
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-[60vh]">
      {/* Search Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Kết quả tìm kiếm cho: &quot;{query}&quot;
        </h1>
        <p className="text-gray-600">
          {loading ? "Đang tìm kiếm..." : `Tìm thấy ${total} sản phẩm`}
        </p>
      </div>

      {/* Sort Options */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-gray-500" />
          <label className="text-sm font-medium text-gray-700">Sắp xếp:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Grid */}
      <div className="w-full">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Search className="h-16 w-16 text-gray-300" />
            <p className="text-gray-500 text-lg">
              Không tìm thấy sản phẩm nào
            </p>
          </div>
        ) : (
          <>
            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {results.map((product) => (
                <Link
                  key={product._id}
                  href={`/laptop/${product._id}`}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  {/* Product Image */}
                  <div className="relative w-full aspect-square mb-3 bg-gray-100 rounded overflow-hidden">
                    {product.images?.[0]?.imageUrl ? (
                      <Image
                        src={product.images[0].imageUrl}
                        alt={product.name}
                        fill
                        className="object-contain hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Search className="h-12 w-12 text-gray-300" />
                      </div>
                    )}

                    {/* Out of stock overlay */}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-3 py-1 rounded text-sm font-medium">
                          Hết hàng
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="mb-2">
                    <h3 className="font-medium text-gray-900 line-clamp-2 min-h-[3rem]">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {product.modelName} - {product.brandId.name}
                    </p>
                  </div>

                  {/* Specs */}
                  <div className="text-xs text-gray-600 mb-2 space-y-1">
                    <p className="truncate">{product.processor}</p>
                    <p className="truncate">{product.ram} | {product.storage}</p>
                  </div>

                  {/* Rating */}
                  {product.averageRating > 0 && (
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-medium">{product.averageRating.toFixed(1)}</span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-blue-600 font-bold text-lg">
                      {product.discountPrice.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                    {product.price > product.discountPrice && (
                      <span className="text-gray-400 line-through text-sm">
                        {product.price.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  {product.stock > 0 && (
                    <p className="text-sm text-green-600">
                      Còn {product.stock} sản phẩm
                    </p>
                  )}
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                >
                  Trước
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      // Show first, last, current, and adjacent pages
                      return (
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1
                      );
                    })
                    .map((page, index, array) => {
                      // Add ellipsis
                      const prevPage = array[index - 1];
                      const showEllipsis = prevPage && page - prevPage > 1;

                      return (
                        <React.Fragment key={page}>
                          {showEllipsis && (
                            <span className="px-2 text-gray-400">...</span>
                          )}
                          <Button
                            onClick={() => setCurrentPage(page)}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            className="min-w-[40px]"
                          >
                            {page}
                          </Button>
                        </React.Fragment>
                      );
                    })}
                </div>

                <Button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  variant="outline"
                >
                  Sau
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
