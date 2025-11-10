import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

/**
 * Hook để lấy userId từ session với fallback decode từ JWT
 */
export function useUserId(): string | null {
  const { data: session } = useSession();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      setUserId(null);
      return;
    }

    // Priority 1: Try from session.user directly (most reliable)
    let sessionUserId = session.user?._id || session.user?.userId || session.user?.id;

    // Priority 2: If no userId found or it looks like a provider ID (e.g., Facebook ID), decode from JWT
    if (!sessionUserId || (sessionUserId && /^\d+$/.test(sessionUserId) && sessionUserId.length < 20)) {
      if (session.accessToken) {
        try {
          const parts = session.accessToken.split('.');
          if (parts.length === 3) {
            // Decode base64
            const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
            const paddedBase64 = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
            const decodedStr = atob(paddedBase64);
            const payload = JSON.parse(decodedStr);
            
            // Try multiple fields from JWT payload
            const jwtUserId = payload._id || payload.userId || payload.id || payload.sub;
            if (jwtUserId) {
              sessionUserId = jwtUserId;
            }
          }
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('[useUserId] Error decoding JWT:', error);
            console.log('[useUserId] Session data:', {
              hasAccessToken: !!session.accessToken,
              userKeys: session.user ? Object.keys(session.user) : [],
              userId: session.user?._id || session.user?.userId || session.user?.id,
            });
          }
        }
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[useUserId] No accessToken in session');
        }
      }
    }

    // Only set if we have a valid MongoDB ObjectId (24 hex characters)
    if (sessionUserId && /^[a-f\d]{24}$/i.test(sessionUserId)) {
      setUserId(sessionUserId);
    } else {
      setUserId(null);
      if (process.env.NODE_ENV === 'development' && session) {
        console.warn('[useUserId] Invalid userId format:', sessionUserId);
      }
    }
  }, [session]);

  return userId;
}

