import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket(userId: string, onNotification: (data: any) => void) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;
    // Kết nối tới server socket.io
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      query: { userId },
      transports: ["websocket"],
    });
    socketRef.current = socket;

    // Lắng nghe sự kiện notification
    socket.on("notification", onNotification);

    return () => {
      socket.disconnect();
    };
  }, [userId, onNotification]);
}