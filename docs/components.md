# Components — Cấu trúc và nơi tìm

Vị trí: `src/components/`

Mô tả
- Tất cả UI components được tổ chức theo mô hình atoms/molecules/organisms, giúp tái sử dụng và dễ bảo trì.

Thư mục con (ví dụ)
- `atoms/` — các component nhỏ: `Button`, `Input`, `Badge`, `Icon`.
- `molecules/` — kết hợp atoms thành các phần: `ProductCard`, `SearchInput`, `Rating`.
- `organisms/` — layout lớn: `Header`, `Footer`, `Section`, `AdminTable`.
- `providers/` — context providers (NotificationProvider, ThemeProvider, AuthProvider).

Lưu ý
- Khi cần UI mới, hãy thêm vào đúng mức (atom/molecule/organism) để giữ tính nhất quán.
