import { create } from 'zustand';
import { INotification, NotificationType } from '@/types/notification';

interface NotificationState {
  notifications: INotification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setNotifications: (notifications: INotification[]) => void;
  addNotification: (notification: INotification) => void;
    markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  deleteAllRead: () => void;
  setUnreadCount: (count: number) => void;
  incrementUnreadCount: () => void;
  decrementUnreadCount: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  setNotifications: (notifications) => {
    const unreadCount = notifications.filter(n => !n.isRead).length;
    console.log('[NotificationStore] setNotifications called:', {
      totalNotifications: notifications.length,
      unreadCount,
      notificationsSample: notifications.slice(0, 3).map(n => ({ id: n._id || n.id, isRead: n.isRead }))
    });
    set({ notifications, unreadCount });
    
    // Verify sau khi set
    const state = get();
    console.log('[NotificationStore] After setNotifications, store state:', {
      notificationsCount: state.notifications.length,
      unreadCount: state.unreadCount
    });
  },

  addNotification: (notification) => {
    const currentNotifications = get().notifications;
    
    // Normalize notification ID (backend có thể trả về _id hoặc id)
    const notifId = notification._id || notification.id;
    if (!notifId) {
      console.warn('[NotificationStore] Notification without ID:', notification);
      return;
    }
    
    // Check if notification already exists (prevent duplicates)
    const exists = currentNotifications.some(n => 
      (n._id || n.id) === notifId
    );
    if (exists) {
      console.log('[NotificationStore] ⚠️ Notification already exists, skipping:', notifId);
      return;
    }
    
    // Normalize notification để đảm bảo có _id
    const normalizedNotification: INotification = {
      ...notification,
      _id: notifId,
    };
    
    // Add to beginning of array (newest first)
    const newNotifications = [normalizedNotification, ...currentNotifications];
    
    // Update unread count: increment if notification is unread
    const currentUnreadCount = get().unreadCount;
    const newUnreadCount = notification.isRead 
      ? currentUnreadCount 
      : currentUnreadCount + 1;
    
    console.log('[NotificationStore] 📊 Updating unread count:', {
      current: currentUnreadCount,
      new: newUnreadCount,
      notificationIsRead: notification.isRead
    });
    
    set({ notifications: newNotifications, unreadCount: newUnreadCount });
  },

  markAsRead: (notificationId) => {
    const notifications = get().notifications.map(notif => {
      const notifId = notif._id || notif.id;
      if (notifId === notificationId && !notif.isRead) {
        return { ...notif, isRead: true, readAt: new Date().toISOString() };
      }
      return notif;
    });
    
    const unreadCount = Math.max(0, get().unreadCount - 1);
    set({ notifications, unreadCount });
  },

  markAllAsRead: () => {
    const notifications = get().notifications.map(notif => ({
      ...notif,
      isRead: true,
      readAt: notif.readAt || new Date().toISOString()
    }));
    
    set({ notifications, unreadCount: 0 });
  },

  deleteNotification: (notificationId) => {
    const notification = get().notifications.find(n => 
      (n._id || n.id) === notificationId
    );
    const notifications = get().notifications.filter(n => 
      (n._id || n.id) !== notificationId
    );
    const unreadCount = notification && !notification.isRead
      ? Math.max(0, get().unreadCount - 1)
      : get().unreadCount;
    
    set({ notifications, unreadCount });
  },

  deleteAllRead: () => {
    const notifications = get().notifications.filter(n => !n.isRead);
    set({ notifications });
  },

  setUnreadCount: (count) => {
    const finalCount = typeof count === 'number' ? Math.max(0, count) : 0;
    console.log('[NotificationStore] setUnreadCount called:', {
      input: count,
      finalCount,
      type: typeof count
    });
    set({ unreadCount: finalCount });
    
    // Verify sau khi set
    const state = get();
    console.log('[NotificationStore] After setUnreadCount, store state:', {
      unreadCount: state.unreadCount
    });
  },
  
  incrementUnreadCount: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
  
  decrementUnreadCount: () => set((state) => ({ 
    unreadCount: Math.max(0, state.unreadCount - 1) 
  })),

  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),
}));

