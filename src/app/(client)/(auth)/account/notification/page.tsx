'use client';

import React, { useEffect, useState } from 'react';
import { useNotificationStore } from '@/store/notificationStore';
import { NotificationAPI } from '@/services/notification-api';
import  NotificationList  from '@/components/organisms/notification/NotificationList';
import { Button } from '@/components/atoms/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/atoms/ui/tabs';
import { Check, Trash2, Bell, BellOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { INotification, NotificationType } from '@/types/notification';

export default function NotificationPage() {
  const {
    notifications,
    unreadCount,
    isLoading,
    setNotifications,
    setUnreadCount,
    markAllAsRead,
    deleteAllRead,
  } = useNotificationStore();

  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read'>('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const limit = 20;

  // Filter notifications based on active tab
  const filteredNotifications = React.useMemo(() => {
    switch (activeTab) {
      case 'unread':
        return notifications.filter((n) => !n.isRead);
      case 'read':
        return notifications.filter((n) => n.isRead);
      default:
        return notifications;
    }
  }, [notifications, activeTab]);

  // Load more notifications
  const loadMore = async () => {
    if (isLoading || !hasMore) return;

    try {
      const response = await NotificationAPI.getNotifications({
        page: page + 1,
        limit,
        isRead: activeTab === 'read' ? true : activeTab === 'unread' ? false : undefined,
      });

      if (response.success) {
        const newNotifications = response.data.notifications;
        if (newNotifications.length === 0) {
          setHasMore(false);
        } else {
          setNotifications([...notifications, ...newNotifications]);
          setPage(page + 1);
        }
      }
    } catch (error) {
      console.error('Error loading more notifications:', error);
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    setIsMarkingAll(true);
    try {
      const response = await NotificationAPI.markAllAsRead();
      if (response.success) {
        markAllAsRead();
        setUnreadCount(0);
        toast({
          title: 'Thành công',
          description: `Đã đánh dấu ${response.data.updatedCount} thông báo là đã đọc`,
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể đánh dấu tất cả là đã đọc',
        variant: 'destructive',
      });
    } finally {
      setIsMarkingAll(false);
    }
  };

  // Handle delete all read
  const handleDeleteAllRead = async () => {
    setIsDeleting(true);
    try {
      const response = await NotificationAPI.deleteAllRead();
      if (response.success) {
        deleteAllRead();
        toast({
          title: 'Thành công',
          description: `Đã xóa ${response.data.deletedCount} thông báo đã đọc`,
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa thông báo đã đọc',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Load initial notifications when tab changes
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await NotificationAPI.getNotifications({
          page: 1,
          limit,
          isRead: activeTab === 'read' ? true : activeTab === 'unread' ? false : undefined,
        });

        if (response.success) {
          setNotifications(response.data.notifications);
          setUnreadCount(response.data.pagination.unreadCount);
          setHasMore(response.data.pagination.totalPages > 1);
          setPage(1);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [activeTab, setNotifications, setUnreadCount]);

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const readNotifications = notifications.filter((n) => n.isRead);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
    <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Thông báo
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {unreadCount > 0
              ? `Bạn có ${unreadCount} thông báo chưa đọc`
              : 'Bạn không có thông báo mới'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadNotifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAll}
            >
              <Check className="mr-2 h-4 w-4" />
              Đánh dấu tất cả đã đọc
            </Button>
          )}
          {readNotifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteAllRead}
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa đã đọc
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Tất cả ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread" className="flex items-center gap-2">
            <BellOff className="h-4 w-4" />
            Chưa đọc ({unreadNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="read" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Đã đọc ({readNotifications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <NotificationList
            notifications={filteredNotifications}
            isLoading={isLoading}
            emptyMessage="Không có thông báo nào"
          />
          {hasMore && filteredNotifications.length > 0 && (
            <div className="mt-6 text-center">
              <Button variant="outline" onClick={loadMore} disabled={isLoading}>
                Tải thêm
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="unread" className="mt-6">
          <NotificationList
            notifications={filteredNotifications}
            isLoading={isLoading}
            emptyMessage="Không có thông báo chưa đọc"
          />
          {hasMore && filteredNotifications.length > 0 && (
            <div className="mt-6 text-center">
              <Button variant="outline" onClick={loadMore} disabled={isLoading}>
                Tải thêm
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="read" className="mt-6">
          <NotificationList
            notifications={filteredNotifications}
            isLoading={isLoading}
            emptyMessage="Không có thông báo đã đọc"
          />
          {hasMore && filteredNotifications.length > 0 && (
            <div className="mt-6 text-center">
              <Button variant="outline" onClick={loadMore} disabled={isLoading}>
                Tải thêm
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
