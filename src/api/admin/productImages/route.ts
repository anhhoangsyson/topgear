import { type NextRequest, NextResponse } from "next/server"
import { productImageSchema } from "@/types"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate request body
    const validationResult = productImageSchema.safeParse(body)
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

    // Insert product image
    const result = await db.collection("productimages").insertOne({
      productVariantId: body.productVariantId,
      imageUrl: body.imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Get the inserted product image
    const image = await db.collection("productimages").findOne({ _id: result.insertedId })

    return NextResponse.json(
      {
        success: true,
        data: image,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating product image:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Lỗi khi tạo hình ảnh sản phẩm",
      },
      { status: 500 },
    )
  }
}

