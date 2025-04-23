import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const authPaths = ['/login', '/register', '/forgot-password']
const protectedPaths = ['/account', '/checkout']
const adminPaths = '/admin'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    // get path from request
    const { pathname } = request.nextUrl

    // get sessionToken from cookies to handle authentication
    const accessToken = request.cookies.get('accessToken')?.value || null
    
    if (authPaths.some(path => pathname.startsWith(path) && accessToken)) {
        return NextResponse.redirect(new URL('/account', request.url))
    }

    if (protectedPaths.some(path => pathname.startsWith(path) && !accessToken)) {
        if (pathname.startsWith('/checkout')) {
            const redirectUrl = new URL('/login', request.url)
            redirectUrl.searchParams.set('message', 'Vui lòng đăng nhập trước khi đặt hàng nhé thượng đế :()')  // add message to query params
            return NextResponse.redirect(redirectUrl)
        }
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (pathname.startsWith(adminPaths) && !accessToken) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // if not match any path, continue to next middleware
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


