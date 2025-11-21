# Feature: Trang Chủ (Home)

Vị trí: `src/app/page.tsx` (hoặc trong `src/app/(cli)/page.tsx` tuỳ cấu trúc)

Mô tả
- Trang đầu của cửa hàng, hiển thị các danh mục nổi bật, bộ sưu tập sản phẩm (hot/new), banner và liên kết nhanh tới các trang chính.

Nội dung chính
- Components: hero banner, product carousels, highlight cards, quick links.
- Data: thường fetch các API public để lấy danh sách laptop nổi bật và thống kê.

Lưu ý khi sửa
- Nếu sử dụng fetch đến backend trong thời điểm build và backend không sẵn sàng, trang có thể gây lỗi prerender — cân nhắc `export const dynamic = 'force-dynamic'`.
- Giữ logic DOM (event listeners) trong component `'use client'`.
