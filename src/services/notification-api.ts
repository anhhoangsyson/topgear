import { TokenManager } from "@/lib/token-manager";
import { NotificationResponse, UnreadCountResponse } from "@/types/notification";

export class NotificationAPI {
  /**
   * Get notifications với pagination
   */
  static async getNotifications(params?: {
    page?: number;
    limit?: number;
    type?: string;
    isRead?: boolean;
  }): Promise<NotificationResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.type) queryParams.append("type", params.type);
    if (params?.isRead !== undefined) queryParams.append("isRead", params.isRead.toString());

    const queryString = queryParams.toString();
    const endpoint = `/notifications${queryString ? `?${queryString}` : ""}`;

    return TokenManager.callExpressWithAuth<NotificationResponse>(endpoint, {
      method: "GET",
    });
  }

  /**
   * Get unread count
   */
  static async getUnreadCount(): Promise<UnreadCountResponse> {
    return TokenManager.callExpressWithAuth<UnreadCountResponse>(
      "/notifications/unread-count",
      {
        method: "GET",
      }
    );
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string): Promise<{ success: boolean; message: string }> {
    return TokenManager.callExpressWithAuth<{ success: boolean; message: string }>(
      `/notifications/${notificationId}/read`,
      {
        method: "PATCH",
      }
    );
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(): Promise<{
    success: boolean;
    message: string;
    data: { count: number };
  }> {
    return TokenManager.callExpressWithAuth<{
      success: boolean;
      message: string;
      data: { count: number };
    }>("/notifications/mark-all-read", {
      method: "PATCH",
    });
  }

  /**
   * Delete notification
   */
  static async deleteNotification(notificationId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    return TokenManager.callExpressWithAuth<{ success: boolean; message: string }>(
      `/notifications/${notificationId}`,
      {
        method: "DELETE",
      }
    );
  }

  /**
   * Delete all read notifications
   */
  static async deleteAllRead(): Promise<{
    success: boolean;
    message: string;
    data: { deletedCount: number };
  }> {
    return TokenManager.callExpressWithAuth<{
      success: boolean;
      message: string;
      data: { deletedCount: number };
    }>("/notifications/read", {
      method: "DELETE",
    });
  }
}

