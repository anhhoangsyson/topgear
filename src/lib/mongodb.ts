import { MongoClient, Db } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/product-management"
const MONGODB_DB = process.env.MONGODB_DB || "product-management"

// Cached connection
let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase() {
  // If we have a cached connection, use it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  // Create a new connection
  const client = new MongoClient(MONGODB_URI)
  await client.connect()
  const db = client.db(MONGODB_DB)

  // Cache the connection
  cachedClient = client
  cachedDb = db

  return { client, db }
}

