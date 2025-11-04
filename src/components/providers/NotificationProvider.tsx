'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useSocket } from '@/hooks/use-socket';
import { useNotificationStore } from '@/store/notificationStore';
import { NotificationAPI } from '@/services/notification-api';
import { INotification } from '@/types/notification';
import { toast } from '@/hooks/use-toast';

interface NotificationProviderProps {
  children: React.ReactNode;
}

export default function NotificationProvider({ children }: NotificationProviderProps) {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === 'admin';
  
  // Lấy userId từ session - nhưng cần đảm bảo đây là MongoDB _id từ backend, không phải provider ID
  // Nếu không có hoặc có vẻ là provider ID (như Facebook ID), decode từ JWT
  const sessionUserId = session?.user?.id || (session?.user as any)?._id || (session as any)?.userId;
  
  // Kiểm tra xem có phải là MongoDB ObjectId format không (24 chars hex)
  // Hoặc decode từ JWT nếu có accessToken
  const [userId, setUserIdState] = React.useState<string | undefined>(sessionUserId);
  
  // Decode từ JWT nếu userId không có hoặc có vẻ không phải MongoDB _id
  // NOTE: Chỉ decode cho customer (không phải admin) vì admin dùng AdminNotificationProvider
  useEffect(() => {
    if (status === 'authenticated') {
      console.log('[NotificationProvider] 🔍 Checking userId:', {
        currentUserId: userId,
        isAdmin,
        role: session?.user?.role,
        hasAccessToken: !!session?.accessToken,
        sessionUser: session?.user,
        sessionUserKeys: session?.user ? Object.keys(session.user) : []
      });
      
      // Chỉ decode cho customer, không phải admin
      if (!isAdmin) {
        // Nếu không có userId hoặc userId có vẻ là provider ID (như Facebook ID: all digits, length < 20)
        const isProviderId = userId && /^\d+$/.test(userId) && userId.length < 20;
        
        if (!userId || isProviderId) {
          if (session?.accessToken) {
            console.log('[NotificationProvider] 🔍 Decoding userId from JWT (current:', userId, 'isProviderId:', isProviderId, ')');
            try {
              const parts = session.accessToken.split('.');
              if (parts.length === 3) {
                const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
                const paddedBase64 = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
                const decodedStr = atob(paddedBase64);
                const payload = JSON.parse(decodedStr);
                
                console.log('[NotificationProvider] 📊 JWT payload keys:', Object.keys(payload));
                console.log('[NotificationProvider] 📊 JWT payload sample:', {
                  _id: payload._id,
                  userId: payload.userId,
                  id: payload.id,
                  sub: payload.sub
                });
                
                // Ưu tiên _id (MongoDB _id từ backend)
                const jwtUserId = payload._id || payload.userId || payload.id || payload.sub;
                if (jwtUserId) {
                  console.log('[NotificationProvider] ✅✅✅ Got MongoDB userId from JWT:', jwtUserId);
                  setUserIdState(jwtUserId);
                } else {
                  console.warn('[NotificationProvider] ⚠️ No userId in JWT payload. Full payload:', payload);
                }
              } else {
                console.error('[NotificationProvider] ❌ Invalid JWT format, parts:', parts.length);
              }
            } catch (error) {
              console.error('[NotificationProvider] ❌ Error decoding JWT:', error);
            }
          } else {
            console.warn('[NotificationProvider] ⚠️ No accessToken in session to decode userId from');
          }
        } else {
          console.log('[NotificationProvider] ✅ Using userId from session:', userId, '(appears to be MongoDB _id)');
        }
      } else {
        console.log('[NotificationProvider] ⏭️ Admin user detected (role:', session?.user?.role, '), skipping userId decode (will use AdminNotificationProvider)');
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
    console.log('[NotificationProvider] 🔔🔔🔔 handleNotification CALLED:', {
      isAdmin,
      hasData: !!data,
      notificationId: data._id || data.id,
      type: data.type,
      title: data.title,
      isRead: data.isRead,
      fullData: data
    });
    
    // Skip nếu là admin (admin sẽ dùng AdminNotificationProvider)
    if (isAdmin) {
      console.log('[NotificationProvider] ⏭️ Skipping - user is admin, will use AdminNotificationProvider');
      return;
    }
    
    console.log('[NotificationProvider] ✅ Processing notification for customer user');
    
    // Add notification to store (will update unreadCount automatically)
    console.log('[NotificationProvider] 📦 Adding notification to store...');
    addNotification(data);
    
    // Get updated unread count after adding (wait a bit for state update)
    setTimeout(() => {
      const updatedUnreadCount = useNotificationStore.getState().unreadCount;
      console.log('[NotificationProvider] ✅ Notification added to store. Unread count:', updatedUnreadCount);
    }, 100);
    
    // Show toast notification with sound
    console.log('[NotificationProvider] 🔔 Showing toast notification...');
    try {
      // Play notification sound (nếu browser hỗ trợ)
      if (typeof window !== 'undefined' && 'Audio' in window) {
        try {
          const audio = new Audio('/notification.mp3');
          audio.volume = 0.5;
          audio.play().catch((err) => {
            console.log('[NotificationProvider] ⚠️ Audio play failed (normal if user has not interacted):', err);
          });
        } catch (e) {
          console.log('[NotificationProvider] ⚠️ Audio error (ignored):', e);
        }
      }
    } catch (e) {
      console.log('[NotificationProvider] ⚠️ Audio setup error (ignored):', e);
    }
    
    // Show toast
    try {
      toast({
        title: data.title || 'Thông báo mới',
        description: data.message || '',
        duration: 6000,
        variant: data.data?.priority === 'high' ? 'destructive' : 'default',
      });
      console.log('[NotificationProvider] ✅✅✅ Toast notification SHOWN successfully');
    } catch (error) {
      console.error('[NotificationProvider] ❌❌❌ Error showing toast:', error);
    }
  }, [addNotification, isAdmin]);

  // Handle unread count updates from socket - useCallback để stable
  const handleUnreadCountUpdate = useCallback((count: number) => {
    // Skip nếu là admin
    if (isAdmin) return;
    
    // Unread count updated from socket
    setUnreadCount(count);
  }, [setUnreadCount, isAdmin]);

  // Debug logging - chỉ log khi đã authenticated
  useEffect(() => {
    if (status === 'loading') {
      console.log('[NotificationProvider] ⏳ Session loading...');
      return;
    }
    
    if (status === 'unauthenticated') {
      console.log('[NotificationProvider] ⚠️ Not authenticated (user not logged in)');
      return;
    }

    if (status === 'authenticated' && !isAdmin) {
      console.log('[NotificationProvider] ✅ User authenticated:', {
        userId,
        sessionUser: session?.user,
        sessionUserKeys: session?.user ? Object.keys(session.user) : [],
        sessionKeys: session ? Object.keys(session) : [],
        status,
        hasUserId: !!userId,
        userIdValue: userId
      });
      
      // Nếu không có userId, log để debug
      if (!userId) {
        console.error('[NotificationProvider] ❌❌❌ userId is UNDEFINED!');
        // Safe log session (tránh circular reference errors)
        console.error('[NotificationProvider] Session data:', {
          hasSession: !!session,
          status: status,
          user: session?.user ? {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            role: session.user.role,
            profileCompleted: session.user.profileCompleted,
            keys: Object.keys(session.user)
          } : null,
          hasAccessToken: !!session?.accessToken,
          accessTokenLength: session?.accessToken?.length,
          provider: session?.provider,
          sessionKeys: session ? Object.keys(session) : []
        });
      }
    }
  }, [status, userId, session, isAdmin]);

  // Setup socket connection - chỉ cần authenticated và không phải admin
  const shouldConnectSocket = status === 'authenticated' && !isAdmin;
  const socketUserId = shouldConnectSocket ? (userId || 'connect-now') : undefined;
  
  useSocket(
    socketUserId,
    handleNotification,
    handleUnreadCountUpdate
  );

  // Fetch initial notifications when user is authenticated
  useEffect(() => {
    // Skip nếu đang loading hoặc chưa authenticated
    if (status === 'loading' || status === 'unauthenticated') {
      return;
    }

    if (status === 'authenticated' && userId && !isAdmin) {
      const fetchNotifications = async () => {
        try {
          console.log('[NotificationProvider] Fetching initial notifications...');
          setLoading(true);
          setError(null);

          // Fetch notifications
          const [notificationsRes, unreadCountRes] = await Promise.all([
            NotificationAPI.getNotifications({ page: 1, limit: 20 }),
            NotificationAPI.getUnreadCount(),
          ]);

          console.log('[NotificationProvider] Notifications response:', notificationsRes);
          console.log('[NotificationProvider] Unread count response:', unreadCountRes);

          if (notificationsRes.success) {
            const notifications = notificationsRes.data.notifications || [];
            const calculatedUnreadCount = notifications.filter((n: INotification) => !n.isRead).length;
            console.log('[NotificationProvider] Setting notifications:', notifications.length);
            console.log('[NotificationProvider] Calculated unread count from notifications:', calculatedUnreadCount);
            setNotifications(notifications);
            
            // Set unread count từ notifications nếu API không trả về
            if (calculatedUnreadCount > 0) {
              setUnreadCount(calculatedUnreadCount);
            }
          } else {
            console.error('[NotificationProvider] Failed to fetch notifications:', notificationsRes);
          }

          if (unreadCountRes.success) {
            const apiUnreadCount = unreadCountRes.data.count || 0;
            console.log('[NotificationProvider] Setting unread count from API:', apiUnreadCount);
            setUnreadCount(apiUnreadCount);
          } else {
            console.error('[NotificationProvider] Failed to fetch unread count:', unreadCountRes);
            // Fallback: Calculate from notifications if API fails
            if (notificationsRes.success && notificationsRes.data.notifications) {
              const fallbackCount = notificationsRes.data.notifications.filter((n: INotification) => !n.isRead).length;
              console.log('[NotificationProvider] Using fallback unread count:', fallbackCount);
              setUnreadCount(fallbackCount);
            }
          }
        } catch (error) {
          console.error('[NotificationProvider] ❌ Error fetching notifications:', error);
          setError('Không thể tải thông báo');
        } finally {
          setLoading(false);
        }
      };

      fetchNotifications();
    } else if (status === 'authenticated' && !userId) {
      console.warn('[NotificationProvider] ⚠️ Authenticated but no userId. Trying to fetch userId...');
      // Đã có logic fetch userId ở useEffect trên
    }
    // Không log nếu status là loading hoặc unauthenticated (normal states)
  }, [status, userId, setNotifications, setUnreadCount, setLoading, setError, isAdmin]);

  return <>{children}</>;
}

