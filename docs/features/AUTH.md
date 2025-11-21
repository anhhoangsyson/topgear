# Feature: Xác Thực (Auth)

Vị trí: `src/app/(cli)/(auth)/`, `src/lib/auth-options.ts`, `src/services/user-api.ts`

Mô tả
- Login/Logout/Session management. Dùng NextAuth để quản lý session, hỗ trợ Facebook provider và credentials.

Nội dung chính
- NextAuth config: `src/lib/auth-options.ts` (providers, callbacks, session)
- Pages/components: login, register, forgot password, email verification.

Lưu ý
- Trong production, đặt `NEXTAUTH_URL` chính xác và `NEXTAUTH_SECRET` trong biến môi trường.
- OAuth: cập nhật Redirect URIs trong trang developer của provider (Facebook) cho domain production và preview.
