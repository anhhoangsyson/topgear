# Feature: Laptop Listing & Catalog

Vị trí: `src/app/(cli)/laptop/` và liên quan trong `src/services/laptop-api` hoặc `src/services`.

Mô tả
- Trang danh sách laptop, nhóm sản phẩm, bộ lọc theo thương hiệu/danh mục/giá và sắp xếp.

Nội dung chính
- Components: product card, filter panel, pagination/Load more, sort dropdown.
- Data: gọi API backend (danh sách laptop, count, filter options).

Lưu ý
- Bộ lọc và pagination thường cần client-side state (sử dụng `useSearchParams` hoặc Zustand). Di chuyển logic hook vào component client.
- Tránh fetch trực tiếp tới `http://localhost` trong build; dùng dynamic pages nếu cần runtime.
