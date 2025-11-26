export type RatingStatus = 'visible' | 'hidden';

export interface IAdminReply {
  content: string;
  adminId: string | {
    _id: string;
    fullname: string;
    email: string;
  };
  repliedAt: string;
}

export interface IRating {
  _id: string;
  orderId: string | {
    _id: string;
    orderStatus: string;
    totalAmount: number;
  };
  userId: string | {
    _id: string;
    fullname: string;
    email: string;
    avatar?: string;
  };
  laptopId?: string | {
    _id: string;
    name: string;
    modelName: string;
    images?: Array<{ imageUrl: string }>;
  } | null;
  rating: number; // 1-5
  comment?: string; // max 1000 characters
  status: RatingStatus; // visible | hidden
  adminReply?: IAdminReply; // Admin reply
  createdAt: string;
  updatedAt?: string;
}

export interface IRatingStats {
  average: number;
  count: number;
  distribution: Array<{
    rating: number;
    count: number;
  }>;
}

export interface IRatingListResponse {
  ratings: IRating[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ICreateRatingRequest {
  orderId: string;
  laptopId?: string | null;
  rating: number; // 1-5
  comment?: string; // max 1000 characters
}

export interface IUpdateRatingRequest {
  rating?: number;
  comment?: string;
}

// Admin-specific interfaces
export interface IAdminUpdateRatingRequest {
  status?: RatingStatus;
  adminNote?: string;
  rating?: number;
  comment?: string;
}

export interface IAdminReplyRequest {
  content: string; // 1-2000 characters
}

export interface IAdminUpdateStatusRequest {
  status: RatingStatus; // 'visible' | 'hidden'
}

export interface IRatingFilter {
  page?: number;
  limit?: number;
  userId?: string;
  laptopId?: string;
  orderId?: string;
  rating?: number;
  status?: RatingStatus;
  sortBy?: string; // e.g., "createdAt:desc" or "rating:desc"
}

export interface IAdminRatingListResponse {
  items: IRating[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages?: number;
  };
}

export interface IAdminRatingStats {
  totalRatings: number;
  averageRating: number;
  distribution: Array<{
    rating: number;
    count: number;
  }>;
  ratingsByMonth: Array<{
    month: string;
    count: number;
  }>;
  topRatedLaptops: Array<{
    laptopId: string;
    average: number;
    count: number;
  }>;
  byRating?: {
    [key: string]: number; // "1": 10, "2": 20, etc. (computed from distribution)
  };
  byStatus?: {
    pending: number;
    approved: number;
    rejected: number;
  };
}

