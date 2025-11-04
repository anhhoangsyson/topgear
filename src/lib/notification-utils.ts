import { INotification, NotificationType } from '@/types/notification';

/**
 * Xác định link để redirect dựa trên type và data của notification
 */
export function getNotificationLink(notification: INotification): string | null {
  // Ưu tiên link ở top level (theo API docs)
  if (notification.link) {
    return notification.link;
  }

  // Fallback: generate link từ data
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

  if (orderRelatedTypes.includes(type as any) && notification.data?.orderId) {
    return `/account/orders/${notification.data.orderId}`;
  }

  // Xử lý các notification khác
  if (notification.data?.orderId) {
    return `/account/orders/${notification.data.orderId}`;
  }
  
  if (notification.data?.productId) {
    return `/laptop/${notification.data.productId}`;
  }
  
  if (notification.data?.voucherId) {
    return '/cart';
  }

  // Fallback: link từ data
  if (notification.data?.link) {
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

  return orderRelatedTypes.includes(type as any) || !!notification.data?.orderId;
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
    console.warn('[handleNotificationClick] No notification ID found');
    return;
  }

  // Đánh dấu đã đọc nếu chưa đọc
  if (!notification.isRead) {
    try {
      await options.markAsReadAPI(notificationId);
      options.markAsRead(notificationId);
    } catch (error) {
      console.error('[handleNotificationClick] Error marking as read:', error);
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

