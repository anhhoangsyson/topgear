import {  NextResponse } from "next/server"

export async function GET() {
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
