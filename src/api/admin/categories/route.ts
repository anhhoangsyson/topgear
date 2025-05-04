import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    // Connect to MongoDB
    const { db } = await connectToDatabase()

    // Get categories
    const categories = await db.collection("categories").find({ isDeleted: false }).toArray()

    return NextResponse.json({
      success: true,
      data: categories,
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Lỗi khi lấy danh sách danh mục",
      },
      { status: 500 },
    )
  }
}

