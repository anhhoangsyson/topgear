# Admin Rating Management - Quản lý đánh giá

Module quản lý đánh giá (rating) dành cho admin trong hệ thống Top Gear E-commerce.

## 📁 Cấu trúc file

```
src/app/admin/(otherPages)/ratings/
├── page.tsx                  # Server component chính
├── RatingsClient.tsx         # Client component chính với logic
├── RatingDetailModal.tsx     # Modal xem chi tiết & chỉnh sửa
├── RatingStatsCard.tsx       # Card thống kê tổng quan
├── rating-columns.tsx        # Columns definition cho DataTable
└── README.md                 # File này
```

## 🚀 Tính năng

### 1. **Trang danh sách rating** (`/admin/ratings`)
- Hiển thị tất cả đánh giá trong DataTable
- Search theo ID
- Sort theo các cột
- Pagination tự động

### 2. **Thống kê tổng quan**
- 📊 Tổng số đánh giá
- ⭐ Điểm trung bình
- ⏳ Số đánh giá chờ duyệt
- ✅ Số đánh giá đã duyệt
- 📈 Biểu đồ phân bố theo sao (1-5)
- 📋 Tổng kết trạng thái (Pending/Approved/Rejected)

### 3. **Bộ lọc**
- **Trạng thái**: Tất cả / Chờ duyệt / Đã duyệt / Từ chối
- **Số sao**: Tất cả / 5 / 4 / 3 / 2 / 1
- Nút làm mới dữ liệu

### 4. **Chi tiết & Chỉnh sửa rating**
Modal hiển thị:
- Rating stars (1-5)
- Nội dung nhận xét đầy đủ
- Thông tin người dùng (tên, email)
- Thông tin sản phẩm (tên, hình ảnh)
- Mã đơn hàng
- Ngày tạo

Actions:
- ✏️ Thay đổi trạng thái (Pending/Approved/Rejected)
- 📝 Thêm ghi chú admin
- 💾 Lưu thay đổi
- 🗑️ Xóa đánh giá

## 🔧 API Endpoints cần implement ở Backend

Backend Express cần implement các endpoint sau:

### 1. GET `/api/v1/rating`
Lấy danh sách rating với filters

**Query params:**
- `page` (number, optional) - default: 1
- `limit` (number, optional) - default: 20, max: 100
- `userId` (string, optional)
- `laptopId` (string, optional)
- `orderId` (string, optional)
- `rating` (number, optional) - 1-5
- `status` (string, optional) - pending|approved|rejected
- `sortBy` (string, optional) - e.g., "createdAt:desc"

**Response:**
```json
{
  "data": {
    "items": [
      {
        "_id": "643...abc",
        "userId": { "_id": "...", "fullname": "...", "email": "..." },
        "laptopId": { "_id": "...", "name": "...", "modelName": "..." },
        "rating": 5,
        "comment": "Rất tốt",
        "status": "pending",
        "adminNote": "",
        "orderId": "640...111",
        "createdAt": "2025-11-01T12:00:00.000Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 20,
      "total": 123
    }
  }
}
```

### 2. GET `/api/v1/rating/:id`
Lấy chi tiết một rating

**Response:**
```json
{
  "data": { /* rating object */ }
}
```

### 3. PUT `/api/v1/rating/:id`
Cập nhật rating (admin)

**Body:**
```json
{
  "status": "approved",
  "adminNote": "OK"
}
```

**Response:**
```json
{
  "data": { /* updated rating */ }
}
```

### 4. DELETE `/api/v1/rating/:id`
Xóa rating

**Response:**
```json
{
  "message": "Rating deleted successfully"
}
```

### 5. GET `/api/v1/rating/order/:orderId`
Lấy rating theo đơn hàng

**Response:**
```json
{
  "data": [ /* array of ratings */ ]
}
```

### 6. GET `/api/v1/rating/stats`
Lấy thống kê

**Response:**
```json
{
  "data": {
    "total": 1234,
    "average": 4.3,
    "byRating": {
      "5": 800,
      "4": 250,
      "3": 100,
      "2": 50,
      "1": 34
    },
    "byStatus": {
      "pending": 12,
      "approved": 1200,
      "rejected": 22
    }
  }
}
```

### 7. POST `/api/v1/rating/bulk` (Optional)
Bulk actions

