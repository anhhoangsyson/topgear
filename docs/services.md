# Services — API wrappers

Vị trí: `src/services/`

Mô tả
- Các file trong thư mục này là các wrapper gọi API backend, tách biệt logic fetch khỏi components.

Ví dụ
- `user-api.ts`, `search-api.ts`, `order-api.ts`, `laptop-api.ts`, `notification-api.ts`.

Lưu ý
- Giữ các endpoint và shape dữ liệu ở một chỗ giúp dễ bảo trì và mock khi test.
