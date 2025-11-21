# Store — State management

Vị trí: `src/store/`

Mô tả
- Chứa các Zustand stores dùng cho state client-side như giỏ hàng, thông báo, wishlist.

File điển hình
- `cartStore.ts`, `notificationStore.ts`, `categoryStore.ts`.

Lưu ý
- Stores nên giữ logic thuần client; persist vào `localStorage` nếu cần.
