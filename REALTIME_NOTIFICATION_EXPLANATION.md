# 🎯 Giải Thích Chi Tiết: Realtime Notification Implementation

## 📋 Tổng Quan

Realtime notification system được implement với **3 layer chính**:

1. **Socket.io Connection Layer** - Kết nối real-time với backend
2. **State Management Layer** - Quản lý notifications state (Zustand)
3. **UI Layer** - Hiển thị notifications (Components)

---

## 🔌 Layer 1: Socket.io Connection

### **File: `src/hooks/use-socket.ts`**

Đây là custom hook để quản lý kết nối Socket.io:

```typescript
export function useSocket(
  userId: string | undefined,
  onNotification: (data: any) => void,
  onUnreadCountUpdate?: (count: number) => void
)
```

**Cách hoạt động:**

1. **Authentication:**
   ```typescript
   const token = await TokenManager.getAccessToken();
   const socket = io(socketUrl, {
     auth: { token: token },  // Gửi JWT token để authenticate
     query: { userId },        // Gửi userId trong query
   });
   ```
   - Lấy JWT token từ cookie
   - Gửi token trong `auth` để backend verify
   - Gửi `userId` trong query string

2. **Connection Events:**
   ```typescript
   socket.on("connect", () => {
     socket.emit("join-notifications", { userId });
   });
   ```
   - Khi kết nối thành công, join vào room `notifications:${userId}`
   - Backend sẽ emit notifications vào room này

3. **Listen Events:**
   ```typescript
   socket.on("notification", (data) => {
     onNotification(data);  // Callback từ Provider
   });
   
   socket.on("unread-count-updated", (data) => {
     onUnreadCountUpdate(data.count);
   });
   ```
   - Lắng nghe event `notification` - khi có notification mới
   - Lắng nghe event `unread-count-updated` - khi unread count thay đổi

4. **Reconnection:**
   ```typescript
   reconnection: true,
   reconnectionAttempts: 5,
   reconnectionDelay: 1000,
   ```
   - Tự động reconnect nếu mất kết nối
   - Retry 5 lần, mỗi lần cách nhau 1 giây

5. **Cleanup:**
   ```typescript
   return () => {
     socket.disconnect();  // Disconnect khi unmount
   };
   ```
   - Disconnect socket khi component unmount

---

## 🗄️ Layer 2: State Management (Zustand)

### **File: `src/store/notificationStore.ts`**

Zustand store quản lý toàn bộ notifications state:

**State:**
```typescript
{
  notifications: INotification[];  // Danh sách notifications
  unreadCount: number;             // Số lượng chưa đọc
  isLoading: boolean;              // Loading state
  error: string | null;            // Error state
}
```

**Actions:**

1. **addNotification:**
   ```typescript
   addNotification: (notification) => {
     // Check duplicate
     const exists = currentNotifications.some(n => n._id === notification._id);
     if (exists) return;
     
     // Add to beginning (newest first)
     const newNotifications = [notification, ...currentNotifications];
     
     // Update unread count nếu notification chưa đọc
     const unreadCount = notification.isRead 
       ? get().unreadCount 
       : get().unreadCount + 1;
     
     set({ notifications: newNotifications, unreadCount });
   }
   ```
   - Thêm notification mới vào đầu danh sách
   - Tăng unread count nếu chưa đọc
   - Prevent duplicates

2. **markAsRead:**
   ```typescript
   markAsRead: (notificationId) => {
     // Update notification.isRead = true
     const notifications = get().notifications.map(notif =>
       notif._id === notificationId && !notif.isRead
         ? { ...notif, isRead: true, readAt: new Date().toISOString() }
         : notif
     );
     
     // Decrement unread count
     const unreadCount = Math.max(0, get().unreadCount - 1);
     set({ notifications, unreadCount });
   }
   ```
   - Đánh dấu notification đã đọc
   - Giảm unread count

