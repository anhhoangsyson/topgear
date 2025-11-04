'use client';

import { INotification, NotificationType } from '@/types/notification';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/atoms/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/atoms/ui/dropdown-menu';
import { MoreVertical, Trash2, Check } from 'lucide-react';
import { useNotificationStore } from '@/store/notificationStore';
import { NotificationAPI } from '@/services/notification-api';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import React from 'react';
import { cn } from '@/lib/utils';
import { getNotificationLink, handleNotificationClick } from '@/lib/notification-utils';
import { useRouter } from 'next/navigation';

interface NotificationItemProps {
  notification: INotification;
}

const getNotificationIcon = (type: NotificationType | string) => {
  // Backend trả về lowercase types: 'order', 'comment', etc.
  const typeStr = typeof type === 'string' ? type.toLowerCase() : type;
  
  if (typeStr === 'order' || typeStr === NotificationType.ORDER_CREATED || typeStr === NotificationType.ORDER_STATUS_CHANGED || typeStr === NotificationType.ORDER_COMPLETED) {
    return '📦';
  }
  if (typeStr === NotificationType.ORDER_CANCELLED || typeStr === 'order_cancelled') {
    return '❌';
  }
  if (typeStr === NotificationType.PAYMENT_SUCCESS || typeStr === 'payment_success') {
    return '✅';
  }
  if (typeStr === NotificationType.PAYMENT_FAILED || typeStr === 'payment_failed') {
    return '⚠️';
  }
  if (typeStr === NotificationType.VOUCHER_AVAILABLE || typeStr === 'voucher') {
    return '🎟️';
  }
  if (typeStr === NotificationType.PRODUCT_RESTOCKED || typeStr === 'product') {
    return '📦';
  }
  if (typeStr === NotificationType.PRODUCT_DISCOUNT || typeStr === 'promotion') {
    return '💰';
  }
  if (typeStr === NotificationType.SYSTEM_ANNOUNCEMENT || typeStr === 'system') {
    return '📢';
  }
  return '🔔';
};

export default function NotificationItem({ notification }: NotificationItemProps) {
  const { markAsRead, deleteNotification } = useNotificationStore();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const router = useRouter();

  // Get notification ID (backend có thể trả về _id hoặc id)
  const notificationId = notification._id || notification.id || '';
  
  const handleMarkAsRead = async () => {
    if (notification.isRead || !notificationId) return;

    try {
      await NotificationAPI.markAsRead(notificationId);
      markAsRead(notificationId);
      toast({
        title: 'Đã đánh dấu đã đọc',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể đánh dấu đã đọc',
        variant: 'destructive',
      });
    }
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    await handleNotificationClick(notification, {
      markAsRead,
      markAsReadAPI: async (id: string) => {
        await NotificationAPI.markAsRead(id);
      },
      router,
    });
  };

  const handleDelete = async () => {
    if (!notificationId) return;
    
    setIsDeleting(true);
    try {
      await NotificationAPI.deleteNotification(notificationId);
      deleteNotification(notificationId);
      toast({
        title: 'Đã xóa thông báo',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa thông báo',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const link = getNotificationLink(notification);
  const icon = getNotificationIcon(notification.type);

  const content = (
    <div
      className={cn(
        'p-4 rounded-lg border transition-colors hover:bg-gray-50 dark:hover:bg-gray-800',
        !notification.isRead && 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                {notification.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {notification.message}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                {formatDate(notification.createdAt)}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!notification.isRead && (
                  <DropdownMenuItem onClick={handleMarkAsRead}>
                    <Check className="mr-2 h-4 w-4" />
                    Đánh dấu đã đọc
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleDelete} disabled={isDeleting}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {!notification.isRead && (
          <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
        )}
      </div>
    </div>
  );

  if (link) {
    return (
      <div onClick={handleClick} className="cursor-pointer block">
        {content}
      </div>
    );
  }

  return (
    <div onClick={handleClick} className="cursor-pointer">
      {content}
    </div>
  );
}

