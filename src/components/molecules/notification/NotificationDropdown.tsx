'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Bell, Clock, AlertCircle } from 'lucide-react';
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
import { handleNotificationClick } from '@/lib/notification-utils';

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
    return calculated;
  }, [unreadCountFromStore, notifications]);
  
  const isLoading = useNotificationStore((state) => state.isLoading);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const setNotifications = useNotificationStore((state) => state.setNotifications);
  const setUnreadCount = useNotificationStore((state) => state.setUnreadCount);
  const setLoading = useNotificationStore((state) => state.setLoading);


  // Get recent notifications (both read and unread, but prioritize unread)
  const recentNotifications = useMemo(() => {
    // Sort by: unread first, then by date (newest first)
    const sorted = [...notifications].sort((a, b) => {
      // Unread notifications first
      if (!a.isRead && b.isRead) return -1;
      if (a.isRead && !b.isRead) return 1;
      // Then sort by date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    // Return up to 10 most recent notifications
    return sorted.slice(0, 10);
  }, [notifications]);

  const onNotificationClick = async (notification: INotification) => {
    await handleNotificationClick(notification, {
      markAsRead,
      markAsReadAPI: async (id: string) => {
        await NotificationAPI.markAsRead(id);
      },
      router,
      onClose: () => setIsOpen(false),
    });
  };

  // Refresh notifications khi mở dropdown
  useEffect(() => {
    if (isOpen) {
      const fetchNotifications = async () => {
        try {
          setLoading(true);
          
          // Fetch both notifications and unread count
          const [notificationsRes, unreadCountRes] = await Promise.all([
            NotificationAPI.getNotifications({ 
              page: 1, 
              limit: 20  // Fetch more notifications
            }),
            NotificationAPI.getUnreadCount(),
          ]);
          
          if (notificationsRes.success) {
            const fetchedNotifications = notificationsRes.data.notifications || [];
            
            if (process.env.NODE_ENV === 'development') {
              console.log('[NotificationDropdown] Fetched notifications:', {
                count: fetchedNotifications.length,
                notifications: fetchedNotifications.map(n => ({
                  id: n._id || n.id,
                  type: n.type,
                  title: n.title,
                  isRead: n.isRead,
                })),
              });
            }
            
            setNotifications(fetchedNotifications);
            
            // Use unread count from API if available
            if (unreadCountRes.success) {
              const apiUnreadCount = unreadCountRes.data.count || 0;
              setUnreadCount(apiUnreadCount);
              
              if (process.env.NODE_ENV === 'development') {
                console.log('[NotificationDropdown] Unread count from API:', apiUnreadCount);
              }
            } else if (notificationsRes.data.pagination?.unreadCount !== undefined) {
              // Fallback to pagination unreadCount
              const paginationUnreadCount = notificationsRes.data.pagination.unreadCount;
              setUnreadCount(paginationUnreadCount);
              
              if (process.env.NODE_ENV === 'development') {
                console.log('[NotificationDropdown] Unread count from pagination:', paginationUnreadCount);
              }
            } else {
              // Calculate from notifications
              const calculatedCount = fetchedNotifications.filter(n => !n.isRead).length;
              setUnreadCount(calculatedCount);
              
              if (process.env.NODE_ENV === 'development') {
                console.log('[NotificationDropdown] Calculated unread count:', calculatedCount);
              }
            }
          } else {
            if (process.env.NODE_ENV === 'development') {
              console.error('[NotificationDropdown] API response not successful:', notificationsRes);
            }
          }
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('[NotificationDropdown] Error fetching notifications:', error);
            if (error instanceof Error) {
              console.error('[NotificationDropdown] Error message:', error.message);
              console.error('[NotificationDropdown] Error stack:', error.stack);
            }
          }
        } finally {
          setLoading(false);
        }
      };
      fetchNotifications();
    }
  }, [isOpen, setNotifications, setUnreadCount, setLoading]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button 
          className="relative p-2 hover:bg-white/10 rounded transition-colors"
          aria-label={`Thông báo${unreadCount > 0 ? ` (${unreadCount} mới)` : ''}`}
        >
          <Bell className="w-6 h-6 text-white" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
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
        ) : notifications.length === 0 && recentNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Không có thông báo nào
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Chúng tôi sẽ thông báo cho bạn khi có cập nhật mới
            </p>
          </div>
        ) : recentNotifications.length === 0 && notifications.length > 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {unreadCount === 0 
                ? 'Không có thông báo mới' 
                : 'Đang tải thông báo...'}
            </p>
            {unreadCount === 0 && (
              <p className="text-xs text-gray-400 mt-1">
                Tất cả thông báo đã được đọc
              </p>
            )}
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {recentNotifications.map((notification, index) => (
              <DropdownMenuItem
                key={notification._id || notification.id || index}
                onClick={() => onNotificationClick(notification)}
                className={`relative flex flex-col items-start gap-1 p-3 cursor-pointer transition-all ${
                  !notification.isRead 
                    ? 'bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 border-l-4 border-l-blue-500' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                } ${
                  notification.data?.priority === 'high' 
                    ? 'border-l-4 border-l-red-500 shadow-sm' 
                    : ''
                }`}
              >
                {/* Unread indicator */}
                {!notification.isRead && (
                  <div className="absolute left-2 top-1/2 -translate-y-1/2">
                    <div className={`h-2 w-2 rounded-full ${
                      notification.data?.priority === 'high' ? 'bg-red-500' : 'bg-blue-500'
                    } animate-pulse`} />
                  </div>
                )}
                
                <div className="flex items-start gap-2 w-full ml-1">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className={`text-sm line-clamp-1 ${
                        !notification.isRead 
                          ? 'font-semibold text-gray-900 dark:text-gray-100' 
                          : 'font-medium text-gray-700 dark:text-gray-300'
                      }`}>
                        {notification.title}
                      </p>
                      {notification.data?.priority === 'high' && (
                        <Badge variant="destructive" className="text-xs px-1.5 py-0 h-4">
                          <AlertCircle className="w-2.5 h-2.5 mr-0.5" />
                          Ưu tiên
                        </Badge>
                      )}
                    </div>
                    <p className={`text-xs line-clamp-2 mt-1 ${
                      !notification.isRead 
                        ? 'text-gray-700 dark:text-gray-200' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400 dark:text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(notification.createdAt)}</span>
                    </div>
                  </div>
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

