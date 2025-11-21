# Feature: Tìm Kiếm (Search)

Vị trí: `src/app/(cli)/search/` và `src/components/search` (nếu có)

Mô tả
- Tìm kiếm sản phẩm với gợi ý, bộ lọc và trang kết quả.

Nội dung chính
- Components: search input (autocomplete), filters, results grid.
- Services: `search-api` gọi backend để lấy gợi ý và kết quả.

Lưu ý
- `useSearchParams` và các client hook phải nằm trong component `'use client'`.
- Gợi ý dạng realtime có thể sử dụng debounce và gọi endpoint `GET /search/suggest`.
