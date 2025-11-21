# Feature: Giỏ Hàng (Cart)

Vị trí: `src/app/(cli)/cart/` và `src/store/cartStore.ts`

Mô tả
- Quản lý các sản phẩm người dùng chọn, cập nhật số lượng, tính giá tạm tính, mã giảm giá và chuyển sang checkout.

Nội dung chính
- Store: Zustand store lưu trạng thái giỏ hàng (persist vào `localStorage`).
- Components: cart drawer/page, cart item row, price summary, coupon input.

Lưu ý
- Toàn bộ phần giỏ hàng là client-side: dùng `'use client'` cho component chứa thao tác cập nhật.
- Khi checkout gọi API tạo đơn, đảm bảo token/session hợp lệ (NextAuth / cookie).
