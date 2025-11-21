# Feature: Trang Chi Tiết Sản Phẩm (Product Detail)

Vị trí: `src/app/(cli)/laptop/[id]/page.tsx` hoặc tương đương

Mô tả
- Hiển thị thông tin chi tiết của một laptop: hình ảnh, thông số, mô tả, đánh giá, chọn cấu hình, và thêm vào giỏ hàng.

Nội dung chính
- Components: gallery, product info panel, specs table, rating component, related products.
- Actions: thêm vào giỏ, chọn biến thể, gọi API rating/comment.

Lưu ý
- Tải hình ảnh và xử lý gallery là client-side (DOM). Nếu dùng library thao tác DOM, phải là component `'use client'`.
- Đảm bảo fetch dữ liệu sản phẩm an toàn (try/catch) để không phá build khi backend lỗi.
