import { type NextRequest, NextResponse } from "next/server"
import { productAttributeSchema } from "@/types"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate request body
    const validationResult = productAttributeSchema.safeParse(body)
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

    // Insert product attribute
    const result = await db.collection("productattributes").insertOne({
      variantId: body.variantId,
      attributeId: body.attributeId,
      attributeValue: body.attributeValue,
      status: body.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Get the inserted product attribute
    const attribute = await db.collection("productattributes").findOne({ _id: result.insertedId })

    return NextResponse.json(
      {
        success: true,
        data: attribute,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating product attribute:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Lỗi khi tạo thuộc tính sản phẩm",
      },
      { status: 500 },
    )
  }
}

