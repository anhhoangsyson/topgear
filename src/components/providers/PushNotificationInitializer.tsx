'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { initializePushNotifications } from '@/lib/push-notification';

/**
 * Component to initialize browser push notifications
 * Should be rendered once in the app layout
 */
export default function PushNotificationInitializer() {
  const { status } = useSession();

  useEffect(() => {
    // Only initialize when user is authenticated
    if (status === 'authenticated') {
      // Initialize push notifications
      initializePushNotifications().catch(err => {
        console.error('[PushNotificationInitializer] Failed to initialize:', err);
      });
    }
  }, [status]);

  return null;
}

