'use client';

import React, { useEffect, useState } from 'react';
import { useNotificationStore } from '@/store/notificationStore';
import { NotificationAPI } from '@/services/notification-api';
import  NotificationList  from '@/components/organisms/notification/NotificationList';
import { Button } from '@/components/atoms/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/atoms/ui/tabs';
import { Check, Trash2, Bell, BellOff, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/ui/select';
import { toast } from '@/hooks/use-toast';
import NotificationSettings from '@/components/molecules/notification/NotificationSettings';

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
  const [selectedType, setSelectedType] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [totalCounts, setTotalCounts] = useState({
    all: 0,
    unread: 0,
    read: 0,
  });

  const limit = 20;

  // Filter notifications based on active tab and type
  const filteredNotifications = React.useMemo(() => {
    let filtered = notifications;
    
    // Filter by type if selected
    if (selectedType !== 'all') {
      filtered = filtered.filter(n => {
        const type = typeof n.type === 'string' ? n.type.toLowerCase() : n.type;
        return type === selectedType.toLowerCase();
      });
    }
    
    return filtered;
  }, [notifications, selectedType]);

  // Load more notifications
  const loadMore = async () => {
    if (isLoading || !hasMore) return;

    try {
        const response = await NotificationAPI.getNotifications({
          page: page + 1,
          limit,
          isRead: activeTab === 'read' ? true : activeTab === 'unread' ? false : undefined,
          type: selectedType !== 'all' ? selectedType : undefined,
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
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading more notifications:', error);
      }
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    setIsMarkingAll(true);
    try {
      const response = await NotificationAPI.markAllAsRead();
      if (response.success) {
        const updatedCount = response.data?.count || unreadCount;
        markAllAsRead();
        setUnreadCount(0);
        toast({
          title: 'Thành công',
          description: `Đã đánh dấu ${updatedCount} thông báo là đã đọc`,
          duration: 3000,
        });
      }
    } catch {
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
    } catch {
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
        // Reset pagination when tab or filter changes
        setPage(1);
        setHasMore(true);
        
        const response = await NotificationAPI.getNotifications({
          page: 1,
          limit,
          isRead: activeTab === 'read' ? true : activeTab === 'unread' ? false : undefined,
          type: selectedType !== 'all' ? selectedType : undefined,
        });

        if (response.success) {
          setNotifications(response.data.notifications);
          const unreadCount = response.data.pagination?.unreadCount || 0;
          const total = response.data.pagination?.total || 0;
          setUnreadCount(unreadCount);
          setHasMore(response.data.pagination?.totalPages > 1);
          
          // Update counts based on current tab
          if (activeTab === 'all') {
            const readCount = total - unreadCount;
            setTotalCounts({
              all: total || 0,
              unread: unreadCount || 0,
              read: readCount >= 0 ? readCount : 0,
            });
          } else if (activeTab === 'unread') {
            setTotalCounts(prev => ({
              ...prev,
              unread: total || 0,
            }));
          } else if (activeTab === 'read') {
            setTotalCounts(prev => ({
              ...prev,
              read: total || 0,
            }));
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching notifications:', error);
        }
      }
    };

    fetchNotifications();
  }, [activeTab, selectedType, setNotifications, setUnreadCount]);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="mb-6 pb-4 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Thông báo
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {unreadCount > 0
                ? `Bạn có ${unreadCount} thông báo chưa đọc`
                : 'Bạn không có thông báo mới'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <NotificationSettings />
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAll}
                className="text-xs"
              >
                <Check className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Đánh dấu tất cả đã đọc</span>
                <span className="sm:hidden">Đánh dấu đã đọc</span>
              </Button>
            )}
            {totalCounts.read > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteAllRead}
                disabled={isDeleting}
                className="text-xs"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Xóa đã đọc</span>
                <span className="sm:hidden">Xóa</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Filter by type */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Lọc theo loại:</span>
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Tất cả loại" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            <SelectItem value="order">Đơn hàng</SelectItem>
            <SelectItem value="payment">Thanh toán</SelectItem>
            <SelectItem value="voucher">Voucher</SelectItem>
            <SelectItem value="product">Sản phẩm</SelectItem>
            <SelectItem value="system">Hệ thống</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="flex items-center justify-center gap-2 text-xs sm:text-sm">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">
              Tất cả ({isNaN(totalCounts.all) ? filteredNotifications.length : totalCounts.all})
            </span>
            <span className="sm:hidden">Tất cả</span>
          </TabsTrigger>
          <TabsTrigger value="unread" className="flex items-center justify-center gap-2 text-xs sm:text-sm">
            <BellOff className="h-4 w-4" />
            <span className="hidden sm:inline">
              Chưa đọc ({isNaN(totalCounts.unread) ? unreadCount : totalCounts.unread})
            </span>
            <span className="sm:hidden">Chưa đọc</span>
          </TabsTrigger>
          <TabsTrigger value="read" className="flex items-center justify-center gap-2 text-xs sm:text-sm">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">
              Đã đọc ({isNaN(totalCounts.read) ? 0 : totalCounts.read})
            </span>
            <span className="sm:hidden">Đã đọc</span>
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
