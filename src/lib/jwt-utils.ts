/**
 * JWT Utilities - Decode JWT token để lấy userId
 * Không verify signature, chỉ decode payload (client-side safe)
 */

export interface JWTPayload {
  userId?: string;
  id?: string;
  _id?: string;
  sub?: string; // Standard JWT subject field
  email?: string;
  role?: string;
  [key: string]: any;
}

/**
 * Decode JWT token without verification (client-side only)
 * JWT có format: header.payload.signature
 * Works in browser environment
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    // JWT format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('[JWT] Invalid token format');
      return null;
    }

    // Decode payload (base64url)
    const payload = parts[1];
    
    // Base64URL decode - browser compatible
    // Replace URL-safe characters
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    
    // Add padding if needed
    const paddedBase64 = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    
    // Browser-compatible base64 decode using atob
    const decodedStr = atob(paddedBase64);
    
    // Parse JSON
    const decoded = JSON.parse(decodedStr) as JWTPayload;

    return decoded;
  } catch (error) {
    console.error('[JWT] Error decoding token:', error);
    return null;
  }
}

/**
 * Extract userId from JWT token
 * Tự động thử nhiều field names: userId, id, _id, sub
 */
export function getUserIdFromToken(token: string): string | null {
  const payload = decodeJWT(token);
  if (!payload) {
    console.warn('[JWT] Failed to decode token payload');
    return null;
  }

  // Debug: Log toàn bộ payload để xem có gì
  console.log('[JWT] Full payload:', payload);
  console.log('[JWT] Payload keys:', Object.keys(payload));

  // Thử các field names phổ biến
  const userId = 
    payload.userId ||
    payload.id ||
    payload._id ||
    payload.sub ||
    payload.user?.id ||
    payload.user?._id ||
    payload.data?.userId ||
    payload.data?.id ||
    payload.data?._id ||
    null;

  if (userId) {
    console.log('[JWT] ✅ Found userId:', userId);
  } else {
    console.warn('[JWT] ⚠️ userId not found in payload. Available fields:', Object.keys(payload));
  }

  return userId;
}

/**
 * Get userId from NextAuth session access token
 */
export async function getUserIdFromSession(): Promise<string | null> {
  try {
    console.log('[JWT] Fetching session from NextAuth...');
    
    // Fetch session từ NextAuth
    const response = await fetch('/api/auth/session');
    if (!response.ok) {
      console.error('[JWT] Failed to fetch session:', response.status);
      return null;
    }

    const session = await response.json();
    console.log('[JWT] Session data:', {
      hasAccessToken: !!session?.accessToken,
      hasUser: !!session?.user,
      userKeys: session?.user ? Object.keys(session.user) : [],
      sessionKeys: Object.keys(session || {})
    });

    const accessToken = session?.accessToken;

    if (!accessToken) {
      console.warn('[JWT] ⚠️ No access token in session');
      // Check if user.id exists in session directly
      if (session?.user?.id) {
        console.log('[JWT] ✅ Found userId in session.user.id:', session.user.id);
        return session.user.id;
      }
      return null;
    }

    console.log('[JWT] Access token exists, length:', accessToken.length);
    console.log('[JWT] Token preview (first 50 chars):', accessToken.substring(0, 50) + '...');

    // Decode JWT để lấy userId
    const userId = getUserIdFromToken(accessToken);
    
    if (userId) {
      console.log('[JWT] ✅ Extracted userId from JWT:', userId);
    } else {
      console.warn('[JWT] ⚠️ userId not found in JWT payload');
    }

    return userId;
  } catch (error) {
    console.error('[JWT] ❌ Error getting userId from session:', error);
    return null;
  }
}

