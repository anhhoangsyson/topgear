'use client';

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { searchApi, SearchProduct } from "@/services/search-api";
import { Button } from "@/components/atoms/ui/Button";
import { Loader2, Search, Filter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SearchClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Fetch search results
  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const filters = {
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
        };

        const response = await searchApi.searchProducts(
          query,
          currentPage,
          20,
          filters
        );

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
  }, [query, currentPage, minPrice, maxPrice]);

  // Reset page when query or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, minPrice, maxPrice]);

  const handleApplyFilters = () => {
    setCurrentPage(1);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setCurrentPage(1);
  };

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

      {/* Filter Button - Mobile */}
      <div className="mb-4 md:hidden">
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          className="w-full"
        >
          <Filter className="h-4 w-4 mr-2" />
          {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <aside
          className={`md:w-64 flex-shrink-0 ${
            showFilters ? "block" : "hidden md:block"
          }`}
        >
          <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-24">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Bộ lọc
            </h2>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-medium mb-3 text-gray-900">Khoảng giá</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Từ (VND)
                  </label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="0"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Đến (VND)
                  </label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="100000000"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleApplyFilters}
                className="flex-1"
                size="sm"
              >
                Áp dụng
              </Button>
              <Button
                onClick={handleClearFilters}
                variant="outline"
                className="flex-1"
                size="sm"
              >
                Xóa
              </Button>
            </div>
          </div>
        </aside>

        {/* Results Grid */}
        <div className="flex-1">
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
              <Button onClick={handleClearFilters} variant="outline">
                Xóa bộ lọc
              </Button>
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
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.variantName}
                          fill
                          className="object-contain hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Search className="h-12 w-12 text-gray-300" />
                        </div>
                      )}

                      {/* Out of stock overlay */}
                      {product.variantStock === 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="bg-red-500 text-white px-3 py-1 rounded text-sm font-medium">
                            Hết hàng
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
                      {product.variantName}
                    </h3>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-blue-600 font-bold text-lg">
                        {product.variantPriceSale.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
                      {product.variantPrice > product.variantPriceSale && (
                        <span className="text-gray-400 line-through text-sm">
                          {product.variantPrice.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </span>
                      )}
                    </div>

                    {/* Stock Status */}
                    {product.variantStock > 0 && (
                      <p className="text-sm text-gray-500">
                        Còn {product.variantStock} sản phẩm
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
    </div>
  );
}
