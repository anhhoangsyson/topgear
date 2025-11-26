import { TokenManager } from '@/lib/token-manager';
import {
  IRating,
  IAdminUpdateRatingRequest,
  IRatingFilter,
  IAdminRatingListResponse,
  IAdminRatingStats,
  IAdminReplyRequest,
  IAdminUpdateStatusRequest
} from '@/types/rating';

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
 * Get all ratings for admin with filters and pagination
 */
export const getAdminRatings = async (filters?: IRatingFilter): Promise<IAdminRatingListResponse> => {
  const token = await TokenManager.getAccessToken();

  if (!token) {
    throw new Error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
  }

  // Build query params
  const params = new URLSearchParams();
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.userId) params.append('userId', filters.userId);
  if (filters?.laptopId) params.append('laptopId', filters.laptopId);
  if (filters?.orderId) params.append('orderId', filters.orderId);
  if (filters?.rating) params.append('rating', filters.rating.toString());
  if (filters?.status) params.append('status', filters.status);
  if (filters?.sortBy) params.append('sortBy', filters.sortBy);

  const queryString = params.toString();
  const url = `${RATING_BASE_URL}/rating/admin/all${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
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

  // The backend returns { success, data: { ratings, total, page, totalPages } }
  // Transform to match IAdminRatingListResponse format
  if (result.data && result.data.ratings) {
    return {
      items: result.data.ratings,
      meta: {
        page: result.data.page || 1,
        limit: filters?.limit || 10,
        total: result.data.total || 0,
        totalPages: result.data.totalPages || 1,
      },
    };
  }

  return result.data;
};

/**
 * Get rating by ID (admin)
 */
export const getAdminRatingById = async (ratingId: string): Promise<IRating> => {
  const token = await TokenManager.getAccessToken();

  if (!token) {
    throw new Error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
  }

  const response = await fetch(`${RATING_BASE_URL}/rating/${ratingId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    try {
      const errorResult = await response.json();
      const errorMessage = errorResult.message || errorResult.error || 'Không thể lấy thông tin đánh giá';
      throw new Error(errorMessage);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Không thể lấy thông tin đánh giá (${response.status})`);
    }
  }

  const result = await response.json();
  return result.data;
};

/**
 * Update rating (admin) - mainly for status and adminNote
 */
export const updateAdminRating = async (
  ratingId: string,
  data: IAdminUpdateRatingRequest
): Promise<IRating> => {
  const token = await TokenManager.getAccessToken();

  if (!token) {
    throw new Error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
  }

  const response = await fetch(`${RATING_BASE_URL}/rating/${ratingId}`, {
    method: 'PUT',
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
 * Delete rating (admin)
 */
export const deleteAdminRating = async (ratingId: string): Promise<void> => {
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
 * Get ratings by order ID (admin)
 */
export const getAdminRatingsByOrder = async (orderId: string): Promise<IRating[]> => {
  const token = await TokenManager.getAccessToken();

  if (!token) {
    throw new Error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
  }

  const response = await fetch(`${RATING_BASE_URL}/rating/order/${orderId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
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
 * Get rating statistics (admin)
 */
export const getAdminRatingStats = async (): Promise<IAdminRatingStats> => {
  const token = await TokenManager.getAccessToken();

  if (!token) {
    throw new Error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
  }

  const response = await fetch(`${RATING_BASE_URL}/rating/admin/stats`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
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
  const statsData = result.data;

  // Transform distribution array to byRating object for backward compatibility
  const byRating: { [key: string]: number } = {};
  if (statsData.distribution) {
    statsData.distribution.forEach((item: { rating: number; count: number }) => {
      byRating[item.rating.toString()] = item.count;
    });
  }

  return {
    ...statsData,
    byRating,
  };
};

/**
 * Bulk update ratings status (admin) - optional
 */
export const bulkUpdateRatingStatus = async (
  ids: string[],
  status: 'approved' | 'rejected' | 'pending'
): Promise<{ success: string[]; failed: string[] }> => {
  const token = await TokenManager.getAccessToken();

  if (!token) {
    throw new Error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
  }

  const response = await fetch(`${RATING_BASE_URL}/rating/bulk`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ ids, status }),
  });

  if (!response.ok) {
    try {
      const errorResult = await response.json();
      const errorMessage = errorResult.message || errorResult.error || 'Không thể cập nhật hàng loạt';
      throw new Error(errorMessage);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Không thể cập nhật hàng loạt (${response.status})`);
    }
  }

  const result = await response.json();
  return result.data;
};

/**
 * Admin reply to rating
 */
export const addAdminReply = async (
  ratingId: string,
  data: IAdminReplyRequest
): Promise<IRating> => {
  const token = await TokenManager.getAccessToken();

  if (!token) {
    throw new Error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
  }

  const response = await fetch(`${RATING_BASE_URL}/rating/admin/${ratingId}/reply`, {
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
      const errorMessage = errorResult.message || errorResult.error || 'Không thể trả lời đánh giá';
      throw new Error(errorMessage);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Không thể trả lời đánh giá (${response.status})`);
    }
  }

  const result = await response.json();
  return result.data;
};

/**
 * Update admin reply
 */
export const updateAdminReply = async (
  ratingId: string,
  data: IAdminReplyRequest
): Promise<IRating> => {
  const token = await TokenManager.getAccessToken();

  if (!token) {
    throw new Error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
  }

  const response = await fetch(`${RATING_BASE_URL}/rating/admin/${ratingId}/reply`, {
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
      const errorMessage = errorResult.message || errorResult.error || 'Không thể cập nhật reply';
      throw new Error(errorMessage);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Không thể cập nhật reply (${response.status})`);
    }
  }

  const result = await response.json();
  return result.data;
};

/**
 * Delete admin reply
 */
export const deleteAdminReply = async (ratingId: string): Promise<IRating> => {
  const token = await TokenManager.getAccessToken();

  if (!token) {
    throw new Error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
  }

  const response = await fetch(`${RATING_BASE_URL}/rating/admin/${ratingId}/reply`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    try {
      const errorResult = await response.json();
      const errorMessage = errorResult.message || errorResult.error || 'Không thể xóa reply';
      throw new Error(errorMessage);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Không thể xóa reply (${response.status})`);
    }
  }

  const result = await response.json();
  return result.data;
};

/**
 * Update rating status (visible/hidden)
 */
export const updateRatingStatus = async (
  ratingId: string,
  data: IAdminUpdateStatusRequest
): Promise<IRating> => {
  const token = await TokenManager.getAccessToken();

  if (!token) {
    throw new Error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
  }

  const response = await fetch(`${RATING_BASE_URL}/rating/admin/${ratingId}/status`, {
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
      const errorMessage = errorResult.message || errorResult.error || 'Không thể cập nhật trạng thái';
      throw new Error(errorMessage);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Không thể cập nhật trạng thái (${response.status})`);
    }
  }

  const result = await response.json();
  return result.data;
};
