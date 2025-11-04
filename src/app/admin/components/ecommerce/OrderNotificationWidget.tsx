'use client';

import React, { useEffect } from 'react';
import { useNotificationStore } from '@/store/notificationStore';
import { NotificationAPI } from '@/services/notification-api';
import { NotificationType } from '@/types/notification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/ui/card';
import { Badge } from '@/components/atoms/ui/badge';
import { AlertCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export default function OrderNotificationWidget() {
  const { notifications, unreadCount } = useNotificationStore();

  // Filter lấy TẤT CẢ order notifications (không filter theo priority hay totalAmount)
  const orderNotifications = notifications.filter(n => {
    const type = typeof n.type === 'string' ? n.type.toLowerCase() : n.type;
    return (type === 'order' || 
            type === NotificationType.ORDER_CREATED || 
            type === NotificationType.ORDER_STATUS_CHANGED ||
            type === NotificationType.ORDER_CANCELLED ||
            type === NotificationType.ORDER_COMPLETED ||
            (n.data?.orderId && type !== NotificationType.SYSTEM_ANNOUNCEMENT)) && 
           !n.isRead;
  });

  // High priority notifications
  const highPriorityNotifications = orderNotifications.filter(
    n => n.data?.priority === 'high'
  );

  // Today's notifications
  const todayNotifications = orderNotifications.filter(n => {
    const today = new Date().setHours(0, 0, 0, 0);
    const notifDate = new Date(n.createdAt).setHours(0, 0, 0, 0);
    return notifDate === today;
  });

  // Calculate total amount from high priority orders
  const totalHighPriorityAmount = highPriorityNotifications.reduce((sum, notif) => {
    const amount = typeof notif.data?.totalAmount === 'number' 
      ? notif.data.totalAmount 
      : typeof notif.data?.totalAmount === 'string'
      ? parseFloat(notif.data.totalAmount) || 0
      : 0;
    return sum + amount;
  }, 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Đơn hàng cần xử lý
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Tổng chờ xử lý */}
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {orderNotifications.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Tổng chờ xử lý
            </div>
          </div>

          {/* Ưu tiên cao */}
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-red-300 dark:border-red-700">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {highPriorityNotifications.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Ưu tiên cao
            </div>
          </div>

          {/* Đơn hôm nay */}
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {todayNotifications.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Đơn hôm nay
            </div>
          </div>
        </div>

        {/* High Priority Alert */}
        {highPriorityNotifications.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <span className="font-semibold text-red-800 dark:text-red-300">
                Cảnh báo ưu tiên cao
              </span>
            </div>
            <p className="text-sm text-red-700 dark:text-red-400 mb-2">
              Có {highPriorityNotifications.length} đơn hàng ưu tiên cao cần xử lý ngay!
            </p>
            {totalHighPriorityAmount > 0 && (
              <p className="text-sm font-medium text-red-800 dark:text-red-300">
                Tổng giá trị: {formatPrice(String(totalHighPriorityAmount))}
              </p>
            )}
          </div>
        )}

        {/* Recent High Priority Orders */}
        {highPriorityNotifications.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Đơn hàng ưu tiên cao gần đây:
            </h4>
            {highPriorityNotifications.slice(0, 3).map((notification, index) => (
              <Link
                key={notification._id || notification.id || index}
                href={`/admin/orders?orderId=${notification.data?.orderId || ''}`}
                className="block p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-gray-900 dark:text-white">
                        {notification.title}
                      </span>
                      <Badge variant="destructive" className="text-xs">
                        Ưu tiên
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {notification.data?.orderId && `Mã: ${notification.data.orderId}`}
                      {notification.data?.totalAmount && 
                        ` • ${formatPrice(String(notification.data.totalAmount))}`}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    {new Date(notification.createdAt).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Link to orders */}
        <Link
          href="/admin/orders"
          className="block mt-4 text-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Xem tất cả đơn hàng →
        </Link>
      </CardContent>
    </Card>
  );
}

