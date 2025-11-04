/**
 * Browser Push Notification Service
 * Handles registration and management of push notifications
 */

export interface PushNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: {
    url?: string;
    orderId?: string;
    notificationId?: string;
    [key: string]: any;
  };
  tag?: string;
  requireInteraction?: boolean;
  vibrate?: number[];
  priority?: 'high' | 'normal';
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('[PushNotification] This browser does not support notifications');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return 'denied';
}

/**
 * Register service worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('[PushNotification] Service Worker not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });
    
    console.log('[PushNotification] Service Worker registered:', registration);
    return registration;
  } catch (error) {
    console.error('[PushNotification] Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Show browser notification
 */
export async function showBrowserNotification(
  options: PushNotificationOptions
): Promise<void> {
  const permission = await requestNotificationPermission();
  
  if (permission !== 'granted') {
    console.warn('[PushNotification] Notification permission not granted');
    return;
  }

  try {
    const notificationOptions: NotificationOptions = {
      body: options.body,
      icon: options.icon || '/favicon.svg',
      badge: options.badge || '/favicon.svg',
      data: options.data || {},
      tag: options.tag,
      requireInteraction: options.requireInteraction || false,
      vibrate: options.vibrate || [200],
      silent: false,
    };

    // Add actions if orderId exists
    if (options.data?.orderId) {
      notificationOptions.actions = [
        {
          action: 'view',
          title: 'Xem chi tiết',
          icon: '/favicon.svg'
        },
        {
          action: 'dismiss',
          title: 'Đóng'
        }
      ];
    }

    const notification = new Notification(options.title, notificationOptions);

    // Handle click
    notification.onclick = (event) => {
      event.preventDefault();
      const url = options.data?.url || '/account/notification';
      window.focus();
      window.open(url, '_blank');
      notification.close();
    };
  } catch (error) {
    console.error('[PushNotification] Error showing notification:', error);
  }
}

/**
 * Initialize push notification service
 */
export async function initializePushNotifications(): Promise<boolean> {
  try {
    // Register service worker
    const registration = await registerServiceWorker();
    if (!registration) {
      return false;
    }

    // Request permission
    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      console.log('[PushNotification] User denied notification permission');
      return false;
    }

    console.log('[PushNotification] Push notifications initialized successfully');
    return true;
  } catch (error) {
    console.error('[PushNotification] Failed to initialize:', error);
    return false;
  }
}

