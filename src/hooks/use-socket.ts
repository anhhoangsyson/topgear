import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { TokenManager } from "@/lib/token-manager";
import { INotification } from "@/types/notification";

/**
 * useSocket hook
 * - Kết nối socket.io khi có `userId` (người dùng đã đăng nhập)
 * - Sử dụng TokenManager để lấy access token và gửi lên server để authenticate
 * - Trả về `socketRef.current` để component có thể dùng trực tiếp nếu cần
 *
 * Lưu ý:
 * - Hook tự manage lifecycle: connect khi mount và disconnect khi unmount hoặc userId thay đổi
 * - Các callback onNotification/onUnreadCountUpdate phải an toàn (catch error bên trong)
 */
export function useSocket(
  userId: string | undefined,
  onNotification: (data: INotification) => void,
  onUnreadCountUpdate?: (count: number) => void
) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Nếu không có userId (hoặc undefined), không connect
    if (!userId) {
      return;
    }
    
    let mounted = true;

    const connectSocket = async () => {
      try {
        // Lấy access token từ TokenManager (có thể lưu ở cookie/localStorage)
        const token = await TokenManager.getAccessToken();
        if (!mounted || !token) {
          // Nếu unmounted hoặc không có token, không tiếp tục
          return;
        }

        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';
        
        // Kết nối tới server socket.io với các tuỳ chọn hợp lý cho reconnect
        const socket = io(socketUrl, {
          transports: ["websocket", "polling"],
          withCredentials: true,
          reconnection: true,
          reconnectionAttempts: 3,
          reconnectionDelay: 2000,
          timeout: 10000,
          autoConnect: true,
        });

        socketRef.current = socket;

        // Khi kết nối thành công, gửi event authenticate kèm token để server xác thực
        socket.on("connect", () => {
          socket.emit("authenticate", token);
        });

        socket.on("disconnect", () => {
          // Silent disconnect: có thể log hoặc hiển thị trạng thái nếu cần
        });

        socket.on("connect_error", (error: Error) => {
          if (process.env.NODE_ENV === 'development') {
            console.error("[Socket] Connection error:", error?.message || String(error));
          }
        });

        // Một số event do server emit: authenticated / authentication_error
        socket.on("authenticated", () => {
          // Authentication thành công (thường không cần hành động thêm ở client)
        });

        socket.on("authentication_error", (error: { message: string }) => {
          if (process.env.NODE_ENV === 'development') {
            console.error("[Socket] Authentication error:", error.message);
          }
        });

        // Sự kiện nhận notification mới từ server
        socket.on("new_notification", (data: INotification) => {
          if (mounted) {
            try {
              onNotification(data);
            } catch (error) {
              if (process.env.NODE_ENV === 'development') {
                console.error("[Socket] Error handling notification:", error);
              }
            }
          }
        });

        // Các sự kiện cập nhật số lượng chưa đọc
        socket.on("notification_read", (data: { notificationId: string; unreadCount: number }) => {
          if (onUnreadCountUpdate && mounted) {
            onUnreadCountUpdate(data.unreadCount);
          }
        });

        socket.on("all_notifications_read", (data: { unreadCount: number }) => {
          if (onUnreadCountUpdate && mounted) {
            onUnreadCountUpdate(data.unreadCount);
          }
        });

        if (onUnreadCountUpdate) {
          socket.on("unread-count-updated", (data: { count: number }) => {
            if (mounted) {
              onUnreadCountUpdate(data.count);
            }
          });
        }

      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error("[Socket] Error connecting:", error);
        }
      }
    };

    connectSocket();

    return () => {
      // Cleanup: set mounted false and disconnect socket nếu đang tồn tại
      mounted = false;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId, onNotification, onUnreadCountUpdate]); // Thêm userId dependency để reconnect khi userId thay đổi

  return socketRef.current;
}