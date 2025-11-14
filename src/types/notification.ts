export enum NotificationType {
  ORDER_CREATED = "ORDER_CREATED",
  ORDER_STATUS_CHANGED = "ORDER_STATUS_CHANGED",
  ORDER_CANCELLED = "ORDER_CANCELLED",
  ORDER_COMPLETED = "ORDER_COMPLETED",
  PAYMENT_SUCCESS = "PAYMENT_SUCCESS",
  PAYMENT_FAILED = "PAYMENT_FAILED",
  VOUCHER_AVAILABLE = "VOUCHER_AVAILABLE",
  PRODUCT_RESTOCKED = "PRODUCT_RESTOCKED",
  PRODUCT_DISCOUNT = "PRODUCT_DISCOUNT",
  SYSTEM_ANNOUNCEMENT = "SYSTEM_ANNOUNCEMENT"
}

// Admin-specific notification types
export enum AdminNotificationType {
  ORDER = "order", // Đơn hàng mới hoặc bị hủy
}

export interface INotification {
  _id?: string; // Backend có thể trả về id hoặc _id
  id?: string; // Theo API docs, có thể là "id" (ưu tiên dùng _id)
  userId: string;
  type: NotificationType | string; // Backend trả về 'order', 'comment', etc. (lowercase) hoặc NotificationType enum
  title: string;
  message: string;
  data?: {
    orderId?: string;
    productId?: string;
    voucherId?: string;
    newStatus?: string;
    code?: string;
    customerId?: string;
    totalAmount?: number;
    orderStatus?: string;
    paymentMethod?: string;
    priority?: 'high' | 'normal';
    link?: string;
    action?: string; // 'customer_request_cancel', 'order_cancelled', etc.
    status?: string; // 'canceling', 'cancelled', etc.
    // Comment notification data
    blogId?: string;
    commentId?: string;
    commenterName?: string;
    parentCommentId?: string;
    blogTitle?: string;
    // Rating notification data
    ratingId?: string;
    laptopId?: string;
    rating?: number;
    userName?: string;
    laptopName?: string;
    isNegative?: boolean;
    [key: string]: string | number | object | undefined;
  };
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt?: string;
  expiresAt?: string;
  link?: string; // Backend có thể trả về link ở top level (theo API docs)
}

export interface NotificationResponse {
  success: boolean;
  data: {
    notifications: INotification[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      unreadCount: number;
    };
  };
}

export interface UnreadCountResponse {
  success: boolean;
  data: {
    count: number;
  };
}

