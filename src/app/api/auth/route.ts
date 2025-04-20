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
      secure: process.env.NODE_ENV === 'production', // Chỉ dùng secure trong production
      path: '/',
      maxAge: 36000, // Hết hạn sau 1 giờ
      sameSite: 'lax'
    });
    
    return response;
  } catch (error) {
    console.error('Error setting token:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}