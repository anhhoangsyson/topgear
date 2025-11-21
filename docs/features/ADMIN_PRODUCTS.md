# Admin: Quản lý Sản phẩm

Vị trí: `src/app/admin/(otherPages)/laptop/` và `src/app/admin/(otherPages)/laptop-group/`

Mô tả
- Thêm/Sửa/Xoá sản phẩm, quản lý nhóm sản phẩm, upload ảnh, thiết lập giá và biến thể.

Nội dung chính
- Form product: name, slug, price, images, specs, attributes.
- Upload ảnh: gọi API backend để lưu file.
- Validation: kiểm tra input (Zod) trước khi gửi.

Lưu ý
- Các thao tác upload hình/preview ảnh phải chạy client-side.
