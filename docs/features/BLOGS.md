# Feature: Blog / Tin Tức

Vị trí: `src/app/(cli)/blogs/` và admin quản lý trong `src/app/admin/(otherPages)/blog/`

Mô tả
- Hiển thị danh sách bài blog, trang chi tiết bài viết và giao diện quản trị để tạo/sửa/xóa bài.

Nội dung chính
- Frontend: blog list, blog detail, pagination, tags/categories.
- Admin: editor (React Quill) với upload ảnh, preview, draft/publish.

Lưu ý
- React Quill và các editor DOM-heavy phải chạy trong component `'use client'` (đã tách ra client wrapper trong repo).
- Upload ảnh thường gọi API backend; backend phải cung cấp endpoint lưu file và trả về URL.
