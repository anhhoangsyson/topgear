# Feature: Thanh Toán (Checkout)

Vị trí: `src/app/(cli)/checkout/`

Mô tả
- Quy trình thanh toán gồm bước nhập thông tin giao hàng, chọn phương thức thanh toán và xác nhận đơn.

Nội dung chính
- Components: checkout form, payment methods, order summary, success page.
- API: tạo order ở backend, xử lý thanh toán (nếu tích hợp payment gateway cần backend xử lý callback).

Lưu ý
- Bảo mật: không lưu thông tin thẻ trên frontend. Giao tiếp với payment provider phải qua backend.
- Thanh toán online có thể cần webhook/callback từ provider — backend phải cấu hình để xử lý.
