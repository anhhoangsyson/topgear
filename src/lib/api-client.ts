import { apiCall } from "./api-utils";
// api-utils.ts - Enhanced for your architecture
export class ApiClient {
  // Gọi Next.js API routes (có accessToken handling) locahost:3001/api/...
  static async callNextApi<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`;

    return apiCall<T>(url, {
      credentials: 'include', // Để gửi cookies
      ...options,
    });
  }

  // Gọi trực tiếp Express.js backend (khi không cần accessToken) locahost:3000/api/v1/...
  static async callExpressApi<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const baseUrl = process.env.NEXT_PUBLIC_EXPRESS_API_URL;
    const url = `${baseUrl}${endpoint}`;

    return apiCall<T>(url, options);
  }
}