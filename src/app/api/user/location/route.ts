import { callApi } from "@/app/api/user/route";
import { NextRequest, NextResponse } from "next/server";

const API_URl = process.env.NEXT_PUBLIC_EXPRESS_API_URL;

export async function GET(req: NextRequest, res: NextResponse) {
    const accessToken = req.headers.get('Authorization')?.split(' ')[1] || ''

    try {
        if (!accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const locationRes = await callApi('/location', 'GET', accessToken)

        return NextResponse.json(locationRes)
    } catch (error: unknown) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const body = await res.json();
        console.log("Request body:", body);
        const token = req.headers.get('Authorization')?.split(' ')[1] || '';
        console.log('accsstoken cc', token);

        // call be exresss api
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
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}