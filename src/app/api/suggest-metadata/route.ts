import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json(); // Lấy dữ liệu JSON từ request

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/laptop/suggest-metadata`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body), // Chuyển đổi dữ liệu thành JSON
        });

        if (!res.ok) {
            throw new Error("Failed to fetch metadata");
        }

        const suggestMetadata = await res.json(); // Chuyển đổi dữ liệu thành JSON
        return NextResponse.json(suggestMetadata);
    } catch (error) {
        console.error("Error fetching suggest-metadata:", error);
        return NextResponse.json({ error: "Failed to fetch suggest-metadata" }, { status: 500 });
    }
}