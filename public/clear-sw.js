// Clear Service Worker immediately - must run before any other scripts
// This script MUST be loaded synchronously (no async/defer)
(function() {
  'use strict';
  
  if ('serviceWorker' in navigator) {
    // Unregister all service workers immediately
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      if (registrations.length > 0) {
        console.log('[clear-sw] Found ' + registrations.length + ' service worker(s), unregistering...');
        var unregisterPromises = [];
        for (var i = 0; i < registrations.length; i++) {
          unregisterPromises.push(registrations[i].unregister());
        }
        Promise.all(unregisterPromises).then(function() {
          console.log('[clear-sw] All service workers unregistered');
          // Clear cache
          if ('caches' in window) {
            caches.keys().then(function(names) {
              names.forEach(function(name) {
                caches.delete(name);
              });
            });
          }
          // Reload page to ensure clean state
          if (window.location.pathname !== '/unregister-sw.html') {
            window.location.reload();
          }
        }).catch(function(error) {
          console.error('[clear-sw] Error unregistering:', error);
        });
      } else {
        console.log('[clear-sw] No service workers found');
      }
    }).catch(function(error) {
      console.error('[clear-sw] Error getting registrations:', error);
    });

    // Also try to unregister controller immediately
    if (navigator.serviceWorker.controller) {
      console.log('[clear-sw] Service worker controller active, attempting to bypass...');
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
    }
  }
})();

