import { NextRequest, NextResponse } from "next/server";
import { callApi } from '@/services/api-client'

export async function GET(req: NextRequest) {
    try {
        // Get access token from cookies
        const accessToken = req.cookies.get('accessToken')?.value || '';

        if (!accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userData = await callApi('/auth/me', "GET", accessToken);
        return NextResponse.json(userData);
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const accessToken = req.cookies.get('accessToken')?.value || ''

        if (!accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()

            const updateUserData = await callApi('/user', "PUT", accessToken, body)
            return NextResponse.json(updateUserData)
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}