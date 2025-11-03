import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { accessToken } = await request.json();

    console.log('[API /api/auth] Setting accessToken cookie:', {
      hasToken: !!accessToken,
      tokenLength: accessToken?.length || 0,
      nodeEnv: process.env.NODE_ENV
    });

    if (!accessToken) {
      console.error('[API /api/auth] ❌ No access token provided');
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
    
    console.log('[API /api/auth] ✅ Cookie set successfully');
    
    return response;
  } catch (error) {
    console.error('[API /api/auth] ❌ Error setting token:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}