import { cookies } from "next/headers"

export async function verifyToken(): Promise<boolean> {

    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value

    if (!accessToken) {
        return false
    }

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        })
        if (!res.ok) {
            return false
        }
        return res.ok
    } catch (error) {
        console.log(error);
        return false
    }

}

