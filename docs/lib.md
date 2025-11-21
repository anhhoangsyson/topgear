# Lib — Helpers & Config

Vị trí: `src/lib/`

Mô tả
- Chứa các helper và cấu hình dùng lại trong app: kết nối DB, cấu hình NextAuth, các utils chung.

Các file quan trọng
- `mongodb.ts` — logic kết nối MongoDB (sử dụng cache cho môi trường serverless).
- `auth-options.ts` — cấu hình NextAuth (providers, callbacks).
- `api-client.ts` — helper để gọi API backend từ frontend.

Lưu ý
- Nếu thay đổi cách lưu connection Mongo, phải đảm bảo không tạo quá nhiều kết nối trên môi trường serverless (dùng global cache pattern).
