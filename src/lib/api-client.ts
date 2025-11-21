import { apiCall } from "./api-utils";
// api-utils.ts cung cấp hàm apiCall: wrapper fetch với xử lý status, json, và lỗi

/**
 * ApiClient: tiện ích gọi API từ frontend
 * - callNextApi: gọi tới route nội bộ của Next.js (`/api/...`) — giữ cookies và session
 * - callExpressApi: gọi trực tiếp tới backend Express (NEXT_PUBLIC_EXPRESS_API_URL)
 *
 * Ghi chú:
 * - Khi cần gửi cookies/session (NextAuth cookie), dùng `callNextApi` (credentials: 'include').
 * - Khi gọi backend trực tiếp (ví dụ upload/3rd-party), dùng `callExpressApi` và set headers phù hợp.
 */
export class ApiClient {
  // Gọi Next.js API routes (ví dụ `/api/user`) — mặc định gửi cookies để NextAuth làm việc
  static async callNextApi<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // đảm bảo endpoint bắt đầu bằng /api
    const url = endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`;

    return apiCall<T>(url, {
      // credentials include để trình duyệt gửi cookie (ví dụ session cookie)
      credentials: 'include',
      ...options,
    });
  }

  // Gọi trực tiếp Express.js backend (sử dụng NEXT_PUBLIC_EXPRESS_API_URL)
  static async callExpressApi<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const baseUrl = process.env.NEXT_PUBLIC_EXPRESS_API_URL;
    const url = `${baseUrl}${endpoint}`;

    // Lưu ý: khi gọi trực tiếp backend, cần quản lý token/headers nếu backend yêu cầu
    return apiCall<T>(url, options);
  }
}