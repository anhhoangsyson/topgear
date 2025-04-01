import { type NextRequest, NextResponse } from "next/server"
import { productVariantSchema } from "@/types"
import { connectToDatabase } from "@/lib/mongodb"

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json()

//     // Validate request body
//     const validationResult = productVariantSchema.safeParse(body)
//     if (!validationResult.success) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Dữ liệu không hợp lệ",
//           details: validationResult.error.errors,
//         },
//         { status: 400 },
//       )
//     }

//     // Connect to MongoDB
//     const { db } = await connectToDatabase()

//     // Insert product variant
//     const result = await db.collection("productvariants").insertOne({
//       productId: body.productId,
//       variantName: body.variantName,
//       variantPrice: body.variantPrice,
//       variantStock: body.variantStock,
//       status: body.status,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     })

//     // Get the inserted product variant
//     const variant = await db.collection("productvariants").findOne({ _id: result.insertedId })

//     return NextResponse.json(
//       {
//         success: true,
//         data: variant,
//       },
//       { status: 201 },
//     )
//   } catch (error) {
//     console.error("Error creating product variant:", error)
//     return NextResponse.json(
//       {
//         success: false,
//         error: "Lỗi khi tạo biến thể sản phẩm",
//       },
//       { status: 500 },
//     )
//   }
// }

export async function GET(req: NextRequest,res: NextResponse) {
  try {
    const res = await fetch(`http://localhost:3000/api/v1/pvariants`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })    

    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "Lỗi khi lấy danh sách biến thể sản phẩm",
        },
        { status: res.status },
      )
    }

    const productVariantsData = await res.json()
    console.log("Product variants data from nextserver:", productVariantsData);

    return NextResponse.json(productVariantsData)
    
  } catch (error) {
    console.error("Error fetching product variants:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Lỗi khi lấy danh sách biến thể sản phẩm",
      },
      { status: 500 },
    )

  }
}
