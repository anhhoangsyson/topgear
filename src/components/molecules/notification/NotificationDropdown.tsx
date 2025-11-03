'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/atoms/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/atoms/ui/dropdown-menu';
import { useNotificationStore } from '@/store/notificationStore';
import { NotificationAPI } from '@/services/notification-api';
import { INotification } from '@/types/notification';
import { formatDate } from '@/lib/utils';
import { LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  
  // Lấy state từ store - đảm bảo unreadCount luôn là số
  const notifications = useNotificationStore((state) => state.notifications || []);
  const unreadCountFromStore = useNotificationStore((state) => state.unreadCount);
  
  // Tính toán unreadCount với fallback
  const unreadCount = useMemo(() => {
    // Ưu tiên dùng unreadCount từ store nếu hợp lệ
    if (typeof unreadCountFromStore === 'number' && !isNaN(unreadCountFromStore)) {
      return unreadCountFromStore;
    }
    // Fallback: tính từ notifications
    const calculated = notifications.filter(n => !n.isRead).length;
    console.log('[NotificationDropdown] ⚠️ unreadCount từ store không hợp lệ, using calculated:', {
      storeValue: unreadCountFromStore,
      calculated,
      totalNotifications: notifications.length
    });
    return calculated;
  }, [unreadCountFromStore, notifications]);
  
  const isLoading = useNotificationStore((state) => state.isLoading);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const setNotifications = useNotificationStore((state) => state.setNotifications);
  const setUnreadCount = useNotificationStore((state) => state.setUnreadCount);

  // Debug: Log unread count changes
  useEffect(() => {
    console.log('[NotificationDropdown] 📊 Unread count changed:', unreadCount);
    console.log('[NotificationDropdown] 📦 Total notifications:', notifications.length);
    console.log('[NotificationDropdown] 📋 Unread notifications:', notifications.filter(n => !n.isRead).length);
  }, [unreadCount, notifications]);

  // Get recent unread notifications
  const recentNotifications = notifications
    .filter(n => !n.isRead)
    .slice(0, 5)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleNotificationClick = async (notification: INotification) => {
    const notificationId = notification._id || notification.id;
    if (!notificationId) return;

    // Mark as read
    if (!notification.isRead) {
      try {
        await NotificationAPI.markAsRead(notificationId);
        markAsRead(notificationId);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }

    // Navigate
    const link = notification.link || notification.data?.link;
    if (notification.data?.orderId) {
      router.push(`/account/orders/${notification.data.orderId}`);
      setIsOpen(false);
    } else if (link) {
      router.push(link);
      setIsOpen(false);
    } else {
      router.push('/account/notification');
      setIsOpen(false);
    }
  };

  // Refresh notifications khi mở dropdown
  useEffect(() => {
    if (isOpen) {
      const fetchNotifications = async () => {
        try {
          const response = await NotificationAPI.getNotifications({ 
            page: 1, 
            limit: 10 
          });
          if (response.success) {
            setNotifications(response.data.notifications);
            setUnreadCount(response.data.pagination.unreadCount);
          }
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };
      fetchNotifications();
    }
  }, [isOpen, setNotifications, setUnreadCount]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button 
          className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label={`Thông báo${unreadCount > 0 ? ` (${unreadCount} mới)` : ''}`}
        >
          <Bell className={`w-5 h-5 text-gray-700 dark:text-gray-300 transition-transform ${unreadCount > 0 ? 'animate-pulse' : ''}`} />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-semibold animate-bounce"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Thông báo</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} mới
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <LoaderCircle className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : recentNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Không có thông báo mới
            </p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {recentNotifications.map((notification, index) => (
              <DropdownMenuItem
                key={notification._id || notification.id || index}
                onClick={() => handleNotificationClick(notification)}
                className="flex flex-col items-start gap-1 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="flex items-start gap-2 w-full">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link 
            href="/account/notification" 
            className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
            onClick={() => setIsOpen(false)}
          >
            Xem tất cả thông báo
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

