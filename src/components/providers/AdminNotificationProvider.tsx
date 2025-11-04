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
    const audio = new Audio();
    
    // Simple beep sound - có thể thay bằng file thật
    // audio.src = priority === 'high' 
    //   ? '/urgent-notification.mp3' 
    //   : '/admin-notification.mp3';
    
    // Fallback: Tạo simple beep sound programmatically
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
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
  } catch (error) {
    // Ignore audio errors (user might have blocked autoplay)
    console.log('Audio play error:', error);
  }
};

export default function AdminNotificationProvider({ children }: AdminNotificationProviderProps) {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === 'admin';
  
  // Lấy userId từ session - nếu không có thì decode từ JWT token
  const [userIdState, setUserIdState] = React.useState<string | undefined>(
    session?.user?.id || (session?.user as any)?._id || (session as any)?.userId
  );

  // Debug logging với full session data
  useEffect(() => {
    if (status === 'authenticated' && isAdmin) {
      console.log('[AdminNotificationProvider] 🔍 Session debug:', {
        userId: userIdState,
        sessionUserId: session?.user?.id,
        sessionUserKeys: session?.user ? Object.keys(session.user) : [],
        sessionKeys: session ? Object.keys(session) : [],
        hasAccessToken: !!session?.accessToken,
        isAdmin,
        role: session?.user?.role,
        status
      });
    }
  }, [status, userIdState, isAdmin, session]);

  // Fetch userId từ JWT nếu không có trong session
  useEffect(() => {
    if (status === 'authenticated' && isAdmin && !userIdState && session?.accessToken) {
      console.log('[AdminNotificationProvider] 🔍 Attempting to decode userId from JWT...');
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
            console.log('[AdminNotificationProvider] ✅ Got userId from JWT decode:', jwtUserId);
            setUserIdState(jwtUserId);
          } else {
            console.warn('[AdminNotificationProvider] ⚠️ No userId in JWT payload. Available keys:', Object.keys(payload));
          }
        }
      } catch (error) {
        console.error('[AdminNotificationProvider] ❌ Error decoding JWT:', error);
      }
    }
  }, [status, isAdmin, userIdState, session?.accessToken]);

  const userId = userIdState || session?.user?.id || (session?.user as any)?._id || (session as any)?.userId;
  
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
    
    // Chỉ xử lý order notifications cho admin
    const isOrderNotification = 
      notificationType === 'order' || 
      notificationType === NotificationType.ORDER_CREATED || 
      notificationType === NotificationType.ORDER_CANCELLED;
    
    if (isOrderNotification) {
      addNotification(data);
      
      // Play sound notification
      playNotificationSound(data.data?.priority);
      
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
          console.log('[AdminNotificationProvider] Fetching admin notifications...');
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

          console.log('[AdminNotificationProvider] Notifications response:', notificationsRes);
          console.log('[AdminNotificationProvider] Unread count response:', unreadCountRes);

          if (notificationsRes.success) {
            // Filter chỉ lấy order notifications
            const orderNotifications = notificationsRes.data.notifications.filter(
              n => n.type === NotificationType.ORDER_CREATED || 
                   n.type === NotificationType.ORDER_CANCELLED
            );
            console.log('[AdminNotificationProvider] Setting order notifications:', orderNotifications.length);
            setNotifications(orderNotifications);
          }

          if (unreadCountRes.success) {
            console.log('[AdminNotificationProvider] Setting unread count:', unreadCountRes.data.count);
            setUnreadCount(unreadCountRes.data.count);
          }
        } catch (error) {
          console.error('[AdminNotificationProvider] ❌ Error fetching admin notifications:', error);
          setError('Không thể tải thông báo');
        } finally {
          setLoading(false);
        }
      };

      fetchNotifications();
    } else if (status === 'authenticated' && isAdmin && !userId) {
      console.warn('[AdminNotificationProvider] ⚠️ Authenticated admin but no userId. Fetching userId...');
      // Đã có logic fetch userId ở useEffect trên
    }
    // Không log nếu status là loading hoặc unauthenticated (normal states)
  }, [status, userId, isAdmin, setNotifications, setUnreadCount, setLoading, setError]);

  return <>{children}</>;
}

