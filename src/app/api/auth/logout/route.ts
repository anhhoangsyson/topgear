import { NextResponse } from 'next/server'

export async function POST() {
  // Xóa tất cả các cookies liên quan đến authentication
  const response = NextResponse.json({ success: true })
  
  // Xóa accessToken cookie
  response.cookies.set('accessToken', '', { maxAge: 0, path: '/' })
  
  // Xóa NextAuth cookies (nếu có)
  response.cookies.set('next-auth.callback-url', '', { maxAge: 0, path: '/' })
  response.cookies.set('next-auth.csrf-token', '', { maxAge: 0, path: '/' })
  
  return response
}