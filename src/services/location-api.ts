import { TokenManager } from '../lib/token-manager';

export interface LocationData {
  _id: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  isDefault: boolean;
}

export class LocationApi {
  async getLocations(): Promise<LocationData[]> {
    return TokenManager.callWithAuth<LocationData[]>('/user/location');
  }

  static async addLocation(locationData: Omit<LocationData, '_id'>): Promise<LocationData> {
    // api nay goi den http:localhost:3000/api/v1/location
    console.log('lct in location-api.ts', locationData);
    
    return TokenManager.callWithAuth<LocationData>('/location', {
      method: 'POST',
      body: JSON.stringify(locationData),
    });
  }

   async deleteLocation(id: string): Promise<void> {
    return TokenManager.callWithAuth<void>(`/user/location/${id}`, {
      method: 'DELETE',
    });
  }
}