**Body:**
```json
{
  "ids": ["id1", "id2"],
  "status": "approved"
}
```

## 🔐 Authentication

Tất cả API calls yêu cầu:
- Header: `Authorization: Bearer <token>`
- Role: `admin`

Token được lấy tự động từ `TokenManager.getAccessToken()`

## 📝 Cách sử dụng

### 1. Truy cập trang
- Vào sidebar admin → **Đánh giá** → **Quản lý đánh giá**
- Hoặc trực tiếp: `/admin/ratings`

### 2. Xem thống kê
- Stats card hiển thị ngay đầu trang
- Auto refresh sau mỗi lần update/delete

### 3. Lọc dữ liệu
```typescript
// Filter theo status
setStatusFilter("pending") // "pending" | "approved" | "rejected" | "all"

// Filter theo rating
setRatingFilter(5) // 1-5 hoặc "all"
```

### 4. Xem chi tiết & Chỉnh sửa
```typescript
// Click nút "Chi tiết" trên bất kỳ row nào
handleShowRatingDetail(rating)

// Modal sẽ mở với đầy đủ thông tin
// Có thể:
// - Thay đổi status
// - Thêm adminNote
// - Lưu hoặc Xóa
```

### 5. Cập nhật rating
```typescript
const handleUpdate = async () => {
  const updatedRating = await updateAdminRating(ratingId, {
    status: "approved",
    adminNote: "Good review"
  });

  // Toast success/error tự động hiển thị
  // Stats tự động refresh
};
```

## 🎨 UI Components

### RatingsClient
Main container với:
- State management
- Fetch logic
- Filter controls
- Data table
- Modal

### RatingStatsCard
Props:
```typescript
interface RatingStatsCardProps {
  stats: IAdminRatingStats | null;
  isLoading?: boolean;
}
```

### RatingDetailModal
Props:
```typescript
interface RatingDetailModalProps {
  rating: IRating | null;
  open: boolean;
  onClose: () => void;
  onRatingUpdate: (rating: IRating) => void;
  onRatingDelete: (ratingId: string) => void;
}
```

## 🔄 Data Flow

1. **Load trang**:
   ```
   RatingsClient mount
   → fetchRatings()
   → fetchStats()
   → Render DataTable + StatsCard
   ```

2. **User chọn filter**:
   ```
   setStatusFilter("pending")
   → useEffect triggers
   → fetchRatings(with new filter)
   → Re-render table
   ```

3. **User click "Chi tiết"**:
   ```
   handleShowRatingDetail(rating)
   → setSelectedRating(rating)
   → setShowModal(true)
   → RatingDetailModal renders
   ```

4. **User update rating**:
   ```
   handleUpdate()
   → API call: updateAdminRating()
   → onRatingUpdate(updatedRating)
   → Update local state
   → fetchStats()
   → Show toast
   → Close modal
   ```

## 🐛 Troubleshooting

### Lỗi "Không có quyền truy cập"
- Kiểm tra token trong localStorage/cookie
- Đảm bảo role = "admin"
- Check middleware tại `src/middleware.ts`

### Lỗi 404 Not Found
- Kiểm tra `NEXT_PUBLIC_EXPRESS_API_URL` trong `.env.local`
- Đảm bảo backend đang chạy
- Verify endpoint path

### Toast không hiển thị
- Kiểm tra `<Toaster />` đã được add vào layout chưa
- File: `src/app/admin/(otherPages)/layout.tsx`

### DataTable không render
- Check data format: phải là array
- Verify columns definition
- Console.log để debug

## 📦 Dependencies

```json
{
  "@tanstack/react-table": "^8.x",
  "lucide-react": "^0.x",
  "react": "^18.x",
  "next": "^14.x"
}
```

## 🎯 Best Practices

1. **Error Handling**: Luôn wrap API calls trong try-catch
2. **Loading States**: Hiển thị loading khi fetch data
3. **Toast Notifications**: Thông báo mọi success/error
4. **Confirm Dialogs**: Confirm trước khi xóa
5. **Auto Refresh**: Refresh stats sau mọi thay đổi
6. **Type Safety**: Sử dụng TypeScript interfaces đầy đủ

## 📄 License

Internal use only - Top Gear E-commerce Platform
