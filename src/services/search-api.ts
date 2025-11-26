// Search API Service
// Backend endpoints: /laptop/search/*
//
// File này định nghĩa các kiểu dữ liệu trả về từ backend và wrapper để gọi
// endpoint tìm kiếm / gợi ý. Các hàm ở đây đều xử lý lỗi mềm (trả về [])
// để tránh làm vỡ UI khi backend không sẵn sàng.

export interface SearchSuggestion {
  _id: string;
  name: string;
  modelName: string;
  price: number;
  discountPrice: number;
  primaryImage: string;
  slug: string;
  brand: {
    _id: string;
    name: string;
  };
}

export interface SearchProduct {
  _id: string;
  name: string;
  slug?: string;
  modelName: string;
  price: number;
  discountPrice: number;
  stock: number;
  images: { imageUrl: string }[];
  processor: string;
  ram: string;
  storage: string;
  graphicsCard: string;
  screen: string;
  description: string;
  tags: string[];
  averageRating: number;
  brandId: {
    _id: string;
    name: string;
  };
  category: {
    _id: string;
    name: string;
  };
}

export interface SearchPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'name';

export interface SearchResponse {
  success: boolean;
  data: SearchProduct[];
  pagination: SearchPagination;
  query: string;
  sortBy: string;
}

export interface SuggestionResponse {
  success: boolean;
  data: SearchSuggestion[];
  total: number;
}

export interface AutocompleteResponse {
  success: boolean;
  data: string[];
  total: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_URL || '';

export const searchApi = {
  /**
   * Get search suggestions (products) - Realtime suggestions when user is typing
   * @param query - Search keyword (minimum 2 characters)
   * @param limit - Number of suggestions (default: 5)
   */
  async getSuggestions(query: string, limit: number = 5): Promise<SearchSuggestion[]> {
    if (query.length < 2) {
      return [];
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/laptop/search/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error('Suggestions request failed');
      }

      const result: SuggestionResponse = await response.json();
      // Trả về danh sách suggestion (hoặc mảng rỗng nếu backend không trả data)
      return result.data || [];
    } catch (error) {
      console.error('Suggestions error:', error);
      return [];
    }
  },

  /**
   * Get autocomplete keywords - Suggest keywords to complete search query
   * @param query - Search keyword (minimum 2 characters)
   * @param limit - Number of keywords (default: 5)
   */
  async getAutocomplete(query: string, limit: number = 5): Promise<string[]> {
    if (query.length < 2) {
      return [];
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/laptop/search/autocomplete?q=${encodeURIComponent(query)}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error('Autocomplete request failed');
      }

      const result: AutocompleteResponse = await response.json();
      // Trả về danh sách từ khoá gợi ý
      return result.data || [];
    } catch (error) {
      console.error('Autocomplete error:', error);
      return [];
    }
  },

  /**
   * Realtime search with full details, pagination and sorting
   * @param query - Search keyword
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 20)
   * @param sortBy - Sort option (default: 'relevance')
   */
  async searchProducts(
    query: string,
    page: number = 1,
    limit: number = 20,
    sortBy: SortOption = 'relevance'
  ): Promise<SearchResponse> {
    try {
      const params = new URLSearchParams({
        q: query,
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
      });

      const url = `${API_BASE_URL}/laptop/search?${params.toString()}`;
      if (process.env.NODE_ENV === 'development') {
        console.debug('[search-api] search URL:', url);
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Search request failed');
      }

      const data: SearchResponse = await response.json();
      // Trả về toàn bộ response của search (bao gồm pagination)
      return data;
    } catch (error) {
      console.error('Search error:', error);
      return {
        success: false,
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
        query,
        sortBy,
      };
    }
  },
};
