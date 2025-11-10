'use client';

import React, { useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useSocket } from '@/hooks/use-socket';
import { useNotificationStore } from '@/store/notificationStore';
import { NotificationAPI } from '@/services/notification-api';
import { INotification, NotificationType } from '@/types/notification';
import { toast } from '@/hooks/use-toast';

interface NotificationProviderProps {
  children: React.ReactNode;
}

export default function NotificationProvider({ children }: NotificationProviderProps) {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === 'admin';
  
  // Lấy userId từ session - nhưng cần đảm bảo đây là MongoDB _id từ backend, không phải provider ID
  // Nếu không có hoặc có vẻ là provider ID (như Facebook ID), decode từ JWT
  const sessionUserId = session?.user?.id || session?.user?._id || (session as { userId?: string })?.userId;
  
  // Kiểm tra xem có phải là MongoDB ObjectId format không (24 chars hex)
  // Hoặc decode từ JWT nếu có accessToken
  const [userId, setUserIdState] = React.useState<string | undefined>(sessionUserId);
  
  // Decode từ JWT nếu userId không có hoặc có vẻ không phải MongoDB _id
  // NOTE: Chỉ decode cho customer (không phải admin) vì admin dùng AdminNotificationProvider
  useEffect(() => {
    if (status === 'authenticated') {
      // Chỉ decode cho customer, không phải admin
      if (!isAdmin) {
        // Nếu không có userId hoặc userId có vẻ là provider ID (như Facebook ID: all digits, length < 20)
        const isProviderId = userId && /^\d+$/.test(userId) && userId.length < 20;
        
        if (!userId || isProviderId) {
          if (session?.accessToken) {
            try {
              const parts = session.accessToken.split('.');
              if (parts.length === 3) {
                const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
                const paddedBase64 = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
                const decodedStr = atob(paddedBase64);
                const payload = JSON.parse(decodedStr);
                
                // Ưu tiên _id (MongoDB _id từ backend)
                const jwtUserId = payload._id || payload.userId || payload.id || payload.sub;
                if (jwtUserId) {
                  setUserIdState(jwtUserId);
                }
              }
            } catch (error) {
              if (process.env.NODE_ENV === 'development') {
                console.error('[NotificationProvider] Error decoding JWT:', error);
              }
            }
          }
        }
      }
    }
  }, [status, isAdmin, session?.accessToken, userId, session?.user?.role]);
  
  const {
    addNotification,
    setUnreadCount,
    setNotifications,
    setLoading,
    setError,
  } = useNotificationStore();

  // Handle incoming notifications from socket - useCallback để stable
  const handleNotification = useCallback((data: INotification) => {
    const notificationType = typeof data.type === 'string' ? data.type.toLowerCase() : data.type;
    
    // Skip nếu là admin (admin sẽ dùng AdminNotificationProvider)
    if (isAdmin) {
      return;
    }
    
    // Xử lý TẤT CẢ order-related notifications cho customer:
    // - Đơn hàng mới (ORDER_CREATED)
    // - Thay đổi trạng thái đơn hàng (ORDER_STATUS_CHANGED) - từ admin
    // - Yêu cầu hủy đơn hàng (ORDER_CANCELLED)
    // - Đơn hàng hoàn thành (ORDER_COMPLETED)
    // - Thanh toán (PAYMENT_SUCCESS, PAYMENT_FAILED)
    const isOrderNotification = 
      notificationType === 'order' || 
      notificationType === 'order_created' ||
      notificationType === 'order_status_changed' ||
      notificationType === 'order_completed' ||
      notificationType === 'order_cancelled' ||
      notificationType === 'payment_success' ||
      notificationType === 'payment_failed' ||
      notificationType === NotificationType.ORDER_CREATED || 
      notificationType === NotificationType.ORDER_STATUS_CHANGED ||
      notificationType === NotificationType.ORDER_CANCELLED ||
      notificationType === NotificationType.ORDER_COMPLETED ||
      notificationType === NotificationType.PAYMENT_SUCCESS ||
      notificationType === NotificationType.PAYMENT_FAILED ||
      (data.data?.orderId && notificationType !== NotificationType.SYSTEM_ANNOUNCEMENT);
    
    // Chỉ xử lý order-related notifications hoặc các notification khác (voucher, product, etc.)
    if (!isOrderNotification && !data.data?.voucherId && !data.data?.productId) {
      return;
    }
    
    // Add notification to store (will update unreadCount automatically)
    addNotification(data);
    
    // Play notification sound (check localStorage setting)
    if (typeof window !== 'undefined') {
      const soundEnabled = localStorage.getItem('notificationSoundEnabled') !== 'false';
      
      if (soundEnabled && 'Audio' in window) {
        try {
          const audio = new Audio('/notification.mp3');
          audio.volume = 0.5;
          audio.play().catch((err) => {
            // If audio file doesn't exist, fallback to system beep
            if (err.name !== 'NotAllowedError' && err.name !== 'NotSupportedError') {
              // Try fallback beep sound if file doesn't exist
              try {
                const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
                const audioContext = new AudioContextClass();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.frequency.value = 800;
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
              } catch {
                // Ignore fallback errors
              }
            }
          });
        } catch {
          // Ignore audio errors
        }
      }
      
      // Show desktop notification (check permission and setting)
      const desktopEnabled = localStorage.getItem('desktopNotificationsEnabled') === 'true';
      if (desktopEnabled && 'Notification' in window && Notification.permission === 'granted') {
        try {
          const notification = new Notification(data.title || 'Thông báo mới', {
            body: data.message || '',
            icon: '/favicon.svg',
            badge: '/favicon.svg',
            tag: data._id || data.id || 'notification',
            requireInteraction: data.data?.priority === 'high',
          });
          
          // Add click handler to navigate to notification link
          notification.onclick = () => {
            window.focus();
            const link = data.link || (data.data?.orderId ? `/account/orders/${data.data.orderId}` : '/account/notification');
            if (typeof window !== 'undefined') {
              window.location.href = link;
            }
            notification.close();
          };
        } catch (e) {
          // Ignore desktop notification errors
        }
      }
      
      // Auto-mark as read if enabled
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
                console.error('[NotificationProvider] Error auto-marking as read:', error);
              }
            }
          }, 3000); // 3 seconds delay
        }
      }
    }
    
    // Show toast
    toast({
      title: data.title || 'Thông báo mới',
      description: data.message || '',
      duration: 6000,
      variant: data.data?.priority === 'high' ? 'destructive' : 'default',
    });
  }, [addNotification, isAdmin]);

  // Handle unread count updates from socket - useCallback để stable
  const handleUnreadCountUpdate = useCallback((count: number) => {
    // Skip nếu là admin
    if (isAdmin) return;
    
    // Unread count updated from socket
    setUnreadCount(count);
  }, [setUnreadCount, isAdmin]);


  // Fetch initial notifications when user is authenticated
  useEffect(() => {
    // Skip nếu đang loading hoặc chưa authenticated
    if (status === 'loading' || status === 'unauthenticated') {
      return;
    }

    if (status === 'authenticated' && userId && !isAdmin) {
      const fetchNotifications = async () => {
        try {
          setLoading(true);
          setError(null);

          // Fetch notifications
          const [notificationsRes, unreadCountRes] = await Promise.all([
            NotificationAPI.getNotifications({ page: 1, limit: 20 }),
            NotificationAPI.getUnreadCount(),
          ]);

          if (notificationsRes.success) {
            const notifications = notificationsRes.data.notifications || [];
            const calculatedUnreadCount = notifications.filter((n: INotification) => !n.isRead).length;
            setNotifications(notifications);
            
            // Set unread count từ notifications nếu API không trả về
            if (calculatedUnreadCount > 0) {
              setUnreadCount(calculatedUnreadCount);
            }
          }

          if (unreadCountRes.success) {
            const apiUnreadCount = unreadCountRes.data.count || 0;
            setUnreadCount(apiUnreadCount);
          } else {
            // Fallback: Calculate from notifications if API fails
            if (notificationsRes.success && notificationsRes.data.notifications) {
              const fallbackCount = notificationsRes.data.notifications.filter((n: INotification) => !n.isRead).length;
              setUnreadCount(fallbackCount);
            }
          }
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('[NotificationProvider] Error fetching notifications:', error);
          }
          setError('Không thể tải thông báo');
        } finally {
          setLoading(false);
        }
      };

      fetchNotifications();
    }
  }, [status, userId, setNotifications, setUnreadCount, setLoading, setError, isAdmin]);

  // Setup socket connection - chỉ cho customer (không phải admin)
  useSocket(
    status === 'authenticated' && !isAdmin && userId ? userId : undefined,
    handleNotification,
    handleUnreadCountUpdate
  );

  return <>{children}</>;
}

