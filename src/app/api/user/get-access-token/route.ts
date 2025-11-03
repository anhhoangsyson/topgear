import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * Get access token từ:
 * 1. NextAuth session (ưu tiên)
 * 2. Cookie (fallback)
 */
export async function GET() {
  try {
    // Method 1: Try lấy từ NextAuth session trước
    const session = await getServerSession(authOptions);
    if (session?.accessToken) {
      return NextResponse.json({ accessToken: session.accessToken });
    }

    // Method 2: Fallback - Lấy từ cookie
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    
    if (accessToken) {
      return NextResponse.json({ accessToken });
    }

    // Không tìm thấy token ở cả 2 nơi
    return NextResponse.json(
      { error: 'Access token not found in session or cookies' }, 
      { status: 401 }
    );
  } catch (error) {
    console.error('[get-access-token] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}