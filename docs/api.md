# API (Frontend routes) — Giải thích nhanh

Vị trí: `src/app/api/`

Mô tả
- Các route trong `src/app/api` là route handlers phía frontend (Next.js). Chúng thường đóng vai trò proxy hoặc xử lý request cụ thể trước khi gọi backend Express.

Lưu ý
- Tránh đặt logic nặng vào route handler nếu có thể — keep thin layer và đẩy business logic vào backend.
