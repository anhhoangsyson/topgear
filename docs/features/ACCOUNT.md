# Feature: Tài Khoản Người Dùng (Account)

Vị trí: `src/app/(cli)/(auth)/account/` và `src/app/(cli)/(auth)/account/*`

Mô tả
- Trang quản lý tài khoản: hồ sơ, địa chỉ, đơn hàng, thông báo cá nhân.

Nội dung chính
- Components: profile form, address list/add, order history list, notification settings.
- Services: `user-api` để lấy/ cập nhật thông tin người dùng.

Lưu ý
- Các trang này yêu cầu user đã đăng nhập — dùng NextAuth session hoặc guard ở route level.
