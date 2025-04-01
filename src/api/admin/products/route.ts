import { type NextRequest, NextResponse } from "next/server"
import { productSchema } from "@/types"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate request body
    const validationResult = productSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Dữ liệu không hợp lệ",
          details: validationResult.error.errors,
        },
        { status: 400 },
      )
    }

    // Connect to MongoDB
    const { db } = await connectToDatabase()

    // Insert product
    const result = await db.collection("products").insertOne({
      productName: body.productName,
      categoriesId: body.categoriesId,
      description: body.description || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Get the inserted product
    const product = await db.collection("products").findOne({ _id: result.insertedId })

    return NextResponse.json(
      {
        success: true,
        data: product,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Lỗi khi tạo sản phẩm",
      },
      { status: 500 },
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    // Connect to MongoDB
    const { db } = await connectToDatabase()

    // Get products
    const products = await db.collection("products").find({}).toArray()

    return NextResponse.json({
      success: true,
      data: products,
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Lỗi khi lấy danh sách sản phẩm",
      },
      { status: 500 },
    )
  }
}

