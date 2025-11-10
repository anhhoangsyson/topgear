import { TokenManager } from '@/lib/token-manager';
import { ICreateCommentRequest, IUpdateCommentRequest, IComment, ICommentListResponse, ICommentStats } from '@/types/comment';

const API_BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_URL || 'http://localhost:3000';

// Ensure base URL ends with /api/v1 or add it, but avoid duplication
const getBaseUrl = () => {
  let base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  
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

const COMMENT_BASE_URL = getBaseUrl();

/**
 * Create a new comment
 */
export const createComment = async (data: ICreateCommentRequest): Promise<IComment> => {
  const token = await TokenManager.getAccessToken();
  
  if (!token) {
    throw new Error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
  }

  const response = await fetch(`${COMMENT_BASE_URL}/comments`, {
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
      const errorMessage = errorResult.message || errorResult.error || 'Không thể tạo bình luận';
      
      // Handle validation errors
      if (errorResult.errors && Array.isArray(errorResult.errors)) {
        const validationErrors = errorResult.errors.map((err: { message: string }) => err.message).join(', ');
        throw new Error(validationErrors);
      }
      
      throw new Error(errorMessage);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Không thể tạo bình luận (${response.status})`);
    }
  }

  const result = await response.json();
  return result.data;
};

/**
 * Update a comment
 */
export const updateComment = async (commentId: string, data: IUpdateCommentRequest): Promise<IComment> => {
  const token = await TokenManager.getAccessToken();
  
  if (!token) {
    throw new Error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
  }

  const response = await fetch(`${COMMENT_BASE_URL}/comments/${commentId}`, {
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
      const errorMessage = errorResult.message || errorResult.error || 'Không thể cập nhật bình luận';
      throw new Error(errorMessage);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Không thể cập nhật bình luận (${response.status})`);
    }
  }

  const result = await response.json();
  return result.data;
};

/**
 * Delete a comment
 */
export const deleteComment = async (commentId: string): Promise<IComment> => {
  const token = await TokenManager.getAccessToken();
  
  if (!token) {
    throw new Error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
  }

  const response = await fetch(`${COMMENT_BASE_URL}/comments/${commentId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    try {
      const errorResult = await response.json();
      const errorMessage = errorResult.message || errorResult.error || 'Không thể xóa bình luận';
      throw new Error(errorMessage);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Không thể xóa bình luận (${response.status})`);
    }
  }

  const result = await response.json();
  return result.data;
};

/**
 * Get comments by blog ID
 */
export const getCommentsByBlog = async (
  blogId: string,
  page: number = 1,
  limit: number = 20,
  includeReplies: boolean = true
): Promise<ICommentListResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    includeReplies: includeReplies.toString(),
  });

  const response = await fetch(`${COMMENT_BASE_URL}/comments/blog/${blogId}?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    try {
      const errorResult = await response.json();
      const errorMessage = errorResult.message || errorResult.error || 'Không thể lấy danh sách bình luận';
      throw new Error(errorMessage);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Không thể lấy danh sách bình luận (${response.status})`);
    }
  }

  const result = await response.json();
  return result.data;
};

/**
 * Get my comments
 */
export const getMyComments = async (page: number = 1, limit: number = 20): Promise<ICommentListResponse> => {
  const token = await TokenManager.getAccessToken();
  
  if (!token) {
    throw new Error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
  }

  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const response = await fetch(`${COMMENT_BASE_URL}/comments/user/my-comments?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    try {
      const errorResult = await response.json();
      const errorMessage = errorResult.message || errorResult.error || 'Không thể lấy bình luận của bạn';
      throw new Error(errorMessage);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Không thể lấy bình luận của bạn (${response.status})`);
    }
  }

  const result = await response.json();
  return result.data;
};

/**
 * Get comment by ID
 */
export const getCommentById = async (commentId: string): Promise<IComment> => {
  const response = await fetch(`${COMMENT_BASE_URL}/comments/${commentId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    try {
      const errorResult = await response.json();
      const errorMessage = errorResult.message || errorResult.error || 'Không thể lấy bình luận';
      throw new Error(errorMessage);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Không thể lấy bình luận (${response.status})`);
    }
  }

  const result = await response.json();
  return result.data;
};

/**
 * Admin: Get all comments with filters
 */
export const getAllCommentsAdmin = async (filters: {
  blog_id?: string;
  user_id?: string;
  isApproved?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<ICommentListResponse> => {
  const token = await TokenManager.getAccessToken();
  
  if (!token) {
    throw new Error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
  }

  const params = new URLSearchParams();
  if (filters.blog_id) params.append('blog_id', filters.blog_id);
  if (filters.user_id) params.append('user_id', filters.user_id);
  if (filters.isApproved !== undefined) params.append('isApproved', filters.isApproved.toString());
  if (filters.search) params.append('search', filters.search);
  params.append('page', (filters.page || 1).toString());
  params.append('limit', (filters.limit || 20).toString());

  const response = await fetch(`${COMMENT_BASE_URL}/comments/admin/all?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    try {
      const errorResult = await response.json();
      const errorMessage = errorResult.message || errorResult.error || 'Không thể lấy danh sách bình luận';
      throw new Error(errorMessage);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Không thể lấy danh sách bình luận (${response.status})`);
    }
  }

  const result = await response.json();
  return result.data;
};

/**
 * Admin: Approve comment
 */
export const approveCommentAdmin = async (commentId: string): Promise<IComment> => {
  const token = await TokenManager.getAccessToken();
  
  if (!token) {
    throw new Error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
  }

  const response = await fetch(`${COMMENT_BASE_URL}/comments/admin/${commentId}/approve`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    try {
      const errorResult = await response.json();
      const errorMessage = errorResult.message || errorResult.error || 'Không thể duyệt bình luận';
      throw new Error(errorMessage);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Không thể duyệt bình luận (${response.status})`);
    }
  }

  const result = await response.json();
  return result.data;
};

/**
 * Admin: Reject comment
 */
export const rejectCommentAdmin = async (commentId: string): Promise<IComment> => {
  const token = await TokenManager.getAccessToken();
  
  if (!token) {
    throw new Error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
  }

  const response = await fetch(`${COMMENT_BASE_URL}/comments/admin/${commentId}/reject`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    try {
      const errorResult = await response.json();
      const errorMessage = errorResult.message || errorResult.error || 'Không thể từ chối bình luận';
      throw new Error(errorMessage);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Không thể từ chối bình luận (${response.status})`);
    }
  }

  const result = await response.json();
  return result.data;
};

/**
 * Admin: Get comment stats
 */
export const getCommentStats = async (): Promise<ICommentStats> => {
  const token = await TokenManager.getAccessToken();
  
  if (!token) {
    throw new Error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
  }

  const response = await fetch(`${COMMENT_BASE_URL}/comments/admin/stats`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    try {
      const errorResult = await response.json();
      const errorMessage = errorResult.message || errorResult.error || 'Không thể lấy thống kê bình luận';
      throw new Error(errorMessage);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Không thể lấy thống kê bình luận (${response.status})`);
    }
  }

  const result = await response.json();
  return result.data;
};
