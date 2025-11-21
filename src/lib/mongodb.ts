import { MongoClient, Db } from "mongodb"

// MONGODB_URI và MONGODB_DB được đọc từ env. Giá trị mặc định phục vụ development.
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/product-management"
const MONGODB_DB = process.env.MONGODB_DB || "product-management"

// cachedClient / cachedDb: dùng để lưu kết nối giữa các lần gọi trong môi trường serverless
// (ví dụ: Vercel serverless functions). Tránh tạo nhiều kết nối mới mỗi lần hàm chạy.
let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

/**
 * Kết nối tới MongoDB và trả về client + db.
 * - Sử dụng cache nếu đã có kết nối (giảm cold-start và giới hạn kết nối).
 * - Caller sẽ nhận về `{ client, db }` để thao tác DB.
 */
export async function connectToDatabase() {
  // Nếu đã kết nối cached, trả lại để tái sử dụng
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  // Tạo kết nối mới
  const client = new MongoClient(MONGODB_URI)
  await client.connect()
  const db = client.db(MONGODB_DB)

  // Lưu vào cache để tái sử dụng trong các lần gọi tiếp theo
  cachedClient = client
  cachedDb = db

  return { client, db }
}

