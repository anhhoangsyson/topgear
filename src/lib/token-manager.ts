import { ApiClient } from './api-client';

export class TokenManager {
  private static accessToken: string | null = null;

  static async getAccessToken(): Promise<string | null> {
    // Cache token để tránh call API nhiều lần
    if (this.accessToken) {
      return this.accessToken;
    }

    try {
      const response = await ApiClient.callNextApi<{ accessToken: string }>('/user/get-access-token');
      this.accessToken = response.accessToken;
      return this.accessToken;
    } catch {
      return null;
    }
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