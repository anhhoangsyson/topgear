# Tài liệu API — Quản lý Rating (Admin)

Mục đích: mô tả các endpoint dành cho admin quản lý đánh giá (rating) của người dùng.

Base path: `/api/v1/rating`
Authentication: Tất cả endpoint admin yêu cầu header `Authorization: Bearer <token>` và role của user phải là `admin`.

---

**GET /api/v1/rating**

Mô tả: Lấy danh sách rating cho admin, hỗ trợ paging, lọc và sắp xếp.

Query params:
- `page` (number, optional) — mặc định `1`
- `limit` (number, optional) — mặc định `20`, giới hạn tối đa `100`
- `userId` (string, optional) — lọc theo user
- `laptopId` (string, optional) — lọc theo sản phẩm
- `orderId` (string, optional) — lọc theo đơn hàng
- `rating` (number, optional) — 1..5
- `status` (string, optional) — `pending|approved|rejected`
- `sortBy` (string, optional) — ví dụ `createdAt:desc|rating:desc`

Response 200 (ví dụ):
```json
{
  "data": {
    "items": [
      {
        "_id": "643...abc",
        "userId": "62f...xyz",
        "userName": "Nguyen A",
        "laptopId": "63a...def",
        "rating": 5,
        "title": "Rất tốt",
        "comment": "Máy chạy mượt, đáng tiền",
        "images": ["https://.../img1.jpg"],
        "orderId": "640...111",
        "status": "pending",
        "createdAt": "2025-11-01T12:00:00.000Z"
      }
    ],
    "meta": { "page": 1, "limit": 20, "total": 123 }
  },
  "message": "Ratings retrieved successfully"
}
```

Example curl:
```bash
curl -X GET "https://api.example.com/api/v1/rating?page=1&limit=10&status=pending" \
  -H "Authorization: Bearer <ADMIN_JWT>"
```

---

**GET /api/v1/rating/:id**

Mô tả: Lấy chi tiết một rating theo `id`.

Response 200: object rating (như item trong list).
Errors:
- 404: Rating không tồn tại.

Example curl:
```bash
curl -X GET "https://api.example.com/api/v1/rating/643...abc" \
  -H "Authorization: Bearer <ADMIN_JWT>"
```

---

**PUT /api/v1/rating/:id**

Mô tả: Cập nhật rating (thường dùng để thay đổi `status` duyệt/từ chối hoặc thêm ghi chú admin).

Body (JSON):
- `status` (optional) — `approved|rejected|pending`
- `adminNote` (optional) — string
- (Tùy policy) `rating`, `title`, `comment` (optional) — nếu admin được phép sửa nội dung

Response 200 (ví dụ):
```json
{ "data": { /* rating đã cập nhật */ }, "message": "Rating updated successfully" }
```

Example curl:
```bash
curl -X PUT "https://api.example.com/api/v1/rating/643...abc" \
  -H "Authorization: Bearer <ADMIN_JWT>" \
  -H "Content-Type: application/json" \
  -d '{"status":"approved","adminNote":"OK"}'
```

Validation:
- `status` phải là một giá trị hợp lệ trong enum.
- Nếu admin sửa `rating`, phải là integer 1..5.

---

**DELETE /api/v1/rating/:id**

Mô tả: Xóa rating (hard delete) hoặc soft-delete tùy implementation.

Response 200:
```json
{ "message": "Rating deleted successfully" }
```

Cân nhắc: Lưu audit log thay vì xóa cứng nếu cần lịch sử xử lý.

Example curl:
```bash
curl -X DELETE "https://api.example.com/api/v1/rating/643...abc" \
  -H "Authorization: Bearer <ADMIN_JWT>"
```

---

**GET /api/v1/rating/order/:orderId**

Mô tả: Lấy rating liên quan tới một `orderId` (hữu ích để tra cứu rating gắn với đơn hàng cụ thể).

Example:
```bash
curl -X GET "https://api.example.com/api/v1/rating/order/640...111" \
  -H "Authorization: Bearer <ADMIN_JWT>"
```

---

**GET /api/v1/rating/stats**

Mô tả: Thống kê nhanh về ratings: tổng số, điểm trung bình, phân bố theo sao, số pending.

Response 200 (ví dụ):
```json
{
  "data": {
    "total": 1234,
    "average": 4.3,
    "byRating": { "5": 800, "4": 250, "3": 100, "2": 50, "1": 34 },
    "pending": 12
  }
}
```

---

**POST /api/v1/rating/bulk** (optional)

Mô tả: Bulk actions cho admin — ví dụ thay đổi `status` cho nhiều rating.

Body example:
```json
{ "ids": ["id1","id2"], "status": "approved" }
```

Response 200: thông báo kết quả và danh sách id thành công/không thành công.

---

**Validation & DTO**
- Khi nhận `userId`, `laptopId`, `orderId`: kiểm tra là ObjectId hợp lệ (24 hex chars) -> trả 400 nếu không.
- `rating` phải integer 1..5.
- `status` thuộc enum `pending|approved|rejected`.
- `page`/`limit` phải là số dương; giới hạn `limit` tối đa 100.

**Authentication & Authorization**
- Middleware: `authenticateJWT` + kiểm tra role `admin`.
- 401 nếu thiếu/invalid token; 403 nếu token hợp lệ nhưng không có quyền admin.

**Error responses (tiêu chuẩn)**
- 400 Bad Request — payload hoặc params không hợp lệ.
- 401 Unauthorized — thiếu/không hợp lệ JWT.
- 403 Forbidden — không có quyền.
- 404 Not Found — không tìm thấy resource.
- 500 Internal Server Error — lỗi server/DB.

Example lỗi 400:
```json
{ "message": "Invalid rating value", "errors": { "rating": "Must be integer between 1 and 5" } }
```

---

**Best practices & suggestions triển khai**
- Khi `status` thay đổi sang `approved`, gửi notification cho user (email / in-app).
- Ghi audit log (adminId, action, timestamp) khi admin sửa/xóa rating.
- Đối với `images` upload: validate kích thước, định dạng, scan virus nếu cần.
- Hỗ trợ bulk actions (bulk approve/reject) để admin thao tác nhanh.
- Giới hạn page size để tránh truy vấn nặng.

---

**Test checklist (gợi ý)**
- [ ] Lấy danh sách với paging và lọc (`status=pending`).
- [ ] Lấy chi tiết rating bằng id.
- [ ] Approve một rating và kiểm tra user nhận notification.
- [ ] Reject rating và kiểm tra trạng thái.
- [ ] Xóa rating và kiểm tra audit log/backups.
- [ ] Gọi `stats` và kiểm tra tính hợp lý của distribution.

---

Nếu bạn muốn tôi chuyển phần này thành OpenAPI (YAML) hoặc thêm vào `src/api/rating/README.md`, tôi có thể tạo thêm. 
