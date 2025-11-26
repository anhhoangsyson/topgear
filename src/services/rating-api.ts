import { TokenManager } from '@/lib/token-manager';
import { ICreateRatingRequest, IUpdateRatingRequest, IRating, IRatingListResponse, IRatingStats } from '@/types/rating';

const API_BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_URL || 'http://localhost:3000';

// Ensure base URL ends with /api/v1 or add it, but avoid duplication
const getBaseUrl = () => {
  const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  
  // Check if it already contains /api/v1
  if (base.includes('/api/v1')) {
    // If it ends with /api/v1, return as is
    if (base.endsWith('/api/v1')) {
      return base;
    }
    // If /api/v1 is in the middle, extract everything up to /api/v1
    const apiV1Index = base.indexOf('/api/v1');
    return base.substring(0, apiV1Index + '/api/v1'.length);
  }
  
  // If no /api/v1 found, add it
  return `${base}/api/v1`;
};

const RATING_BASE_URL = getBaseUrl();

/**
 * Create a new rating
 */
export const createRating = async (data: ICreateRatingRequest): Promise<IRating> => {
  const token = await TokenManager.getAccessToken();

  if (!token) {
    throw new Error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
  }

  const response = await fetch(`${RATING_BASE_URL}/rating`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    try {
      const errorResult = await response.json();
      const errorMessage = errorResult.message || errorResult.error || 'Không thể tạo đánh giá';
      throw new Error(errorMessage);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Không thể tạo đánh giá (${response.status})`);
    }
  }

  const result = await response.json();
  return result.data;
};

/**
 * Update an existing rating
 */
export const updateRating = async (ratingId: string, data: IUpdateRatingRequest): Promise<IRating> => {
  const token = await TokenManager.getAccessToken();

  if (!token) {
    throw new Error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
  }

  const response = await fetch(`${RATING_BASE_URL}/rating/${ratingId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    try {
      const errorResult = await response.json();
      const errorMessage = errorResult.message || errorResult.error || 'Không thể cập nhật đánh giá';
      throw new Error(errorMessage);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Không thể cập nhật đánh giá (${response.status})`);
    }
  }

  const result = await response.json();
  return result.data;
};

/**
 * Delete a rating
 */
export const deleteRating = async (ratingId: string): Promise<void> => {
  const token = await TokenManager.getAccessToken();

  if (!token) {
    throw new Error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
  }

  const response = await fetch(`${RATING_BASE_URL}/rating/${ratingId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    try {
      const errorResult = await response.json();
      const errorMessage = errorResult.message || errorResult.error || 'Không thể xóa đánh giá';
      throw new Error(errorMessage);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Không thể xóa đánh giá (${response.status})`);
    }
  }
};

/**
 * Get ratings by order ID
 */
export const getRatingsByOrder = async (orderId: string): Promise<IRating[]> => {
  const response = await fetch(`${RATING_BASE_URL}/rating/order/${orderId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    try {
      const errorResult = await response.json();
      const errorMessage = errorResult.message || errorResult.error || 'Không thể lấy danh sách đánh giá';
      throw new Error(errorMessage);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Không thể lấy danh sách đánh giá (${response.status})`);
    }
  }

  const result = await response.json();
  return result.data;
};

/**
 * Get ratings by laptop ID with pagination
 */
export const getRatingsByLaptop = async (laptopId: string, page: number = 1, limit: number = 20): Promise<IRatingListResponse> => {
  const response = await fetch(`${RATING_BASE_URL}/rating/laptop/${laptopId}?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    try {
      const errorResult = await response.json();
      const errorMessage = errorResult.message || errorResult.error || 'Không thể lấy danh sách đánh giá';
      throw new Error(errorMessage);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Không thể lấy danh sách đánh giá (${response.status})`);
    }
  }

  const result = await response.json();
  return result.data;
};

/**
 * Get rating statistics for a laptop
 */
export const getLaptopRatingStats = async (laptopId: string): Promise<IRatingStats> => {
  const response = await fetch(`${RATING_BASE_URL}/rating/laptop/${laptopId}/stats`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    try {
      const errorResult = await response.json();
      const errorMessage = errorResult.message || errorResult.error || 'Không thể lấy thống kê đánh giá';
      throw new Error(errorMessage);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Không thể lấy thống kê đánh giá (${response.status})`);
    }
  }

  const result = await response.json();
  return result.data;
};

/**
 * Get my ratings (current user)
 */
export const getMyRatings = async (page: number = 1, limit: number = 20): Promise<IRatingListResponse> => {
  const token = await TokenManager.getAccessToken();

  if (!token) {
    throw new Error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
  }

  const response = await fetch(`${RATING_BASE_URL}/rating/user/my-ratings?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    try {
      const errorResult = await response.json();
      throw new Error(errorResult.message || 'Không thể lấy danh sách đánh giá của bạn');
    } catch {
      throw new Error(`Không thể lấy danh sách đánh giá của bạn (${response.status})`);
    }
  }

  const result = await response.json();
  return result.data;
};

/**
 * Get rating by ID
 */
export const getRatingById = async (ratingId: string): Promise<IRating> => {
  const response = await fetch(`${RATING_BASE_URL}/rating/${ratingId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    try {
      const errorResult = await response.json();
      throw new Error(errorResult.message || 'Không thể lấy đánh giá');
    } catch {
      throw new Error(`Không thể lấy đánh giá (${response.status})`);
    }
  }

  const result = await response.json();
  return result.data;
};

