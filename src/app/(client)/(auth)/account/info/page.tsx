import React from 'react'
import FormAccountInfo from '../ui/FormAccountInfo';
import AddressInfo from '@/app/(client)/(auth)/account/info/AddressInfo';
import { cookies } from 'next/headers';

async function getUserInfo() {

  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value

  const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
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
    return await userRes.json();
  } else {
    console.error('Unexpected response type:', contentType);
    return null;
  }
}

export default async function UserInfoPage() {

  const userData = await getUserInfo();
  // console.log('User Datata:', userData);
  return (
    <div className='flex gap-x-4'>
      <div className='bg-white rounded w-4/6'>
        <FormAccountInfo userInfo={userData.data}/>
      </div>
      <AddressInfo />
    </div>
  );
}
