// Search API Service
// Backend endpoints: /api/v1/pvariants/autocomplete và /api/v1/pvariants/search

export interface SearchSuggestion {
  _id: string;
  variantName: string;
  variantPriceSale: number;
  image: string;
}

export interface SearchProduct {
  _id: string;
  variantName: string;
  variantPrice: number;
  variantPriceSale: number;
  variantStock: number;
  filterCategories: string[];
  status: string;
  image: string;
  score: number;
}

export interface SearchPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  categories?: string[];
}

export interface SearchResponse {
  success: boolean;
  message: string;
  data: SearchProduct[];
  pagination: SearchPagination;
  filters?: SearchFilters;
}

export interface AutocompleteResponse {
  success: boolean;
  message: string;
  suggestions: SearchSuggestion[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_URL || '';

export const searchApi = {
  /**
   * Get autocomplete suggestions
   * @param query - Search keyword (minimum 2 characters)
   * @param limit - Number of suggestions (default: 5)
   */
  async getAutocomplete(query: string, limit: number = 5): Promise<SearchSuggestion[]> {
    if (query.length < 2) {
      return [];
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/pvariants/autocomplete?q=${encodeURIComponent(query)}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error('Autocomplete request failed');
      }

      const data: AutocompleteResponse = await response.json();
      return data.suggestions || [];
    } catch (error) {
      console.error('Autocomplete error:', error);
      return [];
    }
  },

  /**
   * Search products with filters and pagination
   * @param query - Search keyword
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 20)
   * @param filters - Optional filters (minPrice, maxPrice, categories)
   */
  async searchProducts(
    query: string,
    page: number = 1,
    limit: number = 20,
    filters?: SearchFilters
  ): Promise<SearchResponse> {
    try {
      const params = new URLSearchParams({
        q: query,
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filters?.minPrice) {
        params.append('minPrice', filters.minPrice.toString());
      }

      if (filters?.maxPrice) {
        params.append('maxPrice', filters.maxPrice.toString());
      }

      if (filters?.categories && filters.categories.length > 0) {
        filters.categories.forEach((cat) => params.append('categories', cat));
      }

      const response = await fetch(
        `${API_BASE_URL}/pvariants/search?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error('Search request failed');
      }

      const data: SearchResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Search error:', error);
      return {
        success: false,
        message: 'Tìm kiếm thất bại',
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }
  },
};
