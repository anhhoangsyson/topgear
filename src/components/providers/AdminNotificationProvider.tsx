'use client';

import React, { useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useSocket } from '@/hooks/use-socket';
import { useNotificationStore } from '@/store/notificationStore';
import { NotificationAPI } from '@/services/notification-api';
import { INotification, NotificationType } from '@/types/notification';
import { toast } from '@/hooks/use-toast';

interface AdminNotificationProviderProps {
  children: React.ReactNode;
}

// Helper function để play sound notification
const playNotificationSound = (priority?: 'high' | 'normal') => {
  // Check if sound is enabled (lưu trong localStorage)
  if (typeof window === 'undefined') return;
  
  const soundEnabled = localStorage.getItem('adminSoundEnabled') !== 'false';
  if (!soundEnabled) return;

  try {
    // Tạo audio element với fallback sound
    // Note: Có thể thay bằng file audio thật trong public folder
    // const audio = new Audio(); // Not used - using programmatic audio instead
    
    // Simple beep sound - có thể thay bằng file thật
    // audio.src = priority === 'high' 
    //   ? '/urgent-notification.mp3' 
    //   : '/admin-notification.mp3';
    
    // Fallback: Tạo simple beep sound programmatically
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = priority === 'high' ? 800 : 400;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch {
    // Ignore audio errors (user might have blocked autoplay)
  }
};

export default function AdminNotificationProvider({ children }: AdminNotificationProviderProps) {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === 'admin';
  
  // Lấy userId từ session - nếu không có thì decode từ JWT token
  const [userIdState, setUserIdState] = React.useState<string | undefined>(
    session?.user?.id || session?.user?._id || (session as { userId?: string })?.userId
  );

  // Fetch userId từ JWT nếu không có trong session
  useEffect(() => {
    if (status === 'authenticated' && isAdmin && !userIdState && session?.accessToken) {
      try {
        // Decode JWT để lấy userId
        const parts = session.accessToken.split('.');
        if (parts.length === 3) {
          const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
          const paddedBase64 = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
          const decodedStr = atob(paddedBase64);
          const payload = JSON.parse(decodedStr);
          
          const jwtUserId = payload.userId || payload.id || payload._id || payload.sub;
          if (jwtUserId) {
            setUserIdState(jwtUserId);
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[AdminNotificationProvider] Error decoding JWT:', error);
        }
      }
    }
  }, [status, isAdmin, userIdState, session?.accessToken]);

  const userId = userIdState || session?.user?.id || session?.user?._id || (session as { userId?: string })?.userId;
  
  const {
    addNotification,
    setUnreadCount,
    setNotifications,
    setLoading,
    setError,
  } = useNotificationStore();

  // Handle incoming notifications from socket
  const handleNotification = useCallback((data: INotification) => {
    // Backend trả về type là string (lowercase): 'order', 'comment', etc.
    const notificationType = typeof data.type === 'string' ? data.type.toLowerCase() : data.type;
    
    // Xử lý TẤT CẢ order notifications cho admin:
    // - Đơn hàng mới (ORDER_CREATED)
    // - Thay đổi trạng thái đơn hàng (ORDER_STATUS_CHANGED) - từ customer
    // - Yêu cầu hủy đơn hàng (ORDER_CANCELLED) - từ customer
    // - Đơn hàng hoàn thành (ORDER_COMPLETED)
    const isOrderNotification = 
      notificationType === 'order' || 
      notificationType === NotificationType.ORDER_CREATED || 
      notificationType === NotificationType.ORDER_STATUS_CHANGED ||
      notificationType === NotificationType.ORDER_CANCELLED ||
      notificationType === NotificationType.ORDER_COMPLETED ||
      (data.data?.orderId && notificationType !== NotificationType.SYSTEM_ANNOUNCEMENT);
    
    if (isOrderNotification) {
      addNotification(data);
      
      // Play sound notification (check localStorage setting)
      const soundEnabled = typeof window !== 'undefined' 
        ? localStorage.getItem('adminSoundEnabled') !== 'false'
        : true;
      if (soundEnabled) {
        playNotificationSound(data.data?.priority);
      }
      
      // Show desktop notification (check permission and setting)
      if (typeof window !== 'undefined') {
        const desktopEnabled = localStorage.getItem('desktopNotificationsEnabled') === 'true';
        if (desktopEnabled && 'Notification' in window && Notification.permission === 'granted') {
          try {
            const notification = new Notification(data.title || 'Thông báo đơn hàng', {
              body: data.message || '',
              icon: '/favicon.svg',
              badge: '/favicon.svg',
              tag: data._id || data.id || 'admin-notification',
              requireInteraction: data.data?.priority === 'high',
            });
            
            // Add click handler to navigate to notification link
            notification.onclick = () => {
              window.focus();
              const link = data.link || (data.data?.orderId ? `/admin/orders?orderId=${data.data.orderId}` : '/admin/orders');
              if (typeof window !== 'undefined') {
                window.location.href = link;
              }
              notification.close();
            };
          } catch {
            // Ignore desktop notification errors
          }
        }
      }
      
      // Auto-mark as read if enabled (for admin)
      const autoMarkRead = localStorage.getItem('autoMarkReadEnabled') === 'true';
      if (autoMarkRead && !data.isRead) {
        const notificationId = data._id || data.id;
        if (notificationId) {
          // Mark as read after a short delay (to allow user to see the notification)
          setTimeout(async () => {
            try {
              await NotificationAPI.markAsRead(notificationId);
              useNotificationStore.getState().markAsRead(notificationId);
            } catch (error) {
              if (process.env.NODE_ENV === 'development') {
                console.error('[AdminNotificationProvider] Error auto-marking as read:', error);
              }
            }
          }, 3000); // 3 seconds delay
        }
      }
      
      // Show toast notification với custom style
      toast({
        title: data.title,
        description: data.message,
        duration: data.data?.priority === 'high' ? 10000 : 5000,
        variant: data.data?.priority === 'high' ? 'destructive' : 'default',
      });
    }
  }, [addNotification]);

  // Handle unread count updates from socket
  const handleUnreadCountUpdate = useCallback((count: number) => {
    setUnreadCount(count);
  }, [setUnreadCount]);

  // Setup socket connection - chỉ cần authenticated và isAdmin
  useSocket(
    status === 'authenticated' && isAdmin ? (userId || undefined) : undefined,
    handleNotification,
    handleUnreadCountUpdate
  );

  // Fetch initial notifications when admin is authenticated
  useEffect(() => {
    // Skip nếu đang loading hoặc chưa authenticated
    if (status === 'loading' || status === 'unauthenticated') {
      return;
    }

    if (status === 'authenticated' && isAdmin && userId) {
      const fetchNotifications = async () => {
        try {
          setLoading(true);
          setError(null);

          // Fetch notifications - chỉ lấy order notifications cho admin (dùng 'order' lowercase theo API docs)
          const [notificationsRes, unreadCountRes] = await Promise.all([
            NotificationAPI.getNotifications({ 
              page: 1, 
              limit: 20,
              type: 'order' // Backend dùng lowercase 'order'
            }),
            NotificationAPI.getUnreadCount(),
          ]);

          if (notificationsRes.success) {
            // Filter lấy TẤT CẢ order notifications (không filter theo priority hay totalAmount)
            const orderNotifications = notificationsRes.data.notifications.filter(n => {
              const type = typeof n.type === 'string' ? n.type.toLowerCase() : n.type;
              return type === 'order' ||
                     type === NotificationType.ORDER_CREATED || 
                     type === NotificationType.ORDER_STATUS_CHANGED ||
                     type === NotificationType.ORDER_CANCELLED ||
                     type === NotificationType.ORDER_COMPLETED ||
                     (n.data?.orderId && type !== NotificationType.SYSTEM_ANNOUNCEMENT);
            });
            setNotifications(orderNotifications);
          }

          if (unreadCountRes.success) {
            setUnreadCount(unreadCountRes.data.count);
          }
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('[AdminNotificationProvider] Error fetching admin notifications:', error);
          }
          setError('Không thể tải thông báo');
        } finally {
          setLoading(false);
        }
      };

      fetchNotifications();
    }
  }, [status, userId, isAdmin, setNotifications, setUnreadCount, setLoading, setError]);

  return <>{children}</>;
}

