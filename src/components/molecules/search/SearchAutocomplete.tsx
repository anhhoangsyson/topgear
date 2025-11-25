"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { searchApi, SearchSuggestion } from "@/services/search-api";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/atoms/ui/input";

interface SearchAutocompleteProps {
  onSelect?: (suggestion: SearchSuggestion) => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchAutocomplete({
  onSelect,
  onSearch,
  placeholder = "Tìm kiếm sản phẩm...",
  className = "",
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounced fetch suggestions - Using new suggestions API
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    try {
      const results = await searchApi.getSuggestions(searchQuery, 5);
      setSuggestions(results);
      setShowDropdown(results.length >= 0);
    } catch (error) {
      console.error("Suggestions error:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle input change with debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (onSelect) {
      onSelect(suggestion);
    }

    // Navigate to product detail page
    router.push(`/laptop/${suggestion.slug}`);
    setShowDropdown(false);
    setQuery("");
  };

  // Handle search submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      }

      // Navigate to search results page
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setShowDropdown(false);
    }
  };

  // Handle clear
  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setShowDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

          <Input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="pl-10 pr-10"
          />

          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Loading indicator */}
          {loading && (
            <div className="absolute right-10 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            </div>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          <div className="p-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.slug}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                {/* Product Image */}
                <div className="relative w-12 h-12 flex-shrink-0 bg-gray-100 rounded">
                  {suggestion.primaryImage ? (
                    <Image
                      src={suggestion.primaryImage}
                      alt={suggestion.name}
                      fill
                      className="object-contain rounded"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Search className="h-6 w-6 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {suggestion.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {suggestion.modelName} - {suggestion.brand.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-blue-600 font-semibold">
                      {suggestion.discountPrice.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }) || ""}
                    </p>
                    {suggestion.price > suggestion.discountPrice && (
                      <p className="text-xs text-gray-400 line-through">
                        {suggestion.price.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </p>
                    )}
                  </div>
                </div>

                {/* Arrow Icon */}
                <div className="text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>

          {/* View All Results Link */}
          {query && (
            <div className="border-t border-gray-200 p-2">
              <button
                onClick={handleSubmit}
                className="w-full text-left px-2 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
              >
                Xem tất cả kết quả cho "{query}"
              </button>
            </div>
          )}
        </div>
      )}

      {showDropdown && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
          Không tìm thấy sản phẩm nào.
        </div>  
      )}
    </div>
  );
}
