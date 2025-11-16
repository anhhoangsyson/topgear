import { TokenManager } from '@/lib/token-manager';
import { IWishlist, IWishlistListResponse, IWishlistCheckResponse, IWishlistCountResponse } from '@/types/wishlist';

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

const WISHLIST_BASE_URL = getBaseUrl();

/**
 * Add product to wishlist
 */
export const addToWishlist = async (laptopId: string): Promise<IWishlist> => {
  const token = await TokenManager.getAccessToken();
  
  if (!token) {
    throw new Error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
  }

  const response = await fetch(`${WISHLIST_BASE_URL}/wishlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ laptopId }),
  });

  if (!response.ok) {
    try {
      const errorResult = await response.json();
      const errorMessage = errorResult.message || errorResult.error || 'Không thể thêm vào wishlist';
      throw new Error(errorMessage);
    } catch (parseError) {
      throw new Error(`Không thể thêm vào wishlist: ${response.status}`);
    }
  }

  const result = await response.json();
  return result.data;
};

/**
 * Remove product from wishlist
 */
export const removeFromWishlist = async (laptopId: string): Promise<void> => {
  const token = await TokenManager.getAccessToken();
  
  if (!token) {
    throw new Error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
  }

  const response = await fetch(`${WISHLIST_BASE_URL}/wishlist/${laptopId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    try {
      const errorResult = await response.json();
      const errorMessage = errorResult.message || errorResult.error || 'Không thể xóa khỏi wishlist';
      throw new Error(errorMessage);
    } catch (parseError) {
      throw new Error(`Không thể xóa khỏi wishlist: ${response.status}`);
    }
  }
};

/**
 * Get user wishlist with pagination
 */
export const getWishlist = async (page: number = 1, limit: number = 20): Promise<IWishlistListResponse> => {
  const token = await TokenManager.getAccessToken();
  
  if (!token) {
    throw new Error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
  }

  const response = await fetch(`${WISHLIST_BASE_URL}/wishlist?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    try {
      const errorResult = await response.json();
      const errorMessage = errorResult.message || errorResult.error || 'Không thể lấy danh sách wishlist';
      throw new Error(errorMessage);
    } catch (parseError) {
      throw new Error(`Không thể lấy danh sách wishlist: ${response.status}`);
    }
  }

  const result = await response.json();
  return result.data;
};

/**
 * Check if product is in wishlist
 */
export const checkInWishlist = async (laptopId: string): Promise<boolean> => {
  const token = await TokenManager.getAccessToken();
  
  if (!token) {
    return false;
  }

  try {
    const response = await fetch(`${WISHLIST_BASE_URL}/wishlist/check/${laptopId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return false;
    }

    const result = await response.json();
    return result.data.inWishlist;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[checkInWishlist] Error:', error);
    }
    return false;
  }
};

/**
 * Get wishlist count
 */
export const getWishlistCount = async (): Promise<number> => {
  const token = await TokenManager.getAccessToken();
  
  if (!token) {
    return 0;
  }

  try {
    const response = await fetch(`${WISHLIST_BASE_URL}/wishlist/count`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return 0;
    }

    const result = await response.json();
    return result.data.count;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[getWishlistCount] Error:', error);
    }
    return 0;
  }
};

