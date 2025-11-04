'use client';

import { INotification } from '@/types/notification';
import NotificationItem from '@/components/molecules/notification/NotificationItem';
import React from 'react';
import { Loader } from '@/components/atoms/feedback/Loader';

interface NotificationListProps {
  notifications: INotification[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export default function NotificationList({
  notifications,
  isLoading,
  emptyMessage = 'Không có thông báo nào',
}: NotificationListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <Loader size="lg" variant="default" />
        <p className="text-sm text-gray-600">Đang tải thông báo...</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-4xl mb-4">🔔</div>
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification, index) => (
        <NotificationItem key={notification._id || notification.id || index} notification={notification} />
      ))}
    </div>
  );
}

