 # Hướng dẫn dành cho lập trình viên — E-COM

 Tài liệu này mô tả cách thiết lập môi trường phát triển, chạy dự án trên máy local và các tác vụ phổ biến cho contributor.

 Yêu cầu trước khi bắt đầu
 - Node.js LTS (khuyến nghị v18 hoặc v20)
 - npm (đi kèm Node) hoặc pnpm
 - Một instance MongoDB (local hoặc cloud) cho backend
 - Tùy chọn: Docker để chạy dịch vụ cục bộ

 Thiết lập
 1. Clone repository và cài phụ thuộc:

 ```powershell
 git clone <repo-url>
 cd top-gear
 npm ci
 ```

 2. Biến môi trường
 - Tạo `.env.local` và đặt giá trị. Các biến quan trọng:
	 - `NEXTAUTH_URL`
	 - `NEXTAUTH_SECRET`
	 - `NEXT_PUBLIC_EXPRESS_API_URL`
	 - `FACEBOOK_CLIENT_ID` / `FACEBOOK_CLIENT_SECRET` (nếu dùng Facebook OAuth)

 3. Backend
 - Khởi động backend Express (ở repo hoặc folder riêng). Đảm bảo backend có `MONGODB_URI` đúng và user DB có quyền cần thiết.

 4. Chạy ứng dụng

 ```powershell
 # backend: (trong folder backend)
 # npm run dev

 # frontend (repo này)
 npm run dev
 ```

 Build và chạy production

 ```powershell
 npm run build
 npm start
 ```

 Kiểm thử và lint
 - Lint: `npm run lint` (có thể tạm tắt khi đang phát triển nhanh)
 - Kiểm tra kiểu: TypeScript được sử dụng toàn bộ dự án — dùng `npm run type-check` nếu có script tương ứng.

 Cấu trúc mã (tổng quan)
 - `src/app`: các trang và layout của Next.js App Router.
 - `src/components`: thành phần UI (atoms/molecules/organisms).
 - `src/lib`: các helper và client cho auth/db.
 - `src/services`: client API dùng bởi frontend.
 - `src/store`: các store Zustand cho trạng thái phía client.

 Mẹo phát triển quan trọng
 - Ranh giới server/client trong App Router: không import module chỉ chạy trên client (window/document, client hooks) trong server components. Đánh dấu component client bằng `'use client'` và render chúng trong server bằng Suspense hoặc dynamic import.
 - Khi trang fetch tới backend tại thời điểm build, đánh dấu trang là dynamic bằng `export const dynamic = 'force-dynamic'` hoặc tránh fetch trong giai đoạn build.
 - Sử dụng MongoDB client cache trong serverless functions để tránh timeout khi cold-start và giới hạn kết nối.
 - Không commit `.next` vào source control. Nếu gặp lỗi ENOENT trên Vercel liên quan `.next`, xóa cache Vercel và redeploy.

 CI / Kiểm tra PR
 - Khuyến nghị: thêm GitHub Actions để chạy `npm ci`, `npm run build` và `npm run lint` trên PR.

 Cách đóng góp
 - Tạo branch riêng cho feature và mở PR.
 - Chạy lint và type-check trước khi gửi PR.
 - Thêm test cho tính năng mới khi có thể.
