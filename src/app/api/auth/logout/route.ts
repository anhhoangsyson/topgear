import { NextResponse } from 'next/server'

export async function POST() {
  // Xóa cookie accessToken
  const response = NextResponse.json({ success: true })
  response.cookies.set('accessToken', '', { maxAge: 0, path: '/' })
  return response
}