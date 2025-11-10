import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { TokenManager } from "@/lib/token-manager";
import { INotification } from "@/types/notification";

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
        // Get access token for authentication
        const token = await TokenManager.getAccessToken();
        if (!mounted || !token) {
          return;
        }

        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';
        
        // Kết nối tới server socket.io
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

        // Lắng nghe sự kiện connection
        socket.on("connect", () => {
          socket.emit("authenticate", token);
        });

        socket.on("disconnect", () => {
          // Silent disconnect
        });

        socket.on("connect_error", (error: Error) => {
          if (process.env.NODE_ENV === 'development') {
            console.error("[Socket] Connection error:", error?.message || String(error));
          }
        });

        socket.on("authenticated", () => {
          // Silent authentication success
        });

        socket.on("authentication_error", (error: { message: string }) => {
          if (process.env.NODE_ENV === 'development') {
            console.error("[Socket] Authentication error:", error.message);
          }
        });

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
      mounted = false;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId, onNotification, onUnreadCountUpdate]); // Thêm userId dependency để reconnect khi userId thay đổi

  return socketRef.current;
}