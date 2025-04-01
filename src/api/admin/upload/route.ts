import { type NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("image") as File

    if (!file) {
      return NextResponse.json({ success: false, error: "Không tìm thấy file" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename
    const fileName = `${uuidv4()}_${file.name.replace(/\s/g, "_")}`
    const uploadDir = path.join(process.cwd(), "public/uploads")
    const filePath = path.join(uploadDir, fileName)

    // Save file
    await writeFile(filePath, buffer)

    // Return the URL
    const imageUrl = `/uploads/${fileName}`

    return NextResponse.json(
      {
        success: true,
        data: { imageUrl },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Lỗi khi tải lên file",
      },
      { status: 500 },
    )
  }
}

