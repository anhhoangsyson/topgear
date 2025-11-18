import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/brand`, {
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