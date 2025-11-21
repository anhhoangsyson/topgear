# Cấu trúc dự án — Giải thích nhanh

Tài liệu này mô tả cấu trúc thư mục chính của repository và chức năng của từng phần. Mục đích để giúp developer nhanh hiểu nơi đặt mã, nơi thêm tính năng và nơi sửa lỗi.

Root
- `src/` — mã nguồn frontend Next.js (App Router). Đây là nơi chứa tất cả pages, components, providers và logic frontend.
- `public/` — tài nguyên tĩnh (images, icons, service worker, data).
- `docs/` — tài liệu giải thích các feature và cấu trúc (một số file README feature nằm ở đây).

Quan trọng trong `src/`
- `src/app/` — App Router: pages, layouts, và api routes kết hợp với Next.js. Thư mục này là entry chính của ứng dụng.
  - `src/app/(cli)/` — các trang khách hàng (catalog, sản phẩm, giỏ hàng, checkout, blog)
  - `src/app/admin/` — khu vực admin: các trang quản lý (products, orders, blog, dashboard)
  - `src/app/api/` — route API phía frontend (proxy/route handlers)

- `src/components/` — tất cả UI components được tổ chức theo atoms/molecules/organisms.
- `src/lib/` — helper, client, cấu hình (ví dụ: `mongodb.ts`, `auth-options.ts`, `api-client.ts`).
- `src/services/` — wrapper gọi API (ví dụ: `user-api.ts`, `search-api.ts`).
- `src/store/` — Zustand stores cho trạng thái client (cart, notifications,...)
- `src/hooks/` — custom React hooks (socket, toast, user info,...)
- `src/schemaValidations/` — validation schemas (Zod) cho forms và payloads.
- `src/types/` — các TypeScript types dùng chung.

Ghi chú quan trọng
- Server / Client: Vì dùng Next.js App Router, giữ rạch ròi module chỉ chạy trên client (document/window, ReactQuill, useSearchParams, các hook) trong component có `'use client'`. Nếu thấy lỗi `document is not defined` hoặc client hook in server component — chuyển logic đó vào component client.
- Dynamic pages: Nếu một trang cần fetch backend tại thời điểm runtime (không muốn prerender), thêm `export const dynamic = 'force-dynamic'` ở đầu module.
- Không commit `.next`.

Xem chi tiết các phần trong thư mục `docs/features/`.
