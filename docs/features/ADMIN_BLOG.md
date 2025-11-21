# Admin: Quản lý Blog

Vị trí: `src/app/admin/(otherPages)/blog/`

Mô tả
- Tạo/Chỉnh sửa/Xóa bài viết blog; hỗ trợ editor WYSIWYG (React Quill), upload ảnh, quản lý trạng thái (draft/publish).

Nội dung chính
- Editor client-side, trang danh sách bài blog, form metadata (title, slug, tags, excerpt).

Lưu ý
- Editor heavy-DOM đã được tách thành component `'use client'` trong repo để tránh lỗi khi build.
