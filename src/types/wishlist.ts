import { ILaptop } from './index';

export interface IWishlist {
  _id: string;
  userId: string;
  laptopId: ILaptop | string;
  createdAt: string;
  updatedAt?: string;
}

export interface IWishlistListResponse {
  wishlists: IWishlist[];
  total: number;
  page: number;
  totalPages: number;
}

export interface IWishlistCheckResponse {
  inWishlist: boolean;
}

export interface IWishlistCountResponse {
  count: number;
}

