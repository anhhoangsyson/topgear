# E-COM - E-commerce Platform

Website bán laptop và phụ kiện công nghệ, được xây dựng với Next.js 14 và TypeScript.

## 🚀 Tính năng chính

### 👤 Khách hàng (Customer)
- ✅ Đăng ký / Đăng nhập (Email + Facebook)
- ✅ Xem danh sách sản phẩm (Laptop, phụ kiện)
- ✅ Tìm kiếm, lọc sản phẩm theo thương hiệu, danh mục
- ✅ Chi tiết sản phẩm
- ✅ Giỏ hàng
- ✅ Thanh toán (COD, Online)
- ✅ Theo dõi đơn hàng
- ✅ Quản lý địa chỉ giao hàng
- ✅ Thông báo real-time (Socket.io)
- ✅ Blog/Tin tức

### 👨‍💼 Admin
- ✅ Đăng nhập admin
- ✅ Dashboard thống kê
- ✅ Quản lý sản phẩm (Laptop, Laptop Group)
- ✅ Quản lý danh mục (Category)
- ✅ Quản lý thương hiệu (Brand)
- ✅ Quản lý đơn hàng
- ✅ Quản lý blog
- ✅ Thông báo real-time khi có đơn hàng mới

## 🛠️ Công nghệ sử dụng

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: Radix UI, Shadcn/ui
- **State Management**: Zustand, React Query
- **Authentication**: NextAuth.js (Email + Facebook)
- **Database**: MongoDB
- **Real-time**: Socket.io
- **Form**: React Hook Form + Zod validation

## 📁 Cấu trúc thư mục

```
src/
├── app/                          # Next.js App Router (Pages & API Routes)
│   ├── (client)/                 # Trang dành cho khách hàng
│   │   ├── (auth)/               # Trang cần đăng nhập
│   │   │   ├── account/          # Quản lý tài khoản, đơn hàng, địa chỉ
│   │   │   ├── login/            # Đăng nhập
│   │   │   └── register/         # Đăng ký
│   │   ├── cart/                 # Giỏ hàng
│   │   ├── checkout/             # Thanh toán
│   │   ├── laptop/               # Trang laptop
│   │   ├── blogs/                # Blog/Tin tức
│   │   └── page.tsx              # Trang chủ
│   ├── admin/                    # Trang dành cho admin
│   │   ├── (auth)/               # Đăng nhập admin
│   │   ├── (otherPages)/         # Các trang quản lý
│   │   │   ├── dashboard/        # Dashboard thống kê
│   │   │   ├── laptop/           # Quản lý laptop
│   │   │   ├── orders/           # Quản lý đơn hàng
│   │   │   ├── category/         # Quản lý danh mục
│   │   │   ├── brand/            # Quản lý thương hiệu
│   │   │   └── blog/             # Quản lý blog
│   │   └── components/           # Components riêng cho admin
│   └── api/                      # API Routes
│       ├── auth/                 # Authentication API
│       ├── laptop/               # Laptop API
│       ├── user/                 # User API
│       └── ...
│
├── components/                    # Components dùng chung
│   ├── atoms/                    # Component nhỏ nhất (Button, Input, Badge...)
│   ├── molecules/                # Component trung bình (Card, Form field...)
│   ├── organisms/                # Component lớn (Header, Footer, Section...)
│   ├── providers/                # Context Providers (Notification, Auth...)
│   └── common/                   # Components dùng chung
│
├── lib/                          # Utilities & Helpers
│   ├── api-client.ts             # API client (call backend)
│   ├── token-manager.ts          # Quản lý token
│   ├── utils.ts                  # Utility functions
│   └── ...
│
├── store/                         # Zustand stores (State management)
│   ├── cartStore.ts              # State giỏ hàng
│   ├── notificationStore.ts      # State thông báo
│   └── ...
│
├── services/                      # API services
│   ├── notification-api.ts       # API thông báo
│   ├── user-api.ts               # API user
│   └── ...
│
├── hooks/                         # Custom React Hooks
│   ├── use-socket.ts             # Hook kết nối Socket.io
│   └── use-toast.ts              # Hook hiển thị toast
│
├── types/                         # TypeScript types
│   ├── notification.ts           # Types thông báo
│   └── ...
│
└── schemaValidations/             # Zod validation schemas
    ├── auth.schema.ts             # Validation đăng nhập/đăng ký
    └── ...
```

## 🚀 Cài đặt và chạy

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Tạo file `.env.local`
```env
# Database
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3001

# API Backend
NEXT_PUBLIC_EXPRESS_API_URL=http://localhost:3000
NEXT_PUBLIC_API_URL_NEXT_SERVER=http://localhost:3001

# Socket.io (Backend URL)
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000

# Facebook OAuth (nếu dùng)
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
```

### 3. Chạy development server
```bash
npm run dev
```

Mở [http://localhost:3001](http://localhost:3001) để xem website.

## 📝 Scripts

```bash
npm run dev      # Chạy development server
npm run build    # Build cho production
npm run start    # Chạy production server
npm run lint     # Kiểm tra lỗi code
npm run format   # Format code
```

## 🔑 Tính năng chi tiết

### Authentication (Xác thực)
- **NextAuth.js**: Hỗ trợ đăng nhập bằng Email/Password và Facebook
- **JWT Token**: Lưu token từ backend để authenticate
- **Session Management**: Quản lý session với NextAuth

### Real-time Notifications (Thông báo real-time)
- **Socket.io**: Kết nối real-time với backend
- **Customer**: Nhận thông báo về đơn hàng
- **Admin**: Nhận thông báo khi có đơn hàng mới
- **Toast + Badge**: Hiển thị thông báo và số lượng chưa đọc

### Shopping Cart (Giỏ hàng)
- **Zustand Store**: Quản lý state giỏ hàng
- **Persist**: Lưu giỏ hàng vào localStorage
- **Add/Remove/Update**: Các thao tác với giỏ hàng

### Order Management (Quản lý đơn hàng)
- **Checkout**: 2 bước (Thông tin + Thanh toán)
- **Payment**: COD và Online payment
- **Order Tracking**: Theo dõi trạng thái đơn hàng

### Admin Panel
- **Dashboard**: Thống kê doanh thu, đơn hàng
- **CRUD**: Quản lý sản phẩm, danh mục, thương hiệu
- **Order Management**: Xem và xử lý đơn hàng
- **Blog Management**: Quản lý blog/tin tức

## 🔧 Cấu trúc quan trọng

### API Routes (`src/app/api/`)
- Tất cả API routes của Next.js
- Proxy requests tới backend Express
- Handle authentication

### Components Structure
- **Atoms**: Button, Input, Badge... (Component nhỏ, tái sử dụng)
- **Molecules**: Card, Form field... (Kết hợp atoms)
- **Organisms**: Header, Footer, Section... (Component lớn)
- **Providers**: Context providers (Notification, Auth)

### State Management
- **Zustand**: Quản lý state client-side (Cart, Notifications)
- **React Query**: Quản lý server state (Data fetching, caching)

## 📞 Liên hệ

Nếu có vấn đề hoặc câu hỏi, vui lòng tạo issue trong repository.

---

**Lưu ý**: Project này đang trong quá trình phát triển, có thể có một số tính năng chưa hoàn thiện.
