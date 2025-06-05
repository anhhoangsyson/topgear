import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Gọi API backend để xác thực admin
    const response = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/auth/login`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Đăng nhập thất bại' }, 
        { status: response.status }
      );
    }

    // Kiểm tra role admin
    
    if (data?.data.role !== 'admin') {
      return NextResponse.json(
        { error: 'Bạn không có quyền truy cập admin' }, 
        { status: 403 }
      );
    }

    // Lưu accessToken vào HTTP-only cookie
    const nextResponse = NextResponse.json({ 
      success: true, 
      user: data.data.user 
    });
    
    nextResponse.cookies.set('accessToken', data.data.token, {
      httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 36000, // 10 hours
      sameSite: 'lax'
    });
    
    return nextResponse;
  } catch (error) {
    
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Lỗi server' }, 
      { status: 500 }
    );
  }
}