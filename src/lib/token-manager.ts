import { ApiClient } from './api-client';

export class TokenManager {
  private static accessToken: string | null = null;

  /**
   * Get access token với nhiều fallback options:
   * 1. Cache token
   * 2. NextAuth session (client-side)
   * 3. API route (server-side cookie)
   */
  static async getAccessToken(): Promise<string | null> {
    // Cache token để tránh call API nhiều lần
    if (this.accessToken) {
      return this.accessToken;
    }

    // Method 1: Try lấy từ NextAuth session (client-side)
    if (typeof window !== 'undefined') {
      try {
        const sessionResponse = await fetch('/api/auth/session', {
          credentials: 'include',
        });
        
        if (sessionResponse.ok) {
          const session = await sessionResponse.json();
          console.log('[TokenManager] 🔍 Session data:', {
            hasAccessToken: !!session?.accessToken,
            hasUser: !!session?.user,
            provider: session?.provider,
            userKeys: session?.user ? Object.keys(session.user) : [],
            sessionKeys: Object.keys(session || {})
          });
          
          if (session?.accessToken) {
            console.log('[TokenManager] ✅ Got token from NextAuth session, length:', session.accessToken.length);
            this.accessToken = session.accessToken;
            return this.accessToken;
          } else {
            console.warn('[TokenManager] ⚠️ No accessToken in session. Provider:', session?.provider);
          }
        } else {
          console.warn('[TokenManager] ⚠️ Session response not OK:', sessionResponse.status);
        }
      } catch (error) {
        console.warn('[TokenManager] Failed to get token from session:', error);
      }
    }

    // Method 2: Fallback - Call API route để lấy từ cookie (server-side)
    try {
      const response = await ApiClient.callNextApi<{ accessToken: string }>('/user/get-access-token');
      if (response?.accessToken) {
        console.log('[TokenManager] ✅ Got token from API route');
        this.accessToken = response.accessToken;
        return this.accessToken;
      }
    } catch (error) {
      console.warn('[TokenManager] ⚠️ Failed to get token from API route:', error);
      // Clear cache on error để retry next time
      this.accessToken = null;
    }

    return null;
  }

  static clearToken() {
    this.accessToken = null;
  }

  static async callWithAuth<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Sử dụng Next.js API routes - tự động handle auth
    const token = await this.getAccessToken();
    if (!token) {
      throw new Error('Access token is not available');
    }
    // call apoi express be locahost:3000/api/v1
    console.log('Calling Express API with auth:', endpoint, options);
    
    return ApiClient.callExpressApi<T>(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });
  }

  static async callExpressWithAuth<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAccessToken();

    return ApiClient.callExpressApi<T>(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      },
    });
  }
}