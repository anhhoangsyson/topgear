 # E-COM — Dự án Thương mại điện tử (Next.js)

 Kho này chứa một ứng dụng thương mại điện tử toàn bộ (E-COM) dùng Next.js với khu vực quản trị (admin). Ứng dụng sử dụng Next.js App Router, NextAuth cho xác thực, một API backend tách biệt (Express), MongoDB để lưu dữ liệu và một bộ thành phần UI cùng các tiện ích.

 **Tổng quan nhanh:**
 - **Frontend:** Next.js (App Router) trong `src/app` — gồm trang dành cho khách hàng và khu vực admin.
 - **Admin:** `src/app/admin` chứa dashboard quản trị, trình soạn blog, quản lý sản phẩm và đơn hàng.
 - **Backend API:** API Express (cấu hình qua `NEXT_PUBLIC_EXPRESS_API_URL`) — xử lý dữ liệu, xác thực và upload tệp.
 - **Database:** MongoDB (kết nối ở `src/lib/mongodb.ts`).

 **Tính năng chính**
 - Giao diện cửa hàng: duyệt laptop theo danh mục, thương hiệu, trang chi tiết sản phẩm.
 - Tìm kiếm với gợi ý và bộ lọc.
 - Giỏ hàng, thanh toán, lịch sử đơn hàng.
 - Trang tài khoản người dùng (hồ sơ, địa chỉ, thông báo).
 - Bảng điều khiển admin: số liệu, quản lý thương hiệu/danh mục/sản phẩm/đơn hàng/mã giảm giá.
 - Trình soạn thảo blog (React Quill) với CRUD và xem trước.
 - Thông báo thời gian thực (socket) và trung tâm thông báo cho admin.
 - Xác thực qua NextAuth (hỗ trợ  username/Facebook,password, v.v.).

 Hướng dẫn nhanh
 1. Cài đặt phụ thuộc:

 ```powershell
 npm ci
 ```

 2. Tạo biến môi trường: sao chép từ `.env.local.example` (hoặc tạo `.env.local`) và thiết lập cho môi trường phát triển. Các biến quan trọng:

 - `NEXTAUTH_URL` — URL ứng dụng Next.js (ví dụ `http://localhost:3001` khi phát triển)
 - `NEXTAUTH_SECRET` — chuỗi ngẫu nhiên an toàn
 - `NEXT_PUBLIC_EXPRESS_API_URL` — URL backend API (ví dụ `http://localhost:3000/api/v1`)
 - Khóa Facebook (nếu dùng OAuth): `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET`

 3. Chạy ứng dụng:

 ```powershell
 # chạy backend riêng (nếu có repo backend)
 # trong repo backend: npm run dev

 # sau đó chạy frontend
 npm run dev
 ```

 4. Build cho production:

 ```powershell
 npm run build
 npm start
 ```

 Triển khai
 - Frontend được thiết kế để deploy trên Vercel. Thiết lập biến môi trường trong Vercel Project Settings (Production & Preview). Đảm bảo `NEXTAUTH_URL` trỏ tới domain Vercel và OAuth redirect URI trên Facebook Developer có callback production (ví dụ `https://your-app.vercel.app/api/auth/callback/facebook`).
 - Backend API cần được triển khai và có thể truy cập từ server Next.js production. Nếu backend không sẵn sàng trong quá trình build và một số trang cố gắng fetch tại thời điểm build, hãy đánh dấu trang là dynamic (`export const dynamic = 'force-dynamic'`) hoặc tránh fetch vào thời điểm build.

 Gỡ lỗi (các vấn đề phổ biến)
 - `auth required` (MongoServerError): backend không thể xác thực với MongoDB — kiểm tra `MONGODB_URI` và quyền user trên backend.
 - `document is not defined` / `window is not defined`: một module chỉ chạy phía client đã bị import trong server component. Di chuyển mã client vào component có `'use client'` và render bằng dynamic import hoặc Suspense.
 - `ENOENT: page_client-reference-manifest.js` trên Vercel: đảm bảo `.next` không được commit, xóa cache Vercel và kiểm tra bước build (Install: `npm ci`, Build: `npm run build`). Kiểm tra `next.config` và cấu hình loader SVG nếu dùng các plugin tùy chỉnh.

 Vị trí quan trọng trong mã
 - Entry frontend: `src/app` (App Router). Các trang khách hàng thường trong `src/app/(cli)`; trang admin trong `src/app/admin`.
 - Thành phần UI: `src/components` (atoms/molecules/organisms).
 - Các helper: `src/lib` (ví dụ `mongodb.ts`, `auth-options.ts`, `api-client.ts`).
 - Services: `src/services` chứa các client API dùng bởi frontend.

 Nếu bạn cần hỗ trợ triển khai, CI hoặc viết README chi tiết hơn cho developer/người dùng, xem thêm `README.DEVELOPER.md` và `README.NONTECH.md`.

---
Maintainers: add contact or owner information here.
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
│   ├── (cli)/                 # Trang dành cho khách hàng
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

---

**Lưu ý**: Project này đang trong quá trình phát triển, có thể có một số tính năng chưa hoàn thiện.
