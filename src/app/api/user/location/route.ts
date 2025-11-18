import { callApi } from "@/services/api-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    // Try to get token from Authorization header first
    let accessToken = req.headers.get('Authorization')?.split(' ')[1] || '';
    
    // Fallback: try to get from cookie
    if (!accessToken) {
        const cookies = req.cookies;
        accessToken = cookies.get('accessToken')?.value || '';
    }
    
    // Last fallback: try to get from API route
    if (!accessToken) {
        try {
            const tokenRes = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL_NEXT_SERVER || 'http://localhost:3000'}/api/user/get-access-token`, {
                method: 'GET',
            });
            if (tokenRes.ok) {
                const tokenData = await tokenRes.json();
                accessToken = tokenData?.accessToken || '';
            }
        } catch {
            // Ignore token fetch errors
        }
    }

    try {
        if (!accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const locationRes = await callApi('/location', 'GET', accessToken)

        return NextResponse.json(locationRes)
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        // call be express api
        const response = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/location`, {
            method: "POST",
            headers: {
                'Cotent-Type': 'application/json',
                'Authorization': `Bearer ${req.headers.get('Authorization')?.split(' ')[1] || ''}`
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        return NextResponse.json(data)
    } catch {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}