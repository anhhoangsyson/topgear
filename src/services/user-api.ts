import { TokenManager } from '@/lib/token-manager';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  // ... other fields
}

export class UserApi {
  static async getProfile(): Promise<UserProfile> {
    return TokenManager.callWithAuth<UserProfile>('/user');
  }

  static async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    return TokenManager.callWithAuth<UserProfile>('/user', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
  
}