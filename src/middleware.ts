import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { getToken } from "next-auth/jwt";

const authPaths = ['/login', '/register', '/forgot-password']
const protectedPaths = ['/account', '/checkout']
const adminPaths = ['/admin']

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    // get path from request
    const { pathname } = request.nextUrl
    console.log('🚀 ~ file: middleware.ts:10 ~ middleware ~ pathname:', pathname);

    // get sessionToken from cookies to handle authentication
    const accessToken = request.cookies.get('accessToken')?.value || null

    // Đã đăng nhập mà vào login/register
    if (authPaths.some(path => pathname.startsWith(path) && accessToken)) {
        return NextResponse.redirect(new URL('/account', request.url))
    }

    if (protectedPaths.some(path => pathname.startsWith(path)) && !accessToken) {
        if (pathname.startsWith('/checkout')) {
            const redirectUrl = new URL('/login', request.url)
            redirectUrl.searchParams.set('message', 'Vui lòng đăng nhập trước khi đặt hàng nhé thượng đế :()')
            return NextResponse.redirect(redirectUrl)
        }
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // check if user is admin
    // if (adminPaths.some(path => pathname.startsWith(path) && accessToken)) {
    //     try {
    //         const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    //         if (!token || token.role !== 'admin') {
    //             return NextResponse.redirect(new URL('/', request.url))
    //         }
    //         return NextResponse.next()
    //     } catch (error) {
    //         console.log('🚀 ~ file: middleware.ts:42 ~ middleware ~ error:', error);

    //         return NextResponse.redirect(new URL('/login', request.url))
    //     }
    // }
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
        if (!token || token.role !== 'admin') {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }
    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher:
        [
            '/login',
            '/register',
            '/admin/:path*',
            '/checkout/:path*',
            '/account/:path*',
        ]
}


