import { INotification, NotificationType } from '@/types/notification';

/**
 * Xác định link để redirect dựa trên type và data của notification
 */
export function getNotificationLink(notification: INotification): string | null {
  const type = typeof notification.type === 'string' 
    ? notification.type.toLowerCase() 
    : notification.type;

  // Xử lý các notification liên quan đến đơn hàng
  const orderRelatedTypes = [
    'order',
    'order_created',
    'order_status_changed',
    'order_completed',
    'order_cancelled',
    'payment_success',
    'payment_failed',
    NotificationType.ORDER_CREATED,
    NotificationType.ORDER_STATUS_CHANGED,
    NotificationType.ORDER_COMPLETED,
    NotificationType.ORDER_CANCELLED,
    NotificationType.PAYMENT_SUCCESS,
    NotificationType.PAYMENT_FAILED,
  ];

  // Helper function để check xem có phải admin notification không
  const isAdminNotification = (notif: INotification) => {
    // Admin notifications thường có action như 'customer_request_cancel', 'order_cancelled'
    // hoặc link có chứa '/admin'
    return notif.data?.action === 'customer_request_cancel' || 
           notif.data?.action === 'order_cancelled' ||
           notif.link?.includes('/admin') ||
           (notif.type === 'order' && notif.data?.action); // Các order notifications có action thường là admin
  };

  // Ưu tiên: Nếu có link từ backend (đặc biệt cho admin), dùng link đó
  if (notification.link) {
    // Fix URL nếu backend trả về /order/[id] thay vì /admin/orders/[id] hoặc /account/orders/[id]
    const orderIdMatch = notification.link.match(/\/order[s]?\/([^\/\?]+)/);
    if (orderIdMatch) {
      const orderId = orderIdMatch[1];
      // Nếu là admin link (có /admin trong path hoặc là admin notification)
      if (notification.link.includes('/admin') || isAdminNotification(notification)) {
        // Admin dùng query parameter format: /admin/orders?orderId=...
        return `/admin/orders?orderId=${orderId}`;
      }
      // Nếu là customer link
      return `/account/orders/${orderId}`;
    }
    return notification.link;
  }

  // Fallback: Nếu có orderId và là order notification, tạo URL đúng
  const isOrderType = orderRelatedTypes.some(ot => ot === type);
  if ((isOrderType || notification.data?.orderId) && notification.data?.orderId) {
    // Kiểm tra nếu có action để xác định context (admin hay customer)
    // Admin notifications thường có action như 'customer_request_cancel'
    if (isAdminNotification(notification)) {
      // Admin dùng query parameter format: /admin/orders?orderId=...
      return `/admin/orders?orderId=${notification.data.orderId}`;
    }
    // Default cho customer
    return `/account/orders/${notification.data.orderId}`;
  }
  
  if (notification.data?.productId) {
    return `/laptop/${notification.data.productId}`;
  }
  
  if (notification.data?.voucherId) {
    return '/cart';
  }

  // Fallback: Sửa link từ backend nếu nó sai format
  if (notification.link) {
    // Fix URL nếu backend trả về /order/[id] thay vì /account/orders/[id]
    const orderIdMatch = notification.link.match(/\/order\/([^\/]+)/);
    if (orderIdMatch) {
      return `/account/orders/${orderIdMatch[1]}`;
    }
    return notification.link;
  }

  // Fallback: link từ data (cũng sửa nếu sai)
  if (notification.data?.link) {
    const orderIdMatch = notification.data.link.match(/\/order\/([^\/]+)/);
    if (orderIdMatch) {
      return `/account/orders/${orderIdMatch[1]}`;
    }
    return notification.data.link;
  }

  return null;
}

/**
 * Kiểm tra notification có phải là order-related không
 */
export function isOrderNotification(notification: INotification): boolean {
  const type = typeof notification.type === 'string' 
    ? notification.type.toLowerCase() 
    : notification.type;

  const orderRelatedTypes = [
    'order',
    'order_created',
    'order_status_changed',
    'order_completed',
    'order_cancelled',
    'payment_success',
    'payment_failed',
    NotificationType.ORDER_CREATED,
    NotificationType.ORDER_STATUS_CHANGED,
    NotificationType.ORDER_COMPLETED,
    NotificationType.ORDER_CANCELLED,
    NotificationType.PAYMENT_SUCCESS,
    NotificationType.PAYMENT_FAILED,
  ];

  const isOrderType = orderRelatedTypes.some(ot => ot === type);
  return isOrderType || !!notification.data?.orderId;
}

/**
 * Xử lý click vào notification: đánh dấu đã đọc và redirect
 */
export async function handleNotificationClick(
  notification: INotification,
  options: {
    markAsRead: (id: string) => void;
    markAsReadAPI: (id: string) => Promise<void>;
    router: { push: (path: string) => void };
    onClose?: () => void;
  }
): Promise<void> {
  const notificationId = notification._id || notification.id;
  if (!notificationId) {
    return;
  }

  // Đánh dấu đã đọc nếu chưa đọc
  if (!notification.isRead) {
    try {
      await options.markAsReadAPI(notificationId);
      options.markAsRead(notificationId);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[handleNotificationClick] Error marking as read:', error);
      }
      // Tiếp tục redirect ngay cả khi mark as read fail
    }
  }

  // Xác định link để redirect
  const link = getNotificationLink(notification);
  
  if (link) {
    options.router.push(link);
    options.onClose?.();
  } else {
    // Fallback: redirect đến trang notification
    options.router.push('/account/notification');
    options.onClose?.();
  }
}

