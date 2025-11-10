import React from 'react'
import { cookies } from 'next/headers';
import FormAccountInfo from '@/app/(client)/(auth)/account/ui/FormAccountInfo';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

async function getUserInfo() {
  const session = await getServerSession(authOptions);
  let accessToken = session?.accessToken;

  // Fallback: Nếu session không có accessToken, thử lấy từ cookie
  if (!accessToken) {
    const cookieStore = await cookies();
    accessToken = cookieStore.get('accessToken')?.value;
  }

  // Kiểm tra token trước khi fetch
  if (!accessToken) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching user info: No access token in session or cookie');
    }
    return null;
  }

  try {
    const userRes = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
      cache: 'no-store',
    });

    if (!userRes.ok) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`Error fetching user info: ${userRes.status} ${userRes.statusText}`);
      }
      return null;
    }

    const contentType = userRes.headers.get('Content-Type');

    if (contentType && contentType.includes('application/json')) {
      const userData = await userRes.json();
      return {
        userData: userData,
      }
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.error('Unexpected response type:', contentType);
      }
      return null;
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching user info:', error);
    }
    return null;
  }
}

export default async function UserInfoPage() {
  const userData = await getUserInfo();
  return (
    <FormAccountInfo userInfo={userData?.userData.data} />
  );
}
