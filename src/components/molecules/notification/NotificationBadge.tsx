'use client';

import { Badge } from '@/components/atoms/ui/badge';
import { useNotificationStore } from '@/store/notificationStore';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface NotificationBadgeProps {
  className?: string;
}

export default function NotificationBadge({ className }: NotificationBadgeProps) {
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  return (
    <Link href="/account/notification" className={`relative ${className}`}>
      <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs font-semibold"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </Badge>
      )}
    </Link>
  );
}