3. **deleteNotification:**
   ```typescript
   deleteNotification: (notificationId) => {
     // Remove notification
     const notifications = get().notifications.filter(n => n._id !== notificationId);
     
     // Giảm unread count nếu notification chưa đọc
     const unreadCount = notification && !notification.isRead
       ? Math.max(0, get().unreadCount - 1)
       : get().unreadCount;
     
     set({ notifications, unreadCount });
   }
   ```

---

## 🔄 Layer 3: Provider & Flow

### **File: `src/components/providers/NotificationProvider.tsx`**

Provider này wrap toàn bộ app và quản lý:

1. **Socket Connection:**
   ```typescript
   useSocket(
     status === 'authenticated' ? userId : undefined,
     handleNotification,
     handleUnreadCountUpdate
   );
   ```
   - Chỉ connect khi user đã authenticated
   - Setup callbacks để xử lý events

2. **Handle Real-time Notification:**
   ```typescript
   const handleNotification = (data: INotification) => {
     addNotification(data);  // Thêm vào store
     
     // Hiển thị toast notification
     toast({
       title: data.title,
       description: data.message,
       duration: 5000,
     });
   };
   ```
   - Khi nhận notification từ socket:
     - Thêm vào Zustand store
     - Hiển thị toast notification

3. **Handle Unread Count Update:**
   ```typescript
   const handleUnreadCountUpdate = (count: number) => {
     setUnreadCount(count);  // Update unread count trong store
   };
   ```

4. **Fetch Initial Data:**
   ```typescript
   useEffect(() => {
     if (status === 'authenticated' && userId) {
       // Fetch notifications từ API
       const [notificationsRes, unreadCountRes] = await Promise.all([
         NotificationAPI.getNotifications({ page: 1, limit: 20 }),
         NotificationAPI.getUnreadCount(),
       ]);
       
       // Update store
       setNotifications(notificationsRes.data.notifications);
       setUnreadCount(unreadCountRes.data.count);
     }
   }, [status, userId]);
   ```
   - Load initial notifications khi user login
   - Load unread count

---

## 🔄 Flow Hoàn Chỉnh

### **1. User Login → Connection Flow**

```
User Login
  ↓
NotificationProvider mounts
  ↓
Check authentication status
  ↓
┌─ Authenticated? ─┐
│ YES              │ NO
│   ↓              │   ↓
│ Fetch API       │ Skip
│ - Notifications │
│ - Unread count  │
│   ↓              │
│ Connect Socket  │
│ - Get JWT token │
│ - Connect io()  │
│ - Join room     │
│ - Listen events │
│   ↓              │
│ Ready! ✅        │
└─────────────────┘
```

### **2. Backend Emits Notification**

```
Backend có notification mới
  ↓
Backend: io.to(`user:${userId}`).emit('notification', data)
  ↓
Socket.io Client nhận event
  ↓
use-socket.ts: socket.on('notification', ...)
  ↓
Call handleNotification callback
  ↓
NotificationProvider: handleNotification()
  ↓
┌──────────────────────────┐
│ 1. addNotification()    │ → Zustand store
│    - Add to list        │
│    - Increment count    │
│                         │
│ 2. toast()             │ → Toast notification
│    - Show popup        │
│                         │
│ 3. Store update        │ → React re-render
│    - Badge update      │
│    - UI update         │
└──────────────────────────┘
```

### **3. User Interacts**

```
User clicks notification
  ↓
NotificationItem component
  ↓
handleMarkAsRead()
  ↓
┌──────────────────────────┐
│ 1. API Call             │
│    NotificationAPI      │
│    .markAsRead(id)      │
│                         │
│ 2. Update Store         │
│    markAsRead(id)       │
│    - isRead = true     │
│    - Decrement count   │
│                         │
│ 3. Navigate (if link)   │
│    /account/orders/:id  │
│                         │
│ 4. UI Update            │
│    - Badge update      │
│    - Item style change │
└──────────────────────────┘
```

---

## 🎨 UI Components

