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
    // NOTE: userId có thể là 'connect' hoặc 'connect-now' (trigger string) hoặc actual userId
    if (!userId) {
      console.log('[useSocket] ⏭️ No userId provided, skipping socket connection');
      console.log('[useSocket] 📝 userId value:', userId);
      return;
    }
    
    console.log('[useSocket] ✅ userId provided:', userId, '(can be trigger string or actual userId)');
    
    // Không cần userId để connect, server sẽ authenticate và trả về userId
    // Nhưng cần userId để biết khi nào nên connect
    let mounted = true;

    const connectSocket = async () => {
      try {
        console.log('[useSocket] 🔄 Starting socket connection process...');
        console.log('[useSocket] 📝 userId parameter:', userId);
        
        // Get access token for authentication
        const token = await TokenManager.getAccessToken();
        if (!mounted) {
          console.warn('[useSocket] Component unmounted, skipping connection');
          return;
        }
        
        if (!token) {
          console.warn('[useSocket] ⚠️ No token available. User may need to login again.');
          // Không throw error, chỉ log để không break UI
          return;
        }
        
        console.log('[useSocket] ✅ Token retrieved, length:', token.length);

        // Socket URL theo API docs: http://localhost:3000 (Express backend)
        // KHÔNG phải localhost:3001 (Next.js frontend)
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';
        
        // Validate socket URL
        if (socketUrl.includes('3001')) {
          console.error("[useSocket] ❌ Socket URL is pointing to Next.js (3001) instead of Express backend (3000)!");
          console.error("[useSocket] 📝 Current URL:", socketUrl);
          console.error("[useSocket] 📝 Should be: http://localhost:3000");
          console.error("[useSocket] ⚠️ Please update .env.local: NEXT_PUBLIC_SOCKET_URL=http://localhost:3000");
          // Không return, tiếp tục với warning
        }

        console.log('[useSocket] 🔌 Connecting to socket:', socketUrl);
        console.log('[useSocket] 📝 Expected: http://localhost:3000 (Express backend)');
        console.log('[useSocket] ⚠️ Make sure Express backend is running on port 3000!');

        // Kết nối tới server socket.io (theo API docs)
        const socket = io(socketUrl, {
          transports: ["websocket", "polling"],
          withCredentials: true,
          reconnection: true,
          reconnectionAttempts: 3, // Giảm số lần retry
          reconnectionDelay: 2000,
          timeout: 10000, // Timeout sau 10s
          autoConnect: true,
        });

        socketRef.current = socket;

        // Lắng nghe sự kiện connection
        socket.on("connect", () => {
          console.log("[useSocket] ✅ Socket connected:", socket.id);
          console.log("[useSocket] Socket URL:", socketUrl);
          // Authenticate với token (theo API docs)
          console.log("[useSocket] Authenticating with token (length):", token.length);
          socket.emit("authenticate", token);
          console.log("[useSocket] ✅ Emitted authenticate event");
        });

        socket.on("disconnect", (reason) => {
          console.log("[useSocket] ❌ Socket disconnected:", reason);
        });

        socket.on("connect_error", (error) => {
          console.error("[useSocket] ❌ Socket connection error:", error.message || error);
          console.error("[useSocket] 📝 Troubleshooting:");
          console.error("[useSocket]   1. ✅ Check Express backend is running on port 3000");
          console.error("[useSocket]      Run: curl http://localhost:3000/api/v1/notifications/unread-count");
          console.error("[useSocket]   2. ✅ Check .env.local has: NEXT_PUBLIC_SOCKET_URL=http://localhost:3000");
          console.error("[useSocket]   3. ✅ Check backend CORS allows frontend origin (localhost:3001)");
          console.error("[useSocket]   4. ✅ Restart Next.js dev server after updating .env.local");
          console.warn("[useSocket] ⚠️ Socket will retry automatically, but notifications won't work until connected");
        });

        // Listen for authenticated event (theo API docs)
        socket.on("authenticated", (data: { userId: string }) => {
          console.log("[useSocket] ✅✅✅ AUTHENTICATED SUCCESSFULLY!");
          console.log("[useSocket] ✅ User ID from server:", data.userId);
        });

        // Listen for authentication_error (theo API docs)
        socket.on("authentication_error", (error: { message: string }) => {
          console.error("[useSocket] ❌❌❌ AUTHENTICATION ERROR!");
          console.error("[useSocket] ❌ Error message:", error.message);
          console.error("[useSocket] ❌ Full error:", error);
        });

        // Lắng nghe sự kiện new_notification (theo API docs - event name là "new_notification")
              socket.on("new_notification", (data: INotification) => {
                console.log("[useSocket] 🔔🔔🔔 Received new_notification event:", {
                  hasData: !!data,
                  notificationId: data._id || data.id,
                  type: data.type,
                  title: data.title,
                  isMounted: mounted,
                  fullData: data
                });
                if (mounted) {
                  console.log("[useSocket] ✅ Calling onNotification callback...");
                  try {
                    onNotification(data);
                    console.log("[useSocket] ✅✅✅ onNotification callback executed successfully");
                  } catch (error) {
                    console.error("[useSocket] ❌❌❌ Error in onNotification callback:", error);
                  }
                } else {
                  console.warn("[useSocket] ⚠️ Component unmounted, ignoring notification");
                }
              });

        // Lắng nghe notification_read event (theo API docs)
        socket.on("notification_read", (data: { notificationId: string; unreadCount: number }) => {
          console.log("[useSocket] 📖 Notification read:", data);
          if (onUnreadCountUpdate && mounted) {
            onUnreadCountUpdate(data.unreadCount);
          }
        });

        // Lắng nghe all_notifications_read event (theo API docs)
        socket.on("all_notifications_read", (data: { unreadCount: number }) => {
          console.log("[useSocket] 📖 All notifications read:", data);
          if (onUnreadCountUpdate && mounted) {
            onUnreadCountUpdate(data.unreadCount);
          }
        });

        // Lắng nghe unread-count-updated (nếu backend vẫn support)
        if (onUnreadCountUpdate) {
          socket.on("unread-count-updated", (data: { count: number }) => {
            console.log("[useSocket] 📊 Unread count updated:", data);
            if (mounted) {
              onUnreadCountUpdate(data.count);
            }
          });
        }

      } catch (error) {
        console.error("[useSocket] Error connecting socket:", error);
      }
    };

    connectSocket();

    return () => {
      mounted = false;
      if (socketRef.current) {
        console.log('[useSocket] 🧹 Cleaning up socket connection...');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId, onNotification, onUnreadCountUpdate]); // Thêm userId dependency để reconnect khi userId thay đổi

  return socketRef.current;
}