// Service Worker for Browser Push Notifications
self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push notification received');
  
  let notificationData = {
    title: 'E-COM Notification',
    body: 'You have a new notification',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    data: {}
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        title: data.title || notificationData.title,
        body: data.message || data.body || notificationData.body,
        icon: data.icon || '/favicon.svg',
        badge: '/favicon.svg',
        data: {
          url: data.link || data.data?.link || '/account/notification',
          orderId: data.data?.orderId,
          notificationId: data._id || data.id,
          ...data.data
        },
        tag: data._id || data.id || 'notification',
        requireInteraction: data.data?.priority === 'high',
        vibrate: data.data?.priority === 'high' ? [200, 100, 200] : [200],
        actions: data.data?.orderId ? [
          {
            action: 'view',
            title: 'Xem chi tiết',
            icon: '/favicon.svg'
          },
          {
            action: 'dismiss',
            title: 'Đóng'
          }
        ] : []
      };
    } catch (e) {
      console.error('[Service Worker] Error parsing push data:', e);
    }
  }

  const promiseChain = self.registration.showNotification(notificationData.title, {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    data: notificationData.data,
    tag: notificationData.tag,
    requireInteraction: notificationData.requireInteraction,
    vibrate: notificationData.vibrate,
    actions: notificationData.actions,
    silent: false
  });

  event.waitUntil(promiseChain);
});

// Handle notification click
self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification clicked:', event.notification.data);
  
  event.notification.close();

  // Determine URL to open
  let urlToOpen = '/account/notification';
  
  if (event.notification.data?.url) {
    urlToOpen = event.notification.data.url;
  } else if (event.notification.data?.orderId) {
    // Determine if admin or customer based on current page or use orderId
    urlToOpen = `/admin/orders?orderId=${event.notification.data.orderId}`;
  }

  // Handle action clicks
  if (event.action === 'view' && event.notification.data?.orderId) {
    urlToOpen = `/admin/orders?orderId=${event.notification.data.orderId}`;
  } else if (event.action === 'dismiss') {
    // Mark as read via API if notificationId exists
    if (event.notification.data?.notificationId) {
      fetch('/api/notification/mark-as-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationId: event.notification.data.notificationId
        })
      }).catch(err => console.error('Error marking notification as read:', err));
    }
    return;
  }

  // Open or focus window
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(function(clientList) {
      // Check if there's already a window/tab open with the target URL
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If no matching window, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Handle notification close
self.addEventListener('notificationclose', function(event) {
  console.log('[Service Worker] Notification closed:', event.notification.tag);
});

