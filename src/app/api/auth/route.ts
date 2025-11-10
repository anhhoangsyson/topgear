import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { accessToken } = await request.json();

    if (!accessToken) {
      return NextResponse.json({ error: 'No access token provided' }, { status: 400 });
    }
    
    // Lưu accessToken vào HTTP-only cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Enable secure in production
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 ngày (giống NextAuth session maxAge)
      sameSite: 'lax'
    });
    
    return response;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API /api/auth] Error setting token:', error);
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}