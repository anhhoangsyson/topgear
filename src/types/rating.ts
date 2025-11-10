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

