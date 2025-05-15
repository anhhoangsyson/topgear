import React from 'react'
import { cookies } from 'next/headers';
import FormAccountInfo from '@/app/(client)/(auth)/account/ui/FormAccountInfo';

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

  // const defaulrAddressRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/default-address`, {
  //   method: 'GET',
  //   headers: {
  //     'Authorization': `Bearer ${accessToken}`
  //   },
  //   cache: 'no-store',
  // })

  // if (!defaulrAddressRes.ok) {
  //   console.error(`Error fetching default address: ${defaulrAddressRes.status} ${defaulrAddressRes.statusText}`);
  //   return null;
  // }

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
    <div className='flex gap-x-4'>
      <div className='bg-white rounded w-4/6'>
        <FormAccountInfo userInfo={userData?.userData.data} />
      </div>
      {/* <AddressInfo defaultAddress={userData?.defaultAddress.data} /> */}
    </div>
  );
}
