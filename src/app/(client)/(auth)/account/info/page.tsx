import React from 'react'
import { cookies } from 'next/headers';
import FormAccountInfo from '@/app/(client)/(auth)/account/ui/FormAccountInfo';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

async function getUserInfo() {

  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  const userRes = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    method: 'GET',
    cache: 'no-store',
    // credentials: 'same-origin',
  });


  if (!userRes.ok) {
    console.error(`Error fetching user info: ${userRes.status} ${userRes.statusText}`);
    return null;
  }

  const contentType = userRes.headers.get('Content-Type');

  if (contentType && contentType.includes('application/json')) {
    const userData = await userRes.json();
    // const defaultAddressData = await defaulrAddressRes.json()
    // return {
    //   userData: userData,
    //   defaultAddress: defaultAddressData
    // }
    return {
      userData: userData,
      // defaultAddress: defaultAddressData
    }
  } else {
    console.error('Unexpected response type:', contentType);
    return null;
  }
}

export default async function UserInfoPage() {
  const userData = await getUserInfo();
  return (
    <FormAccountInfo userInfo={userData?.userData.data} />
  );
}
