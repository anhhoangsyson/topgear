import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies(); // Lấy cookie từ request
  const accessToken = cookieStore.get('accessToken')?.value;
   console.log('accessToken from nextserver', accessToken);
   
  // const accessToken = 'your-access-token'; // Lấy token từ cookie hoặc logic khác
  if (accessToken) {
    return NextResponse.json({ accessToken });
  } else {
    return NextResponse.json({ error: 'Access token not found' }, { status: 401 });
  }
}