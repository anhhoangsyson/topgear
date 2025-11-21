# Feature: Admin (Quản Trị)

Vị trí: `src/app/admin/` và các subfolders `src/app/admin/(otherPages)/...`

Mô tả
- Khu vực quản trị cho phép nhân viên quản lý sản phẩm, đơn hàng, blog, thương hiệu, danh mục và xem số liệu thống kê.

Các phần chính
- `dashboard` — số liệu tổng quan, doanh thu, đơn mới.
- `laptop` / `laptop-group` — quản lý sản phẩm (CRUD), upload hình ảnh, quản lý biến thể.
- `orders` — danh sách đơn, chi tiết, cập nhật trạng thái.
- `brand`, `category` — quản trị dữ liệu tham chiếu.
- `blog` — trình soạn, preview, publish.

Lưu ý
- Các trang admin nên bảo vệ bằng auth middleware (route guard) — chỉ admin mới truy cập.
- Nhiều component admin có thao tác client DOM/Editor — sử dụng `'use client'` cho các phần đó.
- Nếu gặp lỗi `document is not defined` khi build, tìm xem editor nào chạy trên server và tách thành client wrapper.
