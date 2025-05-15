import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// const authPaths = ['/login', '/register', '/forgot-password']
// const protectedPaths = ['/account', '/checkout']
// const adminPaths = '/admin'

// // This function can be marked `async` if using `await` inside
// export async function middleware(request: NextRequest) {
//     // get path from request
//     const { pathname } = request.nextUrl

//     // get sessionToken from cookies to handle authentication
//     const accessToken = request.cookies.get('accessToken')?.value || null


//     if (authPaths.some(path => pathname.startsWith(path) && accessToken)) {
//         return NextResponse.redirect(new URL('/account', request.url))
//     }

//     if (protectedPaths.some(path => pathname.startsWith(path) && !accessToken)) {
//         if (pathname.startsWith('/checkout')) {
//             const redirectUrl = new URL('/login', request.url)
//             redirectUrl.searchParams.set('message', 'Vui lòng đăng nhập trước khi đặt hàng nhé thượng đế :()')  // add message to query params
//             return NextResponse.redirect(redirectUrl)
//         }
//         return NextResponse.redirect(new URL('/login', request.url))
//     }

//     // check if user is admin
//     if (pathname.startsWith('/admin') && accessToken) {
//         try {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`,{
//                 method: 'GET',
//                 headers:{
//                     'Authorization': `Bearer ${accessToken}`,
//                     'Content-Type': 'application/json',
//                 }
//             })

//             if (!res.ok){
//                 console.log('error',res.json());
//                 return NextResponse.redirect(new URL('/login', request.url))
//             }
//             const user = await res.json()

//             if(user.data.role !== 'admin'){
//                 return NextResponse.redirect(new URL('/', request.url))
//             }

//         } catch (error) {
//             console.error('Error parsing access token:', error)
//             return NextResponse.redirect(new URL('/login', request.url))

//         }
//     }

//     if (pathname.startsWith(adminPaths) && !accessToken) {
//         return NextResponse.redirect(new URL('/login', request.url))
//     }

//     // if not match any path, continue to next middleware
//     return NextResponse.next()
// }

// // See "Matching Paths" below to learn more
// export const config = {
//     matcher:
//         [
//             '/login',
//             '/register',
//             '/admin/:path*',
//             '/checkout/:path*',
//             '/account/:path*',
//         ]
// }


// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Chỉ cho phép auth pages hoạt động độc lập
  if (path.startsWith('/admin/(auth)')) {
    // Chặn nesting bằng cách xử lý headers
    const response = NextResponse.next()
    response.headers.set('x-middleware-skip', '1')
    return response
  }  }
   
  // See "Matching Paths" below to learn more
  export const config = {
    matcher: '/about/:path*',
  }