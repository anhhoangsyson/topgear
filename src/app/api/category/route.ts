import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch categories");
    }

    const categories = await res.json(); // Chuyển đổi dữ liệu thành JSON
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}