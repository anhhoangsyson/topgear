import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const categoryId = url.searchParams.get("categoryId")

    // Connect to MongoDB
    const { db } = await connectToDatabase()

    // Get attributes by category
    let query = {}
    if (categoryId) {
      query = { categoriesId: categoryId }
    }

    const attributes = await db
      .collection("categoriesAttribute")
      .aggregate([
        { $match: query },
        {
          $lookup: {
            from: "attributes",
            localField: "attributeId",
            foreignField: "_id",
            as: "attributeDetails",
          },
        },
        {
          $unwind: "$attributeDetails",
        },
        {
          $project: {
            _id: "$attributeId",
            attributeName: "$attributeDetails.attributeName",
            categoryId: "$categoriesId",
          },
        },
      ])
      .toArray()

    return NextResponse.json({
      success: true,
      data: attributes,
    })
  } catch (error) {
    console.error("Error fetching attributes:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Lỗi khi lấy danh sách thuộc tính",
      },
      { status: 500 },
    )
  }
}