### **1. NotificationBadge**
```typescript
// src/components/molecules/notification/NotificationBadge.tsx
const unreadCount = useNotificationStore((state) => state.unreadCount);

<Bell />
{unreadCount > 0 && (
  <Badge>{unreadCount}</Badge>
)}
```
- Hiển thị số lượng unread
- Tự động update khi store thay đổi

### **2. NotificationItem**
```typescript
// src/components/molecules/notification/NotificationItem.tsx
- Hiển thị 1 notification
- Handle mark as read
- Handle delete
- Deep linking (navigate to order/product)
```

### **3. NotificationList**
```typescript
// src/components/organisms/notification/NotificationList.tsx
- Hiển thị danh sách notifications
- Loading state
- Empty state
```

---

## 🔐 Security & Authentication

### **1. Socket Authentication:**
```typescript
const token = await TokenManager.getAccessToken();
const socket = io(socketUrl, {
  auth: { token },  // JWT token
});
```
- Backend verify token trước khi cho phép connect
- Chỉ user authenticated mới nhận được notifications

### **2. Room-based Delivery:**
```typescript
socket.emit("join-notifications", { userId });
// Backend joins user vào room: `user:${userId}`
```
- Mỗi user có room riêng
- Backend chỉ emit vào room của user đó
- Đảm bảo user chỉ nhận notifications của mình

---

## 📊 Data Flow Diagram

```
┌─────────────┐
│   Backend   │
│  Socket.io  │
└──────┬──────┘
       │ emit('notification', data)
       │
       ↓
┌─────────────────────────┐
│  Frontend Socket Client │
│  use-socket.ts         │
│  socket.on('notification') │
└──────┬──────────────────┘
       │ onNotification(data)
       │
       ↓
┌─────────────────────────┐
│ NotificationProvider    │
│ handleNotification()    │
└──────┬──────────────────┘
       │
       ├─→ addNotification() ──┐
       │                       │
       └─→ toast()            │
                              ↓
                    ┌─────────────────┐
                    │ Zustand Store   │
                    │ notifications[] │
                    │ unreadCount    │
                    └────┬────────────┘
                         │
       ┌──────────────────┼──────────────────┐
       │                  │                  │
       ↓                  ↓                  ↓
┌─────────────┐   ┌──────────────┐   ┌─────────────┐
│   Badge     │   │ Notification │   │ Toast Popup │
│   Update    │   │     Page     │   │   Shows     │
└─────────────┘   └──────────────┘   └─────────────┘
```

---

## 💡 Key Features

### **1. Real-time Updates**
- Socket.io cho instant updates
- Không cần polling/reload

### **2. Offline Support**
- Store notifications trong Zustand
- Hiển thị ngay khi online lại
- Auto reconnect

### **3. Performance**
- Chỉ render components cần thiết
- Zustand cho efficient state updates
- Pagination cho large lists

### **4. User Experience**
- Toast notifications cho immediate feedback
- Badge hiển thị unread count
- Deep linking đến order/product
- Auto mark as read khi click

---

## 🐛 Error Handling

### **1. Connection Errors:**
```typescript
socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});
```
- Log errors
- Auto retry với reconnection

### **2. API Errors:**
```typescript
try {
  await NotificationAPI.markAsRead(id);
} catch (error) {
  toast({ variant: 'destructive', ... });
}
```
- Show user-friendly errors
- Don't break UI

### **3. Token Expired:**
```typescript
const token = await TokenManager.getAccessToken();
if (!token) return;  // Skip connection nếu không có token
```
- Skip connection nếu token invalid
- Re-fetch token khi có

---

## 📝 Summary

**3 Bước Chính:**

1. **Connect Socket.io** (use-socket.ts)
   - Authenticate với JWT
   - Join room
   - Listen events

2. **Manage State** (notificationStore.ts)
   - Store notifications
   - Track unread count
   - Provide actions

3. **Display & Interact** (Components)
   - Badge hiển thị count
   - Page hiển thị list
   - Toast cho real-time alerts

**Khi Backend emit notification:**
→ Socket nhận event
→ Provider xử lý
→ Store update
→ UI tự động re-render
→ User thấy notification ngay lập tức! 🎉

