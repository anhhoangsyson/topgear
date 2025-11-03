'use client';

import React, { useState, useEffect } from 'react';
import { Dropdown } from '@/app/admin/components/ui/dropDown/DropDown';
import { DropdownItem } from '@/app/admin/components/ui/dropDown/DropDownItem';
import { useNotificationStore } from '@/store/notificationStore';
import { NotificationAPI } from '@/services/notification-api';
import { INotification, NotificationType } from '@/types/notification';
import { formatDate, formatPrice } from '@/lib/utils';
import { Badge } from '@/components/atoms/ui/badge';
import { LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminNotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    isLoading,
    markAsRead,
    setNotifications,
    setUnreadCount,
  } = useNotificationStore();
  const router = useRouter();

  // Filter chỉ lấy order notifications (backend trả về lowercase 'order')
  const orderNotifications = notifications.filter(n => {
    const type = typeof n.type === 'string' ? n.type.toLowerCase() : n.type;
    return type === 'order' || 
           type === NotificationType.ORDER_CREATED || 
           type === NotificationType.ORDER_CANCELLED;
  });

  // Sort theo priority và thời gian
  const sortedNotifications = [...orderNotifications].sort((a, b) => {
    // High priority trước
    if (a.data?.priority === 'high' && b.data?.priority !== 'high') return -1;
    if (a.data?.priority !== 'high' && b.data?.priority === 'high') return 1;
    // Mới nhất trước
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Unread order notifications
  const unreadOrderNotifications = sortedNotifications.filter(n => !n.isRead);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleNotificationClick = async (notification: INotification) => {
    // Get notification ID (backend có thể trả về _id hoặc id)
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

    // Navigate to order page (ưu tiên link ở top level, sau đó mới data.link)
    const link = notification.link || notification.data?.link;
    if (notification.data?.orderId) {
      router.push(`/admin/orders?orderId=${notification.data.orderId}`);
      setIsOpen(false);
    } else if (link) {
      router.push(link);
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
            limit: 20 
          });
          if (response.success) {
            const orderNotifs = response.data.notifications.filter(n => {
              const type = typeof n.type === 'string' ? n.type.toLowerCase() : n.type;
              return type === 'order' || 
                     type === NotificationType.ORDER_CREATED || 
                     type === NotificationType.ORDER_CANCELLED;
            });
            setNotifications(orderNotifs);
            setUnreadCount(response.data.pagination.unreadCount);
          }
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };
      fetchNotifications();
    }
  }, [isOpen, setNotifications, setUnreadCount]);

  const getNotificationIcon = (type: NotificationType | string) => {
    const typeStr = typeof type === 'string' ? type.toLowerCase() : type;
    if (typeStr === 'order' || typeStr === NotificationType.ORDER_CREATED) {
      return '📦';
    }
    if (typeStr === NotificationType.ORDER_CANCELLED || typeStr === 'order_cancelled') {
      return '🔔';
    }
    return '🔔';
  };

  const getNotificationColor = (priority?: 'high' | 'normal') => {
    return priority === 'high' ? 'bg-red-500' : 'bg-blue-500';
  };

  return (
    <div className="relative">
      <button
        className="relative dropdown-toggle flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={handleToggle}
      >
        {/* Bell Icon */}
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
        
        {/* Unread Badge */}
        {unreadOrderNotifications.length > 0 && (
          <span className="absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 flex">
            <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
          </span>
        )}
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <div>
            <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Thông báo đơn hàng
            </h5>
            {unreadOrderNotifications.length > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {unreadOrderNotifications.length} chưa đọc
              </p>
            )}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 transition dropdown-toggle dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <svg
              className="fill-current"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        {/* Notifications List */}
        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <li className="flex items-center justify-center py-8">
              <LoaderCircle className="h-6 w-6 animate-spin text-gray-400" />
            </li>
          ) : sortedNotifications.length === 0 ? (
            <li className="flex items-center justify-center py-8 text-gray-500 dark:text-gray-400">
              Không có thông báo nào
            </li>
          ) : (
            sortedNotifications.slice(0, 10).map((notification, index) => (
              <li key={notification._id || notification.id || index}>
                <DropdownItem
                  onItemClick={() => handleNotificationClick(notification)}
                  className={`flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5 cursor-pointer ${
                    !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                  } ${
                    notification.data?.priority === 'high' 
                      ? 'border-l-4 border-l-red-500' 
                      : ''
                  }`}
                >
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1">
                          <span className="font-medium text-gray-800 dark:text-white/90 text-sm block">
                            {notification.title}
                          </span>
                          {notification.data?.priority === 'high' && (
                            <Badge 
                              variant="destructive" 
                              className="mt-1 text-xs px-2 py-0"
                            >
                              Ưu tiên cao
                            </Badge>
                          )}
                        </div>
                      </div>
                      {!notification.isRead && (
                        <span className={`h-2 w-2 rounded-full ${getNotificationColor(notification.data?.priority)} flex-shrink-0 mt-2`} />
                      )}
                    </div>

                    {/* Message */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {notification.message}
                    </p>

                    {/* Order Info */}
                    {notification.data?.orderId && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        <span className="font-medium">Mã đơn:</span> {notification.data.orderId}
                      </div>
                    )}

                    {notification.data?.totalAmount && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        <span className="font-medium">Giá trị:</span> {
                          formatPrice(
                            typeof notification.data.totalAmount === 'number' 
                              ? String(notification.data.totalAmount)
                              : String(notification.data.totalAmount)
                          )
                        }
                      </div>
                    )}

                    {/* Time */}
                    <div className="flex items-center gap-2 text-gray-500 text-xs dark:text-gray-400 mt-2">
                      <span>{formatDate(notification.createdAt)}</span>
                    </div>
                  </div>
                </DropdownItem>
              </li>
            ))
          )}
        </ul>

        {/* Footer */}
        <Link
          href="/admin/orders"
          className="block px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          onClick={() => setIsOpen(false)}
        >
          Xem tất cả đơn hàng
        </Link>
      </Dropdown>
    </div>
  );
}

