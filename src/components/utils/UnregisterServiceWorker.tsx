'use client';

import { useEffect, useState } from 'react';

/**
 * Component to unregister any existing service workers
 * This is a one-time cleanup to remove old service workers
 */
export default function UnregisterServiceWorker() {
  const [shouldReload, setShouldReload] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Unregister all service workers immediately
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        if (registrations.length > 0) {
          const unregisterPromises = registrations.map((registration) => {
            return registration.unregister().then((success) => {
              return success;
            }).catch((error) => {
              if (process.env.NODE_ENV === 'development') {
                console.error('[UnregisterServiceWorker] Error unregistering:', error);
              }
              return false;
            });
          });
          
          Promise.all(unregisterPromises).then((results) => {
            const successCount = results.filter(r => r).length;
            if (successCount > 0) {
              // Only reload if we actually unregistered something
              setShouldReload(true);
            }
          });
        }
      }).catch((error) => {
        if (process.env.NODE_ENV === 'development') {
          console.error('[UnregisterServiceWorker] Error getting registrations:', error);
        }
      });
    }
  }, []);

  // Reload after unregistering (only once)
  useEffect(() => {
    if (shouldReload) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [shouldReload]);

  return null;
}

