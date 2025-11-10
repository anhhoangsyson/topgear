import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { getToken } from "next-auth/jwt";

const authPaths = ['/login', '/register', '/forgot-password']
const protectedPaths = ['/account', '/checkout']
// const adminPaths = ['/admin'] // Not used - admin paths are handled separately

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    // get path from request
    const { pathname } = request.nextUrl

    // Check NextAuth session token trước (ưu tiên)
    const nextAuthToken = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const hasNextAuthSession = !!nextAuthToken;
    
    // Fallback: Check accessToken cookie
    const accessTokenCookie = request.cookies.get('accessToken')?.value || null;
    
    // Nếu NextAuth session không có nhưng cookie accessToken vẫn còn => clear cookie và redirect login
    if (!hasNextAuthSession && accessTokenCookie && protectedPaths.some(path => pathname.startsWith(path))) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        // Clear stale accessToken cookie
        response.cookies.delete('accessToken');
        return response;
    }

    // Đã đăng nhập (có NextAuth session hoặc cookie) mà vào login/register
    if (authPaths.some(path => pathname.startsWith(path) && (hasNextAuthSession || accessTokenCookie))) {
        return NextResponse.redirect(new URL('/account', request.url))
    }

    // Protected paths: cần có NextAuth session hoặc cookie
    if (protectedPaths.some(path => pathname.startsWith(path)) && !hasNextAuthSession && !accessTokenCookie) {
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


