import { NextRequest, NextResponse } from "next/server";

// export const API_URL = 'https://top-gear-be.vercel.app/api/v1';
const API_URL = process.env.NEXT_PUBLIC_EXPRESS_API_URL || 'https://top-gear-be.vercel.app/api/v1'; 
export async function callApi(endpoint: string, method: string, accessToken?: string, body?: unknown) {
    const headers: HeadersInit = {
        Accept: 'application/json',
    }

    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`
    }

    // Ensure endpoint starts with a '/'
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const fullUrl = `${API_URL}${normalizedEndpoint}`;

    const response = await fetch(`${fullUrl}`, {
        method,
        headers,
        body: JSON.stringify(body) || undefined
    })

    if (!response.ok) {
        const text = await response.text();
        if (response.status === 401) {
            return { error: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.', status: 401 };
        }
        throw new Error(`Backend error: ${response.status} - ${text.slice(0, 100)}`);
    }
    return response.json()
}

export async function GET(req: NextRequest, res: NextResponse) {
    // const accessToken = req.headers.get('Authorization')?.split(' ')[1] || ''
    // const accessToken = req.cookies.get('accessToken')?.value || ''
    const accessTokenResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL_NEXT_SERVER}/api/user/get-access-token`, {
        method: 'GET',
    });
    const accessTokenData = await accessTokenResponse.json();
    const accessToken = accessTokenData?.accessToken || '';

    try {
        if (!accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userData = await callApi('/auth/me',
            "GET", accessToken
        );        return NextResponse.json(userData);
    } catch (error: unknown) {
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
    } catch (error: unknown) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}