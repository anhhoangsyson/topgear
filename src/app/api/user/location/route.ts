import { callApi } from "@/app/api/user/route";
import { NextRequest, NextResponse } from "next/server";

const API_URl = process.env.NEXT_PUBLIC_API_URL_PROD || 'https://top-gear-be.vercel.app/api/v1'

export async function GET(req: NextRequest, res: NextResponse) {
    const accessToken = req.headers.get('Authorization')?.split(' ')[1] || ''

    try {
        if (!accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const locationRes = await callApi('/location', 'GET', accessToken)
        console.log('locationRes', locationRes);
        return NextResponse.json(locationRes)
    } catch (error: any) {
        console.log('error', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}